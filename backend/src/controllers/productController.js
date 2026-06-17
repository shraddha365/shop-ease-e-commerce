import Product from "../models/Product.js";

function createSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function getProducts(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const keyword = req.query.search ? { $text: { $search: req.query.search } } : {};
    const category = req.query.category ? { category: req.query.category } : {};
    const price = {
      price: {
        $gte: Number(req.query.minPrice) || 0,
        $lte: Number(req.query.maxPrice) || Number.MAX_SAFE_INTEGER
      }
    };
    const sortMap = {
      latest: { createdAt: -1 },
      "price-low": { price: 1 },
      "price-high": { price: -1 }
    };
    const filter = { ...keyword, ...category, ...price };
    const products = await Product.find(filter).sort(sortMap[req.query.sort] || sortMap.latest).skip((page - 1) * limit).limit(limit);
    const count = await Product.countDocuments(filter);
    res.json({ products, page, pages: Math.ceil(count / limit), count });
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).populate("reviews.user", "name");
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const product = await Product.create({ ...req.body, slug: createSlug(req.body.name) });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    Object.assign(product, req.body);
    if (req.body.name) product.slug = createSlug(req.body.name);
    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    next(error);
  }
}

export async function createProductReview(req, res, next) {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const alreadyReviewed = product.reviews.some((review) => review.user.toString() === req.user._id.toString());
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ message: "Review added" });
  } catch (error) {
    next(error);
  }
}