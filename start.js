const port = 8080;
const app = require('.');
var loggerWinston = require('./config/winston');

// https server
const fs = require('fs');
const key = fs.readFileSync('./certs/selfsigned.key');
const cert = fs.readFileSync('./certs/selfsigned.crt');
const credentials = { key, cert };
const https = require('https');
const { logger } = require('handlebars');
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  loggerWinston.debug(`Example app listening at https://localhost:${port}`);
});
