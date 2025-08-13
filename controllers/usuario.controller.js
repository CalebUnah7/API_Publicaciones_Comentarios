import HTTPCodes from "../shared/codes.js";
import { AppError } from '../utils/AppError.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {Resend} from 'resend'
import {v4 as uuidv4} from 'uuid'
import {register, loginUser, loginUserByHandle, updatePassword} from '../models/usuario.model.js'
import {validateUsuario} from '../schemas/usuario.schema.js'
import { passwordSchema} from '../schemas/password.schema.js'

// Controlador para registrar un nuevo usuario
export async function registerUser(req, res){
    //validamos el cuerpo de la solicitud
  const parseResult = validateUsuario(req.body)
  const { success, error, data:safeData } = parseResult

  if(!success){
    const errData = HTTPCodes.errorBadRequest('Datos de usuario inválidos');
    throw new AppError(
      errData.statusCode, 
      errData.message, 
      error.issues.map(e => e.message)
    );
  }
  //const { email, nombre, handle, password, role } = req.body

  const { email, nombre, handle, password, role } = safeData
  const id = uuidv4()
  //console.log(id)
   // const password = Math.random().toString().slice(2, 6)
  const password_hash = await bcrypt.hash(password,10)
   // console.log(process.env.RESEND_API_KEY)
  try {
    const user = await register([ id, email, handle, nombre, password_hash, role ])
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'no-reply@tudominio.com',
    //   to: email,
    //   subject: 'Creación de cuenta',
    //   html: `<p>Tu contraseña temporal es: <strong>1234</strong></p>`
    // }) 

    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente.',
      data: { id, email, nombre, handle }
    })

  } catch (error) {
    if (error instanceof AppError) {
            // Se vuelve a lanzar el error para que el manejador de errores lo procese
            throw error;
        }
    //console.error('Error al registrar el usuario:', error);
    const errData = HTTPCodes.errorServer('Error interno del servidor al registrar el usuario');
    throw new AppError(
      errData.statusCode, 
      errData.message, 
      error.message
    );
  }
}

// Controlador para iniciar sesión con el email o el handle(@) del usuario
export async function login(req, res) {
  const { email, handle, password } = req.body;
  let data;
  let expiresIn;

  if (email && handle) {
    const errData = HTTPCodes.errorBadRequest('Debe proporcionar solo un email o un handle para iniciar sesión');
    throw new AppError(errData.statusCode, errData.message);
  } else if (!email && !handle) {
    const errData = HTTPCodes.errorBadRequest('Debe proporcionar un email o un handle para iniciar sesión');
    throw new AppError(errData.statusCode, errData.message);
  }

  if (email) {
    data = await loginUser(email);
    expiresIn = '1h';
  } else if (handle) {
    data = await loginUserByHandle(handle);
    expiresIn = '1h';
  }

  //validamos que las contraseñas coincidan
  if (!data || !await bcrypt.compare(password, data.password_hash)) {
    const errData = HTTPCodes.errorUnauthorized('Usuario o contraseña incorrectos');
    throw new AppError(errData.statusCode, errData.message);
  }

  // //validar si el usuario cambió la contraseña temporal
  // if(data.must_change_password){
  //   const tokenTemporal = jwt.sign({
  //     id: data.id,
  //     password: data.password_hash
  //   }, process.env.JWT_SECRET,
  //   {  expiresIn: '1h'  
  //   })

  //   return res.status(401).json({
  //     success: true,
  //     message: 'Debe cambiar su contraseña',
  //     data: {
  //       token: tokenTemporal,
  //     }
  //   })
  // }

  const token = jwt.sign(
    { id: data.id, role: data.role },
    process.env.JWT_SECRET,
    { algorithm: 'HS256', expiresIn }
  );

  delete data.password_hash;

  res.json({
    success: true,
    message: 'Usuario autenticado correctamente',
    token
  });
}


// Controlador para cambiar la contraseña del usuario
export async function setPassword(req,res){
  //validamos que la contraseña cumpla con el schema
  const parseResult = passwordSchema.safeParse(req.body)

  if(!parseResult.success){
    const errData = HTTPCodes.errorBadRequest('Contraseña inválida');
    throw new AppError(
      errData.statusCode, 
      errData.message, 
      parseResult.error.errors.map(e => e.message)
    );
  }
  
  const {authorization} = req.headers
  const {old_password,new_password, confirm_password} = req.body
  const token = authorization.split(' ')[1]//obtenemos el token del header
  try {
    const {id,password} = jwt.verify(token,process.env.JWT_SECRET)

    if(!await bcrypt.compare(old_password,password)){
      const errData = HTTPCodes.errorUnauthorized('La contraseña anterior es incorrecta');
      throw new AppError(errData.statusCode, errData.message);
    }

    //aquí validamos que las nuevas contraseñas coincidan
    if(new_password !== confirm_password){
      const errData = HTTPCodes.errorBadRequest('Las nuevas contraseñas no coinciden');
      throw new AppError(errData.statusCode, errData.message);
    }

    const setPasswordHash = await bcrypt.hash(confirm_password,10)

    await updatePassword(id,setPasswordHash)

    res.json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    })

  } catch (error) {
    if (error instanceof AppError) {
      // Se vuelve a lanzar el error para que el manejador de errores lo procese
      throw error;
    }
    const errData = HTTPCodes.errorUnauthorized('Debe iniciar sesión para cambiar la contraseña');
    throw new AppError(errData.statusCode, errData.message, error);
  }
}
