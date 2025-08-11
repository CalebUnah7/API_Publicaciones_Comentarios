
//TODO: en caso de no tener un schema, validar usando el usuario.schema.js

import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {Resend} from 'resend'
import {v4 as uuidv4} from 'uuid'
import {register, loginUser, loginUserByHandle, updatePassword} from '../models/usuario.model.js'
import {validateUsuario} from '../schemas/usuario.schema.js'
import {passwordSchema} from '../schemas/password.schema.js'

// Controlador para registrar un nuevo usuario
export async function registerUser(req, res){
  //validamos el cuerpo de la solicitud
  const parseResult = validateUsuario(req.body)

  if(!parseResult.success){
    return res.status(400).json({
      success: false,
      message: 'Datos de usuario inválidos',
      errors: parseResult.error.errors
    })
  }
  const { email, nombre, handle, role } = req.body

  const id = uuidv4()
  console.log(id)
  const password = Math.random().toString().slice(2, 6)
  const password_hash = await bcrypt.hash(password,10)
  console.log(process.env.RESEND_API_KEY)
  
  try {
    const user = await register([ id, email, handle, nombre, password_hash, role ])
    
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'no-reply@tudominio.com',
      to: email,
      subject: 'Creación de cuenta',
      html: `<p>Tu contraseña temporal es: <strong>1234</strong></p>`
    })

    res.json({
      success: true,
      message: 'Usuario registrado. Se envió la contraseña temporal al correo electrónico.',
      data: { id, email, nombre, handle }
    })

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al registrar el usuario',
      error: error.message
    })
  }
}

// Controlador para iniciar sesión con el email del usuario
export async function login(req,res){
  const { email, password } = req.body
  const data = await loginUser(email)
  console.log(data)

  //validamos que las contraseñas coincidan
  if(!await bcrypt.compare(password, data.password_hash)){
    return res.status(401).json({
      success: false,
      message: 'Usuario o contraseña incorrectos'
    })
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
  
  const token = jwt.sign({id: data.id,role: data.role},process.env.JWT_SECRET,
    { algorithm: 'HS256',
      expiresIn: '12h'
    }
  )

  delete data.password_hash

  res.json({
    success: true,
    message: 'Usuario autenticado correctamente',
    data: data,
    token: token
  })

}


// Controlador para iniciar sesión con el handle(@) del usuario
export async function loginByHandle(req,res){
  const { handle, password } = req.body
  const data = await loginUserByHandle(handle)
  console.log(data)

  //validamos que las contraseñas coincidan
  if(!await bcrypt.compare(password, data.password_hash)){
    return res.status(401).json({
      success: false,
      message: 'Usuario o contraseña incorrectos'
    })
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
  
  const token = jwt.sign({id: data.id,role: data.role},process.env.JWT_SECRET,
    { algorithm: 'HS256',
      expiresIn: '12h'
    }
  )

  delete data.password_hash

  res.json({
    success: true,
    message: 'Usuario autenticado correctamente',
    data: data,
    token: token
  })

}

// Controlador para cambiar la contraseña del usuario
export async function setPassword(req,res){
  //validamos que la contraseña cumpla con el schema
  const parseResult = passwordSchema.safeParse(req.body)

  if(!parseResult.success){
    return res.status(400).json({
      success: false,
      message: 'Contraseña inválida',
      errors: parseResult.error.errors
    })
  }
  
  const {authorization} = req.headers
  const {old_password,new_password, confirm_password} = req.body
  const token = authorization.split(' ')[1]//obtenemos el token del header
  try {
    const {id,password} = jwt.verify(token,process.env.JWT_SECRET)

    if(!await bcrypt.compare(old_password,password)){
        return res.status(401).json({
          success: false,
          message: 'La contraseña anterior es incorrecta'
        })
    }

    //aquí validamos que las nuevas contraseñas coincidan
    if(new_password !== confirm_password){
      return res.status(400).json({
        success: false,
        message: 'Las nuevas contraseñas no coinciden'
      })
    }

    const setPasswordHash = await bcrypt.hash(confirm_password,10)

    await updatePassword(id,setPasswordHash)

    res.json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    })

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Debe iniciar sesión para cambiar la contraseña',
    })
  }
}
