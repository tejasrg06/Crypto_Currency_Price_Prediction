
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeDollarSign, BadgeIndianRupee, CalendarDays, TrendingUp, TrendingDown } from "lucide-react";

interface PredictionInfoCardProps {
  predictedPrice: number;
  predictionDays: number;
  currency: "USD" | "INR";
  marketSentiment?: number;
}

const PredictionInfoCard: React.FC<PredictionInfoCardProps> = ({
  predictedPrice,
  predictionDays,
  currency = "USD",
  marketSentiment = 0,
}) => {
  const currencySymbol = currency === "USD" ? "$" : "₹";
  const conversionRate = 83.12; // Fixed conversion rate from USD to INR
  const displayPrice = currency === "USD" ? 
    predictedPrice : 
    predictedPrice * conversionRate;

  // Get sentiment classification
  const getSentimentClass = () => {
    if (marketSentiment > 20) return "text-green-600";
    if (marketSentiment > 0) return "text-green-500";
    if (marketSentiment < -20) return "text-red-600";
    if (marketSentiment < 0) return "text-red-500";
    return "text-gray-500";
  };

  const getSentimentText = () => {
    if (marketSentiment > 20) return "Strongly Bullish";
    if (marketSentiment > 0) return "Slightly Bullish";
    if (marketSentiment < -20) return "Strongly Bearish";
    if (marketSentiment < 0) return "Slightly Bearish";
    return "Neutral";
  };

  return (
    <div className="flex justify-center gap-4 w-full max-w-2xl mx-auto mb-6">
      {/* Predicted Price Card */}
      <Card className="flex-1 min-w-[210px] bg-[#1A1F2C] border-[#8E9196] shadow-lg">
        <CardContent className="flex flex-col items-center p-4">
          <span className="flex items-center gap-1 text-[16px] text-white font-medium mb-2">
            {currency === "USD" ? 
              <BadgeDollarSign className="w-5 h-5 text-[#F97316]" /> : 
              <BadgeIndianRupee className="w-5 h-5 text-[#F97316]" />}
            Predicted Price
          </span>
          <span className="font-bold text-2xl text-[#F97316]">
            {currencySymbol}{displayPrice.toLocaleString(undefined, {maximumFractionDigits: 2})}
          </span>
          <div className="flex items-center text-xs text-[#8E9196] mt-1">
            <CalendarDays className="w-3 h-3 mr-1" />
            for {predictionDays} days
          </div>
        </CardContent>
      </Card>

      {/* Market Sentiment Card */}
      {marketSentiment !== 0 && (
        <Card className="flex-1 min-w-[210px] bg-[#1A1F2C] border-[#8E9196] shadow-lg">
          <CardContent className="flex flex-col items-center p-4">
            <span className="flex items-center gap-1 text-[16px] text-white font-medium mb-2">
              {marketSentiment > 0 ? 
                <TrendingUp className="w-5 h-5 text-green-500" /> : 
                <TrendingDown className="w-5 h-5 text-red-500" />}
              Market Sentiment
            </span>
            <span className={`font-bold text-2xl ${getSentimentClass()}`}>
              {getSentimentText()}
            </span>
            <div className="flex items-center text-xs text-[#8E9196] mt-1">
              Score: {marketSentiment.toFixed(1)}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PredictionInfoCard;
