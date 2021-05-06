const express = require("express");
const router = express.Router();
const userService = require("./UserService");
const authService = require("../authentificate/AuthService");

router.get("/", authService.checkSessionToken, (req, res) => {
  userService.getUsers((err, result) => {
    console.log("Result: " + result);
    if (result) {
      res.send(Object.values(result));
    } else {
      res.send("Es gab Probleme");
    }
  });
});

router.post("/register", userService.createUser);

router.patch(
  "/resetPassword",
  authService.checkSessionToken,
  userService.patchPassword
);

router.delete("/user", authService.checkSessionToken, userService.deleteUser)

module.exports = router;
