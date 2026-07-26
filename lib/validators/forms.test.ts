import { describe, expect, it } from "vitest";

import { estimateVehicleValue } from "./forms";

describe("estimateVehicleValue", () => {
  it("returns a low/high range for valid input", () => {
    const result = estimateVehicleValue({
      vehicleYear: "2020",
      vehicleMileage: "45000",
      condition: "good",
    });

    expect(result.low).toBeGreaterThan(0);
    expect(result.high).toBeGreaterThan(result.low);
  });

  it("applies condition multiplier", () => {
    const excellent = estimateVehicleValue({
      vehicleYear: "2020",
      vehicleMileage: "45000",
      condition: "excellent",
    });
    const poor = estimateVehicleValue({
      vehicleYear: "2020",
      vehicleMileage: "45000",
      condition: "poor",
    });

    expect(excellent.high).toBeGreaterThan(poor.high);
  });
});
