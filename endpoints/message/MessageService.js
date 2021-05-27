const { populate } = require("./MessageModel");
const Message = require("./MessageModel");

function getMessagesOfChat(user, callback) {
  try {
    Message.find({ to: user._id })
      .populate("to", ["username", "_id"])
      .populate("by", ["username", "_id"])
      .exec((err, messages) => {
        if (err || !messages)
          return callback(
            { error: "Couldnt get messages for the user " + user.username },
            null
          );
        else callback(null, messages);
      });
  } catch (error) {
    return callback({ error: "Something went wrong" }, null);
  }
}

function createNewMessage(content, to, user, callback) {
  try {
    const message = {
      content: content,
      to: to,
      by: user._id,
    };
    const newMessage = new Message(message);
    newMessage.save((err, document) => {
      if (err) {
        return callback({ error: "Message couldn't be created." }, null);
      } else return callback(null, document);
    });
  } catch (error) {
    return callback({ error: "Something went wrong" }, null);
  }
}

module.exports = {
  createNewMessage,
  getMessagesOfChat,
};
