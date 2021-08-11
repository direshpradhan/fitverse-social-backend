const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentSchema = new Schema({
  comment: { type: String, required: [true, "Comment cannot be empty"] },
  user: { type: Schema.Types.ObjectId, ref: "user" },
});

const PostSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user" },
    content: {
      type: "String",
      required: [true, "Post content cannot be empty."],
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "user" }],
    comments: [CommentSchema],
  },
  { timestamps: true }
);

const Post = mongoose.model("post", PostSchema);

module.exports = { Post };
