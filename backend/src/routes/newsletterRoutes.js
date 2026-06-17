import express from "express";
import { body, param } from "express-validator";
import { getNewsletterSubscribers, subscribeNewsletter, unsubscribeNewsletter } from "../controllers/newsletterController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post("/subscribe", [body("email").isEmail().withMessage("Valid email is required")], validate, subscribeNewsletter);
router.get("/subscribers", protect, admin, getNewsletterSubscribers);
router.patch("/unsubscribe/:email", [param("email").isEmail().withMessage("Valid email is required")], validate, unsubscribeNewsletter);

export default router;