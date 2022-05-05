const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const Product = require("../models/Product");
const productRouter = require("express").Router();

productRouter.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
    // res.status(200).json(newProduct);
  } catch (error) {
    res.status(400).json(error);
  }
});
productRouter.post("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json(error);
  }
});
productRouter.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product has been deleted" });
  } catch (error) {
    res.status(400).json(error);
  }
});
productRouter.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json(error);
  }
});
productRouter.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json(error);
  }
});
module.exports = productRouter;
