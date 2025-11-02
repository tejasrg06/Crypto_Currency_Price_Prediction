
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CryptoCoin } from "@/services/cryptoApi";
import { ArrowDown, ArrowUp } from "lucide-react";

interface CryptoCardProps {
  coin: CryptoCoin;
  onClick: () => void;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ coin, onClick }) => {
  const priceChange = coin.price_change_percentage_24h;
  const isPositive = priceChange >= 0;

  return (
    <Card 
      className="w-full max-w-[200px] h-[140px] min-w-[170px] min-h-[140px] flex flex-col justify-between overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={coin.image} 
              alt={coin.name} 
              className="w-8 h-8 rounded-full" 
            />
            <CardTitle className="text-md font-semibold">{coin.name}</CardTitle>
          </div>
          <div className="text-sm uppercase text-muted-foreground">{coin.symbol}</div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-1">
          <div className="text-xl font-bold">${coin.current_price.toLocaleString()}</div>
          <div className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
            {Math.abs(priceChange).toFixed(2)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoCard;
