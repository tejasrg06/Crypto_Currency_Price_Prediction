
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { CryptoCoin } from "@/services/cryptoApi";

interface MarketOverviewProps {
  cryptos: CryptoCoin[];
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ cryptos }) => {
  if (cryptos.length === 0) {
    return (
      <div className="rounded-md border bg-card p-4 mb-6">
        <span className="text-muted-foreground">No overview data.</span>
      </div>
    );
  }

  const totalMarketCap = cryptos.reduce((sum, coin) => sum + coin.market_cap, 0);
  const totalGain = cryptos.filter(c => c.price_change_percentage_24h >= 0).length;
  const totalLoss = cryptos.filter(c => c.price_change_percentage_24h < 0).length;
  const topCoin = cryptos[0];
  const bestPerformer = [...cryptos].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)[cryptos.length-1];
  const worstPerformer = [...cryptos].sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)[0];
  const averagePrice = cryptos.reduce((sum, coin) => sum + coin.current_price, 0) / cryptos.length;
  const totalVolume = cryptos.reduce((sum, coin) => sum + (coin.total_volume || 0), 0);

  // Dominance = Top coin mcap / total marketcap
  const dominance = ((topCoin.market_cap / totalMarketCap) * 100).toFixed(2);

  // Top 5 coins by marketcap
  const topFive = [...cryptos].sort((a, b) => b.market_cap - a.market_cap).slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-md border bg-card p-6 flex flex-col md:flex-row md:items-center md:gap-10 gap-4 mb-6">
        <div>
          <div className="text-lg font-bold">Market Cap</div>
          <div className="text-xl">${totalMarketCap.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-lg font-bold">Gainers/Losers</div>
          <div className="flex gap-3 text-sm items-center">
            <span className="flex items-center text-green-500">
              <TrendingUp className="w-4 h-4 mr-1" /> {totalGain} up
            </span>
            <span className="flex items-center text-red-500">
              <TrendingDown className="w-4 h-4 mr-1" /> {totalLoss} down
            </span>
          </div>
        </div>
        <div>
          <div className="text-lg font-bold">Dominance</div>
          <div className="text-xl">{topCoin.name}: {dominance}%</div>
        </div>
        <div>
          <div className="text-lg font-bold">Average Price</div>
          <div className="text-xl">${averagePrice.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
        </div>
        <div>
          <div className="text-lg font-bold">24h Volume</div>
          <div className="text-xl">${totalVolume.toLocaleString()}</div>
        </div>
      </div>
      {/* Secondary insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-md border bg-card p-4 flex flex-col gap-2">
          <div className="text-lg font-bold">Best Performer</div>
          <div className="flex items-center gap-2 text-green-500">
            <img src={bestPerformer.image} alt="" className="w-5 h-5" />
            <span>{bestPerformer.name} ({bestPerformer.symbol.toUpperCase()})</span>
            +{bestPerformer.price_change_percentage_24h?.toFixed(2)}%
          </div>
        </div>
        <div className="rounded-md border bg-card p-4 flex flex-col gap-2">
          <div className="text-lg font-bold">Worst Performer</div>
          <div className="flex items-center gap-2 text-red-500">
            <img src={worstPerformer.image} alt="" className="w-5 h-5" />
            <span>{worstPerformer.name} ({worstPerformer.symbol.toUpperCase()})</span>
            {worstPerformer.price_change_percentage_24h?.toFixed(2)}%
          </div>
        </div>
        <div className="rounded-md border bg-card p-4 flex flex-col gap-2">
          <div className="text-lg font-bold">Top Crypto</div>
          <div className="flex items-center gap-2">
            <img src={topCoin.image} alt="" className="w-5 h-5" />
            <span>{topCoin.name}</span>
          </div>
        </div>
      </div>
      {/* Top 5 grid */}
      <div className="rounded-md border bg-card p-6">
        <div className="text-lg font-bold mb-4">Top 5 Coins by Market Cap</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {topFive.map(coin => (
            <div key={coin.id} className="flex flex-col items-center p-2 rounded shadow bg-[#161822] border border-[#23263b]">
              <img src={coin.image} alt={coin.name} className="w-7 h-7 mb-2" />
              <span className="text-base font-medium">{coin.name}</span>
              <span className="text-xs text-muted-foreground mb-1">({coin.symbol.toUpperCase()})</span>
              <span className="text-sm">${coin.current_price.toLocaleString()}</span>
              <span className={coin.price_change_percentage_24h > 0 ? "text-green-500 text-xs" : "text-red-500 text-xs"}>
                {coin.price_change_percentage_24h > 0 ? "+" : ""}
                {coin.price_change_percentage_24h?.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;
