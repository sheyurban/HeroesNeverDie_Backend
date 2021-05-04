const express = require("express");
const router = express.Router();
const atob = require("atob");
const userService = require("./UserService");
const authService = require("../authentificate/AuthService");

router.get("/", authService.checkSessionToken, (req, res) => {
  console.log("User Route");
  userService.getUsers((err, result) => {
    console.log("Result: " + result);
    if (result) {
      res.send(Object.values(result));
    } else {
      res.send("Es gab Probleme");
    }
  });
});

router.post("/register", async (req, res) => {
  userService.createUser(req, (doc) => {
    res.status(201).send(doc);
  });
});

router.patch("/resetPassword", authService.checkSessionToken, userService.patchPassword)

router.delete("/user", authService.checkSessionToken, userService.deleteUser)

module.exports = router;
