import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import CryptoCard from "@/components/CryptoCard";
import CryptoDetail from "@/components/CryptoDetail";
import ComparisonChart from "@/components/ComparisonChart";
import { getTopCryptos, CryptoCoin } from "@/services/cryptoApi";
import SearchBar from "@/components/SearchBar";
import MarketOverview from "@/components/MarketOverview";
import Watchlist from "@/components/Watchlist";
import { useNavigate } from "react-router-dom";

const comparisonColors = [
  "rgba(155, 135, 245, 1)",
  "rgba(80, 200, 120, 1)",
  "rgba(219, 112, 147, 1)",
  "rgba(78, 205, 196, 1)",
  "rgba(255, 177, 66, 1)",
];

const Index = () => {
  const [cryptocurrencies, setCryptocurrencies] = useState<CryptoCoin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CryptoCoin | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [comparisonCoins, setComparisonCoins] = useState<string[]>([]);
  const [comparisonTimeframe, setComparisonTimeframe] = useState<number>(7);
  const [search, setSearch] = useState("");
  const [displayLimit, setDisplayLimit] = useState(20);
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("watchlist") || "[]");
    } catch {
      return [];
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCryptos = async () => {
      setIsLoading(true);
      const data = await getTopCryptos(50);
      setCryptocurrencies(data);
      setIsLoading(false);
      if (data.length > 0) {
        setSelectedCoin(data[0]);
        setComparisonCoins(data.slice(0, 3).map(coin => coin.id));
      }
    };
    fetchCryptos();
  }, []);

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const handleSelectCoin = (coin: CryptoCoin) => {
    setSelectedCoin(coin);
    setActiveTab("detail");
  };

  const toggleComparisonCoin = (coinId: string) => {
    if (comparisonCoins.includes(coinId)) {
      setComparisonCoins(comparisonCoins.filter(id => id !== coinId));
    } else {
      if (comparisonCoins.length < 5) {
        setComparisonCoins([...comparisonCoins, coinId]);
      }
    }
  };

  const toggleWatchlist = (coinId: string) => {
    setWatchlist(prev =>
      prev.includes(coinId)
        ? prev.filter(id => id !== coinId)
        : [...prev, coinId]
    );
  };

  const filteredCryptocurrencies = cryptocurrencies.filter(
    coin =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const comparisonData = cryptocurrencies
    .filter(coin => comparisonCoins.includes(coin.id))
    .map((coin, index) => ({
      id: coin.id,
      name: coin.name,
      color: comparisonColors[index % comparisonColors.length],
    }));

  const totalVolume = cryptocurrencies.reduce((sum, coin) => sum + (coin.total_volume || 0), 0);
  const trendingCoins = [...cryptocurrencies]
    .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card shadow-md">
        <div className="container py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
            Crypto Crystal Gaze
          </h1>
          <p className="text-muted-foreground mt-1">
            Cryptocurrency price analysis and prediction
          </p>
        </div>
      </header>

      <main className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-[700px]">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="detail">Detailed View</TabsTrigger>
            <TabsTrigger value="compare">Compare</TabsTrigger>
            <TabsTrigger value="market-overview">Market Overview</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <SearchBar value={search} onChange={setSearch} />

            <div className="
                  grid 
                  grid-cols-2 
                  sm:grid-cols-3 
                  md:grid-cols-4 
                  lg:grid-cols-5 
                  xl:grid-cols-6 
                  gap-4 
                  auto-rows-fr
                ">
              {isLoading ? (
                Array(displayLimit)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="h-[140px] w-full max-w-[200px] min-w-[170px] bg-card animate-pulse rounded-lg mx-auto"
                    />
                  ))
              ) : (
                filteredCryptocurrencies
                  .slice(0, displayLimit)
                  .map((coin) => (
                    <div key={coin.id} className="relative group flex flex-col items-stretch">
                      <div className="flex-1 flex justify-center">
                        <CryptoCard
                          coin={coin}
                          onClick={() => handleSelectCoin(coin)}
                        />
                      </div>
                      <div className="absolute top-2 right-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={
                            watchlist.includes(coin.id)
                              ? "Remove from watchlist"
                              : "Add to watchlist"
                          }
                          className="opacity-75 group-hover:opacity-100 transition-opacity z-10"
                          onClick={e => { e.stopPropagation(); toggleWatchlist(coin.id); }}
                        >
                          {watchlist.includes(coin.id) ? (
                            <EyeOff className="text-destructive" />
                          ) : (
                            <Eye className="text-primary" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))
              )}
            </div>
            {filteredCryptocurrencies.length > displayLimit && (
              <div className="flex justify-center mt-4">
                <Button variant="outline" onClick={() => setDisplayLimit(d => d + 20)}>
                  Show More
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="detail" className="space-y-6">
            {selectedCoin ? (
              <CryptoDetail coin={selectedCoin} />
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">
                  Select a cryptocurrency to view details
                </p>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Other Cryptocurrencies</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {cryptocurrencies
                  .filter(coin => !selectedCoin || coin.id !== selectedCoin.id)
                  .slice(0, 5)
                  .map(coin => (
                    <Button
                      key={coin.id}
                      variant="outline"
                      className="justify-start"
                      onClick={() => handleSelectCoin(coin)}
                    >
                      <img src={coin.image} alt={coin.name} className="w-5 h-5 mr-2" />
                      {coin.symbol.toUpperCase()}
                    </Button>
                  ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="compare" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Select Cryptocurrencies to Compare</h2>
              <p className="text-muted-foreground mb-4">
                Choose up to 5 cryptocurrencies to compare their performance
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {cryptocurrencies.map((coin, index) => (
                  <Button
                    key={coin.id}
                    variant={comparisonCoins.includes(coin.id) ? "default" : "outline"}
                    className={`justify-start ${
                      comparisonCoins.includes(coin.id) 
                        ? `border-2 border-${comparisonColors[comparisonCoins.indexOf(coin.id) % comparisonColors.length].replace('rgba', 'rgb').replace(',1)', ')')}`
                        : ""
                    }`}
                    onClick={() => toggleComparisonCoin(coin.id)}
                  >
                    <img src={coin.image} alt={coin.name} className="w-5 h-5 mr-2" />
                    {coin.symbol.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Timeframe</h3>
              <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                <TabsTrigger 
                  value="1" 
                  onClick={() => setComparisonTimeframe(1)}
                  data-state={comparisonTimeframe === 1 ? "active" : "inactive"}
                >
                  24h
                </TabsTrigger>
                <TabsTrigger 
                  value="7" 
                  onClick={() => setComparisonTimeframe(7)}
                  data-state={comparisonTimeframe === 7 ? "active" : "inactive"}
                >
                  1w
                </TabsTrigger>
                <TabsTrigger 
                  value="30" 
                  onClick={() => setComparisonTimeframe(30)}
                  data-state={comparisonTimeframe === 30 ? "active" : "inactive"}
                >
                  1m
                </TabsTrigger>
                <TabsTrigger 
                  value="90" 
                  onClick={() => setComparisonTimeframe(90)}
                  data-state={comparisonTimeframe === 90 ? "active" : "inactive"}
                >
                  3m
                </TabsTrigger>
              </TabsList>
            </div>

            {comparisonCoins.length > 0 ? (
              <ComparisonChart 
                coins={comparisonData}
                timeframe={comparisonTimeframe}
              />
            ) : (
              <div className="flex items-center justify-center h-64 bg-card rounded-lg border border-border">
                <p className="text-muted-foreground">
                  Select cryptocurrencies to compare
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="market-overview" className="space-y-6">
            <MarketOverview cryptos={cryptocurrencies} />
            <div className="rounded-md border bg-card p-6 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-lg font-bold mb-2">Trending Coins (24h Change)</div>
                  <ul>
                    {trendingCoins.map(coin => (
                      <li key={coin.id} className="flex items-center mb-2">
                        <img src={coin.image} alt={coin.name} className="w-5 h-5 mr-2" />
                        <span className="mr-2">{coin.name} ({coin.symbol.toUpperCase()})</span>
                        <span className={coin.price_change_percentage_24h > 0 ? "text-green-500" : "text-red-500"}>
                          {coin.price_change_percentage_24h > 0 ? "+" : ""}
                          {coin.price_change_percentage_24h?.toFixed(2)}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-lg font-bold mb-2">24h Total Volume</div>
                  <div className="text-xl">${totalVolume.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="watchlist" className="space-y-6">
            <Watchlist
              coins={cryptocurrencies}
              watchlist={watchlist}
              onToggle={toggleWatchlist}
              onSelectCoin={handleSelectCoin}
            />
          </TabsContent>
        </Tabs>
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
              <p>Data powered by CoinGecko API</p>
              <p>© 2025 Crypto Crystal Gaze. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
