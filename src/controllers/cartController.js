const { ShoppingCart } = require("../models");

exports.addToCart = async (req, res) => {
  try {
    const { user_id, product_id, qty } = req.body;

    console.log(user_id);
    console.log(product_id);
    console.log(qty);

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!product_id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    if (!qty) {
      return res.status(400).json({ message: "Quantity is required" });
    }

    const cart = await ShoppingCart.create({
      user_id,
      product_id,
      qty,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteOneItem = async (req, res) => {
  try {
    const { user_id, product_id } = req.params;

    if (!user_id || !product_id) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const cart = await ShoppingCart.findOne({
      where: { user_id, product_id },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    await cart.destroy();

    res.status(200).json({ message: "Item deleted from cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getCart = async (req, res) => {
  try {
    const { user_id } = req.params;

    const carts = await ShoppingCart.findAll({
      where: { user_id },
      include: ["User", "Product"],
    });

    if (carts.length === 0) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    let total = 0;
    const cartItems = carts.map((cart) => {
      const { cart_id, qty, Product } = cart;
      console.log(cart);
      const { product_name, price, product_id, quantity } = Product;
      const subtotal = qty * price;
      total += subtotal;
      return {
        cart_id,
        qty,
        product_id,
        product_name,
        quantity,
        price,
        subtotal,
      };
    });

    res.status(200).json({
      cartItems,
      total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOneCart = async (req, res) => {
  try {
    const { user_id, product_id } = req.params;
    console.log({user_id});
    console.log({product_id});

    const carts = await ShoppingCart.findOne({
      where: { user_id, product_id, deletedAt: null }
    });

    if(!carts){
      return res.status(200).json(
        {
          available: false,
        }
      )
    }

    if (carts) {
      return res.status(200).json(
        {
          available: true,
          qty: carts.qty
        }
      )
        
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { product_id, qty } = req.body;

    if (!user_id || !product_id || !qty) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const cart = await ShoppingCart.findOne({
      where: { user_id, product_id, deletedAt: null },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    if (qty === 0) {
      await cart.destroy();
      return res.status(200).json({ message: "Product removed from cart" });
    }

    cart.qty = qty;
    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const cart = await ShoppingCart.findAll({
      where: { user_id },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Delete all carts for this user
    await ShoppingCart.destroy({
      where: { user_id },
    });

    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
