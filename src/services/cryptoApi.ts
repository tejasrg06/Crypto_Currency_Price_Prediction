
import axios from "axios";

// API endpoints
const COINGECKO_API = "https://api.coingecko.com/api/v3";

// Types
export interface CryptoCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
}

export interface PriceHistoryData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

// Get top cryptocurrencies by market cap
export const getTopCryptos = async (limit: number = 10): Promise<CryptoCoin[]> => {
  try {
    const response = await axios.get(
      `${COINGECKO_API}/coins/markets`,
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: limit,
          page: 1,
          sparkline: false,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching top cryptos:", error);
    return [];
  }
};

// Get price history for a specific coin
export const getCoinPriceHistory = async (
  coinId: string,
  days: number = 7
): Promise<PriceHistoryData> => {
  try {
    const response = await axios.get(
      `${COINGECKO_API}/coins/${coinId}/market_chart`,
      {
        params: {
          vs_currency: "usd",
          days: days,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching price history for ${coinId}:`, error);
    return { prices: [], market_caps: [], total_volumes: [] };
  }
};

// Get coin details
export const getCoinDetails = async (coinId: string) => {
  try {
    const response = await axios.get(`${COINGECKO_API}/coins/${coinId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for ${coinId}:`, error);
    return null;
  }
};

// Function to generate prediction based on historical data and sentiment
export const generatePrediction = (
  priceData: [number, number][], 
  days: number = 7, 
  marketSentiment: number = 0
): [number, number][] => {
  if (priceData.length < 2) return [];
  
  // Extract just the prices for calculation
  const prices = priceData.map(item => item[1]);
  
  // Calculate a simple moving average
  const movingAverage = prices.slice(Math.max(prices.length - 7, 0));
  const avgChange = movingAverage.slice(1).map((price, i) => 
    price / movingAverage[i] - 1
  ).reduce((sum, change) => sum + change, 0) / (movingAverage.length - 1);
  
  // Adjust the change based on sentiment
  // Convert sentiment from -100 to 100 scale to a smaller modifier (-0.02 to 0.02)
  const sentimentModifier = marketSentiment / 5000;
  const adjustedChange = avgChange + sentimentModifier;
  
  // Generate prediction
  const predictions: [number, number][] = [];
  let lastTimestamp = priceData[priceData.length - 1][0];
  let lastPrice = priceData[priceData.length - 1][1];
  
  // Create future data points with sentiment influence
  for (let i = 1; i <= days; i++) {
    lastTimestamp += 24 * 60 * 60 * 1000; // Add one day in milliseconds
    lastPrice = lastPrice * (1 + adjustedChange);
    predictions.push([lastTimestamp, lastPrice]);
  }
  
  return predictions;
};
