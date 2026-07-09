import ENVIRONMENT from "../config/environment.config.js";
import ServerError from '../helpers/serverError.helper.js'
import userRepository from "../repositories/user.repository.js"
import messageRepository from '../repositories/message.repository.js'



class MessageController {

  async create(req, res) {
    try {
      const { conversation_id, sender_id, content, type } = req.body;
      const message = await messageRepository.create({
        conversation_id,
        sender_id,
        content,
        type
      });

      return res.status(201).json(message)
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

  async getByConversation(req, res) {
    try {
      const { conversation_id } = req.params;
      const messages = await messageRepository.findByConversation(
        conversation_id
      );

      return res.status(201).json(messages)
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

  async getById(req, res) {
    try {
      const { id } = req.params;
      const message = await messageRepository.findById(id)
      if (!message) {
        return res.status(404).json({
          message: "Message not found"
        })
      }

      return res.status(201).json(messages)
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

  async update(req, res) { }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const message = await messageRepository.markAsDeleted(id)

      return res.status(201).json("Mensaje eliminado")
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
}

    export default new MessageController();