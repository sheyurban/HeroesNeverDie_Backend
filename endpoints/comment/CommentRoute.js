const express = require("express");
const router = express.Router();
const logger = require("../../config/winston");

const authService = require("../authentificate/AuthService");
const CommentService = require("./CommentService");

// create a new post
router.post("/create", (req, res) => {
  try {
    const token = req.get("Authorization");
    authService.checkSessionToken(token, (err, user) => {
      logger.debug(user);
      if (err) return res.status(400).send(err);

      const { content, post } = req.body;
      CommentService.createComment(user, content, post, (err, comment) => {
        if (err) return res.status(400).send(err);
        res.status(201).send("Comment created");
      });
    });
  } catch (error) {
    res.status(500);
  }
});

// get comments for a post by id
router.get("/comments", (req, res) => {
  try {
    const token = req.get("Authorization");
    authService.checkSessionToken(token, (err, user) => {
      logger.debug(user);
      if (err) return res.status(400).send(err);

      const { post } = req.body;
      CommentService.getComments(post, (err, comments) => {
        if (err) return res.status(400).send(err);
        res.status(200).send(comments);
      });
    });
  } catch (error) {
    res.status(500);
  }
});

// update a comment
router.patch("/update", (req, res) => {
  try {
    const token = req.get("Authorization");
    authService.checkSessionToken(token, (err, user) => {
      logger.debug(user);
      if (err) return res.status(400).send(err);

      const { id, content } = req.body;
      CommentService.updateComment(id, content, user, (err, comment) => {
        if (err) return res.status(400).send(err);
        res.status(200).send(comment);
      });
    });
  } catch (error) {
    res.status(500);
  }
});

// delete a comment
router.delete("/delete", (req, res) => {
  try {
    const token = req.get("Authorization");
    authService.checkSessionToken(token, (err, user) => {
      logger.debug(user);
      if (err) return res.status(400).send(err);

      const { id } = req.body;
      CommentService.deleteComment(id, user, (err, comment) => {
        if (err) return res.status(400).send(err);
        res.status(200).send(comment);
      });
    });
  } catch (error) {
    res.status(500);
  }
});

module.exports = router;
