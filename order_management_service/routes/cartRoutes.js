const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { verifyToken } = require("../middleware/authMiddleware");

//add new item to cart
router.post("/add", verifyToken, cartController.addToCart);
//get item to cart
router.get("/", verifyToken, cartController.getUserCart);
//remove items from cart
router.delete("/remove/:id", verifyToken, cartController.removeFromCart);
//update quantity from cart
router.put("/update",verifyToken, cartController.updateQuantity);

module.exports = router;
 