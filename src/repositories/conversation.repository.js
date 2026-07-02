import Conversation from '../models/conversation.model.js'

class ConversationRepository {

  async create(conversationData) {
    return await Conversation.create(
      conversationData)
  }

  async findById(conversationId) {
    return await Conversation.findOne({
      _id: conversationId,
      is_deleted: false
    })
  }

  async update(conversationId, data) {
    return await Conversation.findOneAndUpdate(
      conversationId,
      data,
      { new: true }
    );
  }

  async delete(conversationId) {
    return await Conversation.findByIdAndUpdate(
      conversationId,
      { is_deleted: true },
      { new: true }
    )
  }

  async updateLastMessage(conversationId, messageId) {
    return await Conversation.findByIdAndUpdate(
      conversationId,
      { last_message: messageId },
      { new: true }
    )
  }

  async findPrivateConversation(userA, userB) {
    return await Conversation.findOne({
      type: 'private',
      members: { $all: [userA, userB] },
      is_deleted: false
    })
  }

  async findGroupConversations(userId) {
    return await Conversation.find({
      type: 'group',
      members: userId,
      is_deleted: false
    })
  }
}

const conversationRepository = new ConversationRepository
export default conversationRepository