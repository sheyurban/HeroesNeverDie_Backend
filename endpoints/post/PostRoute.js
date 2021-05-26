const express = require("express");
const router = express.Router();

const PostService = require("./PostService");
const authService = require("../authentificate/AuthService");

// get all posts in db
router.get("/", authService.checkSessionToken, PostService.getAllPosts);

// get post by id
router.get("/id", authService.checkSessionToken, PostService.getPost);

// get all posts of a specific user
router.get("/user", authService.checkSessionToken, PostService.getPostsOfUser);

// create a new post
router.post("/create", authService.checkSessionToken, PostService.createPost);

// delete post
router.delete("/delete", authService.checkSessionToken, PostService.deletePost);

// change title, content and/or tags of a post
router.patch("/update", authService.checkSessionToken, PostService.updatePost);

// add user who liked post and send back number of likes
router.patch("/like", authService.checkSessionToken, PostService.addLike);

// get all liked post of one user
router.get("/like", authService.checkSessionToken, PostService.getLikesOfUser);

// gets all post of category guide or discuss for home view
router.get("/home", authService.checkSessionToken, PostService.getHome);

router.get("/filter", authService.checkSessionToken, PostService.getFilteredPosts)

module.exports = router;
