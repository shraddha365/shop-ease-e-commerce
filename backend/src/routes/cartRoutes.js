import express from "express";
import { body, param } from "express-validator";
import { addCartItem, clearCart, getCart, removeCartItem, updateCartItem } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.use(protect);
router.route("/").get(getCart).delete(clearCart);
router.post("/items", [body("productId").isMongoId().withMessage("Valid product id is required"), body("quantity").optional().isInt({ min: 1 }).withMessage("Quantity must be at least 1")], validate, addCartItem);
router.route("/items/:productId").put([param("productId").isMongoId().withMessage("Valid product id is required"), body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1")], validate, updateCartItem).delete([param("productId").isMongoId().withMessage("Valid product id is required")], validate, removeCartItem);

export default router;