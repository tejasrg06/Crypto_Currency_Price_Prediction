
import axios from "axios";
import Sentiment from "sentiment";

// Free news API endpoint
const NEWS_API_URL = "https://newsdata.io/api/1/news";
const NEWS_API_KEY = "pub_37295c6120071c5b582bfe279430a0fe7f1bc"; // Free tier API key

// Types
export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  image_url?: string;
  publishedAt: string;
  sentiment: {
    score: number;
    comparative: number;
    classification: "positive" | "negative" | "neutral";
  };
}

// Sentiment analyzer instance
const sentiment = new Sentiment();

// Function to classify sentiment score
const classifySentiment = (score: number): "positive" | "negative" | "neutral" => {
  if (score > 2) return "positive";
  if (score < -2) return "negative";
  return "neutral";
};

// Get news for a specific cryptocurrency
export const getCryptoNews = async (
  coinName: string,
  limit: number = 10
): Promise<NewsItem[]> => {
  try {
    const response = await axios.get(NEWS_API_URL, {
      params: {
        apikey: NEWS_API_KEY,
        q: `${coinName} cryptocurrency`,
        language: "en",
        size: limit,
      },
    });

    if (!response.data.results || response.data.results.length === 0) {
      console.log("No news found for", coinName);
      return [];
    }

    // Process and analyze sentiment for each news item
    return response.data.results.map((item: any) => {
      // Combine title and description for better sentiment analysis
      const content = `${item.title || ""} ${item.description || ""}`;
      const sentimentResult = sentiment.analyze(content);

      return {
        id: item.article_id || `${Date.now()}-${Math.random()}`,
        title: item.title || "No Title",
        description: item.description || "No Description Available",
        url: item.link,
        source: item.source_id,
        image_url: item.image_url,
        publishedAt: item.pubDate,
        sentiment: {
          score: sentimentResult.score,
          comparative: sentimentResult.comparative,
          classification: classifySentiment(sentimentResult.score),
        },
      };
    });
  } catch (error) {
    console.error("Error fetching crypto news:", error);
    return [];
  }
};
