'use client';

import { useContext } from 'react';
import { MetamaskContext } from '../contexts/MetamaskContext';
import { WalletConnectContext } from '../contexts/WalletConnectContext';
import { connectToMetamask, metamaskWallet } from '../services/wallets/metamask/metamaskClient';
import { openWalletConnectModal, walletConnectWallet } from '../services/wallets/walletconnect/walletConnectClient';

export enum WalletType {
  METAMASK = 'metamask',
  WALLETCONNECT = 'walletconnect'
}

export const useWallets = () => {
  const metamaskContext = useContext(MetamaskContext);
  const walletConnectContext = useContext(WalletConnectContext);

  // Check if any wallet is connected
  const isAnyWalletConnected = metamaskContext.isConnected || walletConnectContext.isConnected;

  // Get the currently connected wallet type
  const getConnectedWalletType = (): WalletType | null => {
    if (metamaskContext.isConnected) return WalletType.METAMASK;
    if (walletConnectContext.isConnected) return WalletType.WALLETCONNECT;
    return null;
  };

  // Get the current account address/ID
  const getCurrentAccount = (): string => {
    if (metamaskContext.isConnected) return metamaskContext.metamaskAccountAddress;
    if (walletConnectContext.isConnected) return walletConnectContext.accountId;
    return '';
  };

  // Get the appropriate wallet interface
  const getCurrentWallet = () => {
    const walletType = getConnectedWalletType();
    if (walletType === WalletType.METAMASK) return metamaskWallet;
    if (walletType === WalletType.WALLETCONNECT) return walletConnectWallet;
    return null;
  };

  // Connect to a specific wallet
  const connectWallet = async (walletType: WalletType): Promise<boolean> => {
    try {
      if (walletType === WalletType.METAMASK) {
        const accounts = await connectToMetamask();
        return accounts.length > 0;
      } else if (walletType === WalletType.WALLETCONNECT) {
        await openWalletConnectModal();
        // Note: WalletConnect connection status is updated asynchronously
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Failed to connect to ${walletType}:`, error);
      return false;
    }
  };

  // Disconnect from all wallets
  const disconnectAllWallets = () => {
    if (metamaskContext.isConnected) {
      metamaskWallet.disconnect();
    }
    if (walletConnectContext.isConnected) {
      walletConnectWallet.disconnect();
    }
  };

  // Disconnect from a specific wallet
  const disconnectWallet = (walletType: WalletType) => {
    if (walletType === WalletType.METAMASK) {
      metamaskWallet.disconnect();
    } else if (walletType === WalletType.WALLETCONNECT) {
      walletConnectWallet.disconnect();
    }
  };

  return {
    // Connection status
    isAnyWalletConnected,
    metamask: metamaskContext,
    walletConnect: walletConnectContext,
    
    // Current wallet info
    getConnectedWalletType,
    getCurrentAccount,
    getCurrentWallet,
    
    // Connection methods
    connectWallet,
    disconnectWallet,
    disconnectAllWallets,
    
    // Wallet interfaces
    metamaskWallet,
    walletConnectWallet,
  };
};