const Post = require("./PostModel");
const Comment = require("../comment/CommentModel");

async function getPost(req, res) {
  try {
    const { id } = req.body;

    Post.findOne({ _id: id })
      .populate("likes", ["username", "_id"])
      .exec((err, post) => {
        if (err) return res.send(400);
        res.send(post);
      });
  } catch (error) {}
}

function getAllPosts(req, res) {
  try {
    Post.find()
      .populate("comments")
      .exec()
      .then((posts) => {
        res.json(posts);
      });
  } catch (error) {
    res.sendStatus(400);
  }
}

function getPostsOfUser(req, res) {
  try {
    const { id } = req.body;
    console.log(id);
    Post.find({ postedBy: id }, (err, posts) => {
      if (err) res.sendStatus(400);
      res.send(posts);
    });
  } catch (error) {
    res.sendStatus(400);
  }
}

function createPost(req, res) {
  try {
    const post = req.body;
    // Save new User in database, password will be hashed pre save
    const newPost = new Post(post);
    newPost.save((err, document) => {
      if (err) res.status(400).send({ error: "Post couldn't be created." });
      else res.status(201).send(document);
    });
  } catch (error) {
    console.log({ error });
    res.status(400).send({ error: "CatchBlock: Post couldn't be created." });
  }
}

function deletePost(req, res) {
  try {
    const { id } = req.body;
    Post.deleteOne({ _id: id }, (err) => {
      if (err) res.sendStatus(400);
      res.sendStatus(200);
    });
  } catch (error) {
    res.sendStatus(400);
  }
}

function updatePost(req, res) {
  try {
    const { id, title, content, tags } = req.body;
    Post.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          title: title,
          content: content,
          tags: tags,
        },
      },
      {
        new: true,
        useFindAndModify: false,
      },
      (err, post) => {
        if (err) res.sendStatus(400);
        res.send(post);
      }
    );
  } catch (error) {
    res.sendStatus(400);
  }
}

function addLike(req, res) {
  try {
    const { idUser, idPost } = req.body;

    Post.findById({ _id: idPost }, (err, post) => {
      if (err) return res.sendStatus(400);
      if (post.likes.includes(idUser)) {
        return res.status(200).send("User already liked post");
      }
      Post.findByIdAndUpdate(
        { _id: idPost },
        {
          $push: {
            likes: idUser,
          },
        },
        {
          new: true,
          useFindAndModify: false,
        },
        (err, post) => {
          if (err) res.sendStatus(400);
          res.send(post);
        }
      );
    });
  } catch (error) {
    res.sendStatus(400);
  }
}

function getLikesOfUser(req, res) {
  try {
    const { id } = req.body;
    Post.find({ likes: id }, (err, posts) => {
      if (err) return res.sendStatus(400);
      res.send(posts);
    });
  } catch (error) {
    res.sendStatus(400);
  }
}

function getHome(req, res) {
  try {
    let query = Post.find(
      { category: { $in: ["Guide", "Discuss"] } },
      (err, posts) => {
        if (err) return res.sendStatus(400);
        res.send(posts);
      }
    );
  } catch (error) {}
}

module.exports = {
  getPost,
  getAllPosts,
  getPostsOfUser,
  createPost,
  deletePost,
  updatePost,
  addLike,
  getLikesOfUser,
  getHome,
};
