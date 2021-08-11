const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: { type: String, required: "First name cannot be empty." },
    lastName: { type: String, required: "Last name cannot be empty." },
    username: {
      type: String,
      required: "Username cannot be empty.",
      index: true,
      unique: true,
    },
    email: {
      type: String,
      required: "Enter e-mail id!",
      index: true,
      unique: true,
    },
    password: { type: String, required: true },
    followers: [{ type: Schema.Types.ObjectId, ref: "user" }],
    following: [{ type: Schema.Types.ObjectId, ref: "user" }],
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserSchema);

module.exports = { User };
