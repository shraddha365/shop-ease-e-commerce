import express from "express";
import { body, param } from "express-validator";
import { createContactMessage, deleteContactMessage, getContactMessages, updateContactMessageStatus } from "../controllers/contactController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("subject").trim().notEmpty().withMessage("Subject is required"),
    body("message").trim().isLength({ min: 10 }).withMessage("Message must be at least 10 characters")
  ],
  validate,
  createContactMessage
);

router.get("/", protect, admin, getContactMessages);
router.patch("/:id/status", protect, admin, [param("id").isMongoId().withMessage("Valid message id is required"), body("status").isIn(["New", "Read", "Resolved"]).withMessage("Valid status is required")], validate, updateContactMessageStatus);
router.delete("/:id", protect, admin, [param("id").isMongoId().withMessage("Valid message id is required")], validate, deleteContactMessage);

export default router;