const express = require('express');
const router = express.Router();
const atob = require('atob');
var path = require('path');
const logger = require('../../config/winston');

const authService = require('./AuthService');

// login, creates the auth token
router.options((req, res) => {
  console.log(req.header);
});

router.post('/login', (req, res, next) => {
  logger.debug('Want to create token');
  try {
    let loginData = req.get('Authorization');
    loginData = loginData.replace('Basic ', '');
    loginData = atob(loginData).split(':');
    loginData = { username: loginData[0], password: loginData[1] };

    authService.createSessionToken(loginData, (err, token, user) => {
      logger.debug(token);
      if (token) {
        // res.header('Access-Control-Expose-Headers', 'Authorization')
        res.header('Authorization', 'Bearer ' + token);

        if (user) {
          const { id, username, email, isAdmin, ...partialObject } = user;
          const subset = { id, username, email, isAdmin };
          logger.debug(JSON.stringify(subset));
          res.status(200).send(subset);
        } else {
          logger.error(
            'User is null even though a token has been created. Error: ' + err
          );
        }
      } else {
        logger.error('token has not been created, Error: ' + err);
        res.status(400).send(err);
      }
    });
  } catch (error) {
    res.status(400).send("User couldn't be logged in.");
  }
});

// route to verify new users, this link is send in email
router.get('/verify', (req, res) => {
  const { token } = req.query;

  // find user
  authService.verifyUser(token, (err, user) => {
    if (err || !user) return res.status(400).send(err);
    res.status(200).sendFile(path.join(__dirname + '/success.html'));
  });
});

module.exports = router;
