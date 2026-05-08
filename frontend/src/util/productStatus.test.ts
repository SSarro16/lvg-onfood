import { getProductStatus } from "./productStatus";

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
        quantity: undefined as unknown as number,
        estimatedCompletedTime: undefined as unknown as number,
      })
    ).toBe("unavailable");
  });
});
