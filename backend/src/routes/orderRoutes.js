import express from "express";
import { body, param } from "express-validator";
import { createOrder, getMyOrders, getOrderById, updateOrderStatus, updateOrderToPaid } from "../controllers/orderController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.route("/").post(protect, [body("orderItems").isArray({ min: 1 }).withMessage("Order items are required"), body("shippingAddress.address").notEmpty().withMessage("Shipping address is required"), body("paymentMethod").isIn(["Stripe", "Razorpay", "Cash on delivery"]).withMessage("Valid payment method is required")], validate, createOrder);
router.get("/myorders", protect, getMyOrders);
router.route("/:id").get(protect, [param("id").isMongoId().withMessage("Valid order id is required")], validate, getOrderById);
router.patch("/:id/pay", protect, [param("id").isMongoId().withMessage("Valid order id is required")], validate, updateOrderToPaid);
router.patch("/:id/status", protect, admin, [param("id").isMongoId().withMessage("Valid order id is required"), body("status").isIn(["Processing", "Shipped", "Delivered", "Cancelled"]).withMessage("Valid status is required")], validate, updateOrderStatus);

export default router;