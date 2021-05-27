const express = require("express");
const router = express.Router();
const userService = require("./UserService");
const authService = require("../authentificate/AuthService");
const logger = require("../../config/winston");

// get all users
router.get("/", (req, res) => {
  try {
    const token = req.get("Authorization");
    authService.checkSessionToken(token, (err, user) => {
      if (err) res.status(401).send(err);
      console.log(user);
      userService.getUsers((err, result) => {
        if (result) {
          res.send(Object.values(result));
        } else {
          res.send("Es gab Probleme");
        }
      });
    });
  } catch (error) {
    res.status(500);
  }
});

// deleting user
router.delete("/delete", (req, res) => {
  try {
    const token = req.get("Authorization");
    authService.checkSessionToken(token, (err, user) => {
      if (err) res.status(401).send(err);
      console.log(user);

      const { id } = req.body;
      userService.deleteUser(user, id, (err, result) => {
        if (err) return res.status(401).send(err);
        res.send(result);
      });
    });
  } catch (error) {
    res.status(500);
  }
});

// get user with id
router.get("/id", (req, res) => {
  try {
    const token = req.get("Authorization");
    authService.checkSessionToken(token, (err, user) => {
      if (err) return res.status(400).send(err);

      const { id } = req.body;
      userService.getUser(id, (err, user) => {
        if (err) return res.status(400).send(err);
        res.send(user);
      });
    });
  } catch (error) {
    res.status(500);
  }
});

// change username and email
router.patch("/id", (req, res) => {
  try {
    const token = req.get("Authorization");
    authService.checkSessionToken(token, (err, user) => {
      logger.debug(user);
      if (err) return res.status(400).send(err);

      const { id, username, email } = req.body;
      userService.patchUserdata(id, username, email, (err, user) => {
        if (err) return res.status(400).send(err);
        res.send(user.username);
      });
    });
  } catch (error) {
    res.status(500);
  }
});

router.post("/register", (req, res) => {
  try {
    const userData = req.body;
    userService.createUser(userData, (err, result) => {
      if (err) return res.status(400).send(err);
      res.status(201).send(result);
    });
  } catch (error) {
    res.status(500);
  }
});

router.patch("/resetPassword", (req, res) => {
  try {
    const token = req.get("Authorization");
    authService.checkSessionToken(token, (err, user) => {
      logger.debug(user);
      if (err) return res.status(400).send(err);

      const { newPw } = req.body;
      userService.patchPassword(newPw, user, (err, result) => {
        if (err) return res.status(400).send(err);
        else res.sendStatus(200);
      });
    });
  } catch (error) {
    res.status(500);
  }
});

router.patch("/admin", (req, res) => {
  try {
    const token = req.get("Authorization");
    authService.checkSessionToken(token, (err, user) => {
      logger.debug(user);
      if (err) return res.status(400).send(err);

      const { id } = req.body;
      userService.makeUserToAdmin(id, user, (err, result) => {
        if (err) return res.status(400).send(err);
        else res.sendStatus(200);
      });
    });
  } catch (error) {
    res.status(500);
  }
});

module.exports = router;
