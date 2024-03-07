import express from "express";
import { Request } from "../types/express.types";
import { checkAuth } from "../util/auth";
import { Product, isValidId } from "../types/products.types";
import { sanitizeProduct } from "../util/validation";

const router = express.Router();

const PRODUCTS: Product[] = [
  {
    id: "1asdfghj",
    title: "Gateaux di Patate",
    description: "Gateaux di Patate con Mozzarella e Prosciutto",
    image:
      "https://eu.tastescdns.net/thumbor/lIHXenr2N8RY0R-560pJNz4t2OY=/1050x1050/filters:quality(65):brightness(2):contrast(2):rgb(2,-2,0):sharpen(0.2,0.2,true)/it/recipe/YKS-dsl8dOrM9kgqOBh3/8e5ae36aecc9506c6a93f518b42137.png",
    price: 6.4,
    quantity: 6,
    estimatedCompletedTime: 0,
    lastUpdatedTime: Date.now() - 10 * 60 * 1000,
  },
  {
    id: "2hdrftghsd",
    title: "Lenticchie",
    description: "Lenticchie",
    image:
      "https://www.vitalmentebio.com/wp-content/uploads/2020/01/3A71F517-6914-413F-8B75-FF58C993FE7A.jpg",
    price: 5.5,
    quantity: 6,
    estimatedCompletedTime: 0,
    lastUpdatedTime: Date.now() - 10 * 60 * 1000,
  },
  {
    id: "3dsfkgnlg",
    title: "Condimento di piselli",
    description: "Condimento per pasta di piselli",
    image: null,
    price: 3.0,
    quantity: 0,
    estimatedCompletedTime: 0,
    lastUpdatedTime: Date.now() - 100 * 60 * 1000,
  },
  {
    id: "4lssdfsdfsdf",
    title: "Biscotti al cioccolato",
    description: "Biscotti americani al cioccolato",
    image: null,
    price: 4.5,
    quantity: 0,
    estimatedCompletedTime: Date.now() + 60 * 60 * 1000,
    lastUpdatedTime: Date.now(),
  },
];

// TODO: Ricky
// Get products - GET '/products'
router.get("/", async (req: Request, res, next) => {
  console.log(`token is ${req.token}`);
  // logic to call get on firebase ...
  res.json({ products: PRODUCTS });
});

// Get product detail - GET /products/:id
router.get("/:id", async (req: Request, res, next) => {
  const productId = req.params.id;
  const product = PRODUCTS.find((p) => p.id === productId);
  if (product) {
    // clean product from sensitive data
    res.json({ product });
  } else {
    next({ message: "Product not found" });
  }
});

router.use(checkAuth);

// TODO: Ricky
// Add new product - PUT '/products' BODY {product}
router.put("/", async (req: Request, res, next) => {
  const product = sanitizeProduct(req.body);
  if (product) {
    console.log("if ok");
    PRODUCTS.push({
      ...product,
      lastUpdatedTime: Date.now(),
      quantity: 0,
      estimatedCompletedTime: 0,
    });
    res.json({ success: true });
  } else {
    console.log("if ko");
    next({ message: "Add product failed" });
  }
});

// TODO: Ricky
// Delete product - DELETE '/products/:id'
router.delete("/", async (req: Request, res, next) => {
  // get id
  const productId = isValidId(req.params.id) ? req.params.id : null;
  if (productId) {
    // logic to call delete on firebase ...
    res.json({ success: true });
  } else {
    next({ message: "Delete product failed" });
  }
});

// TODO: Ricky
// Modify existing product - PATCH '/products/:id' BODU {product}
router.patch("/:id", async (req: Request, res, next) => {
  // get id
  const productId = isValidId(req.params.id) ? req.params.id : null;
  const product = sanitizeProduct(req.body);
  if (productId && product) {
    // logic to call update on firebase ...
    res.json({ success: true });
  } else {
    next({ message: "Modify product failed" });
  }
});


export default router;
