import express from "express";
import { Request } from "../types/express.types";
import { checkAuth } from "../util/auth";
import { Product, isValidId } from "../types/products.types";
import { sanitizeNewProduct, sanitizeProduct } from "../util/validation";
import admin from "../util/firebaseAdmin";

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

// [old - to be removed]
// Get products - GET '/products'
router.get("/", async (req: Request, res, next) => {
  try {
    console.log(`token is ${req.token}`);
    const products = PRODUCTS;
    res.json({ products });
  } catch (error: any) {
    next({ message: error.message || "Failed to get products", error });
  }
});

// [new]
// Get products - GET '/products/new'
router.get("/new", async (req: Request, res, next) => {
  try {
    console.log(`token is ${req.token}`);
    // logic to call get on firebase ...
    const db = admin.firestore();
    const productsRef = db.collection("products");
    const snapshot = await productsRef.get();
    const products: Product[] = [];
    snapshot.forEach((doc) => {
      const product = sanitizeProduct(doc.data());
      products.push(product);
    });
    res.json({ products });
  } catch (error: any) {
    next({ message: error.message || "Failed to get products", error });
  }
});

// [old - to be removed]
// Get product detail - GET /products/:id
router.get("/:id", async (req: Request, res, next) => {
  const productId = req.params.id;

  if (isValidId(productId)) {
    try {
      // logic to call get on firebase ...
      let product = PRODUCTS.find((p) => p.id === productId);
      if (product === undefined) {
        next({ message: "Product not found" });
      }
      // sanitize product
      product = sanitizeProduct(product);
      // response
      res.json({ product });
    } catch (error: any) {
      next({ message: error.message || "Failed to get product", error });
    }
  } else {
    next({ message: "Invalid product id" });
  }
});

// [new]
// Get product detail - GET /products/new/:id
router.get("/new/:id", async (req: Request, res, next) => {
  const productId = req.params.id;

  if (isValidId(productId)) {
    try {
      // logic to call get on firebase ...
      const db = admin.firestore();
      const productsRef = db.collection("products");
      const snapshot = await productsRef.where("id", "==", productId).get();
      if (snapshot.empty) {
        next({ message: "Product not found" });
      }
      // sanitize product from firestore
      const product = sanitizeProduct(snapshot.docs[0].data());
      // response
      res.json({ product });
    } catch (error: any) {
      next({ message: error.message || "Failed to get product", error });
    }
  } else {
    next({ message: "Invalid product id" });
  }
});

router.use(checkAuth);

// [old - to be removed]
// Add new product - PUT '/products' BODY {product}
router.put("/", async (req: Request, res, next) => {
  try {
    let product = sanitizeNewProduct(req.body);
    product = {
      ...product,
      lastUpdatedTime: Date.now(),
      quantity: 0, // choice: products start with 0 quantity
      estimatedCompletedTime: 0,
    }

    PRODUCTS.push({...product, id: `${PRODUCTS.length + 1}`});

    res.json({ success: true });
  } catch (error: any) {
    next({ message: error.message || "Add product failed"});
  }
});

// [new]
// Add new product - PUT '/products/new' BODY {product}
router.put("/new", async (req: Request, res, next) => {
  try {
    let product = sanitizeNewProduct(req.body);
    product = {
      ...product,
      lastUpdatedTime: Date.now(),
      quantity: 0, // choice: products start with 0 quantity
      estimatedCompletedTime: 0,
    }
    // logic to call add on firebase ...
    const db = admin.firestore();
    const productsRef = db.collection("products");
    const productRef = await productsRef.add(product);

    const id = productRef.id;
    await productRef.update({ id });

    res.json({ success: true });
  } catch (error: any) {
    next({ message: error.message || "Add product failed"});
  }
});

// [old - to be removed]
// Delete product - DELETE '/products/:id'
router.delete("/", async (req: Request, res, next) => {
  // get id
  const productId = isValidId(req.params.id) ? req.params.id : null;
  if (productId) {
    // logic to call delete on firebase ...
    const index = PRODUCTS.findIndex((p) => p.id === productId);
    if (index === -1) {
      next({ message: "Product not found" });
    }
    PRODUCTS.splice(index, 1);
    res.json({ success: true });
  } else {
    next({ message: "Delete product failed" });
  }
});

// [new]
// Delete product - DELETE '/products/new/:id'
router.delete("/new", async (req: Request, res, next) => {
  // get id
  const productId = isValidId(req.params.id) ? req.params.id : null;
  if (productId) {
    try {
      const db = admin.firestore();
      const productsRef = db.collection("products");
      const productRef = productsRef.doc(productId);
      const result = await productRef.delete();
      res.json({ success: true });
    } catch (error: any) {
      next({ message: error.message || "Delete product failed" });
    }
  } else {
    next({ message: "Delete product failed" });
  }
});

// [old - to be removed]
// Modify existing product - PATCH '/products/:id' BODY {product}
router.patch("/:id", async (req: Request, res, next) => {
  // get id
  const productId = isValidId(req.params.id) ? req.params.id : null;
  const product = sanitizeProduct(req.body);
  if (productId && product) {
    try {
      PRODUCTS.map(p => p.id === productId ? product : p);
      res.json({ success: true });
    } catch (error: any) {
      next({ message: error.message || "Modify product failed" });
    }
  } else {
    next({ message: "Modify product failed" });
  }
});

// [new]
// Modify existing product - PATCH '/products/new/:id' BODY {product}
router.patch("/new/:id", async (req: Request, res, next) => {
  // get id
  const productId = isValidId(req.params.id) ? req.params.id : null;
  const product = sanitizeProduct(req.body);
  if (productId && product) {
    try {
      const db = admin.firestore();
      const productsRef = db.collection("products");
      const productRef = productsRef.doc(productId);
      const result = await productRef.set(product);
      console.log(result);
      res.json({ success: true });
    } catch (error: any) {
      next({ message: error.message || "Modify product failed" });
    }
  } else {
    next({ message: "Modify product failed" });
  }
});


export default router;
