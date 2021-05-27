var userService = require("../user/UserService");
var config = require("config");
var jwt = require("jsonwebtoken");
var logger = require("../../config/winston");
const User = require("../user/UserModel");

function createSessionToken(props, callback) {
  logger.debug("AuthService: create Token");
  if (!props) {
    logger.error("Error: has no json body");
    callback("JSON-Body missing", null, null);
    return;
  }
  logger.debug("Props: " + props);
  userService.findUserBy(props.username, (err, user) => {
    if (user) {
      logger.debug("Found user, check the password");
      if (!user.isVerified) return callback("User not verified", null);
      user.comparePassword(props.password, (err, isMatch) => {
        if (err) {
          logger.error("Password is invalid");
          callback(err, null);
        } else {
          if (isMatch) {
            logger.debug("Password is correct. Create token.");
            var issuedAt = Date.now();
            var expirationTime = config.get("session.timeout");
            var expiresAt = issuedAt + expirationTime * 60000;

            var privateKey = config.get("session.tokenKey");
            let token = jwt.sign(
              {
                user: user.username,
                exp: expiresAt,
              },
              privateKey,
              {
                algorithm: "HS256",
              }
            );
            logger.debug("Token created: " + token);
            callback(null, token, user);
          } else {
            logger.error("Password or username are invalid");
            callback(err, null);
          }
        }
      });
    } else {
      callback(err, null);
    }
  });
}

function checkSessionToken(authData, callback) {
  logger.debug("Check if token is okay");
  try {
    let token = authData;
    token = token.replace("Bearer ", "");
    const privateKey = config.get("session.tokenKey");
    const decoded = jwt.verify(token, privateKey, {
      algorithm: "HS256",
    });
    if (Date.now() >= decoded.exp) {
      return callback("Token already expired", null);
    } else {
      const username = decoded.user;
      userService.findUserBy(username, (err, user) => {
        if (err) return callback("User not found", null);
        if (user) {
          if (!user.isVerified) return callback("Account not verified", null);
          delete user.password;
          return callback(null, user);
        }
      });
    }
  } catch (error) {
    return callback("Something went wrong", null);
  }
}

function verifyUser(token, callback) {
  User.findOne({ token }, (err, user) => {
    if (err || !user) return callback(err, null);
    else if (user.isVerified)
      return callback("User is already verified.", null);

    User.findOneAndUpdate(
      { token: token },
      { isVerified: true },
      {
        new: true,
        useFindAndModify: false,
      },
      (err, user) => {
        // if user found, set isVerified to true
        if (err || !user) return callback(err, null);
        return callback(null, user);
      }
    );
  });
}

module.exports = {
  createSessionToken,
  checkSessionToken,
  verifyUser,
};
