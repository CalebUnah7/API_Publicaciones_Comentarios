import { Router } from 'express';
import {  registerUser,login,setPassword} from '../controllers/usuario.controller.js';
import asyncMiddleware from '../utils/asyncMiddlewareWrapper.js';

const routerUsuario = Router();

// Registrar un nuevo usuario
routerUsuario.post('/register', asyncMiddleware(registerUser))

// Iniciar sesión de usuario 
routerUsuario.post('/login', asyncMiddleware(login))

// Cambiar la contraseña del usuario
routerUsuario.patch('/set-password', asyncMiddleware(setPassword))  

export default routerUsuario;
