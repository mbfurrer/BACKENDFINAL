import express from 'express'
import messageController from '../controllers/message.controller.js'


const messageRouter = express.Router()

messageRouter.post("/create", messageController.create);
messageRouter.get("/:id", messageController.getById);
messageRouter.get(
  "/conversation/:conversationId",
  messageController.getByConversation
);
messageRouter.delete("/:id", messageController.delete);


export default messageRouter