import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function protect(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401);
    return next(new Error("Not authorized, token missing"));
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      res.status(401);
      return next(new Error("Not authorized, user not found"));
    }
    return next();
  } catch (_error) {
    res.status(401);
    return next(new Error("Not authorized, token failed"));
  }
}

export function admin(req, res, next) {
  if (req.user?.role === "admin") return next();
  res.status(403);
  return next(new Error("Admin access required"));
}