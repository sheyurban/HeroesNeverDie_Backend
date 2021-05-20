const express = require("express");
const router = express.Router();

const CommentService = require("./CommentService");

// router.get("/", CommentService.getCommentsOfPost);

router.post("/create", CommentService.createComment);

module.exports = router;
