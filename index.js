const express = require('express');
const fileUpload = require('express-fileupload');
var logger = require('./config/winston');
const app = express();
const cors = require('cors');

const corsOptions = {
  exposedHeaders: 'Authorization',
  methods: '*',
};
app.use(cors(corsOptions));
app.options('*', cors());

app.use(express.json());
// database

const database = require('./database/db');

// Middleware

const userRoutes = require('./endpoints/user/UserRoute');
const fileUploadRoutes = require('./endpoints/fileUplodad/FileUploadRoute');
const authRoutes = require('./endpoints/authentificate/AuthRoute');
const postRoutes = require('./endpoints/post/PostRoute');
const commentRoutes = require('./endpoints/comment/CommentRoute');
const messageRoutes = require('./endpoints/message/MessageRoute');

app.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 50 * 1024 * 1024,
    },
    useTempFiles: true,
    tempFileDir: '/Temp/',
  })
);

/* Adding the routes */

app.use('/users', userRoutes);
app.use('/authenticate', cors(), authRoutes);
app.use('/fileUpload', fileUploadRoutes);
app.use('/post', postRoutes);
app.use('/comment', commentRoutes);
app.use('/message', messageRoutes);

database.initDb((err, db) => {
  if (db) logger.debug('Anbindung von Datenbank erfolgreich');
  else logger.error('Anbindung von Datenbank gescheitert');
});

/*Error handler */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.use((req, res, next) => {
  res.status(404).send("Sorry, can't find that! This URL is not supported.");
});

app.options((req, res) => {
  console.log(req.headers);
});

// const port = 8080;

// app.listen(port, () => {
//   console.log('Server läuft');
// });

module.exports = app;
