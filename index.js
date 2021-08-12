const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const { initializeDBConnection } = require("./db/db.connect");
const signupRouter = require("./routes/signup.router");
const loginRouter = require("./routes/login.router");
const postRouter = require("./routes/post.router");
const userRouter = require("./routes/user.router");
const authenticateToken = require("./authenticateToken");

const app = express();
app.use(bodyparser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello Express app!");
});

initializeDBConnection();

app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use(authenticateToken);
app.use("/user", userRouter);
app.use("/post", postRouter);

app.listen(3000, () => {
  console.log("server started");
});
