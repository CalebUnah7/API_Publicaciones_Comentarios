import { Router } from 'express';
import {  registerUser,login,setPassword} from '../controllers/usuario.controller.js';

const routerUsuario = Router();

// Registrar un nuevo usuario
routerUsuario.post('/register', registerUser)

// Iniciar sesión de usuario 
routerUsuario.post('/login', login)

// Cambiar la contraseña del usuario
routerUsuario.patch('/set-password', setPassword)  

export default routerUsuario;
