import { Router } from 'express';
import {  registerUser,login,setPassword} from '../controllers/usuario.controller.js';

const routerUsuario = Router();

routerUsuario.post('/register', registerUser)
routerUsuario.post('/login', login)
routerUsuario.patch('/set-password', setPassword)  

export default routerUsuario;
