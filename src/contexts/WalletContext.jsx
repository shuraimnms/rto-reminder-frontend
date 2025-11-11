import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { payAPI } from '../services/api';
import { useAuth } from './AuthContext'; // Import useAuth

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user, authChecked } = useAuth(); // Get user and authChecked from AuthContext

  const fetchBalance = useCallback(async () => {
    if (!authChecked || !user) { // Only fetch if auth has been checked and user is logged in
      setBalance(0); // Set balance to 0 if not authenticated
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await payAPI.getBalance();
      setBalance(parseFloat(response.data.balance || 0).toFixed(2)); // Format to 2 decimal places
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error);
      if (error.message === 'Unauthorized') {
        setBalance(parseFloat(0).toFixed(2)); // Format to 2 decimal places even on unauthorized
      }
    } finally {
      setLoading(false);
    }
  }, [authChecked, user]); // Re-run fetchBalance when auth status or user changes

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]); // Depend on fetchBalance

  const refreshBalance = useCallback(() => {
    fetchBalance();
  }, []); // Dependencies for fetchBalance are not needed here as fetchBalance itself doesn't depend on props/state that change frequently

  const setWalletBalance = useCallback((newBalance) => {
    setBalance(parseFloat(newBalance).toFixed(2)); // Format to 2 decimal places
  }, []);

  const value = {
    balance,
    loading,
    refreshBalance,
    setWalletBalance, // Expose the new function
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;
