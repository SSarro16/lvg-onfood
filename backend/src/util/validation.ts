import { Product, isValidDescription, isValidEstimatedCompletedTime, isValidLastUpdatedTime, isValidProduct } from "../types/products.types";

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

const sanitizeProduct = (product: any): Product | null => {
  
  if (!isValidProduct(product, false)) {
    return null;
  }

  const id = product.id;
  const title = product.title.trim();
  const price = product.price;

  const description = isValidDescription(product.description) ? product.description.trim() : '';
  const image = isValidImageUrl(product.image) ? product.image : null;
  const quantity = product.quantity || 0;
  const estimatedCompletedTime = isValidEstimatedCompletedTime(product.estimatedCompletedTime) ? product.estimatedCompletedTime : 0;
  const lastUpdatedTime = isValidLastUpdatedTime(product.lastUpdatedTime) ? product.lastUpdatedTime : 0;


  return {
    id,
    title,
    description,
    image,
    price,
    quantity,
    estimatedCompletedTime,
    lastUpdatedTime,
  };
}

export {isValidString, isValidDate, isValidText, isValidImageUrl, isValidEmail, sanitizeProduct};