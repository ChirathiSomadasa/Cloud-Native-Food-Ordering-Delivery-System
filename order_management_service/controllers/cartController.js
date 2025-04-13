const Cart = require('../models/cart');

// Add to Cart
exports.addToCart = async (req, res) => {
  const { itemId, name, price, img } = req.body;
  const userId = req.user.id;

  // Debugging the received data
  console.log("Received in addToCart:", { itemId, name, price, img });

  if (!itemId) {
    return res.status(400).json({ error: "Item ID is required" });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.itemId.toString() === itemId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ itemId, name, price, img, quantity: 1 });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

// Get Cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.json({ items: [] }); // return empty cart
    }
    res.json({ items: cart.items });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
  
};

// Remove Item
exports.removeFromCart = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(item => item.itemId.toString() !== itemId);
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: "Failed to remove item" });
  }
};
