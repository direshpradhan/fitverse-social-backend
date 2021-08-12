const { User } = require("../models/user.model");

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.json({ success: true, users: allUsers });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error retrieving Users",
        errorMessage: error.message,
      });
  }
};

const getLoggedInUserData = async (req, res) => {
  const { userId } = req.user;
  try {
    const loggedInUser = await User.findById(userId)
      .populate([
        {
          path: "followers",
          select: "username firstName lastName",
          model: User,
        },
        {
          path: "following",
          select: "username firstName lastName",
          model: User,
        },
      ])
      .select("username firstName lastName");

    res.json({ success: true, loggedInUser });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error retrieving logged in user data",
        errorMessage: error.message,
      });
  }
};

const getUserByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username })
      .populate([
        {
          path: "followers",
          select: "username firstName lastName",
          model: User,
        },
        {
          path: "following",
          select: "username firstName lastName",
          model: User,
        },
      ])
      .select("username firstName lastName");

    if (user) {
      return res.json({ success: true, user });
    }

    return res
      .status(404)
      .json({ success: false, message: "No such user exists" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        errorMessage: error.message,
        message: "Error getting user data by username",
      });
  }
};

const followUser = async (req, res) => {
  const { userId } = req.user;
  const { userToFollowId } = req.params;
  try {
    const user = await User.findById(userId);
    const userToFollow = await User.findById(userToFollowId);

    user.following.push(userToFollowId);
    userToFollow.followers.push(userId);

    await user.save();
    await userToFollow.save();

    res.json({ success: true, user, userToFollow });
  } catch (error) {
    res.json({
      success: false,
      message: "Error following user",
      errorMessage: error.message,
    });
  }
};

const unfollowUser = async (req, res) => {
  const { userId } = req.user;
  const { userToUnfollowId } = req.params;
  try {
    const user = await User.findById(userId);
    const userToUnfollow = await User.findById(userToUnfollowId);

    user.following.remove(userToUnfollowId);
    userToUnfollow.followers.remove(userId);

    await user.save();
    await userToUnfollow.save();

    res.json({ success: true, user, userToUnfollow });
  } catch (error) {
    res.json({
      success: false,
      message: "Error unfollowing user",
      errorMessage: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getLoggedInUserData,
  getUserByUsername,
  followUser,
  unfollowUser,
};
