import { Router } from 'express';
import {  registerUser,login,setPassword} from '../controllers/usuario.controller.js';

const router = Router();

router.post('/register', registerUser)
router.post('/login', login)
router.patch('/set-password', setPassword)  

export default router;
