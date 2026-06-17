import express from "express";
import { body, param } from "express-validator";
import { deleteUser, getDashboard, getOrders, getUsers, updateUserRole } from "../controllers/adminController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { updateOrderStatus } from "../controllers/orderController.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.use(protect, admin);
router.get("/dashboard", getDashboard);
router.get("/users", getUsers);
router.patch("/users/:id/role", [param("id").isMongoId().withMessage("Valid user id is required"), body("role").isIn(["user", "admin"]).withMessage("Valid role is required")], validate, updateUserRole);
router.delete("/users/:id", [param("id").isMongoId().withMessage("Valid user id is required")], validate, deleteUser);
router.get("/orders", getOrders);
router.patch("/orders/:id/status", [param("id").isMongoId().withMessage("Valid order id is required"), body("status").isIn(["Processing", "Shipped", "Delivered", "Cancelled"]).withMessage("Valid status is required")], validate, updateOrderStatus);

export default router;