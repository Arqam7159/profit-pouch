import React, { useContext, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TableSortLabel,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { TradesContext } from '../context/TradesContext';
import { format } from 'date-fns';

export default function RealizedPnLHistory() {
  const { realizedPnL } = useContext(TradesContext);
  const [orderBy, setOrderBy] = useState('date');
  const [order, setOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredPnL = realizedPnL.filter(item =>
    item.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPnL = [...filteredPnL].sort((a, b) => {
    if (orderBy === 'date') {
      return order === 'asc'
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }
    if (orderBy === 'symbol') {
      return order === 'asc'
        ? a.symbol.localeCompare(b.symbol)
        : b.symbol.localeCompare(a.symbol);
    }
    if (orderBy === 'profitLoss') {
      return order === 'asc'
        ? a.profitLoss - b.profitLoss
        : b.profitLoss - a.profitLoss;
    }
    return 0;
  });

  return (
    <Box>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Realized Profit/Loss History
        </Typography>
        <TextField
          placeholder="Search by symbol..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
              </InputAdornment>
            ),
            sx: {
              backgroundColor: 'rgba(255,255,255,0.03)',
              borderRadius: '8px',
              '& input': {
                color: 'white',
                fontSize: '0.875rem',
              }
            }
          }}
          sx={{ width: 200 }}
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: 'transparent',
          backgroundImage: 'none',
          boxShadow: 'none',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'date'}
                  direction={orderBy === 'date' ? order : 'asc'}
                  onClick={() => handleSort('date')}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'symbol'}
                  direction={orderBy === 'symbol' ? order : 'asc'}
                  onClick={() => handleSort('symbol')}
                >
                  Symbol
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Buy Price</TableCell>
              <TableCell align="right">Sell Price</TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'profitLoss'}
                  direction={orderBy === 'profitLoss' ? order : 'asc'}
                  onClick={() => handleSort('profitLoss')}
                >
                  Profit/Loss
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPnL.map((item) => (
              <TableRow
                key={item.id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.03)',
                  },
                }}
              >
                <TableCell>
                  {format(new Date(item.date), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{item.symbol}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">
                  PKR {item.buyPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell align="right">
                  PKR {item.sellPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell align="right">
                  <Typography
                    sx={{
                      color: item.profitLoss >= 0 ? '#00e676' : '#ff1744',
                      fontWeight: 500,
                    }}
                  >
                    PKR {item.profitLoss.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 