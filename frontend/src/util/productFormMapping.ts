export type ProductFormStatus = "available" | "wip" | "unavailable";

export type ProductFormFields = {
  title: string;
  image: string;
  price: number;
  description: string;
  quantity: number;
  estimatedCompletedTime: number;
};

export function mapStatusToProduct(
  fields: ProductFormFields,
  status: ProductFormStatus
): ProductFormFields {
  if (status === "available") {
    return {
      ...fields,
      quantity: Math.max(1, fields.quantity || 1),
      estimatedCompletedTime: 0,
    };
  }
  if (status === "wip") {
    return {
      ...fields,
      quantity: 0,
      estimatedCompletedTime: Math.max(1, fields.estimatedCompletedTime || 1),
    };
  }
  return { ...fields, quantity: 0, estimatedCompletedTime: 0 };
}
