require("dotenv").config();
const { User } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signupNewUser = async (req, res) => {
  console.log("signup....");
  const { signupData } = req.body;
  const { firstName, lastName, username, email, password } = signupData;
  try {
    const user = await User.findOne({ email });

    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);

    if (user) {
      return res
        .status(409)
        .json({
          status: false,
          message: "User already exists with this email.",
        });
    }
    const newUser = new User({
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      password: hashedPassword,
      followers: [],
      following: [],
    });

    await newUser.save();

    const token = jwt.sign(
      { user: { userId: newUser._id } },
      process.env.SECRET_ACCESS_KEY,
      { expiresIn: "1d" }
    );

    // const userData = await User.findById(newUser._id)
    //     .populate([
    //       {
    //         path: 'followers',
    //         select: 'username firstName lastName',
    //         model: User,
    //       },
    //       {
    //         path: 'following',
    //         select: 'username firstName lastName',
    //         model: User,
    //       },
    //     ])
    //     .select('username firstName lastName');

    res
      .status(201)
      .json({ success: true, message: "User created", token, user: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { signupNewUser };
