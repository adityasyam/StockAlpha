import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

async function fetchStockData(symbol, API_KEY) {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'request' } });
    if (!res.ok) throw new Error(`Error fetching data for ${symbol}: ${res.statusText}`);
    const data = await res.json();
    const recentDate = Object.keys(data["Time Series (Daily)"])[0];
    const recentData = data["Time Series (Daily)"][recentDate];
    return {
      symbol,
      date: recentDate,
      ...recentData,
    };
  } catch (error) {
    console.error(error);
    return {};
  }
}

export async function getServerSideProps(context) {
  const API_KEY = 'X8SVAMYPD5PK2GRK';
  const symbols = ['AAPL', 'IBM', 'GOOGL', 'AMZN', 'META', 'TSLA', 'MSFT', 'NFLX', 'INTC', 'AMD', 'SAP', 'NVDA', 'ORCL', 'CSCO', 'ADBE'];

  const promises = symbols.map(symbol => fetchStockData(symbol, API_KEY));
  const results = await Promise.all(promises);

  const stockData = results.filter(result => Object.keys(result).length > 0);

  return {
    props: {
      stockData,
    },
  };
}

export default function Home({ stockData }) {
  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      {stockData.map((stock, index) => (
        <Card key={index} style={{ marginBottom: '20px' }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Ticker: {stock.symbol}
            </Typography>
            <Typography variant="h5" component="h2">
              Date: {stock.date}
            </Typography>
            <Typography color="textSecondary">
              Open: {stock['1. open']}
            </Typography>
            <Typography color="textSecondary">
              High: {stock['2. high']}
            </Typography>
            <Typography color="textSecondary">
              Low: {stock['3. low']}
            </Typography>
            <Typography variant="body2" component="p">
              Close: {stock['4. close']}
            </Typography>
            <Typography variant="body2" component="p">
              Volume: {stock['5. volume']}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
