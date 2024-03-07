import { isValidString } from "../util/validation";

interface Product {
  id: string;
  title: string;
  description: string;
  image: string | null;
  price: number;
  quantity: number;
  estimatedCompletedTime: number;
  lastUpdatedTime: number;
};

const isValidId = (value: any): value is string => {
  return isValidString(value) && value.trim().length > 0 && value.trim().length <= 40;
}
const isValidTitle = (value: any): value is string => {
  return isValidString(value) && value.trim().length > 0 && value.trim().length <= 40;
}

const isValidDescription = (value: any): value is string => {
  return isValidString(value) && value.trim().length > 0 && value.trim().length <= 200;
}

const isValidPrice = (value: any): value is number => {
  return typeof value === 'number' && value > 0;
}

const isValidQuantity = (value: any): value is number => {
  return typeof value === 'number' && value >= 0;
}

const isValidEstimatedCompletedTime = (value: any): value is number => {
  return typeof value === 'number' && value >= 0;
}

const isValidLastUpdatedTime = (value: any): value is number => {
  return typeof value === 'number' && value >= 0;
}

const isValidProduct = (value: any, strict = false): value is Product => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  let condition = isValidId(value.id) && isValidTitle(value.title) && isValidPrice(value.price);
  if (strict) {
    condition = condition && isValidDescription(value.description) && isValidQuantity(value.quantity) && isValidEstimatedCompletedTime(value.estimatedCompletedTime) && isValidLastUpdatedTime(value.lastUpdatedTime);
  }
  return condition;
}

export {Product, isValidProduct, isValidDescription, isValidId, isValidTitle, isValidPrice, isValidQuantity, isValidEstimatedCompletedTime, isValidLastUpdatedTime}