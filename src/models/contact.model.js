import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    contact_name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    profile_picture: {
      url: {
        type: String,
        default: null,
      },
    },

    about: {
      type: String,
      default: "Hey there! I am using WhatsApp.",
    },

    phone: {
      type: String,
      required: true,
    },
    
    last_seen: {
      type: Date,
      default: Date.now,
    },

    is_online: {
      type: Boolean,
      default: false,
    },
  },
    {timestamps: true}
)

const CONTACT_COLLECTION_NAME = "Contact"
const Contact = mongoose.model(CONTACT_COLLECTION_NAME , contactSchema)

export default Contact