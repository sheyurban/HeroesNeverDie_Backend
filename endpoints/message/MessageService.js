const { populate } = require("./MessageModel");
const Message = require("./MessageModel");

function getMessagesOfChat(req, res) {
  try {
    const { to } = req.body;
    Message.find({ to: to })
      .populate("to", ["username", "_id"])
      .populate("by", ["username", "_id"])
      .exec((err, messages) => {
        if (err) return res.sendStatus(400);
        else res.send(messages);
      });
  } catch (error) {
    return res.sendStatus(500);
  }
}

function createNewMessage(req, res) {
  try {
    const { content, to, by } = req.body;
    const message = {
      content: content,
      to: to,
      by: by,
    };
    const newMessage = new Message(message);
    newMessage.save((err, document) => {
      if (err) {
        res.status(400).send({ error: "Message couldn't be created." });
      } else res.status(201).send(document);
    });
  } catch (error) {
    return res.sendStatus(500);
  }
}

module.exports = {
  createNewMessage,
  getMessagesOfChat,
};
