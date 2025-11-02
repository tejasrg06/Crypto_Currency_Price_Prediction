
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getTopCryptos, CryptoCoin, getCoinPriceHistory } from "@/services/cryptoApi";
import PriceChart from "@/components/PriceChart";

const NewsAnalysisPage = () => {
  const [cryptocurrencies, setCryptocurrencies] = useState<CryptoCoin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<string>("bitcoin");
  const [selectedCoinName, setSelectedCoinName] = useState<string>("Bitcoin");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [marketSentiment, setMarketSentiment] = useState<number>(0);
  const [timeframe, setTimeframe] = useState<number>(7);
  const [priceData, setPriceData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCryptos = async () => {
      setIsLoading(true);
      const data = await getTopCryptos(20);
      setCryptocurrencies(data);
      setIsLoading(false);
    };
    fetchCryptos();
  }, []);

  useEffect(() => {
    const fetchPriceData = async () => {
      if (selectedCoin) {
        const data = await getCoinPriceHistory(selectedCoin, timeframe);
        setPriceData(data);
      }
    };
    fetchPriceData();
  }, [selectedCoin, timeframe]);

  // Handle coin selection
  const handleCoinChange = (coinId: string) => {
    setSelectedCoin(coinId);
    const coin = cryptocurrencies.find(c => c.id === coinId);
    if (coin) {
      setSelectedCoinName(coin.name);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card shadow-md">
        <div className="container py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
            Crypto Crystal Gaze
          </h1>
          <p className="text-muted-foreground mt-1">
            Price Prediction
          </p>
        </div>
      </header>

      <main className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold">Price Prediction</h2>
            <p className="text-muted-foreground">
              Advanced price prediction with sentiment analysis
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to Dashboard
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-full md:w-64">
                <label className="text-sm font-medium mb-2 block">
                  Select Cryptocurrency
                </label>
                {isLoading ? (
                  <div className="h-10 bg-secondary animate-pulse rounded" />
                ) : (
                  <Select
                    value={selectedCoin}
                    onValueChange={handleCoinChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a cryptocurrency" />
                    </SelectTrigger>
                    <SelectContent>
                      {cryptocurrencies.map((coin) => (
                        <SelectItem key={coin.id} value={coin.id}>
                          <div className="flex items-center">
                            <img
                              src={coin.image}
                              alt={coin.name}
                              className="w-5 h-5 mr-2"
                            />
                            {coin.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                View price predictions for your selected cryptocurrency
              </div>
            </div>
          </CardContent>
        </Card>

        {priceData && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium text-lg mb-4">Price Prediction with Sentiment Analysis</h3>
              <div className="text-sm text-muted-foreground mb-4">
                This prediction incorporates both historical price data and current market sentiment from news articles 
                to provide a more comprehensive forecast.
              </div>
              <PriceChart 
                coinId={selectedCoin}
                coinName={selectedCoinName}
                priceData={priceData}
                timeframe={timeframe}
                showPrediction={true}
                marketSentiment={marketSentiment}
              />
            </CardContent>
          </Card>
        )}
      </main>

      <footer className="bg-card mt-12 py-6 border-t border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
                Crypto Crystal Gaze
              </h2>
              <p className="text-sm text-muted-foreground">
                Cryptocurrency price analysis and prediction
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Data powered by CoinGecko API and NewsData.io</p>
              <p>© 2025 Crypto Crystal Gaze. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewsAnalysisPage;
