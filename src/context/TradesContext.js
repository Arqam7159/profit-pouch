import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const TradesContext = createContext();

export function useTrades() {
  return useContext(TradesContext);
}

export function TradesProvider({ children }) {
  const [trades, setTrades] = useState([]);
  const { user } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setTrades([]);
      console.log('No user authenticated');
      return;
    }

    console.log('User authenticated:', user.uid);

    // Subscribe to trades for the current user
    const q = query(
      collection(db, 'trades'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newTrades = [];
      snapshot.forEach((doc) => {
        const trade = { id: doc.id, ...doc.data() };
        console.log('Loaded trade:', { id: trade.id, symbol: trade.symbol });
        newTrades.push(trade);
      });
      setTrades(newTrades);
      console.log('All trades loaded:', newTrades.map(t => ({ id: t.id, symbol: t.symbol })));
    }, (error) => {
      console.error('Error in trades snapshot:', error);
      setError(error.message);
    });

    return () => unsubscribe();
  }, [user]);

  const addTrade = async (trade) => {
    if (!user) {
      console.error('Cannot add trade: No user authenticated');
      setError('You must be logged in to add trades');
      return;
    }

    try {
      // Remove any existing id from the trade object
      const { id, ...tradeWithoutId } = trade;
      
      // Add the trade to Firestore and let it generate the ID
      const docRef = await addDoc(collection(db, 'trades'), {
        ...tradeWithoutId,
        userId: user.uid,
        createdAt: new Date().toISOString()
      });

      console.log('Trade added with Firestore ID:', docRef.id);
      
      // Return the new trade with the Firestore-generated ID
      return {
        ...trade,
        id: docRef.id
      };
    } catch (error) {
      console.error('Error adding trade:', error);
      setError(error.message);
      throw error;
    }
  };

  const deleteTrade = async (tradeId) => {
    if (!user) {
      const error = new Error('Cannot delete trade: No user authenticated');
      console.error(error);
      setError('You must be logged in to delete trades');
      throw error;
    }

    try {
      console.log('Starting delete operation for trade:', tradeId);
      
      // Reference the trade document directly
      const tradeRef = doc(db, 'trades', tradeId);
      
      // Get the trade document to verify it exists and belongs to the user
      const tradeDoc = await getDoc(tradeRef);
      
      if (!tradeDoc.exists()) {
        console.error('Trade document not found:', tradeId);
        throw new Error('Trade not found');
      }
      
      const tradeData = tradeDoc.data();
      if (tradeData.userId !== user.uid) {
        console.error('Trade does not belong to current user');
        throw new Error('Unauthorized to delete this trade');
      }

      // Delete the trade
      await deleteDoc(tradeRef);
      console.log('Trade deleted successfully:', tradeId);

      return true;
    } catch (error) {
      console.error('Error in delete operation:', error);
      setError(error.message || 'Failed to delete trade');
      throw error;
    }
  };

  const value = {
    trades,
    addTrade,
    deleteTrade,
    error
  };

  return (
    <TradesContext.Provider value={value}>
      {children}
    </TradesContext.Provider>
  );
}

export { TradesContext }; 