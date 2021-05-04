const User = require("./UserModel");
const bcrypt = require("bcrypt");
const atob = require("atob");

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

async function createUser(req, callback) {
  const body = req.body;
  console.log(body);
  if (!(body.userID && body.password)) {
    return res.status(400).send({ error: "Data not formatted properly" });
  }

  const user = new User(body);
  user.save((err, doc) => {
    if (err) return console.error(err);
    callback(doc);
  });
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

function deleteUser(req, res) {
  try {
    const deleteUserID = req.query.id;
    const user = req.user;
    if (user.isAdmin) {
      findUserBy(user.userID, (user) => {
        User.deleteOne({ userID: user.userID });
      });
    } else if (user.userID == deleteUserID) {
      findUserBy(user.userID, (user) => {
        User.deleteOne({ userID: user.userID });
      });
    } else {
      throw Error();
    }
  } catch (error) {
    res.sendStatus(400);
  }
}

function findUserBy(searchUserID, callback) {
  console.log("UserService: find User by ID " + searchUserID);
  if (!searchUserID) {
    console.log("UserId is missing");
    callback("UserID is missing");
    return;
  } else {
    var query = User.findOne({ userID: searchUserID });

    query.exec(function (err, user) {
      if (err) {
        console.log("Did not find user for userID: " + searchUserID);
        return callback("Did not find user for userID: " + searchUserID, null);
      } else {
        if (user) {
          console.log(`Found userID: ${searchUserID}`);
          callback(null, user);
        } else {
          if ("admin" == searchUserID) {
            console.log(
              "Does not have admin account yet. Create it with default password"
            );
            var adminUser = new User();
            adminUser.userID = "admin";
            adminUser.password = "123";
            adminUser.userName = "Default Admin Account";
            adminUser.isAdmin = true;

            adminUser.save((err) => {
              if (err) {
                console.log("Could not create default admin account: " + err);
                callback("Could not login to admin account", null);
              }
            });
          }
        }
      }
    });
  }
}

module.exports = {
  getUsers,
  findUserBy,
  createUser,
  patchPassword,
  deleteUser,
};
