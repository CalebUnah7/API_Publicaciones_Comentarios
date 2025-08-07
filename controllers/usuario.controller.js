import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, getUserByEmail } from '../models/user.model.js';


//TODO: en caso de no tener un schema, validar usando el usuario.schema.js
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: 'Todos los campos son requeridos' });

    const existingUser = await getUserByEmail(email);
    if (existingUser)
      return res.status(409).json({ message: 'El email ya está registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser(username, email, hashedPassword);

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    if (!user)
      return res.status(401).json({ message: 'Credenciales inválidas' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: 'Login exitoso', token });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};
