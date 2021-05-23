const User = require("./UserModel");
const bcrypt = require("bcrypt");
const atob = require("atob");
const validator = require("../user/ValidationModel");
const Joi = require("joi");

// const authService = require("../authentificate/AuthService")

function getUsers(callback) {
  User.find((err, users) => {
    if (err) {
      console.log("Fehler bei Suche: " + err);
      return callback(err, null);
    } else {
      console.log("Alles super");
      return callback(null, users);
    }
  });
}

function getUser(req, res) {
  try {
    const { id } = req.body;
    User.findById({ _id: id }, (err, user) => {
      if (err) return res.sendStatus(400);
      const { id, username, email, ...partialObject } = user;
      const subset = { id, username, email };
      res.send(subset);
    });
  } catch (error) {}
}

async function createUser(req, res) {
  try {
    const data = req.body;

    // Check if all values are accepted
    validateNewUser(data, (err) => {
      if (err) return res.status(400).send(err.details[0].message);

      // Check if username or email is already used
      findUserBy(data.username, (err, user) => {
        if (!err) {
          if (user.email == data.email) {
            return res.status(400).send({ error: "E-Mail already in use." });
          } else if (user.username == data.username) {
            return res.status(400).send({ error: "Username already in use." });
          }
        }

        // Save new User in database, password will be hashed pre save
        const newUser = new User(data);
        newUser.save((err, document) => {
          if (err)
            res.status(400).send({ error: "Account couldn't be created." });
          else res.status(201).send(document);
        });
      });
    });
  } catch (error) {
    console.log({ error });
    res.status(400).send({ error: "CatchBlock: Account couldn't be created." });
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

function patchPassword(req, res) {
  try {
    let { newPw } = JSON.parse(atob(req.body.newPw));
    req.user.password = newPw;
    const user = new User(req.user);

    user.save();

    res.sendStatus(200);
  } catch (error) {
    console.log({ error });
    res.sendStatus(400);
  }
}

function patchUserdata(req,res){

}

function isAllowed (req, res, next){
  try {
    const {id} = req.body
  } catch (error) {
    
  }

}

function deleteUser(req, res) {
  try {
    const deleteUsername = req.query.id;
    const user = req.user;

    if (user.isAdmin || user.username == deleteUsername) {
      findUserBy(user.username, (user) => {
        User.deleteOne({ username: user.username });
      });
    } else {
      throw Error();
    }
  } catch (error) {
    res.sendStatus(400);
  }
}

function findUserBy(searchUsername, callback) {
  console.log("UserService: find User by ID " + searchUsername);
  if (!searchUsername) {
    callback("username is missing");
    return;
  } else {
    var query = User.findOne({ username: searchUsername });

    query.exec(function (err, user) {
      if (err) {
        console.log("Did not find user for username: " + searchUsername);
        return callback(
          "Did not find user for username: " + searchUsername,
          null
        );
      } else {
        if (user) {
          console.log(`Found username: ${searchUsername}`);
          callback(null, user);
        } else {
          if ("admin" == searchUsername) {
            console.log(
              "Does not have admin account yet. Create it with default password"
            );
            var adminUser = new User();
            adminUser.username = "admin";
            adminUser.password = "123";
            adminUser.email = "Default Admin Account";
            adminUser.isAdmin = true;

            adminUser.save((err) => {
              if (err) {
                console.log("Could not create default admin account: " + err);
                callback("Could not login to admin account", null);
              }
            });
          } else {
            console.log("Did not find user for username: " + searchUsername);
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

module.exports = {
  getUser,
  getUsers,
  findUserBy,
  createUser,
  patchPassword,
  deleteUser,
};
