import { useEffect, useMemo, useRef, useState } from "react";
import DropDown from "../../Components/DropDown";
import ProgressBar from "../../Components/ProgressBar";
import Loader from "../../Components/Loader";

import { useAnimationFrame } from "../../Hooks/useAnimationFrame";

import classes from "./Rates.module.css";

import CountryData from "../../Libs/Countries.json";
import CurrencyInput from "../../Components/CurrencyInput/CurrencyInput";
import { useDebounce } from "../../Hooks/useDebounce";
import {
  formatAmount,
  getCurrencyFromCountry,
} from "../../Libs/currencyHelpers";
import { useExchangeRate } from "../../Hooks/useExchangeRate";
import { calculateOFXExchangePair } from "../../Libs/exchangeHelpers";

const countries = CountryData.CountryCodes;
const PROGRESS_SPEED = 0.0001;
const DEBOUNCE_DELAY = 300;

const Rates = () => {
  const [fromCurrency, setFromCurrency] = useState("AU");
  const [toCurrency, setToCurrency] = useState("US");

  const {
    rate: exchangeRate,
    loading,
    error: loadingError,
    fetchRate,
  } = useExchangeRate(fromCurrency, toCurrency);

  const [fromAmountRaw, setFromAmountRaw] = useState("");
  const [fromAmountParsed, setFromAmountParsed] = useState<number>();
  const debouncedFromAmount = useDebounce(fromAmountParsed, DEBOUNCE_DELAY);
  const [toAmount, setToAmount] = useState<number>();
  const [toAmountWithMarkup, setToAmountWithMarkup] = useState<number>();

  const [progression, setProgression] = useState(0);

  useEffect(() => {
    setProgression(0);
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (!debouncedFromAmount) {
      setToAmount(undefined);
      setToAmountWithMarkup(undefined);
      return;
    }

    if (exchangeRate) {
      const { trueConversion, ofxConversion } = calculateOFXExchangePair(
        debouncedFromAmount,
        exchangeRate
      );

      setToAmount(trueConversion);
      setToAmountWithMarkup(ofxConversion);
    } else {
      setToAmount(undefined);
      setToAmountWithMarkup(undefined);
    }
  }, [debouncedFromAmount, exchangeRate]);

  const Flag = ({ code }: { code: string }) => (
    <img
      alt={code || ""}
      src={`/img/flags/${code || ""}.svg`}
      width="20px"
      className={classes.flag}
    />
  );

  const currencyOptions = useMemo(() => {
    return countries.map(({ code }) => ({
      option: getCurrencyFromCountry(code),
      key: code,
      icon: <Flag code={code} />,
    }));
  }, []);

  // Demo progress bar moving :)
  useAnimationFrame(!loading, (deltaTime) => {
    setProgression((prevState) => {
      if (prevState > 0.998) {
        fetchRate();
        return 0;
      }
      return (prevState + deltaTime * PROGRESS_SPEED) % 1;
    });
  });

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <div className={classes.heading}>Currency Conversion</div>

        <div className={classes.rowWrapper}>
          <div>
            <DropDown
              leftIcon={<Flag code={fromCurrency} />}
              label={"From"}
              selected={getCurrencyFromCountry(fromCurrency)}
              options={currencyOptions}
              setSelected={(key: string) => {
                setFromCurrency(key);
              }}
              style={{ marginRight: "20px" }}
            />
          </div>

          <div className={classes.exchangeWrapper}>
            <div className={classes.transferIcon}>
              <img src="/img/icons/Transfer.svg" alt="Transfer icon" />
            </div>

            <div className={classes.rate}>{exchangeRate ?? "N/A"}</div>
          </div>

          <div>
            <DropDown
              leftIcon={<Flag code={toCurrency} />}
              label={"To"}
              selected={getCurrencyFromCountry(toCurrency)}
              options={currencyOptions}
              setSelected={(key: string) => {
                setToCurrency(key);
              }}
              style={{ marginLeft: "20px" }}
            />
          </div>
        </div>
        <div className={classes.conversionWrapper}>
          <CurrencyInput
            value={fromAmountRaw}
            currency={fromCurrency}
            onChange={setFromAmountRaw}
            onAmountChange={setFromAmountParsed}
          />
          <div className={classes.conversionResultWrapper}>
            <div className={classes.conversionResultRow}>
              <span>Rate conversion:</span>
              <span>
                {loading || !toAmount ? (
                  <div className={classes.loadingSkeleton} />
                ) : (
                  formatAmount(toAmount, getCurrencyFromCountry(toCurrency))
                )}
              </span>
            </div>
            <div className={classes.conversionResultRow}>
              <span>With OFX markup:</span>
              <span>
                {loading || !toAmountWithMarkup ? (
                  <div className={classes.loadingSkeleton} />
                ) : (
                  formatAmount(
                    toAmountWithMarkup,
                    getCurrencyFromCountry(toCurrency)
                  )
                )}
              </span>
            </div>
          </div>
        </div>

        <ProgressBar
          progress={progression}
          animationClass={loading ? classes.slow : ""}
          style={{ marginTop: "20px" }}
        />

        {loading && (
          <div className={classes.loaderWrapper}>
            <Loader width={"25px"} height={"25px"} />
          </div>
        )}
        {loadingError && <div className={classes.error}>{loadingError}</div>}
      </div>
    </div>
  );
};

export default Rates;
