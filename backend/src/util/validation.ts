import { NewProduct, Product, isValidDescription, isValidEstimatedCompletedTime, isValidId, isValidLastUpdatedTime, isValidNewProduct, isValidPrice, isValidProduct, isValidQuantity, isValidTitle } from "../types/products.types";

const isValidDate = (value: any): value is Date => {
  const date = new Date(value);
  return value && date.toString() !== 'Invalid Date';
}

const isValidString = (value: any): value is string => {
  return value && typeof value === 'string';
}

const isValidText = (value: any, minLength = 1): value is string => {
  return isValidString(value) && value.trim().length >= minLength;
}

const isValidImageUrl = (value: any): value is string => {
  return isValidString(value) && (value.startsWith('http://') || value.startsWith('https://'));
}

const isValidEmail = (value: any): value is string => {
  return isValidString(value) && value.includes('@');
}

const sanitizeNewProduct = (product: any, withId = true): NewProduct => {
  if (!isValidNewProduct(product, false)) {
    throw "Invalid product. Either title or price is missing or invalid.";
  }

  const title = product.title.trim();
  const price = product.price;

  const description = isValidDescription(product.description) ? product.description.trim() : '';
  const image = isValidImageUrl(product.image) ? product.image : null;
  const quantity = product.quantity || 0;
  const estimatedCompletedTime = isValidEstimatedCompletedTime(product.estimatedCompletedTime) ? product.estimatedCompletedTime : 0;
  const lastUpdatedTime = isValidLastUpdatedTime(product.lastUpdatedTime) ? product.lastUpdatedTime : 0;


  return {
    title,
    description,
    image,
    price,
    quantity,
    estimatedCompletedTime,
    lastUpdatedTime,
  };
}

const sanitizeProduct = (product: any): Product => {
  const newProduct = sanitizeNewProduct(product);
  if (!isValidString(product.id)) {
    throw "Invalid product id.";
  }

  return {
    ...newProduct,
    id: product.id,
  };
}

const sanitizePartialProduct = (product: any): Partial<Product> => {
  const partialProduct: Partial<Product> = {};

  if (isValidTitle(product.title)) {
    partialProduct.title = product.title;
  }
  if (isValidDescription(product.description)) {
    partialProduct.description = product.description;
  }
  if (isValidImageUrl(product.image)) {
    partialProduct.image = product.image;
  }
  if (isValidPrice(product.price)) {
    partialProduct.price = product.price;
  }
  if (isValidQuantity(product.quantity)) {
    partialProduct.quantity = product.quantity;
  }
  if (isValidEstimatedCompletedTime(product.estimatedCompletedTime)) {
    partialProduct.estimatedCompletedTime = product.estimatedCompletedTime;
  }

  return partialProduct;
}

export {isValidString, isValidDate, isValidText, isValidImageUrl, isValidEmail, sanitizeProduct, sanitizeNewProduct, sanitizePartialProduct};