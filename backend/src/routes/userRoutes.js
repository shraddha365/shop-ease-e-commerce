import express from "express";
import { body, param } from "express-validator";
import { getUserProfile, loginUser, registerUser, toggleWishlist, updateUserProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post("/register", [body("name").trim().notEmpty().withMessage("Name is required"), body("email").isEmail().withMessage("Valid email is required"), body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")], validate, registerUser);
router.post("/login", [body("email").isEmail().withMessage("Valid email is required"), body("password").notEmpty().withMessage("Password is required")], validate, loginUser);
router.route("/profile").get(protect, getUserProfile).put(protect, [body("email").optional().isEmail().withMessage("Valid email is required")], validate, updateUserProfile);
router.post("/wishlist/:productId", protect, [param("productId").isMongoId().withMessage("Valid product id is required")], validate, toggleWishlist);

export default router;