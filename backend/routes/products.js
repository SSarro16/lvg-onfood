const express = require("express");


const { getAll, get, add, replace, remove } = require("../data/event");
const { checkAuth } = require("../util/auth");
const {
  isValidText,
  isValidDate,
  isValidImageUrl,
} = require("../util/validation");

const router = express.Router();

const PRODUCTS = [
  {
    id: '1asdfghj',
    title: "Gateaux di Patate",
    description: "Gateaux di Patate con Mozzarella e Prosciutto",
    image:
      "https://eu.tastescdns.net/thumbor/lIHXenr2N8RY0R-560pJNz4t2OY=/1050x1050/filters:quality(65):brightness(2):contrast(2):rgb(2,-2,0):sharpen(0.2,0.2,true)/it/recipe/YKS-dsl8dOrM9kgqOBh3/8e5ae36aecc9506c6a93f518b42137.png",
    price: 6.4,
    quantity: 6,
    estimatedCompletedTime: 0,
    lastUpdatedTime: Date.now() - 10*60*1000,
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
    lastUpdatedTime: Date.now() - 10*60*1000,
  },
  {
    id: "3dsfkgnlg",
    title: "Condimento di piselli",
    description: "Condimento per pasta di piselli",
    image: null,
    price: 3.0,
    quantity: 0,
    estimatedCompletedTime: 0,
    lastUpdatedTime: Date.now() - 100*60*1000,
  },
  {
    id: "4lssdfsdfsdf",
    title: "Biscotti al cioccolato",
    description: "Biscotti americani al cioccolato",
    image: null,
    price: 4.5,
    quantity: 0,
    estimatedCompletedTime: Date.now() + 60*60*1000,
    lastUpdatedTime: Date.now(),
  }
];

// TODO: Ricky
// Get products - GET '/products'
router.get("/", async (req, res, next) => {
  console.log(`token is ${req.token}`);
  res.json({ products: PRODUCTS });
});

// Get product detail - GET /products/:id
router.get("/:id", async (req, res, next) => {
  try {
    const event = await get(req.params.id);
    res.json({ event: event });
  } catch (error) {
    next(error);
  }
});

// router.use(checkAuth);

// TODO: Ricky
// Add new product - PUT '/products' BODY {product}
router.put("/", async (req, res, next) => {
  console.log(req.body);
  const product = req.body;
  if (true) {
    console.log("if ok");
    PRODUCTS.push({...product, lastUpdatedTime: 0, quantity: 5, estimatedCompletedTime: 0});
    res.json({ success: true });
  } else {
    console.log("if ko");
    next({ message: "Add product failed" });
  }
});
// TODO: Ricky
// Delete product - DELETE '/products/:id'
router.delete("/", async (req, res, next) => {
  res.json(PRODUCTS);
});

// TODO: Ricky
// Modify existing product - PATCH '/products/:id'
router.patch("/", async (req, res, next) => {
  res.json(PRODUCTS);
});

router.post("/", async (req, res, next) => {
  console.log(req.token);
  const data = req.body;

  let errors = {};

  if (!isValidText(data.title)) {
    errors.title = "Invalid title.";
  }

  if (!isValidText(data.description)) {
    errors.description = "Invalid description.";
  }

  if (!isValidDate(data.date)) {
    errors.date = "Invalid date.";
  }

  if (!isValidImageUrl(data.image)) {
    errors.image = "Invalid image.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "Adding the event failed due to validation errors.",
      errors,
    });
  }

  try {
    await add(data);
    res.status(201).json({ message: "Event saved.", event: data });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  const data = req.body;

  let errors = {};

  if (!isValidText(data.title)) {
    errors.title = "Invalid title.";
  }

  if (!isValidText(data.description)) {
    errors.description = "Invalid description.";
  }

  if (!isValidDate(data.date)) {
    errors.date = "Invalid date.";
  }

  if (!isValidImageUrl(data.image)) {
    errors.image = "Invalid image.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "Updating the event failed due to validation errors.",
      errors,
    });
  }

  try {
    await replace(req.params.id, data);
    res.json({ message: "Event updated.", event: data });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await remove(req.params.id);
    res.json({ message: "Event deleted." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
