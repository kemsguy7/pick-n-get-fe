'use client';

import { ReactNode } from "react"
import { MetamaskContextProvider } from "../../contexts/MetamaskContext"
import { WalletConnectContextProvider } from "../../contexts/WalletConnectContext"
import { MetaMaskClient } from "./metamask/metamaskClient"
import { WalletConnectClient } from "./walletconnect/walletConnectClient"



interface AllWalletsProviderProps {
  children: ReactNode;
}

export const AllWalletsProvider = ({ children }: AllWalletsProviderProps) => {
  return (
    <MetamaskContextProvider>
      <WalletConnectContextProvider>
        <MetaMaskClient />
        <WalletConnectClient />
        {children}
      </WalletConnectContextProvider>
    </MetamaskContextProvider>
  )
}