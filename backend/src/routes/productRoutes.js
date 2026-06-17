import express from "express";
import { body, param } from "express-validator";
import { createProduct, createProductReview, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/productController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

const productValidation = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be valid"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be valid"),
  body("images").isArray({ min: 1 }).withMessage("At least one image is required")
];

router.route("/").get(getProducts).post(protect, admin, productValidation, validate, createProduct);
router.route("/:id").get([param("id").isMongoId().withMessage("Valid product id is required")], validate, getProductById).put(protect, admin, [param("id").isMongoId().withMessage("Valid product id is required")], productValidation, validate, updateProduct).delete(protect, admin, [param("id").isMongoId().withMessage("Valid product id is required")], validate, deleteProduct);
router.post("/:id/reviews", protect, [param("id").isMongoId().withMessage("Valid product id is required"), body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be 1 to 5"), body("comment").trim().notEmpty().withMessage("Comment is required")], validate, createProductReview);

export default router;