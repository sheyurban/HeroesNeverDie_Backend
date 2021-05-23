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


router.delete("/user", authService.checkSessionToken, userService.deleteUser)

router.get("/id", userService.getUser)

module.exports = router;
