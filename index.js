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

//404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "The route you're looking for does not exist!!",
  });
});

// Error Handler
app.use((err, req, res, next) => {
  res.status(500).json({
    succcess: false,
    message: "Server is having some issues. Please try again after sometime.",
  });
});

app.listen(3000, () => {
  console.log("server started");
});
