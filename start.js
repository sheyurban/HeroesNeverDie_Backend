const port = 8080;
const app = require(".");

// https server
const fs = require('fs')
const key = fs.readFileSync('./certs/selfsigned.key');
const cert = fs.readFileSync('./certs/selfsigned.crt');
const credentials = { key, cert };
const https = require('https');
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`Example app listening at https://localhost:${port}`);
});