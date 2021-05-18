const express = require("express");
const router = express.Router();

const Post = require("./PostModel");

// get all posts in db
router.get("/", (req, res) => {
  try {
    Post.find({}, function (err, posts) {
      if (err) res.sendStatus(400);
      res.send(posts);
    });
  } catch (error) {
    res.sendStatus(400);
  }
});

// get all posts of a specific user
router.get("/user/:id", (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    Post.find({ postedBy: id }, (err, posts) => {
      if (err) res.sendStatus(400);
      res.send(posts);
    });
  } catch (error) {
    res.sendStatus(400);
  }
});

// create a new post
router.post("/create", (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    // Save new User in database, password will be hashed pre save
    const newPost = new Post(data);
    newPost.save((err, document) => {
      if (err) res.status(400).send({ error: "Post couldn't be created." });
      else res.status(201).send(document);
    });
  } catch (error) {
    console.log({ error });
    res.status(400).send({ error: "CatchBlock: Post couldn't be created." });
  }
});

router.delete("/delete/:id", (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    Post.deleteOne({ _id: id }, (err) => {
      if (err) res.sendStatus(400);
      res.sendStatus(200);
    });
  } catch (error) {
    res.sendStatus(400);
  }
});

// change title, content and/or tags of a post
router.patch("/update/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;
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
      },
      (err, post) => {
        if (err) res.sendStatus(400);
        res.send(post);
      }
    );
  } catch (error) {
    res.sendStatus(400);
  }
});

// add user who liked post and send back number of likes
router.patch("/like", (req, res) => {
  try {
    const { idUser, idPost } = req.body;

    Post.findById({ _id: idPost }, (err, post) => {
      if (err) res.sendStatus(400);
      console.log(idUser);
      const comments = post.likes;
      console.log(comments);
      res.send(post)
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
        },
        (err, post) => {
          if (err) res.sendStatus(400);
          res.send(post);
        }
      );

    });
  } catch (error) {
    res.sendStatus(400)
  }
});

module.exports = router;
