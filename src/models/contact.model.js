import mongoose from "mongoose";
import {USER_COLLECTION_NAME} from './user.model.js'

const ContactSchema = new mongoose.Schema(
  {
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME,
      required: true,
    },

    contact_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME,
      required: true,
    },

    favorite: {
      type: Boolean,
      default: false,
    },

    blocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


export const CONTACT_COLLECTION_NAME = 'Contact'
const Contact = mongoose.model(CONTACT_COLLECTION_NAME, ContactSchema)

export default Contact
