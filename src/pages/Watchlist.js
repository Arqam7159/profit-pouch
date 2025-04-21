import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Stack,
  IconButton
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import useSheetPrices from '../hooks/useSheetPrices';
import { useWatchlist } from '../context/WatchlistContext';

export default function Watchlist() {
  const { watchlist, toggleWatchlist } = useWatchlist();
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRuZLftP7d6Au5d4q7l_NV6oi_7oggj95LMfwZ2t_ZHWHTiKjRzZ7aRYxvvOJHeJk5scWyVuBI4W5jw/pub?gid=0&single=true&output=csv';
  const prices = useSheetPrices(sheetUrl, 60000);

  // Build array of [symbol, data] for items in the watchlist
  const watchlistData = watchlist
    .map(symbol => [symbol, prices[symbol]])
    .filter(([, data]) => data);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Watchlist
      </Typography>
      <Paper sx={{ backgroundColor: 'transparent', backgroundImage: 'none', boxShadow: 'none' }}>
        {watchlistData.length > 0 ? (
          <List sx={{
            maxHeight: 'calc(100vh - 300px)',
            overflow: 'auto',
            '&::-webkit-scrollbar': { width: '8px' },
            '&::-webkit-scrollbar-track': { background: 'rgba(255,255,255,0.05)', borderRadius: '4px' },
            '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: '4px', '&:hover': { background: 'rgba(255,255,255,0.2)' } }
          }}>
            {watchlistData.map(([symbol, data]) => (
              <ListItem
                key={symbol}
                sx={{
                  borderRadius: '8px',
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' }
                }}
              >
                <ListItemIcon>
                  <IconButton onClick={() => toggleWatchlist(symbol)}>
                    {watchlist.includes(symbol) ? (
                      <StarIcon sx={{ color: 'gold' }} />
                    ) : (
                      <StarBorderIcon sx={{ color: 'rgba(255,255,255,0.3)' }} />
                    )}
                  </IconButton>
                </ListItemIcon>
                <ListItemIcon>
                  {data.change >= 0 ? (
                    <TrendingUpIcon sx={{ color: '#00e676' }} />
                  ) : (
                    <TrendingDownIcon sx={{ color: '#ff1744' }} />
                  )}
                </ListItemIcon>
                <Box sx={{ flex: 1, ml: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'white', mb: 0.5 }}>
                    {symbol}
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    <Typography variant="body2">
                      HIGH {data.high?.toFixed(2) || data.price.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      LOW {data.low?.toFixed(2) || (data.price * 0.98).toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      LDCP {data.ldcp?.toFixed(2) || (data.price * 0.99).toFixed(2)}
                    </Typography>
                  </Stack>
                </Box>
                <ListItemSecondaryAction sx={{ display: 'flex', alignItems: 'center', gap: 2, pr: 2 }}>
                  <Stack alignItems="flex-end">
                    <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'white', mb: 0.5 }}>
                      {data.price.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: data.change >= 0 ? '#00e676' : '#ff1744', fontWeight: 500 }}>
                      {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}%
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', minWidth: '100px', textAlign: 'right' }}>
                    Vol: {data.volume.toLocaleString()}
                  </Typography>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" color="text.secondary">
            Your watchlist is empty. Add stocks from the Market screen.
          </Typography>
        )}
      </Paper>
    </Box>
  );
} 