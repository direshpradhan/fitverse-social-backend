const { Post } = require("../models/post.model");
const { User } = require("../models/user.model");

const getAllPosts = async (req, res) => {
  const { userId } = req.user;
  try {
    const loggedInUser = await User.findById(userId);
    console.log(loggedInUser);
    const posts = await Post.find({
      user: { $in: [...loggedInUser.following, userId] },
    }).populate("user", "_id firstName lastName username");

    res.json({ success: true, posts });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Cannot retrive Posts",
        errorMessage: error.message,
      });
  }
};

const addNewPost = async (req, res) => {
  const { userId } = req.user;
  const { content } = req.body;
  try {
    const newPost = new Post({
      user: userId,
      content: content,
      likes: [],
      comments: [],
    });
    console.log(newPost);

    await newPost.save();

    const newPostData = await Post.findById(newPost._id).populate(
      "user",
      "_id firstName lastName username"
    );
    console.log(newPostData);

    // .populate("comments.user","_id firstName lastName username");

    res.json({ success: true, newPost: newPostData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deletePost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findByIdAndDelete(postId);

    res.json({ success: true, message: "Post deleted successfully!!", post });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error while deleting post",
        errorMessage: error.message,
      });
  }
};

const getPostsByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({
        success: false,
        message: "No user exists with the given username",
      });
    }
    const posts = await Post.find({ user: user._id }).populate(
      "user",
      "_id firstName lastName username"
    );

    res.json({ success: true, posts });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: `Error while retrieving posts for ${username} `,
        errorMessage: error.message,
      });
  }
};

const toggleLikeUnlikePost = async (req, res) => {
  const { userId } = req.user;
  const { postId } = req.params;
  try {
    // const user = await User.findById(userId);
    const post = await Post.findById(postId);
    console.log(post.likes);
    const isLiked = post.likes.find((id) => id.toString() === userId);
    if (!isLiked) {
      post.likes.push(userId);
      await post.save();
      return res.json({
        success: true,
        message: "Liked Post",
        post,
        userId,
        postId,
      });
    }
    post.likes.remove(userId);
    await post.save();
    res.json({ success: true, message: "Unliked Video", userId, postId });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error while reacting on post",
        errorMessage: error.message,
      });
  }
};

const addCommentToPost = async (req, res) => {
  const { userId } = req.user;
  const { postId } = req.params;
  const { comment } = req.body;
  try {
    const post = await Post.findById(postId);

    post.comments.unshift({ comment, user: userId });
    await post.save();

    const newComment = post.comments[post.comments.length - 1];
    console.log(newComment);

    res.json({
      success: true,
      message: "Comment posted on post",
      postId,
      userId,
      comment,
      commentId: newComment._id,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error while commenting on post",
        errorMessage: error.message,
      });
  }
};

const deleteComment = async (req, res) => {
  const { userId } = req.user;
  const { postId, commentId } = req.params;
  console.log(commentId);
  console.log("post", postId);
  try {
    const post = await Post.findById(postId);
    post.comments.remove(commentId);
    await post.save();

    res.json({
      success: true,
      message: "Comment deleted",
      postId,
      commentId,
      userId,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error while deleting comment",
        errorMessage: error.message,
      });
  }
};

module.exports = {
  getAllPosts,
  addNewPost,
  deletePost,
  getPostsByUsername,
  toggleLikeUnlikePost,
  addCommentToPost,
  deleteComment,
};
