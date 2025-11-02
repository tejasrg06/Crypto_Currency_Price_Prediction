
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
  ChartOptions,
} from "chart.js";
import { PriceHistoryData, getCoinPriceHistory } from "@/services/cryptoApi";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ComparisonChartProps {
  coins: {
    id: string;
    name: string;
    color: string;
  }[];
  timeframe: number;
}

interface NormalizedData {
  [key: string]: {
    dates: string[];
    prices: number[];
  };
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ coins, timeframe }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch price data for all coins
        const priceDataPromises = coins.map(coin => 
          getCoinPriceHistory(coin.id, timeframe)
        );
        
        const priceDataResults = await Promise.all(priceDataPromises);
        
        // Normalize data for comparison (percentage change from first day)
        const normalizedData: NormalizedData = {};
        
        priceDataResults.forEach((data, index) => {
          if (!data.prices || data.prices.length === 0) return;
          
          const coinId = coins[index].id;
          const firstPrice = data.prices[0][1];
          const dates = data.prices.map(price => {
            const date = new Date(price[0]);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          });
          
          // Calculate percentage change from first price
          const normalizedPrices = data.prices.map(price => 
            (price[1] / firstPrice - 1) * 100
          );
          
          normalizedData[coinId] = {
            dates,
            prices: normalizedPrices,
          };
        });
        
        // Create chart data
        if (Object.keys(normalizedData).length > 0) {
          // Use the first coin's dates as labels
          const firstCoinId = Object.keys(normalizedData)[0];
          const labels = normalizedData[firstCoinId].dates;
          
          const datasets = coins.map((coin, index) => {
            const data = normalizedData[coin.id];
            return {
              label: coin.name,
              data: data ? data.prices : [],
              borderColor: coin.color,
              backgroundColor: `${coin.color}33`,
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 5,
              tension: 0.4,
            };
          });
          
          setChartData({
            labels,
            datasets: datasets.filter(dataset => dataset.data.length > 0),
          });
        }
      } catch (error) {
        console.error("Error fetching comparison data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (coins.length > 0) {
      fetchData();
    }
  }, [coins, timeframe]);

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
              label += context.parsed.y.toFixed(2) + '%';
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
            return value + '%';
          }
        },
        title: {
          display: true,
          text: 'Percentage Change',
          color: "rgba(255, 255, 255, 0.7)",
        }
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Performance Comparison</CardTitle>
        <div className="text-sm text-muted-foreground">
          Percentage change over {timeframe === 1 ? "Last 24 Hours" : timeframe === 7 ? "Last Week" : timeframe === 30 ? "Last Month" : `Last ${timeframe} Days`}
        </div>
      </CardHeader>
      <CardContent className="h-[400px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <p>Loading comparison data...</p>
          </div>
        ) : chartData ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p>No data available for comparison</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComparisonChart;
