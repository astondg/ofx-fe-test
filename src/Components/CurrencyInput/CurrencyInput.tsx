import countryToCurrency from "../../Libs/CountryCurrency.json";

import classes from "./CurrencyInput.module.css";

type Currency = (typeof countryToCurrency)[keyof typeof countryToCurrency];

export type CurrencyInputProps = {
  value?: string;
  currency: Currency;
  onChange?(amount: string): void;
  onAmountChange?(numericValue: number | undefined): void;
};

const CurrencyInput = ({
  currency,
  value,
  onChange,
  onAmountChange,
}: CurrencyInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;

    // Only allow numbers and one decimal point
    input = input.replace(/[^\d.]/g, "");

    // Prevent multiple decimal points
    const parts = input.split(".");
    if (parts.length > 2) {
      input = parts[0] + "." + parts.slice(1).join("");
    }

    // Limit to 3 decimal places (max for any currency)
    if (parts[1] && parts[1].length > 3) {
      parts[1] = parts[1].substring(0, 3);
      input = parts.join(".");
    }

    onChange?.(input);

    // Better parsing with validation
    const numericValue = input === "" ? undefined : parseFloat(input);
    onAmountChange?.(isNaN(numericValue || 0) ? undefined : numericValue);
  };

  return (
    <input
      className={classes.currencyInput}
      type="text"
      value={value}
      placeholder="0.00"
      inputMode="decimal"
      onChange={handleChange}
    ></input>
  );
};

export default CurrencyInput;
