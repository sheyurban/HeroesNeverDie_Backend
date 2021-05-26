const express = require("express");
const router = express.Router();
const userService = require("./UserService");
const authService = require("../authentificate/AuthService");

router.get("/", authService.checkSessionToken, (req, res) => {
  userService.getUsers((err, result) => {
    if (result) {
      res.send(Object.values(result));
    } else {
      res.send("Es gab Probleme");
    }
  });
});

// deleting user
router.delete("/user", authService.checkSessionToken, userService.deleteUser);

// get user with id
router.get("/id", authService.checkSessionToken, userService.getUser);

// change username and email
router.patch("/id", authService.checkSessionToken, userService.patchUserdata);

module.exports = router;
