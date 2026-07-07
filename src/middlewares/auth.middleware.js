import ENVIRONMENT from '../config/environment.config.js'
import ServerError from '../helpers/serverError.helper.js'
import jwt from 'jsonwebtoken'

function authMiddleware(req, res, next) {
  try {
    const autorization_header = req.headers.authorization
    const authorization_token = autorization_header.split(' ')[1]
    
    if (!autorization_header){
      throw new ServerError("No hay header de autorizacion", 401)
    }

    if (!authorization_token){
      throw new ServerError("No hay token de autorizacion", 401)
    }

    const user_info = jwt.verify(
      authorization_token, ENVIRONMENT.JWT_SECRET
    )

    req.user = user_info

    console.log(user_info)

    return next()
  }

  catch(error) {

    if (error instanceof jwt.JsonWebTokenError){
      return res.status(401).json(
        {
          ok: false,
          message: 'Token expirado o invalido',
          status: 401
        }
      )
    }


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

export default authMiddleware