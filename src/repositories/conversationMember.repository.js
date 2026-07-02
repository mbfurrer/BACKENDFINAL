import ConversationMember from '../models/conversationMember.model.js'

class ConversationMemberRepository {

  async addMember(conversationId, userId, role = 'member') {
    return await ConversationMember.findOneAndUpdate(
      {
        conversation_id: conversationId,
        user_id: userId
      },
      {
        role: role,
        joined_at: Date.now(),
        left_at: null
      },
      {
        new: true,
        upsert: true
      }
    )
  }

  async removeMember(conversationId, userId) {
    return await ConversationMember.findOneAndUpdate(
      {
        conversation_id: conversationId,
        user_id: userId,
        left_at: null
      },
      { left_at: Date.now() },
      { new: true }
    )
  }

  async findMembers(conversationId) {
    return await ConversationMember.find({
      conversation_id: conversationId,
      left_at: null
    }).populate('user_id')
  }

  async findByUser(userId) {
    return await ConversationMember.findOne(
      {
        user_id: userId,
        left_at: null
      },
      { new: true }
    ).populate('conversation_id')
  }

  async isMember(conversationId, userId) {
    const member = await ConversationMember.exists({
      conversation_id: conversationId,
      user_id: userId,
      left_at: null
    })
    return member !== null
  }

  async changeRole(conversationId, userId, role) {
    return await ConversationMember.findOneAndUpdate(
      {
        conversation_id: conversationId,
        user_id: userId,
        left_at: null
      },
      { role: role },
      { new: true }
    )
  }

  async leaveConversation(conversationId, userId) {
    return await ConversationMember.findOneAndUpdate(
      {
        conversation_id: conversationId,
        user_id: userId,
        left_at: null
      },
      { left_at: Date.now() },
      { new: true }
    )
  }
}

const conversationMemberRepository = new ConversationMemberRepository
export default conversationMemberRepository