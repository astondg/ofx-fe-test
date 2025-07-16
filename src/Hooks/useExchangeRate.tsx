import { useCallback, useEffect, useRef, useState } from "react";
import { getCurrencyFromCountry } from "../Libs/currencyHelpers";

const API_BASE_URL = "https://rates.staging.api.paytron.com";

export const useExchangeRate = (fromCurrency: string, toCurrency: string) => {
  const [rate, setRate] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const componentIsMounted = useRef<boolean>();

  useEffect(() => {
    componentIsMounted.current = true;
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  const fetchRate = useCallback(async () => {
    if (!loading && fromCurrency && toCurrency) {
      setLoading(true);
      setError(undefined);

      try {
        const sellCurrency = getCurrencyFromCountry(fromCurrency);
        const buyCurrency = getCurrencyFromCountry(toCurrency);
        const result = await fetch(
          `${API_BASE_URL}/rate/public?sellCurrency=${sellCurrency}&buyCurrency=${buyCurrency}`
        );

        if (!componentIsMounted.current) return;

        if (result.ok) {
          const body = await result.json();

          if (!componentIsMounted.current) return;

          setRate(body.retailRate);
        } else {
          console.error(
            `failed to retrieve new exchange rate for ${fromCurrency} to ${toCurrency}`,
            { status: result.status, statusText: result.statusText }
          );
          setError(
            `failed to retrieve new exchange rate for ${fromCurrency} to ${toCurrency}`
          );
          setRate(undefined);
        }
      } catch (error) {
        console.error(
          `failed to retrieve new exchange rate for ${fromCurrency} to ${toCurrency}`,
          error
        );
        setError(
          `failed to retrieve new exchange rate for ${fromCurrency} to ${toCurrency}`
        );
        setRate(undefined);
      } finally {
        setLoading(false);
      }
    }
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (!fromCurrency || !toCurrency) return;
    fetchRate();
  }, [fromCurrency, toCurrency, fetchRate]);

  return { rate, loading, error, fetchRate };
};
