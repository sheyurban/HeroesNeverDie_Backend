const Post = require("../post/PostModel");
const Comment = require("./CommentModel");

function createComment(user, content, post, callback) {
  try {
    const comment = {
      postedBy: user,
      content: content,
      post: post,
    };
    const newComment = new Comment(comment);
    newComment.save((err, document) => {
      if (err) return callback({ error: "Comment couldn't be created." }, null);
      else {
        Post.findByIdAndUpdate(
          { _id: newComment.post },
          {
            $push: {
              comments: newComment._id,
            },
          },
          {
            new: true,
            useFindAndModify: false,
          },
          (err, post) => {
            if (err || !post) return callback(err, null);
            return callback(null, document);
          }
        );
      }
    });
  } catch (error) {
    return "Something went wrong", null;
  }
}

function getComments(post, callback) {
  try {
    Comment.find({ post: post })
      .populate("postedBy", ["username", "_id"])
      .exec((err, comments) => {
        if (err) return callback("Couldnt find comments", null);
        return callback(null, comments);
      });
  } catch (error) {
    return callback("Something went wrong", null);
  }
}

function updateComment(id, content, user, callback) {
  try {
    Comment.findById({ _id: id }, (err, comment) => {
      if (err || !comment) return callback("Couldnt find comment", null);
      if (user.id == comment.postedBy || user.isAdmin) {
        Comment.findByIdAndUpdate(
          { _id: id },
          {
            $set: {
              content: content,
            },
          },
          { new: true, useFindAndModify: false },
          (err, comment) => {
            if (err) return callback("Couldnt update comment", null);
            return callback(null, comment);
          }
        );
      } else {
        return callback("Unauthorized", null);
      }
    });
  } catch (error) {
    return callback("Something went wrong", null);
  }
}

function deleteComment(id, user, callback) {
  try {
    Comment.findById({ _id: id }, (err, comment) => {
      if (err || !comment) return callback("Couldnt find this comment", null);
      if (user.id == comment.postedBy || user.isAdmin) {
        Comment.deleteOne({ _id: id }, (err) => {
          if (err) return callback("Couldnt delete this comment", null);
          return callback(null, comment);
        });
      } else {
        return callback("Unauthorized", null);
      }
    });
  } catch (error) {
    return callback("Something went wrong", null);
  }
}

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
};
