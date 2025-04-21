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
  Button,
} from '@mui/material';
import { TradesContext } from '../context/TradesContext';
import useSheetPrices from '../hooks/useSheetPrices';

export default function Holdings({ onSell }) {
  const { trades } = useContext(TradesContext);
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRuZLftP7d6Au5d4q7l_NV6oi_7oggj95LMfwZ2t_ZHWHTiKjRzZ7aRYxvvOJHeJk5scWyVuBI4W5jw/pub?gid=0&single=true&output=csv';
  const prices = useSheetPrices(sheetUrl, 60000);

  // Calculate holdings using FIFO
  const holdings = Object.entries(
    // First, group trades by symbol
    trades.reduce((acc, trade) => {
      if (!acc[trade.symbol]) {
        acc[trade.symbol] = [];
      }
      acc[trade.symbol].push(trade);
      return acc;
    }, {})
  ).reduce((acc, [symbol, symbolTrades]) => {
    // Sort buy trades by date for FIFO
    const buyTrades = symbolTrades
      .filter(t => t.type === 'buy')
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(trade => ({ ...trade, remainingQty: trade.qty })); // Create copies with remaining quantity

    // Process all sells in chronological order
    symbolTrades
      .filter(t => t.type === 'sell')
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .forEach(sellTrade => {
        let remainingToSell = sellTrade.qty;
        let i = 0;
        
        while (remainingToSell > 0 && i < buyTrades.length) {
          const buyTrade = buyTrades[i];
          if (buyTrade.remainingQty > 0) {
            const qtyToDeduct = Math.min(buyTrade.remainingQty, remainingToSell);
            buyTrade.remainingQty -= qtyToDeduct;
            remainingToSell -= qtyToDeduct;
          }
          if (buyTrade.remainingQty === 0) {
            i++;
          }
        }
      });

    // Calculate remaining position
    const remainingBuyTrades = buyTrades.filter(t => t.remainingQty > 0);
    if (remainingBuyTrades.length > 0) {
      const totalQty = remainingBuyTrades.reduce((sum, trade) => sum + trade.remainingQty, 0);
      const totalCost = remainingBuyTrades.reduce((sum, trade) => sum + (trade.remainingQty * trade.price), 0);
      
      acc[symbol] = {
        qty: totalQty,
        avgPrice: totalCost / totalQty,
        totalCost: totalCost
      };
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
              <TableCell align="right">Actions</TableCell>
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
                  {holding.avgPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell align="right">
                  {holding.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell align="right">
                  {holding.marketValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell 
                  align="right"
                  sx={{
                    color: holding.unrealizedPnL >= 0 ? '#4ADE80' : '#F87171',
                    fontWeight: 600,
                    fontFamily: 'monospace'
                  }}
                >
                  {Math.abs(holding.unrealizedPnL).toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
                <TableCell align="right">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => onSell({
                      type: 'sell',
                      symbol: holding.symbol,
                      currentPrice: holding.currentPrice,
                      maxQty: holding.qty
                    })}
                    sx={{
                      backgroundColor: '#DC2626',
                      '&:hover': {
                        backgroundColor: '#B91C1C',
                      },
                      minWidth: 'unset',
                      px: 2
                    }}
                  >
                    Sell
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 