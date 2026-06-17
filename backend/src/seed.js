import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Cart from "./models/Cart.js";
import ContactMessage from "./models/ContactMessage.js";
import NewsletterSubscriber from "./models/NewsletterSubscriber.js";
import Order from "./models/Order.js";
import Product from "./models/Product.js";
import User from "./models/User.js";
import products from "./data/products.js";

dotenv.config();

async function importData() {
  await connectDB();
  await Promise.all([Order.deleteMany(), Cart.deleteMany(), ContactMessage.deleteMany(), NewsletterSubscriber.deleteMany(), Product.deleteMany(), User.deleteMany()]);

  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const userPassword = await bcrypt.hash("User123!", 10);
  await User.insertMany([
    { name: "Admin Manager", email: "admin@shopease.com", password: adminPassword, role: "admin" },
    { name: "Demo Customer", email: "user@shopease.com", password: userPassword, role: "user" }
  ]);

  await Product.insertMany(products);
  await NewsletterSubscriber.create({ email: "shraddhalandge9960@gmail.com", source: "seed" });
  console.log("ShopEase sample data imported");
  process.exit();
}

async function destroyData() {
  await connectDB();
  await Promise.all([Order.deleteMany(), Cart.deleteMany(), ContactMessage.deleteMany(), NewsletterSubscriber.deleteMany(), Product.deleteMany(), User.deleteMany()]);
  console.log("ShopEase data destroyed");
  process.exit();
}

if (process.argv[2] === "--destroy") destroyData();
else importData();