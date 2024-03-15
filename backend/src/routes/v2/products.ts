import express from "express";
import { Request } from "../../types/express.types";
import { checkAuthV2 as checkAuth } from "../../util/auth";
import { Product, isValidId } from "../../types/products.types";
import { sanitizeNewProduct, sanitizeProduct } from "../../util/validation";
import { db } from "../../util/firebaseAdmin";

const router = express.Router();

let cached_products: Product[] = [];
let lastUpdatedTime = 0;
const TTL = 1000 * 60; // 1 minute

// Get products - GET '/products'
router.get("/", async (req: Request, res, next) => {
  if (Date.now() - lastUpdatedTime < TTL) {
    // return cached products if last updated time is within TTL
    res.json({ products: cached_products });
  } else {
    try {
      // logic to call get on firebase ...
      const productsRef = db.collection("products");
      const snapshot = await productsRef.get();
      const products: Product[] = [];
      snapshot.forEach((doc) => {
        const product = sanitizeProduct(doc.data());
        products.push(product);
      });
      // cache products
      cached_products = products;
      lastUpdatedTime = Date.now();
      res.json({ products });
    } catch (error: any) {
      next({ message: error.message || "Failed to get products", error });
    }
  }
});

// // Get product detail - GET /products/:id
// router.get("/:id", async (req: Request, res, next) => {
//   const productId = req.params.id;
//   if (isValidId(productId)) {
//     if (Date.now() - lastUpdatedTime < TTL) {
//       // return cached products if last updated time is within TTL
//       const product = cached_products.find((p) => p.id === productId);
//       if (product) {
//         res.json({ product });
//       } else {
//         next({ message: "Product not found" });
//       }
//     } else {
//       try {
//         // logic to call get on firebase ...
//         const productsRef = db.collection("products");
//         const snapshot = await productsRef.where("id", "==", productId).get();
//         if (snapshot.empty) {
//           next({ message: "Product not found" });
//         } else {
//           // sanitize product from firestore
//           const product = sanitizeProduct(snapshot.docs[0].data());
//           // cache product
//           let found = false;
//           cached_products.map((p) => {
//             if (p.id === productId) {
//               found = true;
//               return product;
//             }
//             return p;
//           });

//           // response
//           res.json({ product });
//         }
//       } catch (error: any) {
//         next({ message: error.message || "Failed to get product", error });
//       }
//     }
//   } else {
//     next({ message: "Invalid product id" });
//   }
// });

router.use(checkAuth);

// Add new product - PUT '/products' BODY {product}
router.put("/", async (req: Request, res, next) => {
  try {
    let product = sanitizeNewProduct(req.body);
    product = {
      ...product,
      lastUpdatedTime: Date.now(),
      quantity: 0, // choice: products start with 0 quantity
      estimatedCompletedTime: 0,
    };
    // logic to call add on firebase ...
    const productsRef = db.collection("products");
    const productRef = await productsRef.add(product);

    const id = productRef.id;
    await productRef.update({ id });

    res.json({ success: true });
  } catch (error: any) {
    next({ message: error.message || "Add product failed" });
  }
});

// Delete product - DELETE '/products/:id'
router.delete("/:id", async (req: Request, res, next) => {
  // get id
  const productId = isValidId(req.params.id) ? req.params.id : null;
  if (productId) {
    try {
      const productsRef = db.collection("products");
      const productRef = productsRef.doc(productId);
      await productRef.delete();
      res.json({ success: true });
    } catch (error: any) {
      next({ message: error.message || "Delete product failed" });
    }
  } else {
    next({ message: "Delete product failed" });
  }
});

// Modify existing product - PATCH '/products/:id' BODY {product}
router.patch("/:id", async (req: Request, res, next) => {
  // get id
  const productId = isValidId(req.params.id) ? req.params.id : null;
  const product = sanitizeProduct(req.body);
  if (productId && product) {
    try {
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
