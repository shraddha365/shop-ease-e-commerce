import express from "express";
import { body } from "express-validator";
import { createPaymentIntent } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post("/stripe/create-payment-intent", protect, [body("amount").isFloat({ min: 0.5 }).withMessage("Amount must be valid")], validate, createPaymentIntent);

export default router;