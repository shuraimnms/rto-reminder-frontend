import React, { createContext, useContext, useState, useEffect } from 'react';
import { payAPI } from '../services/api';

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

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const response = await payAPI.getBalance();
      setBalance(response.data.balance || 0);
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error);
      // Don't set balance to 0 on error, keep previous value or handle gracefully
      if (error.message === 'Unauthorized') {
        // User not logged in, balance should be 0
        setBalance(0);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const refreshBalance = () => {
    fetchBalance();
  };

  const value = {
    balance,
    loading,
    refreshBalance,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;
