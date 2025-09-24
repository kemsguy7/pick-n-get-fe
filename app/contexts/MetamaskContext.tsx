// import { createContext, ReactNode, useState } from "react";

// const defaultValue = {
//   metamaskAccountAddress: '',
//   setMetamaskAccountAddress: (newValue: string) => { },
// }

// export const MetamaskContext = createContext(defaultValue)

// export const MetamaskContextProvider = (props: { children: ReactNode | undefined }) => {
//   const [metamaskAccountAddress, setMetamaskAccountAddress] = useState('')

//   return (
//     <MetamaskContext.Provider
//       value={{
//         metamaskAccountAddress,
//         setMetamaskAccountAddress
//       }}
//     >
//       {props.children}
//     </MetamaskContext.Provider>
//   )
// }

import { createContext, useState, ReactNode } from "react";

interface MetamaskContextType {
  metamaskAccountAddress: string;
  setMetamaskAccountAddress: (newValue: string) => void;
}

const defaultValue: MetamaskContextType = {
  metamaskAccountAddress: '',
  setMetamaskAccountAddress: (newValue: string) => { },
}

export const MetamaskContext = createContext(defaultValue);

interface MetamaskContextProviderProps {
  children: ReactNode;
}

export const MetamaskContextProvider = ({ children }: MetamaskContextProviderProps) => {
  const [metamaskAccountAddress, setMetamaskAccountAddress] = useState(defaultValue.metamaskAccountAddress);

  return (
    <MetamaskContext.Provider
      value={{
        metamaskAccountAddress,
        setMetamaskAccountAddress
      }}
    >
      {children}
    </MetamaskContext.Provider>
  )
}