const express = require("express");
const router = express.Router();

const authService = require("../authentificate/AuthService");
const MessageService = require("./MessageService");

router.post(
  "/create",
  authService.checkSessionToken,
  MessageService.createNewMessage
);

router.get("/", authService.checkSessionToken, MessageService.getMessagesOfChat)

module.exports = router;
