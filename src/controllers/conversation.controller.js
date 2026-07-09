import ServerError from "../helpers/serverError.helper.js";
import conversationRepository from "../repositories/conversation.repository.js";


class ConversationController {
  async createPrivate(req, res) {
    try {
      const senderId = req.user.id;
      const { receiver_id } = req.body;

        if (!receiver_id) {
        return res.status(400).json({
          message: "receiver_id is required",
        });
      }

      if (senderId === receiver_id) {
        return res.status(400).json({
          message: "You can't create a conversation with yourself",
        });
      }

      let conversation = await conversationRepository.findPrivateConversation(
        senderId,
        receiver_id
      );

      if (conversation) {
        return res.status(200).json(conversation);
      }


      conversation =
        await conversationRepository.create({
          type: "private",
          members: [senderId, receiver_id],
          created_by: senderId,
        });

        return res.status(201).json(conversation);
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

const conversationController = new ConversationController()
export default conversationController