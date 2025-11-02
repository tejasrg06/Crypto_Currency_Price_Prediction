
# Crypto Crystal Gaze - Technical Documentation

## Application Overview

Crypto Crystal Gaze is a comprehensive cryptocurrency analytics and price prediction platform designed to provide users with insightful market data, price trends, and forecasting tools. The application enables users to track, compare, and analyze cryptocurrency performance while offering basic predictive analytics.

## Core Features

1. **Dashboard** - Overview of top cryptocurrencies by market capitalization
2. **Detailed View** - In-depth analysis of individual cryptocurrencies
3. **Comparison Tool** - Side-by-side comparison of multiple cryptocurrencies
4. **Market Overview** - Broad market metrics and indicators
5. **Watchlist** - Personalized tracking of selected cryptocurrencies
6. **Price Prediction** - Basic forecast of potential future prices

## Technology Stack

### Frontend Framework
- **React (18.3.1)** - Core UI library
- **TypeScript** - For type-safe code development
- **Vite** - Build tool and development server

### UI Framework and Styling
- **Tailwind CSS** - Utility-first CSS framework for styling
- **shadcn/ui** - Component library built on Radix UI primitives
- **Lucide React** - Icon library

### State Management
- **React Query (@tanstack/react-query)** - For server state management
- **React useState/useEffect hooks** - For local component state

### Data Visualization
- **Chart.js (v4.4.9)** - Core charting library
- **React-Chartjs-2 (v5.3.0)** - React wrapper for Chart.js
- **Recharts (v2.12.7)** - Used for specialized chart components

### Routing
- **React Router DOM (v6.26.2)** - Client-side routing

### Data Fetching
- **Axios (v1.8.4)** - HTTP client for API requests

### Notifications
- **Sonner** - Toast notification system

## Prediction Algorithm

The price prediction feature uses a simple algorithmic approach:

### Algorithm Overview
The application implements a basic moving average-based prediction model that:

1. Calculates a simple moving average from the most recent price data (up to last 7 data points)
2. Computes the average percentage change between consecutive data points
3. Projects this average change forward to generate predicted prices

### Implementation
```typescript
// Function to generate simple prediction based on historical data
export const generatePrediction = (priceData: [number, number][], days: number = 7): [number, number][] => {
  if (priceData.length < 2) return [];
  
  // Extract just the prices for calculation
  const prices = priceData.map(item => item[1]);
  
  // Calculate a simple moving average
  const movingAverage = prices.slice(Math.max(prices.length - 7, 0));
  const avgChange = movingAverage.slice(1).map((price, i) => 
    price / movingAverage[i] - 1
  ).reduce((sum, change) => sum + change, 0) / (movingAverage.length - 1);
  
  // Generate prediction
  const predictions: [number, number][] = [];
  let lastTimestamp = priceData[priceData.length - 1][0];
  let lastPrice = priceData[priceData.length - 1][1];
  
  // Create future data points
  for (let i = 1; i <= days; i++) {
    lastTimestamp += 24 * 60 * 60 * 1000; // Add one day in milliseconds
    lastPrice = lastPrice * (1 + avgChange);
    predictions.push([lastTimestamp, lastPrice]);
  }
  
  return predictions;
};
```

### Limitations
This prediction model has several limitations:

- It uses only historical price data without considering other factors
- It assumes linear trends will continue
- It does not account for market volatility, news events, or market sentiment
- It should be considered for educational purposes only and not for financial decisions

## Data Sources

The application uses the CoinGecko API (v3) to fetch cryptocurrency data:
- Price data
- Market cap information
- Volume data
- Historical charts
- Coin metadata

## Architecture

### Component Structure
- **Pages**: Main views of the application (Index, WatchlistPage, MarketOverviewPage)
- **Components**: Reusable UI elements (CryptoCard, PriceChart, MarketOverview, etc.)
- **Services**: API interaction layer (cryptoApi.ts)
- **UI Components**: Base UI components from shadcn/ui

### Data Flow
1. API requests fetch data from CoinGecko
2. React Query manages caching and re-fetching
3. Component state controls UI interactions and display
4. Local storage persists user preferences (watchlist)

## Local Storage Usage
- Watchlist data is stored in localStorage to persist user selections

## Performance Considerations
- Data pagination for larger datasets
- Conditional rendering for complex UI elements
- Memoization of expensive calculations
- Delayed loading of visual components

## Future Development Opportunities
- Advanced prediction algorithms using machine learning
- WebSocket integration for real-time data
- Portfolio tracking and management
- News sentiment analysis
- Technical indicators and chart patterns
- Backtesting of prediction models
- User accounts and preference syncing

---

*This documentation is intended for developers and technical stakeholders. For end-user documentation, please refer to the user guide.*
