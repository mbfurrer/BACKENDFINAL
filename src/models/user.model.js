import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    name: {
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

    picture: {
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
      unique: true,
    },
    
    last_seen: {
      type: Date,
      default: Date.now,
    },

    online: {
      type: Boolean,
      default: false,
    },
  },
    {timestamps: true}
)

const User = mongoose.model(USER_COLLECTION_NAME , userSchema)
export default User