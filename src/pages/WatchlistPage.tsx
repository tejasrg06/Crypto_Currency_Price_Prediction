
import React, { useState, useEffect } from "react";
import Watchlist from "@/components/Watchlist";
import { getTopCryptos, CryptoCoin } from "@/services/cryptoApi";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const WatchlistPage = () => {
  const [cryptocurrencies, setCryptocurrencies] = useState<CryptoCoin[]>([]);
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
      const data = await getTopCryptos(50);
      setCryptocurrencies(data);
    };
    fetchCryptos();
  }, []);

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = (coinId: string) => {
    setWatchlist(prev =>
      prev.includes(coinId)
        ? prev.filter(id => id !== coinId)
        : [...prev, coinId]
    );
  };

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" onClick={() => navigate("/")}>← Back</Button>
        <h1 className="text-2xl font-bold">Watchlist</h1>
      </div>
      <Watchlist
        coins={cryptocurrencies}
        watchlist={watchlist}
        onToggle={toggleWatchlist}
        onSelectCoin={() => {}} // No-op or you could implement navigation to detail
      />
    </div>
  );
};

export default WatchlistPage;
