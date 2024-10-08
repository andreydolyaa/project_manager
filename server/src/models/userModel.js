import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: function () {
        return this._id;
      },
      index: true,
    },
  },
  {
    versionKey: false,
  }
);

export const User = mongoose.model("User", UserSchema);
