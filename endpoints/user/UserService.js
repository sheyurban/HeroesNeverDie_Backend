const User = require("./UserModel");
const bcrypt = require("bcrypt");
const atob = require("atob");
const validator = require("../user/ValidationModel");
const Joi = require("joi");
const Post = require("../post/PostModel");
const hbs = require("handlebars");
const mail = require("../email/mail");
const fs = require("fs");
var logger = require("../../config/winston");

function getUsers(callback) {
  User.find((err, users) => {
    if (err) {
      logger.error("Fehler bei Suche: " + err);
      return callback(err, null);
    } else {
      return callback(null, users);
    }
  });
}

function getUser(id, callback) {
  try {
    User.findById({ _id: id }, (err, user) => {
      if (err) return callback("Couldnt find user", null);
      const { id, username, email, ...partialObject } = user;
      const subset = { id, username, email };
      return callback(null, subset);
    });
  } catch (error) {
    return callback("Something went wrong", null);
  }
}

async function createUser(userData, callback) {
  try {
    // Check if all values are accepted
    validateNewUser(userData, (err) => {
      if (err) return callback(err.details[0].message, null);

      // Check if username or email is already used
      User.find({ username: userData.username }, (err, user) => {
        if (!err) {
          if (user.email == userData.email) {
            return callback({ error: "E-Mail already in use." }, null);
          } else if (user.username == userData.username) {
            return callback({ error: "Username already in use." }, null);
          }
        }

        // Save new User in database, password will be hashed pre save
        const newUser = new User(userData);
        newUser.save((err, document) => {
          if (err)
            return callback({ error: "Account couldn't be created." }, null);
          else {
            const filePath = "./endpoints/email/register.html";
            const source = fs.readFileSync(filePath, "utf-8").toString();
            const template = hbs.compile(source);
            const replacements = {
              user: document.username,
              link: `https://localhost:8080/authenticate/verify?token=${document.token}`,
            };
            const htmlSite = template(replacements);
            // mail.sendMail(document.email, "Welcome to the Community of Heroes never die", htmlSite)

            return callback(null, "Created User, started verifying process");
          }
        });
      });
    });
  } catch (error) {
    console.log({ error });
    return callback("Something went wrong", null);
  }
}

function validateNewUser(userData, callback) {
  const schema = Joi.object({
    username: Joi.string().min(4).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  const { error } = schema.validate(userData);
  callback(error);
}

function patchPassword(newPw, user, callback) {
  try {
    user.password = JSON.parse(atob(newPw));
    const newUser = new User(user);

    newUser.save((err, document) => {
      if (err)
        return callback({ error: "New Password couldn't be saved." }, null);
      else return callback(null, document);
    });
  } catch (error) {
    return callback("Something went wrong", null);
  }
}

function patchUserdata(id, username, email, callback) {
  try {
    User.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          username: username,
          email: email,
        },
      },
      {
        new: true,
        useFindAndModify: false,
      },
      (err, user) => {
        if (err) return callback("Couldnt patch userdata", null);
        callback(null, user);
      }
    );
  } catch (error) {
    callback("Something went wrong", null);
  }
}

function deleteUser(user, deleteUserId, callback) {
  try {
    if (user.isAdmin || user._id == deleteUserId) {
      User.findByIdAndDelete({ _id: user._id }, (err) => {
        if (err) return callback("Couldnt delete user", null);
        return callback(null, "successful deleted user: " + user.username);
      });
    } else {
      return callback("Not authorized", null);
    }
  } catch (error) {
    return callback("Something went wrong", null);
  }
}

function findUserBy(searchUsername, callback) {
  logger.debug("UserService: find User by ID " + searchUsername);
  if (!searchUsername) {
    callback("username is missing");
    return;
  } else {
    var query = User.findOne({ username: searchUsername });
    query.exec(function (err, user) {
      if (err) {
        logger.error("Did not find user for username: " + searchUsername);
        return callback(
          "Did not find user for username: " + searchUsername,
          null
        );
      } else {
        if (user) {
          logger.debug(`Found username: ${searchUsername}`);
          callback(null, user);
        } else {
          if ("admin" == searchUsername) {
            logger.debug(
              "Does not have admin account yet. Create it with default password"
            );
            var adminUser = new User();
            adminUser.username = "admin";
            adminUser.password = "123";
            adminUser.email = "Default Admin Account";
            adminUser.isAdmin = true;

            adminUser.save((err) => {
              if (err) {
                logger.error("Could not create default admin account: " + err);
                callback("Could not login to admin account", null);
              }
            });
          } else {
            logger.error("Did not find user for username: " + searchUsername);
            return callback(
              "Did not find user for username: " + searchUsername,
              null
            );
          }
        }
      }
    });
  }
}

function makeUserToAdmin(id, user, callback) {
  try {
    if (user.isAdmin) {
      User.findOneAndUpdate(
        { _id: id },
        { isAdmin: true },
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
    } else {
      return callback("Not authorized", null);
    }
  } catch (error) {
    return callback("Something went wrong", null);
  }
}

module.exports = {
  getUser,
  getUsers,
  findUserBy,
  createUser,
  patchPassword,
  deleteUser,
  patchUserdata,
  makeUserToAdmin,
};
