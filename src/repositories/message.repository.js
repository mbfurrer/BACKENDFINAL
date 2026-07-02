import Message from '../models/message.model.js'

class MessageRepository {

  async create(messageData) {
    return await Message.create(messageData)
  }

  async findById(messageId) {
    return await Message.findById(messageId)
  }

  async findByConversation(conversationId, limit = 50, skip = 0) {
    return await Message.find({
      conversation_id: conversationId
    })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .populate('sender_id')
  }

  async findLatest(conversationId) {
    return await Message.findOne({
      conversation_id: conversationId,
      is_deleted: false
    })
      .sort({ createdAt: -1 })
  }

  async update(messageId, data) {
    return await Message.findByIdAndUpdate(
      messageId,
      data,
      { new: true }
    )
  }

  async delete(messageId) {
    return await Message.findByIdAndDelete(messageId)
  }

  async markAsDeleted(messageId) {
    return await Message.findByIdAndUpdate(
      messageId,
      { is_deleted: true },
      { new: true }
    )
  }
}

const messageRepository = new MessageRepository
export default messageRepository
