const mongoose = require("mongoose");
const User = require("../user/UserModel");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dateCreated: Date,
    category: {
      type: String,
      required: true,
    },
    tags: [],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        body: String,
        postedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

var Post = mongoose.model("Post", PostSchema);
module.exports = Post;
