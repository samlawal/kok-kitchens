import { describe, it, expect } from "vitest";
import { parseGetAddress } from "./address";

describe("parseGetAddress", () => {
  it("maps expanded getAddress.io results to line1 + city", () => {
    const result = parseGetAddress({
      addresses: [
        {
          line_1: "10 Kendals Close",
          line_2: "",
          town_or_city: "Radlett",
          county: "Hertfordshire",
          formatted_address: ["10 Kendals Close", "", "", "Radlett", "Hertfordshire"],
        },
        {
          line_1: "Flat 2",
          line_2: "12 High Street",
          town_or_city: "Radlett",
          formatted_address: ["Flat 2", "12 High Street", "", "Radlett", ""],
        },
      ],
    });

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      line1: "10 Kendals Close",
      city: "Radlett",
      label: "10 Kendals Close, Radlett, Hertfordshire",
    });
    expect(result[1].line1).toBe("Flat 2, 12 High Street");
    expect(result[1].city).toBe("Radlett");
  });

  it("drops entries with no first line", () => {
    const result = parseGetAddress({
      addresses: [{ line_1: "", town_or_city: "Nowhere" }, { line_1: "1 Real St", town_or_city: "Town" }],
    });
    expect(result).toHaveLength(1);
    expect(result[0].line1).toBe("1 Real St");
  });

  it("returns [] for missing or malformed data", () => {
    expect(parseGetAddress({})).toEqual([]);
    expect(parseGetAddress({ addresses: undefined })).toEqual([]);
    expect(parseGetAddress(null as unknown as { addresses?: [] })).toEqual([]);
  });
});
