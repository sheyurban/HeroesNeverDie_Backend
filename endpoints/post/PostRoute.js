const express = require("express");
const router = express.Router();

const PostService = require("./PostService");
const authService = require("../authentificate/AuthService");

// get all posts in db
router.get("/", authService.checkSessionToken, PostService.getAllPosts);

// get post by id
router.get("/id", PostService.getPost);

// get all posts of a specific user
router.get("/user", PostService.getPostsOfUser);

// create a new post
router.post("/create", PostService.createPost);

// delete post
router.delete("/delete", PostService.deletePost);

// change title, content and/or tags of a post
router.patch("/update", PostService.updatePost);

// add user who liked post and send back number of likes
router.patch("/like", PostService.addLike);

// get all liked post of one user
router.get("/like", PostService.getLikesOfUser);

// gets all post of category guide or discuss for home view
router.get("/home", PostService.getHome);

module.exports = router;
