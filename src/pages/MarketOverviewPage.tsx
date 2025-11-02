
import React, { useState, useEffect } from "react";
import MarketOverview from "@/components/MarketOverview";
import { getTopCryptos, CryptoCoin } from "@/services/cryptoApi";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const MarketOverviewPage = () => {
  const [cryptocurrencies, setCryptocurrencies] = useState<CryptoCoin[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCryptos = async () => {
      const data = await getTopCryptos(50);
      setCryptocurrencies(data);
    };
    fetchCryptos();
  }, []);

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" onClick={() => navigate("/")}>← Back</Button>
        <h1 className="text-2xl font-bold">Market Overview</h1>
      </div>
      <MarketOverview cryptos={cryptocurrencies} />
    </div>
  );
};

export default MarketOverviewPage;
