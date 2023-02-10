import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./App.css";

function App() {
  // all currency state
  const [currencyRates, setCurrencyRates] = useState([]);

  // main currency rate
  const [currentCurrency, setCurrentCurrency] = useState("AED");

  // loader
  const [isLoading, setIsloading] = useState(false);

  // total currency
  const graphSize = 10;

  // onload currency data
  useEffect(() => {
    getCurrencyData(currentCurrency);
  }, []);

  // api hit and filtering
  async function getCurrencyData(currentCurrency) {
    let client = axios.create({
      baseURL: `https://open.er-api.com/v6/latest/${currentCurrency}`,
    });
    setIsloading(true);
    const response = await client.get();
    setIsloading(false);
    let data = response.data.rates;
    let currency = [];
    Object.keys(data).forEach((k, i) => {
      if (i < graphSize) {
        let val = { name: k, value: data[k] };
        currency.push(val);
      }
    });
    setCurrentCurrency(currentCurrency);
    setCurrencyRates(currency);
  }

  // select designing
  const customStyles = {
    container: (provided) => ({
      ...provided,
      display: "inline-block",
      width: "100%",
      minHeight: "1px",
      textAlign: "left",
      border: "none",
      fontSize: "12px",
    }),
    control: (provided) => ({
      ...provided,
      border: "1px solid #02b3e4",
      borderRadius: "4px",
    }),
    input: (provided) => ({
      ...provided,
      minHeight: "1px",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      minHeight: "1px",
      paddingTop: "0",
      paddingBottom: "0",
      color: "#02b3e4",
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      minHeight: "1px",
      height: "24px",
      background: "#fff",
    }),
    clearIndicator: (provided) => ({
      ...provided,
      minHeight: "1px",
    }),
    valueContainer: (provided) => ({
      ...provided,
      //   minHeight: '1px',
      //   height: '40px',
      paddingTop: "0",
      paddingBottom: "0",
    }),
    singleValue: (provided) => ({
      ...provided,
      minHeight: "1px",
      paddingBottom: "2px",
    }),
  };

  // array formatter
  const formattedArray = (array) => {
    return array.map((item) => {
      return {
        label: item.name,
        value: item.name,
      };
    });
  };

  return (
    <>
      <div className="main">
        <section class="glass">
          <div className="main-container">
            <h1 className="current-currency">{currentCurrency}</h1>
            <Select
              id={"currencySelector"}
              className="mb-2"
              isSearchable={true}
              placeholder={"Select a Currency"}
              onChange={(value) => {
                getCurrencyData(value.value);
              }}
              styles={customStyles}
              options={formattedArray(currencyRates)}
            />
            {isLoading && <h4 className="text-center">Loading</h4>}
            {!isLoading && currencyRates.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  width={500}
                  height={400}
                  data={currencyRates}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" fill="white" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => value.toFixed(2)} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="pv"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
      </div>
      <div class="circle1"></div>
      <div class="circle2"></div>
    </>
  );
}

export default App;
