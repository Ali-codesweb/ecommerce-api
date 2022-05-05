const User = require("../models/User");
const CryptoJS = require("crypto-js");
const authRouter = require("express").Router();
const jwt = require("jsonwebtoken");

authRouter.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const newUser = new User({
    username,
    email,
    password: CryptoJS.AES.encrypt(password, process.env.SECRET_KEY),
  });
  try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

authRouter.post("/login", async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({
      username,
    });
    if (!user) {
      res.status(401).json({ message: "Wrong username Credentials" });
      return;
    }

    const OriginalPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);
    if (OriginalPassword !== req.body.password) {
      res.status(401).json({ message: "Wrong password Credentials" });
      return;
    }

    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;
    res.status(200).json({ others, accessToken });
    console.log(user);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

module.exports = authRouter;
