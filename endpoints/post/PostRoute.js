const express = require("express");
const router = express.Router();
const logger = require("../../config/winston");

const PostService = require("./PostService");
const authService = require("../authentificate/AuthService");

// get all posts in db
router.get("/", (req, res) => {
  try {
    const token = req.get("Authorization");
    authService.checkSessionToken(token, (err, user) => {
      logger.debug(user);
      if (err) return res.status(400).send(err);
      PostService.getAllPosts((err, posts) => {
        if (err) return res.status(400).send(err);
        res.status(200).send(posts);
      });
    });
  } catch (error) {
    res.status(500);
  }
});

// create a new post
router.post("/create", (req, res) => {
  try {
    const token = req.get("Authorization");
    authService.checkSessionToken(token, (err, user) => {
      logger.debug(user);
      if (err) return res.status(400).send(err);

      const post = req.body;
      PostService.createPost(post, user, (err, post) => {
        if (err) return res.status(400).send(err);
        res.status(200).send(post);
      });
    });
  } catch (error) {
    res.status(500);
  }
});

// get post by id
router.get("/id", (req, res) => {
  try {
    const token = req.get("Authorization");
    authService.checkSessionToken(token, (err, user) => {
      logger.debug(user);
      if (err) return res.status(400).send(err);

      const { id } = req.body;
      PostService.getPost(id, (err, post) => {
        if (err) return res.status(400).send(err);
        res.status(200).send(post);
      });
    });
  } catch (error) {
    res.status(500);
  }
});

// get all posts of a specific user
router.get("/user", (req, res) => {
  try {
    const token = req.get("Authorization");
    authService.checkSessionToken(token, (err, user) => {
      logger.debug(user);
      if (err) return res.status(400).send(err);

      const { id } = req.body;
      PostService.getPostsOfUser(id, (err, posts) => {
        if (err) return res.status(400).send(err);
        res.status(200).send(posts);
      });
    });
  } catch (error) {
    res.status(500);
  }
});

router.get("/test", (req, res) => {
  res.json({ message: "pass!" });
});

// delete post
router.delete("/delete", (req, res) => {
  try {
    const token = req.get("Authorization");
    authService.checkSessionToken(token, (err, user) => {
      logger.debug(user);
      if (err) return res.status(400).send(err);

      const { id } = req.body;
      PostService.deletePost(id, user, (err, post) => {
        if (err) return res.status(400).send(err);
        res.status(200).send(post);
      });
    });
  } catch (error) {
    res.status(500);
  }
});

// change title, content and/or tags of a post
router.patch("/update", (req, res) => {
  try {
    const token = req.get("Authorization");
    authService.checkSessionToken(token, (err, user) => {
      logger.debug(user);
      if (err) return res.status(400).send(err);

      const { id, title, content, tags } = req.body;
      PostService.updatePost(id, title, content, tags, user, (err, post) => {
        if (err) return res.status(400).send(err);
        res.status(200).send(post);
      });
    });
  } catch (error) {
    res.status(500);
  }
});

// add user who liked post and send back number of likes
router.patch("/like", (req, res) => {
  try {
    const token = req.get("Authorization");
    authService.checkSessionToken(token, (err, user) => {
      logger.debug(user);
      if (err) return res.status(400).send(err);

      const { idPost } = req.body;
      PostService.addLike(idPost, user, (err, post) => {
        if (err) return res.status(400).send(err);
        res.status(200).send(post);
      });
    });
  } catch (error) {
    res.status(500);
  }
});

// get all liked posts of one user
router.get("/like", (req, res) => {
  try {
    const token = req.get("Authorization");
    authService.checkSessionToken(token, (err, user) => {
      logger.debug(user);
      if (err) return res.status(400).send(err);

      const { id } = req.body;
      PostService.getLikesOfUser(id, (err, posts) => {
        if (err) return res.status(400).send(err);
        res.status(200).send(posts);
      });
    });
  } catch (error) {
    res.status(500);
  }
});

// gets all post of category guide or discuss for home view
router.get("/home", (req, res) => {
  try {
    const token = req.get("Authorization");
    authService.checkSessionToken(token, (err, user) => {
      logger.debug(user);
      if (err) return res.status(400).send(err);
      PostService.getHome((err, posts) => {
        if (err) return res.status(400).send(err);
        res.status(200).send(posts);
      });
    });
  } catch (error) {
    res.status(500);
  }
});

module.exports = router;
