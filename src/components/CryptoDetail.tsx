
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import PriceChart from "./PriceChart";
import { ArrowDown, ArrowUp, Bitcoin, BadgeDollarSign, BadgeIndianRupee } from "lucide-react";
import { PriceHistoryData, getCoinPriceHistory } from "@/services/cryptoApi";
import { CryptoCoin } from "@/services/cryptoApi";

interface CryptoDetailProps {
  coin: CryptoCoin;
}

const CryptoDetail: React.FC<CryptoDetailProps> = ({ coin }) => {
  const [timeframe, setTimeframe] = useState<number>(7);
  const [priceData, setPriceData] = useState<PriceHistoryData>({
    prices: [],
    market_caps: [],
    total_volumes: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");

  useEffect(() => {
    const fetchPriceData = async () => {
      setIsLoading(true);
      const data = await getCoinPriceHistory(coin.id, timeframe);
      setPriceData(data);
      setIsLoading(false);
    };

    fetchPriceData();
  }, [coin.id, timeframe]);

  const priceChange = coin.price_change_percentage_24h;
  const isPositive = priceChange >= 0;
  const conversionRate = 83.12; // Fixed conversion rate from USD to INR
  const currentPrice = currency === "USD" ? 
    coin.current_price : 
    coin.current_price * conversionRate;
  const marketCap = currency === "USD" ? 
    coin.market_cap : 
    coin.market_cap * conversionRate;
  const currencySymbol = currency === "USD" ? "$" : "₹";

  const toggleCurrency = () => {
    setCurrency(currency === "USD" ? "INR" : "USD");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={coin.image} alt={coin.name} className="w-10 h-10" />
              <div>
                <CardTitle>{coin.name}</CardTitle>
                <div className="text-muted-foreground uppercase">{coin.symbol}</div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-2xl font-bold">{currencySymbol}{currentPrice.toLocaleString()}</div>
              <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                {Math.abs(priceChange).toFixed(2)}%
              </div>
            </div>
          </div>
          <Button 
            onClick={toggleCurrency}
            variant="outline" 
            size="sm"
            className="mt-4 self-end"
          >
            {currency === "USD" ? (
              <BadgeIndianRupee className="w-4 h-4 mr-2" />
            ) : (
              <BadgeDollarSign className="w-4 h-4 mr-2" />
            )}
            Switch to {currency === "USD" ? "INR" : "USD"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-4 bg-secondary rounded-lg">
              <Bitcoin className="w-6 h-6 mr-3 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Market Cap</div>
                <div className="font-medium">{currencySymbol}{marketCap.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-center p-4 bg-secondary rounded-lg">
              <BadgeDollarSign className="w-6 h-6 mr-3 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Rank</div>
                <div className="font-medium">#{coin.market_cap_rank || "N/A"}</div>
              </div>
            </div>
            <div className="flex items-center p-4 bg-secondary rounded-lg">
              <BadgeDollarSign className="w-6 h-6 mr-3 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Price Change (24h)</div>
                <div className={`font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {isPositive ? "+" : ""}{priceChange.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="7" className="w-full" onValueChange={(value) => setTimeframe(parseInt(value))}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="1">24h</TabsTrigger>
          <TabsTrigger value="7">1w</TabsTrigger>
          <TabsTrigger value="30">1m</TabsTrigger>
          <TabsTrigger value="90">3m</TabsTrigger>
        </TabsList>
        
        <TabsContent value="1" className="mt-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-[400px]">
              <p>Loading chart data...</p>
            </div>
          ) : (
            <PriceChart 
              coinId={coin.id}
              coinName={coin.name}
              priceData={priceData}
              timeframe={1}
              showPrediction={true}
              currency={currency}
            />
          )}
        </TabsContent>
        
        <TabsContent value="7" className="mt-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-[400px]">
              <p>Loading chart data...</p>
            </div>
          ) : (
            <PriceChart 
              coinId={coin.id}
              coinName={coin.name}
              priceData={priceData}
              timeframe={7}
              showPrediction={true}
              currency={currency}
            />
          )}
        </TabsContent>
        
        <TabsContent value="30" className="mt-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-[400px]">
              <p>Loading chart data...</p>
            </div>
          ) : (
            <PriceChart 
              coinId={coin.id}
              coinName={coin.name}
              priceData={priceData}
              timeframe={30}
              showPrediction={true}
              currency={currency}
            />
          )}
        </TabsContent>
        
        <TabsContent value="90" className="mt-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-[400px]">
              <p>Loading chart data...</p>
            </div>
          ) : (
            <PriceChart 
              coinId={coin.id}
              coinName={coin.name}
              priceData={priceData}
              timeframe={90}
              showPrediction={true}
              currency={currency}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CryptoDetail;
