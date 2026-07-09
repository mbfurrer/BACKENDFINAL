import mongoose from 'mongoose'
import { MESSAGE_COLLECTION_NAME, USER_COLLECTION_NAME, CONVERSATION_COLLECTION_NAME } from "../constants/collections.constants.js";



const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["private", "group"],
      required: true,
    },

    name: {
      type: String,
      default: null,
      required: false,
    },

    picture: {
      url: {
        type: String,
        default: null,
      },
    },

    description: {
      type: String,
      default: "",
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME,
      required: true,
    },

    last_message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MESSAGE_COLLECTION_NAME,
      default: null,
    },

    is_deleted: {
      type: Boolean,
      default: false,
    },

    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME,
      required: true,
    }],

  },
  { timestamps: true }
)

const Conversation = mongoose.model(CONVERSATION_COLLECTION_NAME, conversationSchema)
export default Conversation