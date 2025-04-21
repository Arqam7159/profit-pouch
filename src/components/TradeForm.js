import React, { useState, useContext } from 'react';
import { TradesContext } from '../context/TradesContext';
import { 
  Box, 
  TextField,
  Button,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
  IconButton,
  Dialog,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import useSheetPrices from '../hooks/useSheetPrices';

export default function TradeForm({ onClose, selectedStock: initialStock }) {
  const { addTrade } = useContext(TradesContext);
  const [type, setType] = useState('buy');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(new Date());
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStockSelectOpen, setIsStockSelectOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState(initialStock);
  const [fee, setFee] = useState('');

  // Get stock prices and symbols from the sheet
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRuZLftP7d6Au5d4q7l_NV6oi_7oggj95LMfwZ2t_ZHWHTiKjRzZ7aRYxvvOJHeJk5scWyVuBI4W5jw/pub?gid=0&single=true&output=csv';
  const prices = useSheetPrices(sheetUrl, 60000);
  const availableSymbols = Object.keys(prices).sort();

  const filteredStocks = availableSymbols.filter(symbol => 
    symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStockSelect = (newStock) => {
    setSelectedStock(newStock);
    if (prices[newStock]) {
      setPrice(prices[newStock].price.toString());
    }
    setIsStockSelectOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStock || qty <= 0 || price <= 0) return;
    
    setIsLoading(true);
    
    try {
      await addTrade({
        symbol: selectedStock,
        type,
        qty: Number(qty),
        price: Number(price),
        fee: Number(fee) || 0,
        date: date.toISOString(),
      });
      
      setIsSuccess(true);
      
      setTimeout(() => {
        setQty('');
        setPrice('');
        setFee('');
        setDate(new Date());
        setIsSuccess(false);
        if (onClose) onClose();
      }, 1500);
    } catch (error) {
      console.error('Error adding trade:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  const totalCost = (Number(qty) * Number(price) || 0) + (Number(fee) || 0);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 3
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Add Transaction
          </Typography>
          <IconButton
            onClick={() => onClose()}
            sx={{ color: 'rgba(255,255,255,0.7)' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ 
            position: 'relative', 
            mb: 3,
            backgroundColor: 'rgba(255,255,255,0.03)',
            borderRadius: '16px',
            p: 0.5,
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}>
            <Box
              sx={{
                position: 'absolute',
                top: '4px',
                left: '4px',
                bottom: '4px',
                width: 'calc(50% - 4px)',
                bgcolor: '#1976d2',
                borderRadius: '14px',
                transition: 'transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)',
                transform: type === 'sell' ? 'translateX(100%)' : 'translateX(0)',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                zIndex: 0,
              }}
            />
            <ToggleButtonGroup
              value={type}
              exclusive
              onChange={(e, newType) => newType && setType(newType)}
              aria-label="transaction type"
              sx={{
                width: '100%',
                position: 'relative',
                zIndex: 1,
                '& .MuiToggleButton-root': {
                  flex: 1,
                  color: 'rgba(255,255,255,0.7)',
                  border: 'none',
                  textTransform: 'none',
                  borderRadius: '14px',
                  py: 1.5,
                  transition: 'all 0.4s cubic-bezier(0.65, 0, 0.35, 1)',
                  '&.Mui-selected': {
                    color: 'white',
                    backgroundColor: 'transparent',
                  },
                  '&:hover': {
                    backgroundColor: 'transparent',
                  }
                }
              }}
            >
              <ToggleButton value="buy">Buy</ToggleButton>
              <ToggleButton value="sell">Sell</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Button
            onClick={() => setIsStockSelectOpen(true)}
            sx={{ 
              width: '100%',
              mb: 3,
              p: 2,
              backgroundColor: 'rgba(255,255,255,0.03)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textTransform: 'none',
              transition: 'all 0.3s cubic-bezier(0.65, 0, 0.35, 1)',
              willChange: 'transform, background-color',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.05)',
                transform: 'translateY(-1px)',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ShowChartIcon sx={{ color: '#64b5f6' }} />
              <Typography sx={{ color: 'white', fontWeight: 500 }}>
                {selectedStock}
              </Typography>
            </Box>
            <KeyboardArrowDownIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
          </Button>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'rgba(255,255,255,0.7)' }}>
              Quantity
            </Typography>
            <TextField
              fullWidth
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              type="number"
              placeholder="0.00"
              InputProps={{
                sx: {
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderRadius: '12px',
                  '& input': {
                    color: 'white',
                    fontSize: '1.1rem',
                    padding: '16px',
                  }
                }
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'rgba(255,255,255,0.7)' }}>
              Price Per Share
            </Typography>
            <TextField
              fullWidth
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              placeholder="0.00"
              InputProps={{
                startAdornment: <InputAdornment position="start">PKR</InputAdornment>,
                sx: {
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderRadius: '12px',
                  '& input': {
                    color: 'white',
                    fontSize: '1.1rem',
                    padding: '16px',
                  },
                  '& .MuiInputAdornment-root': {
                    color: 'rgba(255,255,255,0.5)',
                  }
                }
              }}
            />
          </Box>

          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mb: 3 
          }}>
            <DatePicker
              value={date}
              onChange={(newDate) => setDate(newDate)}
              format="MMM dd, yyyy"
              sx={{
                flex: 1,
                '& .MuiInputBase-root': {
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderRadius: '12px',
                  color: 'white',
                  '& input': {
                    color: 'white',
                    fontSize: '1rem',
                    padding: '16px',
                  },
                  '& .MuiIconButton-root': {
                    color: 'rgba(255,255,255,0.5)',
                  }
                }
              }}
            />
            <TextField
              placeholder="Fee"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              type="number"
              sx={{ width: '30%' }}
              InputProps={{
                startAdornment: <InputAdornment position="start">PKR</InputAdornment>,
                sx: {
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderRadius: '12px',
                  '& input': {
                    color: 'white',
                    padding: '16px',
                  },
                  '& .MuiInputAdornment-root': {
                    color: 'rgba(255,255,255,0.5)',
                  }
                }
              }}
            />
            <TextField
              placeholder="Notes"
              sx={{ width: '30%' }}
              InputProps={{
                sx: {
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderRadius: '12px',
                  '& input': {
                    color: 'white',
                    padding: '16px',
                  }
                }
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'rgba(255,255,255,0.7)' }}>
              Total {type === 'buy' ? 'Spent' : 'Received'}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              PKR {totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading || isSuccess}
            sx={{
              height: 56,
              borderRadius: '16px',
              background: isSuccess 
                ? 'linear-gradient(45deg, #00e676 30%, #69f0ae 90%)'
                : '#4B6BFB',
              color: 'white',
              fontWeight: 600,
              fontSize: '1rem',
              transition: 'all 0.5s cubic-bezier(0.65, 0, 0.35, 1)',
              transform: isSuccess ? 'scale(1.02)' : 'scale(1)',
              willChange: 'transform, background',
              backfaceVisibility: 'hidden',
              '&:hover': {
                background: isSuccess 
                  ? 'linear-gradient(45deg, #00c853 30%, #00e676 90%)'
                  : '#3451DB',
                transform: isSuccess ? 'scale(1.02)' : 'translateY(-2px)',
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              position: 'relative',
              width: '100%',
              height: '100%',
              willChange: 'transform, opacity',
            }}>
              {isLoading ? (
                <CircularProgress 
                  size={24} 
                  color="inherit"
                  sx={{
                    animation: 'spin 1s cubic-bezier(0.65, 0, 0.35, 1) infinite',
                    '@keyframes spin': {
                      '0%': {
                        transform: 'rotate(0deg)',
                      },
                      '100%': {
                        transform: 'rotate(360deg)',
                      },
                    },
                  }}
                />
              ) : isSuccess ? (
                <CheckIcon sx={{ 
                  transform: 'scale(1.2)',
                  transition: 'all 0.4s cubic-bezier(0.65, 0, 0.35, 1)',
                  animation: 'checkmark 0.4s cubic-bezier(0.65, 0, 0.35, 1)',
                  '@keyframes checkmark': {
                    '0%': {
                      opacity: 0,
                      transform: 'scale(0.5)',
                    },
                    '50%': {
                      opacity: 1,
                      transform: 'scale(1.3)',
                    },
                    '100%': {
                      transform: 'scale(1.2)',
                    },
                  },
                }} />
              ) : (
                'Add Transaction'
              )}
            </Box>
          </Button>
        </Box>

        <Dialog
          open={isStockSelectOpen}
          onClose={() => setIsStockSelectOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: '#1e2130',
              borderRadius: '16px',
              color: 'white'
            }
          }}
        >
          <Box sx={{ p: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              mb: 3
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Select Stock
              </Typography>
              <IconButton
                onClick={() => setIsStockSelectOpen(false)}
                sx={{ color: 'rgba(255,255,255,0.7)' }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <TextField
              fullWidth
              placeholder="Search stocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderRadius: '12px',
                  '& input': {
                    color: 'white',
                    padding: '12px 4px',
                  }
                }
              }}
            />

            <List sx={{ 
              maxHeight: '400px', 
              overflow: 'auto',
              width: '95%',
              mx: 'auto'
            }}>
              {filteredStocks.map((symbol) => (
                <ListItem
                  key={symbol}
                  button
                  onClick={() => handleStockSelect(symbol)}
                  sx={{
                    borderRadius: '12px',
                    mb: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  <ListItemIcon>
                    <ShowChartIcon sx={{ color: '#64b5f6' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={symbol}
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: 'white',
                        fontWeight: 500
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}