const express = require("express");
const fileUpload = require("express-fileupload");

const database = require("./database/db");

// Middleware

const userRoutes = require("./endpoints/user/UserRoute");
const fileUploadRoutes = require("./endpoints/fileUplodad/FileUploadRoute");
const authRoutes = require("./endpoints/authentificate/AuthRoute");
const postRoutes = require("./endpoints/post/PostRoute")
const commentRoutes = require("./endpoints/comment/CommentRoute")

const app = express();
app.use(express.json());

app.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 50 * 1024 * 1024,
    },
    useTempFiles: true,
    tempFileDir: "/Temp/",
  })
);

/* Adding the routes */

app.use("/users", userRoutes);
app.use("/authenticate", authRoutes);
app.use("/fileUpload", fileUploadRoutes);
app.use("/post", postRoutes)
app.use("/comment", commentRoutes)

database.initDb((err, db) => {
  if (db) console.log("Anbindung von Datenbank erfolgreich");
  else console.log("Anbindung von Datenbank gescheitert");
});

/*Error handler */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.use((req, res, next) => {
  res.status(404).send("Sorry, can't find that! This URL is not supported.");
});

const port = 8080;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
