var userService = require("../user/UserService");
var config = require("config");
var jwt = require("jsonwebtoken");
var logger = require("../../config/winston");

function createSessionToken(props, callback) {
  logger.debug("AuthService: create Token");
  if (!props) {
    logger.error("Error: has no json body");
    callback("JSON-Body missing", null, null);
    return;
  }

  userService.findUserBy(props.userID, (err, user) => {
    if (user) {
      logger.debug("Found user, check the password");

      console.log(user);

      user.comparePassword(props.password, (err, isMatch) => {
        if (err) {
          logger.error("Password is invalid");
          callback(err, null);
        } else {
          if (isMatch) {
            logger.debug("Password is correct. Create token.");
            var issuedAt = new Date().getTime();
            var expirationTime = config.get("session.timeout");
            var expiresAt = issuedAt + expirationTime * 1000;
            var privateKey = config.get("session.tokenKey");
            let token = jwt.sign(
              {
                user: user.userID,
              },
              privateKey,
              {
                expiresIn: expiresAt,
                algorithm: "HS256",
              }
            );
            logger.debug("Token created: " + token);
            callback(null, token, user);
          } else {
            logger.error("Password or UserID are invalid");
            callback(err, null);
          }
        }
      });
    } else {
      callback(err, null);
    }
  });
}

function checkSessionToken(req, res, next) {
  try {
    let token = req.get("Authorization");
    token = token.replace("Bearer ", "");
    const privateKey = config.get("session.tokenKey");
    const decoded = jwt.verify(token, privateKey, {
      algorithm: "HS256",
    });
    const userID = decoded.user;
    userService.findUserBy(userID, (err, user) => {
      if (err) res.sendStatus(401);
      if (user) {
        delete user.password
        req.user = user
        next()};
    });
  } catch (error) {
    res.sendStatus(401);
  }
}

module.exports = {
  createSessionToken,
  checkSessionToken,
};
