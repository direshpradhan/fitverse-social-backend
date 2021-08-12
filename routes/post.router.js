const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  addNewPost,
  deletePost,
  getPostsByUsername,
  toggleLikeUnlikePost,
  addCommentToPost,
  deleteComment,
} = require("../controllers/post.controller");

router.get("/", getAllPosts);
router.post("/", addNewPost);
router.delete("/:postId", deletePost);

router.get("/:username", getPostsByUsername);

router.post("/:postId/like", toggleLikeUnlikePost);

router.post("/:postId/comment", addCommentToPost);
router.delete("/:postId/:commentId", deleteComment);

module.exports = router;
