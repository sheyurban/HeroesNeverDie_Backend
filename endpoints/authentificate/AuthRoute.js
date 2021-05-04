const express = require("express");
const router = express.Router();
const atob = require("atob");

var authService = require("./AuthService");

router.post("/loginBasic", (req, res, next) => {
  console.log("Want to create token");
  try {
    let loginData = req.get("Authorization");
    loginData = loginData.replace("Basic ", "");
    loginData = JSON.parse(atob(loginData));

    authService.createSessionToken(loginData, (err, token, user) => {
      if (token) {
        res.header("Authorization", "Bearer " + token);

        if (user) {
          const { id, userID, userName, ...partialObject } = user;
          const subset = { id, userID, userName };
          console.log(JSON.stringify(subset));
          res.send(subset);
        } else {
          console.log(
            "User is null even though a token has been created. Error: " + err
          );
        }
      } else {
        console.log("token has not been created, Error: " + err);
        res.send("Could not create token");
      }
    });
  } catch (error) {
    res.sendStatus(400);
  }
});

router.post("/login", (req, res, next) => {
  console.log("Want to create token");

  authService.createSessionToken(req.body, (err, token, user) => {
    if (token) {
      res.header("Authorization", "Bearer " + token);

      if (user) {
        const { id, userID, userName, ...partialObject } = user;
        const subset = { id, userID, userName };
        console.log(JSON.stringify(subset));
        res.send(subset);
      } else {
        console.log(
          "User is null even though a token has been created. Error: " + err
        );
      }
    } else {
      console.log("token has not been created, Error: " + err);
      res.send("Could not create token");
    }
  });
});

module.exports = router;
