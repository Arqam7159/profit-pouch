import React, { useContext } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { TradesContext } from '../context/TradesContext';
import useSheetPrices from '../hooks/useSheetPrices';

export default function Holdings() {
  const { trades } = useContext(TradesContext);
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRuZLftP7d6Au5d4q7l_NV6oi_7oggj95LMfwZ2t_ZHWHTiKjRzZ7aRYxvvOJHeJk5scWyVuBI4W5jw/pub?gid=0&single=true&output=csv';
  const prices = useSheetPrices(sheetUrl, 60000);

  // Calculate holdings
  const holdings = trades.reduce((acc, trade) => {
    const symbol = trade.symbol;
    if (!acc[symbol]) {
      acc[symbol] = { qty: 0, avgPrice: 0, totalCost: 0 };
    }
    
    const tradeValue = trade.qty * trade.price;
    if (trade.type === 'buy') {
      const newTotalCost = acc[symbol].totalCost + tradeValue;
      const newQty = acc[symbol].qty + trade.qty;
      acc[symbol] = {
        qty: newQty,
        totalCost: newTotalCost,
        avgPrice: newTotalCost / newQty
      };
    } else {
      const remainingQty = acc[symbol].qty - trade.qty;
      if (remainingQty > 0) {
        acc[symbol] = {
          qty: remainingQty,
          totalCost: acc[symbol].avgPrice * remainingQty,
          avgPrice: acc[symbol].avgPrice
        };
      } else {
        delete acc[symbol]; // Remove if no shares left
      }
    }
    
    return acc;
  }, {});

  // Convert holdings object to array and calculate current values
  const holdingsArray = Object.entries(holdings)
    .map(([symbol, data]) => {
      const currentPrice = prices[symbol]?.price || 0;
      const marketValue = data.qty * currentPrice;
      const unrealizedPnL = marketValue - data.totalCost;
      const pnlPercentage = (unrealizedPnL / data.totalCost) * 100;

      return {
        symbol,
        qty: data.qty,
        avgPrice: data.avgPrice,
        currentPrice,
        marketValue,
        unrealizedPnL,
        pnlPercentage
      };
    })
    .filter(holding => holding.qty > 0)
    .sort((a, b) => b.marketValue - a.marketValue);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Current Holdings
      </Typography>
      <TableContainer component={Paper} sx={{ 
        backgroundColor: 'transparent',
        backgroundImage: 'none',
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell align="right">Shares</TableCell>
              <TableCell align="right">Avg Price</TableCell>
              <TableCell align="right">Current Price</TableCell>
              <TableCell align="right">Market Value</TableCell>
              <TableCell align="right">Unrealized P/L</TableCell>
              <TableCell align="right">Change %</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {holdingsArray.map((holding) => (
              <TableRow
                key={holding.symbol}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.03)',
                  },
                }}
              >
                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                  {holding.symbol}
                </TableCell>
                <TableCell align="right">{holding.qty}</TableCell>
                <TableCell align="right">
                  ₨ {holding.avgPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell align="right">
                  ₨ {holding.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell align="right">
                  ₨ {holding.marketValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell 
                  align="right"
                  sx={{
                    color: holding.unrealizedPnL >= 0 ? '#00e676' : '#ff1744',
                    fontWeight: 500
                  }}
                >
                  ₨ {Math.abs(holding.unrealizedPnL).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  {holding.unrealizedPnL >= 0 ? ' +' : ' -'}
                </TableCell>
                <TableCell 
                  align="right"
                  sx={{
                    color: holding.pnlPercentage >= 0 ? '#00e676' : '#ff1744',
                    fontWeight: 500
                  }}
                >
                  {holding.pnlPercentage >= 0 ? '+' : ''}{holding.pnlPercentage.toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 