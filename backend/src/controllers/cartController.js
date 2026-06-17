import Cart from "../models/Cart.js";

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
}

export async function getCart(req, res, next) {
  try {
    const cart = await getOrCreateCart(req.user._id);
    await cart.populate("items.product");
    res.json(cart);
  } catch (error) {
    next(error);
  }
}

export async function addCartItem(req, res, next) {
  try {
    const { productId, quantity = 1 } = req.body;
    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.find((entry) => entry.product.toString() === productId);
    if (item) item.quantity += Number(quantity);
    else cart.items.push({ product: productId, quantity });
    await cart.save();
    await cart.populate("items.product");
    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
}

export async function updateCartItem(req, res, next) {
  try {
    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.find((entry) => entry.product.toString() === req.params.productId);
    if (!item) {
      res.status(404);
      throw new Error("Cart item not found");
    }
    item.quantity = Number(req.body.quantity);
    await cart.save();
    await cart.populate("items.product");
    res.json(cart);
  } catch (error) {
    next(error);
  }
}

export async function removeCartItem(req, res, next) {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = cart.items.filter((entry) => entry.product.toString() !== req.params.productId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    next(error);
  }
}

export async function clearCart(req, res, next) {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (error) {
    next(error);
  }
}