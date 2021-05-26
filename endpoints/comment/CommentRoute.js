const express = require("express");
const router = express.Router();

const authService = require("../authentificate/AuthService");
const CommentService = require("./CommentService");

router.post(
  "/create",
  authService.checkSessionToken,
  CommentService.createComment
);

router.get(
  "/comments",
  authService.checkSessionToken,
  CommentService.getComments
);

router.patch(
  "/update",
  authService.checkSessionToken,
  CommentService.updateComment
);

router.delete("/delete", authService.checkSessionToken, CommentService.deleteComment)

module.exports = router;
