import countryToCurrency from "./CountryCurrency.json";

export const parseAmount = (input: string): number => {
  // Remove all non-numeric characters except decimal point
  const cleanInput = input.replace(/[^\d.]/g, "");

  if (!cleanInput || cleanInput === ".") return 0;

  const parsed = parseFloat(cleanInput);

  return isNaN(parsed) ? 0 : parsed;
};

export const formatAmount = (amount: number, currency: string): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  });

  return formatter.format(amount);
};

export const getCurrencyFromCountry = (countryCode: string) => {
  return countryToCurrency[countryCode as keyof typeof countryToCurrency];
};
