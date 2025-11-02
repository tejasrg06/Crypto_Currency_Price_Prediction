
import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CryptoCoin } from "@/services/cryptoApi";
import CryptoCard from "./CryptoCard";

interface WatchlistProps {
  coins: CryptoCoin[];
  watchlist: string[];
  onToggle: (coinId: string) => void;
  onSelectCoin: (coin: CryptoCoin) => void;
}

const Watchlist: React.FC<WatchlistProps> = ({ coins, watchlist, onToggle, onSelectCoin }) => {
  const watchedCoins = coins.filter(coin => watchlist.includes(coin.id));

  return (
    <div className="border rounded-md bg-card p-5 mb-6">
      <div className="flex items-center mb-3 gap-2">
        <Eye className="w-5 h-5 text-primary" />
        <span className="font-semibold text-lg">Watchlist</span>
      </div>
      {watchedCoins.length === 0 && (
        <div className="text-muted-foreground text-sm mb-2">No coins in watchlist.</div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {watchedCoins.map((coin) => (
          <div key={coin.id} className="relative group">
            <CryptoCard coin={coin} onClick={() => onSelectCoin(coin)} />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Remove from watchlist"
              className="absolute top-2 right-2 opacity-75 group-hover:opacity-100 transition-opacity"
              onClick={e => { e.stopPropagation(); onToggle(coin.id); }}
            >
              <EyeOff className="text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
