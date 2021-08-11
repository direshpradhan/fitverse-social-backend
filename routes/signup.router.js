const express = require("express");
const router = express.Router();
const { signupNewUser } = require("../controllers/signup.controller");

router.post("/", signupNewUser);

module.exports = router;
