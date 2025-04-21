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
  IconButton,
  TableSortLabel,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { TradesContext } from '../context/TradesContext';
import { format } from 'date-fns';

export default function TradeList() {
  const { trades, deleteTrade, error } = useContext(TradesContext);
  const [orderBy, setOrderBy] = useState('date');
  const [order, setOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTradeId, setSelectedTradeId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleDeleteClick = (tradeId) => {
    if (!tradeId) {
      console.error('No trade ID provided');
      setErrorMessage('Invalid trade selected');
      setShowError(true);
      return;
    }

    const trade = trades.find(t => t.id === tradeId);
    if (!trade) {
      console.error('Trade not found in local state:', tradeId);
      setErrorMessage('Trade not found');
      setShowError(true);
      return;
    }

    console.log('Initiating delete for trade:', {
      id: trade.id,
      symbol: trade.symbol,
      type: trade.type,
      qty: trade.qty
    });

    setSelectedTradeId(tradeId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTradeId) {
      console.error('No trade selected for deletion');
      setErrorMessage('No trade selected');
      setShowError(true);
      return;
    }

    try {
      setErrorMessage('');
      setShowError(false);
      
      const trade = trades.find(t => t.id === selectedTradeId);
      if (!trade) {
        throw new Error('Trade not found in current state');
      }

      console.log('Attempting to delete trade:', {
        id: trade.id,
        symbol: trade.symbol,
        type: trade.type,
        qty: trade.qty
      });
      
      await deleteTrade(selectedTradeId);
      console.log('Delete operation completed successfully');
      
      setDeleteDialogOpen(false);
      setSelectedTradeId(null);
    } catch (error) {
      console.error('Failed to delete trade:', error);
      setErrorMessage(error.message || 'Failed to delete trade');
      setShowError(true);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedTradeId(null);
  };

  const handleErrorClose = () => {
    setShowError(false);
  };

  const filteredTrades = trades.filter(trade =>
    trade.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTrades = [...filteredTrades].sort((a, b) => {
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
    if (orderBy === 'type') {
      return order === 'asc'
        ? a.type.localeCompare(b.type)
        : b.type.localeCompare(a.type);
    }
    if (orderBy === 'price' || orderBy === 'qty') {
      return order === 'asc'
        ? a[orderBy] - b[orderBy]
        : b[orderBy] - a[orderBy];
    }
    return 0;
  });

  return (
    <Box>
      <Snackbar 
        open={showError} 
        autoHideDuration={6000} 
        onClose={handleErrorClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleErrorClose} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {errorMessage || error || 'An error occurred while deleting the trade'}
        </Alert>
      </Snackbar>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Transaction History
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
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'type'}
                  direction={orderBy === 'type' ? order : 'asc'}
                  onClick={() => handleSort('type')}
                >
                  Type
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'qty'}
                  direction={orderBy === 'qty' ? order : 'asc'}
                  onClick={() => handleSort('qty')}
                >
                  Quantity
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'price'}
                  direction={orderBy === 'price' ? order : 'asc'}
                  onClick={() => handleSort('price')}
                >
                  Price
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTrades.map((trade) => (
              <TableRow
                key={trade.id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.03)',
                  },
                }}
              >
                <TableCell>
                  {format(new Date(trade.date), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{trade.symbol}</TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: trade.type === 'buy' ? '#00e676' : '#ff1744',
                      textTransform: 'capitalize',
                      fontWeight: 500,
                    }}
                  >
                    {trade.type}
                  </Typography>
                </TableCell>
                <TableCell align="right">{trade.qty}</TableCell>
                <TableCell align="right">
                  PKR {trade.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell align="right">
                  PKR {(trade.qty * trade.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleDeleteClick(trade.id)}
                    size="small"
                    sx={{
                      color: 'rgba(255,255,255,0.5)',
                      '&:hover': {
                        color: '#ff1744',
                        backgroundColor: 'rgba(255,23,68,0.1)',
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            backgroundColor: '#1e2130',
            color: 'white',
            borderRadius: '16px',
          }
        }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this trade? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleDeleteCancel}
            sx={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            sx={{
              color: '#ff1744',
              '&:hover': {
                backgroundColor: 'rgba(255,23,68,0.1)',
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 