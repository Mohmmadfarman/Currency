import { useState, useEffect } from 'react';
import { LiaExchangeAltSolid } from "react-icons/lia";
import { List } from './List';

function App() {
  const key = 'ec2c4468a6ead5dea5216d06';
  const [exchangeRate, setExchangeRate] = useState(null);
  const [baseCurrency, setBaseCurrency] = useState('USD'); // Default base currency
  const [targetCurrency, setTargetCurrency] = useState('INR'); // Default target currency
  const [amount, setAmount] = useState(1); // Amount to convert
  const [convertedAmount, setConvertedAmount] = useState(null); // To store the converted amount

  const [first, setFirst] = useState(List);
  const [flag, setFlag] = useState('AE'); // Default flag for 'AE'
  const [sflag, setSFlag] = useState('IN'); // Default flag for the second dropdown

  // Dynamically update the image URL based on selected flags
  const image = `https://flagsapi.com/${flag}/flat/64.png`;
  const img2 = `https://flagsapi.com/${sflag}/flat/64.png`;

  // Fetch exchange rate data when the base currency changes
  const fetchExchangeRate = async (baseCurrency) => {
    try {
      const response = await fetch(`https://v6.exchangerate-api.com/v6/${key}/latest/${baseCurrency}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setExchangeRate(data.conversion_rates[targetCurrency]);
      // console.log(data.conversion_rates);
      
      // console.log(data.conversion_rates[targetCurrency]);
      
    } catch (error) {
      console.error('Error fetching the exchange rate data:', error.message);
    }
  };

  // Fetch the exchange rate when baseCurrency or targetCurrency changes
  useEffect(() => {
    fetchExchangeRate(baseCurrency);
  }, [baseCurrency, targetCurrency]);

  // Handle conversion calculation
  const handleConvert = () => {
    if (exchangeRate) {
      // console.log(exchangeRate);
      
      const converted = (amount * exchangeRate).toFixed(2);
      setConvertedAmount(converted);
    }
  };

  return (
    <div className='w-full h-[640px] bg-slate-400 flex justify-center items-center'>
      <div className='w-[90%] md:w-[60%] lg:w-[40%] h-auto bg-violet-400 rounded-lg p-6 md:p-8 flex flex-col items-center shadow-lg'>
        <h1 className='text-2xl md:text-3xl font-semibold mt-2 mb-8 text-center'>Currency Converter</h1>

        <div className='w-full mb-6'>
          <label className='text-lg md:text-xl' htmlFor="amount">Enter Amount:</label>
          <input
            className='border-black ml-3 p-2 rounded-md w-full mt-2'
            type="number"
            id="amount"

            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>

        <div className='flex flex-col md:flex-row gap-6 mb-10 w-full justify-between'>
          <div className='flex flex-col items-center'>
            <h1 className="text-base md:text-lg">From</h1>
            <div className='w-[100%] md:w-[130px] h-12 bg-pink-400 flex flex-row items-center rounded-md mt-2'>
              <img src={image} alt="Flag" className="mr-2" />
              <select
                className='h-10 w-full rounded-sm'
                name="fromCurrency"
                id="fromCurrency"
                value={baseCurrency}
                onChange={(e) => {
                  const ans = e.target.value;
                  setBaseCurrency(ans);
                  const countryCode = List[ans].slice(0, 2);
                  setFlag(countryCode); // Change the flag accordingly
                }}
              >
                {Object.entries(first).map(([currencyCode, countryCode]) => (
                  <option key={currencyCode} value={currencyCode}>
                    {currencyCode}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='mt-4 md:mt-8 text-xl font-bold self-center'>
            <LiaExchangeAltSolid />
          </div>

          <div className='flex flex-col items-center'>
            <h1 className="text-base md:text-lg">To</h1>
            <div className='w-[100%] md:w-[130px] h-12 bg-pink-400 flex flex-row items-center rounded-md mt-2'>
              <img src={img2} alt="Flag" className="mr-2" />
              <select
                className='h-10 w-full rounded-sm'
                name="toCurrency"
                id="toCurrency"
                value={targetCurrency}
                onChange={(e) => {
                  const ans = e.target.value;
                  setTargetCurrency(ans);
                  const countryCode = List[ans].slice(0, 2);
                  setSFlag(countryCode); // Change the flag accordingly
                }}
              >
                {Object.entries(first).map(([currencyCode, countryCode]) => (
                  <option key={currencyCode} value={currencyCode}>
                    {currencyCode}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className='mb-8 text-center'>
          <h1 className="text-lg md:text-xl font-medium">
            {convertedAmount ? `Converted Amount: ${convertedAmount} ${targetCurrency}` : 'Enter amount and select currencies'}
          </h1>
        </div>

        <button
          className='bg-orange-500 p-3 md:p-4 text-sm md:text-base pl-7 pr-7 rounded-md w-full md:w-auto'
          onClick={handleConvert}
        >
          Get Exchange Rate
        </button>
      </div>
    </div>
  );
}

export default App;
