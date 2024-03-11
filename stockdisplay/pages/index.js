import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

async function fetchStockData(symbol, API_KEY) {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'request' } });
    if (!res.ok) throw new Error(`Error fetching data for ${symbol}: ${res.statusText}`);
    const data = await res.json();
    return data["Global Quote"] || {}; // Return an empty object if "Global Quote" is missing
  } catch (error) {
    console.error(error);
    return {}; // Return an empty object in case of error
  }
}

export async function getServerSideProps(context) {
  const API_KEY = 'YOUR_ALPHAVANTAGE_API_KEY';
  const symbols = ['IBM', 'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'FB', 'TSLA', 'NFLX', 'INTC', 'AMD', 'NVDA', 'ORCL', 'CSCO', 'SAP', 'ADBE'];

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
        Stock Dashboard
      </Typography>
      {stockData.map((stock, index) => (
        <Card key={index} style={{ marginBottom: '20px' }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Ticker: {stock['01. symbol']}
            </Typography>
            <Typography variant="h5" component="h2">
              Price: {stock['05. price']}
            </Typography>
            <Typography color="textSecondary">
              Volume: {stock['06. volume']}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
