const OFX_MARKUP = 0.005;

export function calculateOFXExchangePair(
  sellAmount: number,
  exchangeRate: number
) {
  const trueConversion = sellAmount * exchangeRate;
  const ofxConversion = sellAmount * (exchangeRate - OFX_MARKUP * exchangeRate);
  return { trueConversion, ofxConversion };
}
