import { calculateOFXExchangePair } from "./exchangeHelpers";

describe("calculateOFXExchangePair", () => {
  it("should calculate true conversion without markup", () => {
    const result = calculateOFXExchangePair(100, 1.5);
    expect(result.trueConversion).toBe(150);
  });

  it("should calculate OFX conversion with 0.5% markup", () => {
    const result = calculateOFXExchangePair(100, 1.0);
    // With 0.5% markup: 100 * (1.0 - 0.005 * 1.0) = 100 * 0.995 = 99.5
    expect(result.ofxConversion).toBe(99.5);
  });

  it("should handle higher exchange rates correctly", () => {
    const result = calculateOFXExchangePair(100, 50.0);
    // True: 100 * 50 = 5000
    // OFX: 100 * (50 - 0.005 * 50) = 100 * 49.75 = 4975
    expect(result.trueConversion).toBe(5000);
    expect(result.ofxConversion).toBe(4975);
  });

  it("should handle decimal amounts", () => {
    const result = calculateOFXExchangePair(123.45, 0.75);
    const expectedTrue = 123.45 * 0.75;
    const expectedOFX = 123.45 * (0.75 - 0.005 * 0.75);

    expect(result.trueConversion).toBeCloseTo(expectedTrue, 5);
    expect(result.ofxConversion).toBeCloseTo(expectedOFX, 5);
  });

  it("should always have OFX conversion less than true conversion", () => {
    const testCases = [
      { amount: 100, rate: 1.0 },
      { amount: 50, rate: 2.5 },
      { amount: 1000, rate: 0.8 },
    ];

    testCases.forEach(({ amount, rate }) => {
      const result = calculateOFXExchangePair(amount, rate);
      expect(result.ofxConversion).toBeLessThan(result.trueConversion);
    });
  });
});
