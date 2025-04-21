import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase/config';
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const WatchlistContext = createContext();

export function WatchlistProvider({ children }) {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (!user) {
      setWatchlist([]);
      return;
    }
    const docRef = doc(db, 'watchlists', user.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setWatchlist(docSnap.data().symbols || []);
      } else {
        setDoc(docRef, { symbols: [] });
        setWatchlist([]);
      }
    });
    return () => unsubscribe();
  }, [user]);

  const toggleWatchlist = async (symbol) => {
    if (!user) return;
    const docRef = doc(db, 'watchlists', user.uid);
    try {
      if (watchlist.includes(symbol)) {
        await updateDoc(docRef, { symbols: arrayRemove(symbol) });
      } else {
        await updateDoc(docRef, { symbols: arrayUnion(symbol) });
      }
    } catch (err) {
      console.error('Watchlist update failed:', err);
    }
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, toggleWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  return useContext(WatchlistContext);
} 