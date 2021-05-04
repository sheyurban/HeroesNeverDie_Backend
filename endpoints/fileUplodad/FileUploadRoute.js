var express = require("express");
var router = express.Router();
var path = require("path");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/upload.html"));
});

router.post("/upload", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  let sampleFile = req.files.sampleFile;

  sampleFile.mv(__dirname + "/../../uploadedFiles/" + sampleFile.name, (err) => {
    if (err) return res.status(500).send(err);
    res.send("File uploaded.");
  });
});

module.exports = router
