const Post = require("./PostModel");
var logger = require("../../config/winston");
const { post } = require("../..");

async function getPost(id, callback) {
  try {
    Post.findOne({ _id: id })
      .populate("likes", ["username", "_id"])
      .populate("comments", ["content", "_id"])
      .exec((err, post) => {
        if (err) return callback(err, null);
        return callback(null, post);
      });
  } catch (error) {
    return callback("Something went wrong", null);
  }
}

function getAllPosts(callback) {
  try {
    Post.find()
      .populate("comments")
      .exec()
      .then((posts) => {
        return callback(null, posts);
      });
  } catch (error) {
    return callback("Something went wrong", null);
  }
}

function getPostsOfUser(id, callback) {
  try {
    Post.find({ postedBy: id }, (err, posts) => {
      if (err) return callback("Couldnt find post", null);
      return callback(null, posts);
    });
  } catch (error) {
    return callback("Something went wrong", null);
  }
}

function createPost(postData, user, callback) {
  try {
    const post = {
      title: postData.title,
      postedBy: user._id,
      category: postData.category,
      tags: postData.tags,
      content: postData.content,
    };
    const newPost = new Post(post);
    newPost.save((err, document) => {
      if (err) return callback({ error: "Post couldn't be created." }, null);
      else return callback(null, document);
    });
  } catch (error) {
    return callback("Something went wrong", null);
  }
}

function deletePost(id, user, callback) {
  try {
    Post.findById({ _id: id }, (err, post) => {
      if (err || !post) return callback("Couldnt find post", null);
      if (user.id == post.postedBy || user.isAdmin) {
        Post.deleteOne({ _id: id }, (err) => {
          if (err) return callback("Couldnt delete post", null);
          return callback(null, "Post deleted");
        });
      } else {
        return callback({ error: "Unauthorized" }, null);
      }
    });
  } catch (error) {
    return callback("Something went wrong", null);
  }
}

function updatePost(id, title, content, tags, user, callback) {
  try {
    Post.findById({ _id: id }, (err, post) => {
      if (err || !post) return callback("Couldnt find post", null);
      if (user.id == post.postedBy || user.isAdmin) {
        Post.findByIdAndUpdate(
          { _id: id },
          {
            $set: {
              title: title,
              content: content,
              tags: tags,
            },
          },
          {
            new: true,
            useFindAndModify: false,
          },
          (err, post) => {
            if (err) return callback("Couldnt update post", null);
            return callback(null, post);
          }
        );
      } else {
        return callback({ error: "Unauthorized" }, null);
      }
    });
  } catch (error) {
    return callback("Something went wrong", null);
  }
}

function addLike(id, user, callback) {
  try {
    Post.findById({ _id: id }, (err, post) => {
      if (err) return callback("Couldnt find post", null);
      if (post.likes.includes(user._id)) {
        return callback(null, "User already liked post");
      }
      Post.findByIdAndUpdate(
        { _id: id },
        {
          $push: {
            likes: user._id,
          },
        },
        {
          new: true,
          useFindAndModify: false,
        },
        (err, post) => {
          if (err) return callback("Couldnt add like", null);
          return callback(null, post);
        }
      );
    });
  } catch (error) {
    return callback("Something went wrong", null);
  }
}

function getLikesOfUser(id, callback) {
  try {
    Post.find({ likes: id }, (err, posts) => {
      if (err) return callback("Couldnt find posts liked by this user", null);
      return callback(null, posts);
    });
  } catch (error) {
    return callback("Something went wrong", null);
  }
}

function getHome(callback) {
  try {
    Post.find({
      category: {
        $in: ["Guide", "Discuss"],
      },
    })
      .populate({
        path: "comments",
        populate: {
          path: "postedBy",
          select: ["username", "_id"],
        },
      })
      .exec((err, posts) => {
        if (err || !posts) return callback("Couldnt find posts", null);
        return callback(null, posts);
      });
  } catch (error) {
    return callback("Something went wrong", null);
  }
}

module.exports = {
  getPost,
  getAllPosts,
  getPostsOfUser,
  createPost,
  deletePost,
  updatePost,
  addLike,
  getLikesOfUser,
  getHome,
};
