// import { createContext, useState, ReactNode } from "react";
// import { MetamaskContextType } from '../types/wallet';

// interface MetamaskContextType {
//   metamaskAccountAddress: string;
//   setMetamaskAccountAddress: (newValue: string) => void;
// }

// const defaultValue: MetamaskContextType = {
//   metamaskAccountAddress: '',
//   setMetamaskAccountAddress: (newValue: string) => { console.log(newValue) }
// }

// //export const MetamaskContext = createContext(defaultValue);
// export const MetamaskContext = createContext<MetamaskContextType>({
//   metamaskAccountAddress: null,
//   isMetamaskConnected: false,
// });

// interface MetamaskContextProviderProps {
//   children: ReactNode;
// }

// export const MetamaskContextProvider = ({ children }: MetamaskContextProviderProps) => {
//   const [metamaskAccountAddress, setMetamaskAccountAddress] = useState(defaultValue.metamaskAccountAddress);

//   return (
//     <MetamaskContext.Provider
//       value={{
//         metamaskAccountAddress,
//         setMetamaskAccountAddress
//       }}
//     >
//       {children}
//     </MetamaskContext.Provider>
//   )
// }

import { createContext, useState, ReactNode } from "react";
import { MetamaskContextType } from '../types/wallet';

const defaultValue: MetamaskContextType = {
  metamaskAccountAddress: '',
  setMetamaskAccountAddress: () => {},
  isMetamaskConnected: false,
}

export const MetamaskContext = createContext<MetamaskContextType>(defaultValue);

interface MetamaskContextProviderProps {
  children: ReactNode;
}

export const MetamaskContextProvider = ({ children }: MetamaskContextProviderProps) => {
  const [metamaskAccountAddress, setMetamaskAccountAddress] = useState<string>('');
  const [isMetamaskConnected, setIsMetamaskConnected] = useState<boolean>(false);

  const connectMetamask = async (): Promise<void> => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        setMetamaskAccountAddress(accounts[0]);
        setIsMetamaskConnected(true);
      } else {
        throw new Error('MetaMask is not installed');
      }
    } catch (error) {
      console.error('Failed to connect MetaMask:', error);
      throw error;
    }
  };

  const disconnectMetamask = (): void => {
    setMetamaskAccountAddress('');
    setIsMetamaskConnected(false);
  };

  return (
    <MetamaskContext.Provider
      value={{
        metamaskAccountAddress,
        setMetamaskAccountAddress,
        isMetamaskConnected,
        connectMetamask,
        disconnectMetamask,
      }}
    >
      {children}
    </MetamaskContext.Provider>
  );
};