import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const couponDiscounts = {
  WELCOME10: 0.1,
  EASE20: 0.2
};

export async function createOrder(req, res, next) {
  try {
    const { orderItems, shippingAddress, paymentMethod, couponCode = "" } = req.body;
    if (!orderItems?.length) {
      res.status(400);
      throw new Error("No order items");
    }

    const ids = orderItems.map((item) => item.product);
    const products = await Product.find({ _id: { $in: ids } });
    const hydratedItems = orderItems.map((item) => {
      const product = products.find((entry) => entry._id.toString() === item.product);
      if (!product) throw new Error("Product missing from order");
      if (product.stock < item.quantity) throw new Error(`${product.name} does not have enough stock`);
      return { product: product._id, name: product.name, image: product.images[0], price: product.price, quantity: item.quantity };
    });

    const itemsPrice = hydratedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingPrice = itemsPrice > 150 ? 0 : 12;
    const taxPrice = Number((itemsPrice * 0.08).toFixed(2));
    const discountPrice = Number((itemsPrice * (couponDiscounts[couponCode] || 0)).toFixed(2));
    const totalPrice = Number((itemsPrice + shippingPrice + taxPrice - discountPrice).toFixed(2));

    const order = await Order.create({ user: req.user._id, orderItems: hydratedItems, shippingAddress, paymentMethod, couponCode, itemsPrice, shippingPrice, taxPrice, discountPrice, totalPrice });

    await Promise.all(hydratedItems.map((item) => Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity, sold: item.quantity } })));
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
}

export async function getMyOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    const owner = order.user._id.toString() === req.user._id.toString();
    if (!owner && req.user.role !== "admin") {
      res.status(403);
      throw new Error("Not authorized to view this order");
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
}

export async function updateOrderToPaid(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = req.body.paymentResult;
    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    order.status = req.body.status;
    if (req.body.status === "Delivered") order.deliveredAt = Date.now();
    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
}