import mongoose from 'mongoose'
import { CONVERSATION_COLLECTION_NAME, USER_COLLECTION_NAME, MESSAGE_COLLECTION_NAME } from "../constants/collections.constants.js";

const messageSchema = new mongoose.Schema({

  conversation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: CONVERSATION_COLLECTION_NAME,
    required: true,
  },

  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER_COLLECTION_NAME,
    required: true,
  },

  content: {
    type: String,
    default: "",
  },

  type: {
    type: String,
    enum: ["text", "image", "video", "audio", "file"],
    default: "text",
  },

  is_deleted: {
    type: Boolean,
    default: false,
  }

}, {
  timestamps: true,
});

const Message = mongoose.model(MESSAGE_COLLECTION_NAME, messageSchema)
export default Message