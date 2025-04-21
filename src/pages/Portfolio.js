import React, { useState, useContext } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Avatar, 
  IconButton, 
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  InputBase,
  InputAdornment,
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TradeForm from '../components/TradeForm';
import PortfolioSummary from '../components/PortfolioSummary';
import Holdings from '../components/Holdings';
import TradeList from '../components/TradeList';
import emptyStateImage from '../assets/empty-state.svg';
import { TradesContext } from '../context/TradesContext';
import useSheetPrices from '../hooks/useSheetPrices';

export default function Portfolio() {
  const [isTradeFormOpen, setIsTradeFormOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [username, setUsername] = useState("My Portfolio");
  const [portfolioName, setPortfolioName] = useState("Personal Portfolio");
  const [searchQuery, setSearchQuery] = useState('');
  const { trades } = useContext(TradesContext);

  // Get stock prices and symbols
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRuZLftP7d6Au5d4q7l_NV6oi_7oggj95LMfwZ2t_ZHWHTiKjRzZ7aRYxvvOJHeJk5scWyVuBI4W5jw/pub?gid=0&single=true&output=csv';
  const prices = useSheetPrices(sheetUrl, 60000);
  const availableSymbols = Object.keys(prices).sort();

  const filteredStocks = availableSymbols.filter(symbol => 
    symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStockSelect = (symbol) => {
    setSelectedStock(symbol);
    setIsTradeFormOpen(true);
  };

  const handleCloseTradeForm = () => {
    setIsTradeFormOpen(false);
    setSelectedStock(null);
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleProfileSave = () => {
    setIsEditingProfile(false);
  };

  return (
    <Container maxWidth="xl" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Section with Profile and Value */}
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 2
      }}>
        {/* Left: Profile Section */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: 0.5
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32,
                bgcolor: 'primary.main'
              }}
            >
              {username.charAt(0).toUpperCase()}
            </Avatar>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 500,
                lineHeight: 1.2
              }}
            >
              {username}
            </Typography>
            <IconButton 
              size="small" 
              sx={{ color: 'primary.light' }}
              onClick={handleEditProfile}
            >
              <EditIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              opacity: 0.8,
              pl: '44px' // 32px avatar width + 12px gap
            }}
          >
            {portfolioName}
          </Typography>
        </Box>

        {/* Right: Add Transaction Button */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsTradeFormOpen(true)}
          sx={{
            bgcolor: '#0066FF',
            '&:hover': {
              bgcolor: '#0052CC',
            },
            textTransform: 'none',
            borderRadius: 2,
            px: 3,
            color: '#FFFFFF',
            fontSize: '0.875rem',
            fontWeight: 600,
            '& .MuiButton-startIcon': {
              color: '#FFFFFF'
            }
          }}
        >
          Add Transaction
        </Button>
      </Box>

      {trades.length > 0 ? (
        <>
          <Box sx={{ mb: 4 }}>
            <PortfolioSummary />
          </Box>

          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 3,
            mb: 4 
          }}>
            <Box sx={{ 
              p: 3, 
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.05)',
            }}>
              <Typography variant="subtitle2" color="text.secondary">All-time profit</Typography>
              {/* Add your profit stats here */}
            </Box>
            <Box sx={{ 
              p: 3, 
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.05)',
            }}>
              <Typography variant="subtitle2" color="text.secondary">Cost Basis</Typography>
              {/* Add your cost basis stats here */}
            </Box>
            <Box sx={{ 
              p: 3, 
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.05)',
            }}>
              <Typography variant="subtitle2" color="text.secondary">Best Performer</Typography>
              {/* Add your best performer stats here */}
            </Box>
            <Box sx={{ 
              p: 3, 
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.05)',
            }}>
              <Typography variant="subtitle2" color="text.secondary">Worst Performer</Typography>
              {/* Add your worst performer stats here */}
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Holdings />
          </Box>

          <Box>
            <TradeList />
          </Box>
        </>
      ) : (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            gap: 2,
            mt: -4 // Adjust to center vertically accounting for header height
          }}
        >
          <img 
            src={emptyStateImage} 
            alt="Empty Portfolio" 
            style={{ 
              width: '200px', // Slightly smaller
              height: '200px',
              marginBottom: '16px'
            }} 
          />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            This portfolio needs some final touches...
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Add a stock to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsTradeFormOpen(true)}
            sx={{
              bgcolor: '#0066FF',
              '&:hover': {
                bgcolor: '#0052CC',
              },
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
              mt: 1,
              color: '#FFFFFF',
              fontSize: '0.875rem',
              fontWeight: 600,
              '& .MuiButton-startIcon': {
                color: '#FFFFFF'
              }
            }}
          >
            Add Transaction
          </Button>
        </Box>
      )}

      {/* Trade Form Dialog */}
      <Dialog 
        open={isTradeFormOpen} 
        onClose={handleCloseTradeForm}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#1e2130',
            borderRadius: '16px',
            color: 'white',
            minHeight: selectedStock ? '600px' : 'auto'
          }
        }}
      >
        {selectedStock ? (
          <TradeForm 
            onClose={handleCloseTradeForm}
            selectedStock={selectedStock}
          />
        ) : (
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ p: 0, fontWeight: 600 }}>
                Select Stock
              </Typography>
              <IconButton
                onClick={handleCloseTradeForm}
                sx={{ color: 'rgba(255,255,255,0.7)' }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <InputBase
              sx={{ 
                flex: 1,
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                padding: '4px 12px',
                mb: 2,
                width: '100%',
                '& input': {
                  padding: '4px 0',
                  fontSize: '0.95rem',
                  '&::placeholder': {
                    color: 'rgba(255,255,255,0.5)',
                    opacity: 1
                  }
                }
              }}
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }} />
                </InputAdornment>
              }
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
                    borderRadius: '8px',
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
        )}
      </Dialog>

      {/* Profile Edit Dialog */}
      <Dialog 
        open={isEditingProfile} 
        onClose={() => setIsEditingProfile(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Edit Portfolio Details</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              autoFocus
              label="Portfolio Title"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
            />
            <TextField
              label="Portfolio Description"
              value={portfolioName}
              onChange={(e) => setPortfolioName(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditingProfile(false)}>Cancel</Button>
          <Button onClick={handleProfileSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 