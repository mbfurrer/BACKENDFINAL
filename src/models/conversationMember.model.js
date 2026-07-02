import mongoose from "mongoose";
import {CONVERSATION_COLLECTION_NAME} from './conversation.model.js'
import {USER_COLLECTION_NAME} from './user.model.js'

const conversationMemberSchema = new mongoose.Schema({

  conversation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: CONVERSATION_COLLECTION_NAME,
    required: true,
  },

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER_COLLECTION_NAME,
    required: true,
  },

  role: {
    type: String,
    enum: ["member", "admin"],
    default: "member",
  },

  joined_at: {
    type: Date,
    default: Date.now,
  },

  left_at: {
    type: Date,
    default: null,
  }

}, {
  timestamps: true,
});

export const CONVERSATION_MEMBER_COLLECTION_NAME = 'ConversationMember'
const ConversationMember = mongoose.model(CONVERSATION_MEMBER_COLLECTION_NAME, conversationMemberSchema)

export default ConversationMember