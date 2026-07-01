import mongoose from 'mongoose'
import {USER_COLLECTION_NAME} from './user.model.js'
import {MESSAGE_COLLECTION_NAME} from './message.model.js'


const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["private", "group"],
      required: true,
    },

    name: {
      type: String,
      require: true
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

    fk_created_by: {
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
    }

  }, 
  {timestamps: true}
)

export const CONVERSATION_COLLECTION_NAME = 'Conversation'
const Conversation = mongoose.model(CONVERSATION_COLLECTION_NAME, conversationSchema)

export default Conversation