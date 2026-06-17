import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import ContactMessage from "../models/ContactMessage.js";
import NewsletterSubscriber from "../models/NewsletterSubscriber.js";

export async function getDashboard(req, res, next) {
  try {
    const [users, products, orders, contactMessages, newsletterSubscribers] = await Promise.all([User.countDocuments(), Product.countDocuments(), Order.find(), ContactMessage.countDocuments(), NewsletterSubscriber.countDocuments({ isActive: true })]);
    const revenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.json({ users, products, orders: orders.length, revenue, contactMessages, newsletterSubscribers });
  } catch (error) {
    next(error);
  }
}

export async function getUsers(req, res, next) {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function updateUserRole(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    user.role = req.body.role;
    await user.save();
    res.json({ message: "User role updated" });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (user.role === "admin") {
      res.status(400);
      throw new Error("Admin users cannot be deleted from this endpoint");
    }
    await user.deleteOne();
    res.json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
}

export async function getOrders(req, res, next) {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
}