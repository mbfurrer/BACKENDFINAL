import express from 'express'
import conversationController from '../controllers/conversation.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'


const conversationRouter = express.Router()

conversationRouter.post("/private", authMiddleware, conversationController.createPrivate);

export default conversationRouter