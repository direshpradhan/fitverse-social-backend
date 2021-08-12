const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getLoggedInUserData,
  getUserByUsername,
  followUser,
  unfollowUser,
} = require("../controllers/user.controller");

router.get("/", getLoggedInUserData);
router.get("/allUsers", getAllUsers);
router.get("/:username", getUserByUsername);

router.post("/follow/:userToFollowId", followUser);
router.delete("/follow/:userToUnfollowId", unfollowUser);

module.exports = router;
