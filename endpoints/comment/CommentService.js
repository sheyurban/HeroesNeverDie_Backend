const Post = require("../post/PostModel");
const Comment = require("./CommentModel");

function createComment(req, res) {
  try {
    const comment = req.body;
    const newComment = new Comment(comment);
    newComment.save((err, document) => {
      if (err) res.status(400).send({ error: "Comment couldn't be created." });
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
            if (err) return res.sendStatus(400);
            res.status(201).send(document);
          }
        );
      }
    });
  } catch (error) {
    res.status(500);
  }
}

function getComments(req, res) {
  try {
    const { post } = req.body;
    Comment.find({ post: post })
      .populate("postedBy", ["username", "_id"])
      .exec((err, comments) => {
        if (err) return res.sendStatus(400);
        res.send(comments);
      });
  } catch (error) {
    res.status(500);
  }
}

function updateComment(req, res) {
  try {
    const { id, content } = req.body;
    Comment.findById({ _id: id }, (err, comment) => {
      if (err) return res.sendStatus(400);
      if (req.user.id == comment.postedBy || req.user.isAdmin) {
        Comment.findByIdAndUpdate(
          { _id: id },
          {
            $set: {
              content: content,
            },
          },
          { new: true, useFindAndModify: false },
          (err, comment) => {
            if (err) return res.sendStatus(400);
            res.send(comment);
          }
        );
      } else {
        res.sendStatus(401);
      }
    });
  } catch (error) {
    res.status(500);
  }
}

function deleteComment(req, res) {
  try {
    const { id } = req.body;
    Comment.findById({ _id: id }, (err, comment) => {
      if (err || !comment) return res.sendStatus(400);
      if (req.user.id == comment.postedBy || req.user.isAdmin) {
        Comment.deleteOne({ _id: id }, (err) => {
          if (err) return res.sendStatus(400);
          res.sendStatus(200);
        });
      } else {
        res.sendStatus(401);
      }
    });
  } catch (error) {
    res.status(500);
  }
}

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
};
