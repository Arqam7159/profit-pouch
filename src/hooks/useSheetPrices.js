import { useState, useEffect } from 'react';

const useSheetPrices = (sheetUrl, intervalMs = 60000) => {
  const [prices, setPrices] = useState({});

  useEffect(() => {
    let isMounted = true;

    async function fetchPrices() {
      try {
        const res = await fetch(sheetUrl, { cache: 'no-cache' });
        const text = await res.text();
        const rows = text
          .trim()
          .split('\n')
          .map(r => r.split(','));
        
        // 1. grab your header row and convert to lowercase for case-insensitive matching
        const header = rows[0].map(h => h.toLowerCase().trim());
        const idxSymbol = header.indexOf("symbol");
        const idxClose = header.indexOf("close");
        const idxOpen = header.indexOf("open");
        const idxVolume = header.indexOf("volume");
        
        // 2. turn the rest into a symbol→data map
        const dataRows = rows.slice(1);
        const map = Object.fromEntries(
          dataRows.map(cols => {
            const sym = cols[idxSymbol].toUpperCase().trim();
            const close = parseFloat(cols[idxClose]) || 0;
            const open = parseFloat(cols[idxOpen]) || 0;
            const volumeStr = cols[idxVolume] ? cols[idxVolume].replace(/,/g, '') : '0';
            const volume = parseInt(volumeStr) || 0;
            
            // Calculate percentage change
            const change = open !== 0 ? ((close - open) / open) * 100 : 0;
            
            return [sym, {
              price: close,
              volume,
              change,
              open
            }];
          })
        );

        if (isMounted) setPrices(map);
      } catch (err) {
        console.error('Failed to fetch prices', err);
      }
    }

    fetchPrices();
    const timer = setInterval(fetchPrices, intervalMs);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [sheetUrl, intervalMs]);

  return prices;
};

export default useSheetPrices;