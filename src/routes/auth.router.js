import express from 'express'
import authController from '../controllers/auth.controller.js'


const authRouter = express.Router()

authRouter.post(
    '/register',
    authController.register)

authRouter.get(
    '/verify-email',
    authController.verifyEmail)

authRouter.post(
    '/login',
    authController.login)

/* router.post(
    "/logout",
    authMiddleware,
    authController.logout
); */

export default authRouter