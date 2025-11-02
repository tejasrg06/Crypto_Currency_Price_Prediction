
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { getCryptoNews, NewsItem } from "@/services/newsApi";
import { useToast } from "@/components/ui/use-toast";

// Custom styles for sentiment scores
const getSentimentColor = (classification: string) => {
  switch (classification) {
    case "positive":
      return "bg-green-100 text-green-800";
    case "negative":
      return "bg-red-100 text-red-800";
    case "neutral":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Progress bar colors for sentiment
const getSentimentProgressColor = (classification: string) => {
  switch (classification) {
    case "positive":
      return "#22c55e"; // green
    case "negative":
      return "#ef4444"; // red
    case "neutral":
      return "#9ca3af"; // gray
    default:
      return "#9ca3af";
  }
};

interface NewsSentimentAnalysisProps {
  coinName: string;
  onSentimentChange?: (sentiment: number) => void;
}

const NewsSentimentAnalysis: React.FC<NewsSentimentAnalysisProps> = ({ coinName, onSentimentChange }) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const { toast } = useToast();

  // Calculate sentiment overview stats
  const positiveCount = newsItems.filter((item) => item.sentiment.classification === "positive").length;
  const negativeCount = newsItems.filter((item) => item.sentiment.classification === "negative").length;
  const neutralCount = newsItems.filter((item) => item.sentiment.classification === "neutral").length;
  
  const totalItems = newsItems.length;
  const positivePercentage = totalItems > 0 ? (positiveCount / totalItems) * 100 : 0;
  const negativePercentage = totalItems > 0 ? (negativeCount / totalItems) * 100 : 0;
  const neutralPercentage = totalItems > 0 ? (neutralCount / totalItems) * 100 : 0;

  // Market sentiment score from -100 to 100
  const marketSentiment = totalItems > 0 
    ? ((positiveCount - negativeCount) / totalItems) * 100 
    : 0;
  
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      const items = await getCryptoNews(coinName, 12);
      
      if (items.length === 0) {
        toast({
          title: "No news found",
          description: `We couldn't find any recent news articles for ${coinName}.`,
          variant: "destructive",
        });
      }
      
      setNewsItems(items);
      setIsLoading(false);
    };

    if (coinName) {
      fetchNews();
    }
  }, [coinName, toast]);

  // Notify parent component when sentiment changes
  useEffect(() => {
    if (onSentimentChange) {
      onSentimentChange(marketSentiment);
    }
  }, [marketSentiment, onSentimentChange]);

  // Filter news based on sentiment
  const filteredNews = newsItems.filter((item) => {
    if (selectedFilter === "all") return true;
    return item.sentiment.classification === selectedFilter;
  });

  // Render news item
  const renderNewsItem = (item: NewsItem) => {
    const sentimentClass = getSentimentColor(item.sentiment.classification);
    const publishedDate = new Date(item.publishedAt).toLocaleDateString();
    
    return (
      <Card key={item.id} className="mb-4">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <Badge className={sentimentClass}>{item.sentiment.classification}</Badge>
                <span className="text-xs text-muted-foreground">{publishedDate}</span>
              </div>
              <h3 className="font-medium text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                {item.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Source: {item.source}</span>
                <Button size="sm" variant="outline" onClick={() => window.open(item.url, "_blank")}>
                  Read More
                </Button>
              </div>
            </div>
            {item.image_url && (
              <div className="md:w-1/4">
                <img 
                  src={item.image_url} 
                  alt={item.title}
                  className="w-full h-24 object-cover rounded-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>News Sentiment Analysis for {coinName}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading news articles...</p>
            </div>
          ) : newsItems.length > 0 ? (
            <div className="space-y-6">
              {/* Sentiment Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-secondary">
                  <CardContent className="pt-6">
                    <h3 className="text-center font-medium mb-2">Market Sentiment</h3>
                    <div className="w-24 h-24 mx-auto">
                      <CircularProgressbar
                        value={Math.abs(marketSentiment)}
                        maxValue={100}
                        text={`${Math.round(marketSentiment)}%`}
                        styles={buildStyles({
                          textSize: '20px',
                          pathColor: marketSentiment >= 0 ? '#22c55e' : '#ef4444',
                          textColor: marketSentiment >= 0 ? '#22c55e' : '#ef4444',
                          trailColor: '#e5e7eb',
                        })}
                      />
                    </div>
                    <p className="text-center text-sm mt-2">
                      {marketSentiment > 20
                        ? "Strongly Bullish"
                        : marketSentiment > 0
                        ? "Slightly Bullish"
                        : marketSentiment < -20
                        ? "Strongly Bearish"
                        : marketSentiment < 0
                        ? "Slightly Bearish"
                        : "Neutral"}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-secondary">
                  <CardContent className="pt-6">
                    <h3 className="text-center font-medium mb-2">Positive</h3>
                    <div className="w-20 h-20 mx-auto">
                      <CircularProgressbar
                        value={positivePercentage}
                        text={`${Math.round(positivePercentage)}%`}
                        styles={buildStyles({
                          textSize: '22px',
                          pathColor: '#22c55e',
                          textColor: '#22c55e',
                          trailColor: '#e5e7eb',
                        })}
                      />
                    </div>
                    <p className="text-center text-sm mt-2">{positiveCount} articles</p>
                  </CardContent>
                </Card>
                <Card className="bg-secondary">
                  <CardContent className="pt-6">
                    <h3 className="text-center font-medium mb-2">Neutral</h3>
                    <div className="w-20 h-20 mx-auto">
                      <CircularProgressbar
                        value={neutralPercentage}
                        text={`${Math.round(neutralPercentage)}%`}
                        styles={buildStyles({
                          textSize: '22px',
                          pathColor: '#9ca3af',
                          textColor: '#9ca3af',
                          trailColor: '#e5e7eb',
                        })}
                      />
                    </div>
                    <p className="text-center text-sm mt-2">{neutralCount} articles</p>
                  </CardContent>
                </Card>
                <Card className="bg-secondary">
                  <CardContent className="pt-6">
                    <h3 className="text-center font-medium mb-2">Negative</h3>
                    <div className="w-20 h-20 mx-auto">
                      <CircularProgressbar
                        value={negativePercentage}
                        text={`${Math.round(negativePercentage)}%`}
                        styles={buildStyles({
                          textSize: '22px',
                          pathColor: '#ef4444',
                          textColor: '#ef4444',
                          trailColor: '#e5e7eb',
                        })}
                      />
                    </div>
                    <p className="text-center text-sm mt-2">{negativeCount} articles</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* News Filter Tabs */}
              <Tabs defaultValue="all" onValueChange={setSelectedFilter}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All News</TabsTrigger>
                  <TabsTrigger value="positive">Positive</TabsTrigger>
                  <TabsTrigger value="neutral">Neutral</TabsTrigger>
                  <TabsTrigger value="negative">Negative</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-0">
                  {filteredNews.length > 0 ? (
                    filteredNews.map(renderNewsItem)
                  ) : (
                    <div className="text-center p-6">No news articles found</div>
                  )}
                </TabsContent>
                <TabsContent value="positive" className="mt-0">
                  {filteredNews.length > 0 ? (
                    filteredNews.map(renderNewsItem)
                  ) : (
                    <div className="text-center p-6">No positive news articles found</div>
                  )}
                </TabsContent>
                <TabsContent value="neutral" className="mt-0">
                  {filteredNews.length > 0 ? (
                    filteredNews.map(renderNewsItem)
                  ) : (
                    <div className="text-center p-6">No neutral news articles found</div>
                  )}
                </TabsContent>
                <TabsContent value="negative" className="mt-0">
                  {filteredNews.length > 0 ? (
                    filteredNews.map(renderNewsItem)
                  ) : (
                    <div className="text-center p-6">No negative news articles found</div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="text-center p-6">
              <p>No news articles found for {coinName}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsSentimentAnalysis;
