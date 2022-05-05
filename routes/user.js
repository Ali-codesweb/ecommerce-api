const cryptoJs = require("crypto-js");
const {
  verifyToken,
  verifyTokenAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const User = require("../models/User");

const userRouter = require("express").Router();

userRouter.put("/:id", verifyTokenAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = cryptoJs.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});
// Delete user
userRouter.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User has been deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
});

userRouter.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json({ others });
  } catch (error) {
    res.status(500).json(error);
  }
});
// GET ALL USERS
userRouter.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    // const { password, ...others } = user._doc;
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});
// Get User Stats
// userRouter.get('/stats',verifyTokenAndAdmin,async(req,res)=>{
//   const date = new Date()
//   const lastYear = new Date(date.setFullYear(date.getFullYear()-1))

//   try {
//     const data = await User.aggregate()
//   } catch (error) {
//     res.status(500).json(error)
//   }
// })
module.exports = userRouter;
