import { mapStatusToProduct } from "../../util/productFormMapping";

const baseFields = {
  title: "Arancina",
  image: "https://example.com/arancina.jpg",
  price: 3.5,
  description: "Ragu e piselli",
  quantity: 12,
  estimatedCompletedTime: 25,
};

describe("mapStatusToProduct", () => {
  it("maps available products to quantity with no estimated time", () => {
    expect(mapStatusToProduct(baseFields, "available")).toMatchObject({
      quantity: 12,
      estimatedCompletedTime: 0,
    });
  });

  it("maps wip products to minutes with zero quantity", () => {
    expect(mapStatusToProduct(baseFields, "wip")).toMatchObject({
      quantity: 0,
      estimatedCompletedTime: 25,
    });
  });

  it("maps unavailable products to zero quantity and zero minutes", () => {
    expect(mapStatusToProduct(baseFields, "unavailable")).toMatchObject({
      quantity: 0,
      estimatedCompletedTime: 0,
    });
  });
});
