import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mailer_transport from "../config/mailer.config.js";
import ENVIRONMENT from "../config/environment.config.js";
import ServerError from '../helpers/serverError.helper.js'
import userRepository from "../repositories/user.repository.js"



class AuthController {
  async register(req, res) {
    try {
      const { name, phone, email, password } = req.body;
      if (!name || name.length <= 2) {
        throw new ServerError("Nombre debe ser mayor a 2 caracteres", 400)
      }

      if (!phone) {
        throw new ServerError("Indique un celular", 400)
      }

      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        throw new ServerError("Email inválido", 400)
      }

      if (!password || password.length < 6) {
        throw new ServerError("Password debe contener al menos 6 caracteres", 400)
      }

      const existingUser = await userRepository.getByEmail(email);
      if (existingUser) {
        throw new ServerError("El email ya esta registrado", 400)
      }

      const hashed_password = await bcrypt.hash(password, 12);
      const new_user = await userRepository.create({name, phone, email, password: hashed_password});

      const verification_token = jwt.sign(
        {
          email: email
        },
        ENVIRONMENT.JWT_SECRET
      )

      await mailer_transport.sendMail(
        {
          to: email,
          from: ENVIRONMENT.GMAIL_USERNAME,
          subject: "Verifica tu email",
          html: `<h1>Bienvenido a WhatsApp</h1>
                  <a href='${ENVIRONMENT.URL_BACKEND}/api/auth/verify-email?verification_token=${verification_token}'>Click aqui</a> para verificar tu cuenta`
                  //HACER MAS LINDO
        }
      )

      return res.status(201).json({
        message: "Usuario registrado con exito",
        ok: true,
        status: 201,
        data: {
          user: {
            id: new_user.email,
            phone: new_user.phone,          
            name: new_user.name,
            email: new_user.email
          }
        }
      }
      );
    }
    catch (error) {
      if (error instanceof ServerError) {
        return res.status(error.status).json(
          {
            ok: false,
            message: error.message,
            status: error.status
          }
        )
      }
      else {
        console.log('Error Critico', error);
        return res.status(500).json(
          {
            ok: false,
            message: "Error interno del servidor",
            status: 500
          }
        )
      }
    }
  }

  async verifyEmail(req, res) {
    try {
      const { verification_token } = req.query;
      console.log(req.query);

      if (!verification_token) {
        throw new ServerError("Falta token de verificacion", 400)
      }
      const payload = jwt.verify(verification_token, ENVIRONMENT.JWT_SECRET)

      const { email } = payload

      const user = await userRepository.getByEmail(email);

      if (!user) {
        throw new ServerError('Usuario no encontrado', 400);
      }

      if (user.verifiedEmail) {
        throw new ServerError('Este email ya ha sido verificado', 400);
      }

      await userRepository.updateById(user._id, { verifiedEmail: true });

      return res.status(200).json({
        ok: true,
        status: 200,
        message: "Email verificado correctamente. Ya puedes usar tu cuenta!"
      });
    }

    catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json(
          {
            ok: false,
            message: "Token invalido",
            status: 401
          }
        )
      }
      else if (error instanceof ServerError) {
        return res.status(error.status).json(
          {
            ok: false,
            message: error.message,
            status: error.status
          }
        )
      }
      else {
        console.log('Error Critico', error);
        return res.status(500).json(
          {
            ok: false,
            message: "Error interno del servidor",
            status: 500
          }
        )
      }
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body

      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        throw new ServerError("Email inválido", 400)
      }

      if (!password || password.length < 6) {
        throw new ServerError("Contraseña invalida", 400)
      }

      const user_found = await userRepository.getByEmail(email);
      if (!user_found) {
        throw new ServerError("Usuario no registrado", 404)
      }

      if (!user_found.verifiedEmail) {
        throw new ServerError("Usuario con verificacion de mail pendiente", 401)
      }

      const is_same_pass = await bcrypt.compare(password, user_found.password)

      if (!is_same_pass) {
        throw new ServerError('Credenciales invalidas', 401);
      }

      const profile_info = {
        name: user_found.name,
        phone: user_found.phone,
        email: user_found.email,
        id: user_found._id,
      }

      const access_token = jwt.sign(
        profile_info,
        ENVIRONMENT.JWT_SECRET
      )

      return res.status(200).json({
        ok: true,
        status: 200,
        message: "Usuario autentificado exitosamente ",
        data: {
          access_token
        }
      }
      )
    }

    catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json(
          {
            ok: false,
            message: "Token invalido",
            status: 401
          }
        )
      }
      else if (error instanceof ServerError) {
        return res.status(error.status).json(
          {
            ok: false,
            message: error.message,
            status: error.status
          }
        )
      }
      else {
        console.log('Error Critico', error);
        return res.status(500).json(
          {
            ok: false,
            message: "Error interno del servidor",
            status: 500
          }
        )
      }
    }
  }
}



const authController = new AuthController()
export default authController