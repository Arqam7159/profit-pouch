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
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import useSheetPrices from '../hooks/useSheetPrices';

export default function VolumeLeaders() {
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRuZLftP7d6Au5d4q7l_NV6oi_7oggj95LMfwZ2t_ZHWHTiKjRzZ7aRYxvvOJHeJk5scWyVuBI4W5jw/pub?gid=0&single=true&output=csv';
  const prices = useSheetPrices(sheetUrl, 60000);

  // Sort stocks by volume and take top 50
  const volumeLeaders = Object.entries(prices)
    .sort((a, b) => b[1].volume - a[1].volume)
    .slice(0, 50);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Volume Leaders (Top 50)
      </Typography>
      <Paper sx={{
        backgroundColor: 'transparent',
        backgroundImage: 'none',
        boxShadow: 'none',
      }}>
        <List sx={{ 
          maxHeight: 'calc(100vh - 300px)', 
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
            '&:hover': {
              background: 'rgba(255,255,255,0.2)',
            },
          },
        }}>
          {volumeLeaders.map(([symbol, data]) => (
            <ListItem
              key={symbol}
              sx={{
                borderRadius: '8px',
                mb: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.03)',
                },
              }}
            >
              <ListItemIcon>
                {data.change >= 0 ? (
                  <TrendingUpIcon sx={{ color: '#00e676' }} />
                ) : (
                  <TrendingDownIcon sx={{ color: '#ff1744' }} />
                )}
              </ListItemIcon>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 500,
                    color: 'white',
                    mb: 0.5
                  }}
                >
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
              <ListItemSecondaryAction sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                pr: 2
              }}>
                <Stack alignItems="flex-end">
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 500,
                      color: 'white',
                      mb: 0.5
                    }}
                  >
                    {data.price.toFixed(2)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: data.change >= 0 ? '#00e676' : '#ff1744',
                      fontWeight: 500,
                    }}
                  >
                    {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}%
                  </Typography>
                </Stack>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    minWidth: '100px',
                    textAlign: 'right'
                  }}
                >
                  Vol: {data.volume.toLocaleString()}
                </Typography>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
} 