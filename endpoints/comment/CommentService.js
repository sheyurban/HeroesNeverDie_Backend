const Post = require("../post/PostModel");
const Comment = require("./CommentModel");

function createComment(req, res) {
  try {
    const comment = req.body;
    // Save new User in database, password will be hashed pre save
    const newComment = new Comment(comment);
    newComment.save((err, document) => {
      if (err) res.status(400).send({ error: "Post couldn't be created." });
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
            if (err) res.sendStatus(400);
            res.status(201).send(document);
          }
        );
      }
    });
  } catch (error) {
    res.status(500);
  }
}

function xy(req, res) {
  try {
  } catch (error) {
    res.status(500);
  }
}

module.exports = {
  createComment,
};
