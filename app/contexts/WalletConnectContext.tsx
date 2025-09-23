'use client';

import { createContext, useState, ReactNode } from "react";

interface WalletConnectContextType {
  accountId: string;
  setAccountId: (newValue: string) => void;
  isConnected: boolean;
  setIsConnected: (newValue: boolean) => void;
}

const defaultValue: WalletConnectContextType = {
  accountId: '',
  setAccountId: (newValue: string) => { },
  isConnected: false,
  setIsConnected: (newValue: boolean) => { },
}

export const WalletConnectContext = createContext<WalletConnectContextType>(defaultValue);

export const WalletConnectContextProvider = (props: { children: ReactNode | undefined }) => {
  const [accountId, setAccountId] = useState(defaultValue.accountId);
  const [isConnected, setIsConnected] = useState(defaultValue.isConnected);

  // Auto-update connection status when account ID changes
  const handleSetAccountId = (newValue: string) => {
    setAccountId(newValue);
    setIsConnected(newValue !== '');
  };

  return (
    <WalletConnectContext.Provider
      value={{
        accountId,
        setAccountId: handleSetAccountId,
        isConnected,
        setIsConnected
      }}
    >
      {props.children}
    </WalletConnectContext.Provider>
  )
}