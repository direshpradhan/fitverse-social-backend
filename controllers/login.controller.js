require("dotenv").config();
const { User } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  const { email, username, password } = req.body;
  console.log(req.body);
  try {
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else {
      user = await User.findOne({ username });
    }

    console.log(user);
    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "User with given email/username doesn't exist. Sign up to continue!!",
      });
    }
    console.log(username);
    console.log(password);
    const validPassword = await bcrypt.compare(password, user.password);
    console.log(validPassword);

    if (validPassword) {
      console.log("entered token");
      const token = jwt.sign(
        { user: { userId: user._id } },
        process.env.SECRET_ACCESS_KEY,
        { expiresIn: "1d" }
      );
      console.log(token);

      return res.status(201).json({
        success: true,
        message: "Logged In successfully",
        token,
        user,
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Wrong Password. Please try again later",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { loginUser };
