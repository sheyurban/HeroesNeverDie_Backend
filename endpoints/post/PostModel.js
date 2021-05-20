const mongoose = require("mongoose");

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
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
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
