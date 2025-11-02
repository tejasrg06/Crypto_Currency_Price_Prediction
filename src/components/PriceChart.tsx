import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import { PriceHistoryData, generatePrediction } from "@/services/cryptoApi";
import PredictionInfoCard from "./PredictionInfoCard";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PriceChartProps {
  coinId: string;
  coinName: string;
  priceData: PriceHistoryData;
  timeframe: number;
  showPrediction?: boolean;
  currency?: "USD" | "INR";
  marketSentiment?: number;
}

const PriceChart: React.FC<PriceChartProps> = ({
  coinId,
  coinName,
  priceData,
  timeframe,
  showPrediction = true,
  currency = "USD",
  marketSentiment = 0,
}) => {
  const [chartData, setChartData] = useState<any>(null);
  const conversionRate = 83.12; // Fixed conversion rate from USD to INR
  
  // --- Prediction state ---
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);

  // --- Track prediction days ---
  const predictionDays = 7;

  useEffect(() => {
    if (!priceData || !priceData.prices || priceData.prices.length === 0) return;

    // Convert timestamp to readable date format
    const formatDate = (timestamp: number) => {
      const date = new Date(timestamp);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    // Extract actual price data
    const dates = priceData.prices.map((price) => formatDate(price[0]));
    const prices = priceData.prices.map((price) => price[1]);

    // --- Prediction details calculation ---
    let predictionDates: string[] = [];
    let predictionPrices: number[] = [];
    let predictions: [number, number][] = [];

    if (showPrediction) {
      predictions = generatePrediction(priceData.prices, predictionDays, marketSentiment);
      predictionDates = predictions.map((pred) => formatDate(pred[0]));
      predictionPrices = predictions.map((pred) => pred[1]);
      
      // Set predicted price as the last predicted price
      if (predictions.length > 0) {
        setPredictedPrice(predictions[predictions.length - 1][1]);
      } else {
        setPredictedPrice(null);
      }
    } else {
      setPredictedPrice(null);
    }

    // Prepare chart data with conversion if needed
    const convertPrice = (price: number) => currency === "USD" ? price : price * conversionRate;
    
    const adjustedPrices = prices.map(convertPrice);
    const adjustedPredictions = predictionPrices.map(convertPrice);

    setChartData({
      labels: [...dates, ...predictionDates],
      datasets: [
        {
          label: "Historical Price",
          data: [...adjustedPrices, ...(showPrediction ? Array(predictionDates.length).fill(null) : [])],
          borderColor: "rgba(155, 135, 245, 1)",
          backgroundColor: "rgba(155, 135, 245, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 5,
        },
        showPrediction && {
          label: "Prediction",
          data: [...Array(dates.length).fill(null), ...adjustedPredictions],
          borderColor: "rgba(126, 105, 171, 0.8)",
          borderDash: [5, 5],
          borderWidth: 2,
          backgroundColor: "rgba(126, 105, 171, 0.2)",
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 5,
        },
      ].filter(Boolean),
    });
  }, [priceData, showPrediction, currency, marketSentiment]);

  // Chart options
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "rgba(255, 255, 255, 0.7)",
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(28, 25, 38, 0.9)",
        titleColor: "rgba(255, 255, 255, 0.9)",
        bodyColor: "rgba(255, 255, 255, 0.7)",
        borderColor: "rgba(155, 135, 245, 0.3)",
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              const currencySymbol = currency === "USD" ? "$" : "₹";
              // Fixed: Remove currencySymbol property and format properly
              label += new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: currency
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.5)",
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.5)",
          callback: function(value) {
            const currencySymbol = currency === "USD" ? "$" : "₹";
            return currencySymbol + value.toLocaleString();
          }
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  return (
    <div className="w-full">
      {/* Prediction Info Cards outside of the chart */}
      {showPrediction && predictedPrice !== null && (
        <PredictionInfoCard
          predictedPrice={predictedPrice}
          predictionDays={predictionDays}
          currency={currency}
          marketSentiment={marketSentiment}
        />
      )}
      
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>
            {coinName} {showPrediction ? "Price & Prediction" : "Price History"}
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {timeframe === 1
              ? "Last 24 Hours"
              : timeframe === 7
              ? "Last Week"
              : timeframe === 30
              ? "Last Month"
              : `Last ${timeframe} Days`}
            {showPrediction && marketSentiment !== 0 && (
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${marketSentiment > 0 ? 'bg-green-100 text-green-800' : marketSentiment < 0 ? 'bg-red-100 text-red-800' : ''}`}>
                {marketSentiment > 20
                  ? "Strongly Bullish"
                  : marketSentiment > 0
                  ? "Slightly Bullish"
                  : marketSentiment < -20
                  ? "Strongly Bearish"
                  : marketSentiment < 0
                  ? "Slightly Bearish"
                  : "Neutral"} Sentiment
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            {chartData ? (
              <Line data={chartData} options={options} />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p>Loading chart data...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceChart;
