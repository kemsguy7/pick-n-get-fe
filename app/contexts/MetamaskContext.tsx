'use client';

import { createContext, useState, ReactNode } from "react";

interface MetamaskContextType {
  metamaskAccountAddress: string;
  setMetamaskAccountAddress: (newValue: string) => void;
  isConnected: boolean;
  setIsConnected: (newValue: boolean) => void;
}

const defaultValue: MetamaskContextType = {
  metamaskAccountAddress: '',
  setMetamaskAccountAddress: (newValue: string) => { },
  isConnected: false,
  setIsConnected: (newValue: boolean) => { },
}

export const MetamaskContext = createContext<MetamaskContextType>(defaultValue);

export const MetamaskContextProvider = (props: { children: ReactNode | undefined }) => {
  const [metamaskAccountAddress, setMetamaskAccountAddress] = useState(defaultValue.metamaskAccountAddress);
  const [isConnected, setIsConnected] = useState(defaultValue.isConnected);

  // Auto-update connection status when account address changes
  const handleSetMetamaskAccountAddress = (newValue: string) => {
    setMetamaskAccountAddress(newValue);
    setIsConnected(newValue !== '');
  };

  return (
    <MetamaskContext.Provider
      value={{
        metamaskAccountAddress,
        setMetamaskAccountAddress: handleSetMetamaskAccountAddress,
        isConnected,
        setIsConnected
      }}
    >
      {props.children}
    </MetamaskContext.Provider>
  )
}