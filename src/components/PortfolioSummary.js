import React, { useContext } from 'react';
import { Paper, Typography, Box, Grid } from '@mui/material';
import { TradesContext } from '../context/TradesContext';
import useSheetPrices from '../hooks/useSheetPrices';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TimelineIcon from '@mui/icons-material/Timeline';

export default function PortfolioSummary() {
  const { trades } = useContext(TradesContext);
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRuZLftP7d6Au5d4q7l_NV6oi_7oggj95LMfwZ2t_ZHWHTiKjRzZ7aRYxvvOJHeJk5scWyVuBI4W5jw/pub?gid=0&single=true&output=csv';
  const prices = useSheetPrices(sheetUrl, 60000);

  // Calculate portfolio metrics
  const portfolio = trades.reduce((acc, trade) => {
    const symbol = trade.symbol;
    if (!acc[symbol]) {
      acc[symbol] = { qty: 0, avgPrice: 0, totalCost: 0 };
    }
    
    const tradeValue = trade.qty * trade.price;
    if (trade.type === 'buy') {
      acc[symbol].totalCost += tradeValue;
      acc[symbol].qty += trade.qty;
    } else {
      acc[symbol].totalCost -= (acc[symbol].avgPrice * trade.qty);
      acc[symbol].qty -= trade.qty;
    }
    
    if (acc[symbol].qty > 0) {
      acc[symbol].avgPrice = acc[symbol].totalCost / acc[symbol].qty;
    }
    
    return acc;
  }, {});

  // Calculate total portfolio value and P/L
  let totalValue = 0;
  let totalCost = 0;
  let totalPnL = 0;

  Object.entries(portfolio).forEach(([symbol, data]) => {
    if (data.qty > 0 && prices[symbol]) {
      const currentValue = data.qty * prices[symbol].price;
      totalValue += currentValue;
      totalCost += data.totalCost;
      totalPnL += currentValue - data.totalCost;
    }
  });

  const pnlPercentage = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  const MetricCard = ({ title, value, icon, color }) => (
    <Paper 
      elevation={3}
      sx={{
        p: 3,
        background: 'linear-gradient(135deg, #172a45 0%, #1f4068 100%)',
        borderRadius: 2,
        height: '140px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 16px rgba(10, 25, 47, 0.3)',
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1.5,
        color: '#64b5f6'
      }}>
        {React.cloneElement(icon, { sx: { fontSize: 24 } })}
        <Typography 
          variant="body1" 
          sx={{ 
            fontWeight: 500,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            fontSize: '0.875rem',
            color: '#9be7ff'
          }}
        >
          {title}
        </Typography>
      </Box>
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 500,
          color: color || '#e6f1ff',
          fontSize: '1.75rem'
        }}
      >
        {value}
      </Typography>
    </Paper>
  );

  return (
    <Grid 
      container 
      spacing={3}
      sx={{ 
        mb: 4
      }}
    >
      <Grid item xs={12} md={4}>
        <MetricCard
          title="Portfolio Value"
          value={`₨ ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<AccountBalanceIcon />}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <MetricCard
          title="Total Cost"
          value={`₨ ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<ShowChartIcon />}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <MetricCard
          title="Unrealized P/L"
          value={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography 
                variant="h4" 
                component="span" 
                sx={{ 
                  fontWeight: 500,
                  color: totalPnL >= 0 ? '#00e676' : '#ff1744'
                }}
              >
                ₨ {Math.abs(totalPnL).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: totalPnL >= 0 ? '#00e676' : '#ff1744',
                typography: 'h6'
              }}>
                {totalPnL >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                {Math.abs(pnlPercentage).toFixed(2)}%
              </Box>
            </Box>
          }
          icon={<TimelineIcon />}
          color={totalPnL >= 0 ? '#00e676' : '#ff1744'}
        />
      </Grid>
    </Grid>
  );
}