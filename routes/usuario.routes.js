import { Router } from 'express';
import {  registerUser,login,setPassword} from '../controllers/usuario.controller.js';

const router = Router();

router.post('/auth/register', registerUser)
router.post('/auth/login', login)
router.patch('/auth/set-password', setPassword)  

export default router;
