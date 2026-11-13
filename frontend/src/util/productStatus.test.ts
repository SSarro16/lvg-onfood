import { getProductStatus, getProductStatusMeta } from "./productStatus";

describe("getProductStatus", () => {
  it("returns available when quantity is greater than zero", () => {
    expect(getProductStatus({ quantity: 2, estimatedCompletedTime: 0 })).toBe(
      "available"
    );
  });

  it("returns wip when quantity is zero and estimated time is greater than zero", () => {
    expect(getProductStatus({ quantity: 0, estimatedCompletedTime: 15 })).toBe(
      "wip"
    );
  });

  it("returns unavailable when quantity and estimated time are zero", () => {
    expect(getProductStatus({ quantity: 0, estimatedCompletedTime: 0 })).toBe(
      "unavailable"
    );
  });

  it("treats missing values as unavailable", () => {
    expect(
      getProductStatus({
        quantity: undefined,
        estimatedCompletedTime: undefined,
      })
    ).toBe("unavailable");
  });

  it("treats null estimated time as unavailable when quantity is zero", () => {
    expect(getProductStatus({ quantity: 0, estimatedCompletedTime: null })).toBe(
      "unavailable"
    );
  });

  it("returns user-facing meta for available products", () => {
    expect(
      getProductStatusMeta({ quantity: 3, estimatedCompletedTime: 0 })
    ).toMatchObject({
      status: "available",
      label: "Disponibile",
      badge: "success",
      cta: "Vedi dettagli",
    });
  });

  it("returns user-facing meta with eta for products in preparation", () => {
    expect(
      getProductStatusMeta({ quantity: 0, estimatedCompletedTime: 20 })
    ).toMatchObject({
      status: "wip",
      label: "In lavorazione",
      detailLabel: "Pronto tra 20 min",
      badge: "warn",
      cta: "Segui preparazione",
    });
  });
});
