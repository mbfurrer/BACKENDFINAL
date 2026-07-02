import mongoose from "mongoose";
import { CONVERSATION_COLLECTION_NAME, USER_COLLECTION_NAME } from "./constants/collections.constants.js";

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

const ConversationMember = mongoose.model(CONVERSATION_MEMBER_COLLECTION_NAME, conversationMemberSchema)
export default ConversationMember