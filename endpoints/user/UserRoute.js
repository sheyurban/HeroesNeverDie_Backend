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

router.post("/register", async (req, res) => {
  userService.createUser(req, (doc) => {
    res.status(201).send(doc);
  });
});

router.post("/registerNew", userService.createUser12);

router.patch(
  "/resetPassword",
  authService.checkSessionToken,
  userService.patchPassword
);

// router.delete("/user", authService.checkSessionToken, userService.deleteUser)
router.delete("/user", userService.deleteUser);

router.get("/user", (req, res) => {
  userService.getUsers((err, result) => {
    console.log("Result: " + result);
    if (result) {
      res.send(Object.values(result));
    } else {
      res.send("Es gab Probleme");
    }
  });
});

module.exports = router;
