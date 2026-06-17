import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

function userResponse(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address,
    wishlist: user.wishlist,
    token: generateToken(user._id)
  };
}

export async function registerUser(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      res.status(409);
      throw new Error("User already exists");
    }

    const user = await User.create({ name, email, password });
    res.status(201).json(userResponse(user));
  } catch (error) {
    next(error);
  }
}

export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      return res.json(userResponse(user));
    }
    res.status(401);
    throw new Error("Invalid email or password");
  } catch (error) {
    return next(error);
  }
}

export async function getUserProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function updateUserProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    user.name = req.body.name ?? user.name;
    user.email = req.body.email ?? user.email;
    user.phone = req.body.phone ?? user.phone;
    user.address = req.body.address ?? user.address;
    if (req.body.password) user.password = req.body.password;

    const updated = await user.save();
    res.json(userResponse(updated));
  } catch (error) {
    next(error);
  }
}

export async function toggleWishlist(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;
    const exists = user.wishlist.some((item) => item.toString() === productId);
    user.wishlist = exists ? user.wishlist.filter((item) => item.toString() !== productId) : [...user.wishlist, productId];
    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
}