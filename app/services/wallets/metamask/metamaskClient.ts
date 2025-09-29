import { ContractId, AccountId } from "@hashgraph/sdk";
import { TokenId } from "@hashgraph/sdk";
import { ethers } from "ethers";
import { useContext, useEffect } from "react";
import { appConfig } from "../../../config";
import { MetamaskContext } from "../../../contexts/MetamaskContext";
import { ContractFunctionParameterBuilder } from "../contractFunctionParameterBuilder";
import { WalletInterface } from "../walletInterface";

const currentNetworkConfig = appConfig.networks.testnet;

export const switchToHederaNetwork = async (ethereum: any) => {
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: currentNetworkConfig.chainId }] // chainId must be in hexadecimal numbers
    });
  } catch (error: any) {
    if (error.code === 4902) {
      try {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainName: `Hedera (${currentNetworkConfig.network})`,
              chainId: currentNetworkConfig.chainId,
              nativeCurrency: {
                name: 'HBAR',
                symbol: 'HBAR',
                decimals: 18
              },
              rpcUrls: [currentNetworkConfig.jsonRpcUrl]
            },
          ],
        });
      } catch (addError) {
        console.error(addError);
      }
    }
    console.error(error);
  }
}

// FIXED: Move window access inside functions, not at module level
const getProvider = () => {
  if (typeof window === 'undefined') {
    throw new Error("This function can only be called in the browser environment");
  }
  
  const { ethereum } = window as any;
  if (!ethereum) {
    throw new Error("Metamask is not installed! Go install the extension!");
  }

  return new ethers.providers.Web3Provider(ethereum);
}

// returns a list of accounts
// otherwise empty array
export const connectToMetamask = async () => {
  // FIXED: Add client-side check
  if (typeof window === 'undefined') {
    console.warn('MetaMask can only be accessed in the browser');
    return [];
  }

  try {
    const { ethereum } = window as any;
    if (!ethereum) {
      alert("Metamask is not installed! Please install the MetaMask extension.");
      return [];
    }

    const provider = getProvider();
    let accounts: string[] = []

    await switchToHederaNetwork(ethereum);
    accounts = await provider.send("eth_requestAccounts", []);
    
    return accounts;
  } catch (error: any) {
    if (error.code === 4001) {
      // EIP-1193 userRejectedRequest error
      console.warn("Please connect to Metamask.");
    } else {
      console.error('Error connecting to MetaMask:', error);
    }
    return [];
  }
}

class MetaMaskWallet implements WalletInterface {
  private convertAccountIdToSolidityAddress(accountId: AccountId): string {
    const accountIdString = accountId.evmAddress !== null
      ? accountId.evmAddress.toString()
      : accountId.toSolidityAddress();

    return `0x${accountIdString}`;
  }

  // Purpose: Transfer HBAR
  // Returns: Promise<string>
  // Note: Use JSON RPC Relay to search by transaction hash
  async transferHBAR(toAddress: AccountId, amount: number) {
    const provider = getProvider();
    const signer = await provider.getSigner();
    // build the transaction
    const tx = await signer.populateTransaction({
      to: this.convertAccountIdToSolidityAddress(toAddress),
      value: ethers.utils.parseEther(amount.toString()),
    });
    try {
      // send the transaction
      const { hash } = await signer.sendTransaction(tx);
      await provider.waitForTransaction(hash);

      return hash;
    } catch (error: any) {
      console.warn(error.message ? error.message : error);
      return null;
    }
  }

  async transferFungibleToken(toAddress: AccountId, tokenId: TokenId, amount: number) {
    const hash = await this.executeContractFunction(
      ContractId.fromString(tokenId.toString()),
      'transfer',
      new ContractFunctionParameterBuilder()
        .addParam({
          type: "address",
          name: "recipient",
          value: this.convertAccountIdToSolidityAddress(toAddress)
        })
        .addParam({
          type: "uint256",
          name: "amount",
          value: amount
        }),
      appConfig.constants.METAMASK_GAS_LIMIT_TRANSFER_FT
    );

    return hash;
  }

  async transferNonFungibleToken(toAddress: AccountId, tokenId: TokenId, serialNumber: number) {
    const provider = getProvider();
    const addresses = await provider.listAccounts();
    const hash = await this.executeContractFunction(
      ContractId.fromString(tokenId.toString()),
      'transferFrom',
      new ContractFunctionParameterBuilder()
        .addParam({
          type: "address",
          name: "from",
          value: addresses[0]
        })
        .addParam({
          type: "address",
          name: "to",
          value: this.convertAccountIdToSolidityAddress(toAddress)
        })
        .addParam({
          type: "uint256",
          name: "nftId",
          value: serialNumber
        }),
      appConfig.constants.METAMASK_GAS_LIMIT_TRANSFER_NFT
    );

    return hash;
  }

  async associateToken(tokenId: TokenId) {
    // send the transaction
    // convert tokenId to contract id
    const hash = await this.executeContractFunction(
      ContractId.fromString(tokenId.toString()),
      'associate',
      new ContractFunctionParameterBuilder(),
      appConfig.constants.METAMASK_GAS_LIMIT_ASSOCIATE
    );

    return hash;
  }

  // Purpose: build contract execute transaction and send to hashconnect for signing and execution
  // Returns: Promise<TransactionId | null>
  async executeContractFunction(contractId: ContractId, functionName: string, functionParameters: ContractFunctionParameterBuilder, gasLimit: number) {
    const provider = getProvider();
    const signer = await provider.getSigner();
    const abi = [
      `function ${functionName}(${functionParameters.buildAbiFunctionParams()})`
    ];

    // create contract instance for the contract id
    // to call the function, use contract[functionName](...functionParameters, ethersOverrides)
    const contract = new ethers.Contract(`0x${contractId.toSolidityAddress()}`, abi, signer);
    try {
      const txResult = await contract[functionName](
        ...functionParameters.buildEthersParams(),
        {
          gasLimit: gasLimit === -1 ? undefined : gasLimit
        }
      );
      return txResult.hash;
    } catch (error: any) {
      console.warn(error.message ? error.message : error);
      return null;
    }
  }

  disconnect() {
    alert("Please disconnect using the Metamask extension.")
  }
};

export const metamaskWallet = new MetaMaskWallet();

export const MetaMaskClient = () => {
  const { setMetamaskAccountAddress } = useContext(MetamaskContext);
  
  useEffect(() => {
    // FIXED: Only run on client side
    if (typeof window === 'undefined') return;
    
    // set the account address if already connected
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        console.log('MetaMask not detected');
        return;
      }

      const provider = getProvider();
      provider.listAccounts().then((signers) => {
        if (signers.length !== 0) {
          setMetamaskAccountAddress(signers[0]);
        } else {
          setMetamaskAccountAddress("");
        }
      });

      // listen for account changes and update the account address
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length !== 0) {
          setMetamaskAccountAddress(accounts[0]);
        } else {
          setMetamaskAccountAddress("");
        }
      };

      ethereum.on("accountsChanged", handleAccountsChanged);

      // cleanup by removing listeners
      return () => {
        if (ethereum?.removeListener) {
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
      }
    } catch (error: any) {
      console.error('MetaMask client error:', error.message ? error.message : error);
    }
  }, [setMetamaskAccountAddress]);

  return null;
}


// import { useContext, useEffect } from "react";
// import { MetamaskContext } from "../../../contexts/MetamaskContext";

// // Move all imports that might cause SSR issues inside functions
// const currentNetworkConfig = typeof window !== 'undefined' ? 
//   require("../../../config").appConfig.networks.testnet : null;

// // Detect MetaMask specifically (not Rabby or other wallets)
// const getMetaMaskProvider = () => {
//   if (typeof window === 'undefined') return null;
  
//   const { ethereum } = window as any;
  
//   if (!ethereum) return null;
  
//   // If there are multiple wallets, find MetaMask specifically
//   if (ethereum.providers) {
//     return ethereum.providers.find((provider: any) => provider.isMetaMask && !provider.isRabby);
//   }
  
//   // Single provider case - make sure it's MetaMask and not Rabby
//   if (ethereum.isMetaMask && !ethereum.isRabby) {
//     return ethereum;
//   }
  
//   return null;
// };

// export const switchToHederaNetwork = async (ethereum: any) => {
//   if (!currentNetworkConfig) return;
  
//   try {
//     await ethereum.request({
//       method: 'wallet_switchEthereumChain',
//       params: [{ chainId: currentNetworkConfig.chainId }]
//     });
//   } catch (error: any) {
//     if (error.code === 4902) {
//       try {
//         await ethereum.request({
//           method: 'wallet_addEthereumChain',
//           params: [
//             {
//               chainName: `Hedera (${currentNetworkConfig.network})`,
//               chainId: currentNetworkConfig.chainId,
//               nativeCurrency: {
//                 name: 'HBAR',
//                 symbol: 'HBAR',
//                 decimals: 18
//               },
//               rpcUrls: [currentNetworkConfig.jsonRpcUrl]
//             },
//           ],
//         });
//       } catch (addError) {
//         console.error(addError);
//       }
//     }
//     console.error(error);
//   }
// }

// const getProvider = () => {
//   if (typeof window === 'undefined') {
//     throw new Error("This function can only be called in the browser environment");
//   }
  
//   const ethereum = getMetaMaskProvider();
//   if (!ethereum) {
//     throw new Error("MetaMask is not installed! Please install the MetaMask extension.");
//   }

//   // Dynamically import ethers only when needed
//   const { ethers } = require("ethers");
//   return new ethers.providers.Web3Provider(ethereum);
// }

// // Main connection function with proper state updates
// export const connectToMetamask = async () => {
//   if (typeof window === 'undefined') {
//     console.warn('MetaMask can only be accessed in the browser');
//     return [];
//   }

//   try {
//     const ethereum = getMetaMaskProvider();
//     if (!ethereum) {
//       alert("MetaMask is not installed or detected! Please install the MetaMask extension.");
//       return [];
//     }

//     console.log('Connecting to MetaMask...'); // Debug log
    
//     const provider = getProvider();
//     await switchToHederaNetwork(ethereum);
//     const accounts = await provider.send("eth_requestAccounts", []);
    
//     console.log('MetaMask connected successfully:', accounts); // Debug log
    
//     // Force update the context immediately after connection
//     if (accounts && accounts.length > 0) {
//       // Dispatch a custom event to trigger state update
//       window.dispatchEvent(new CustomEvent('metamask-connected', { 
//         detail: { account: accounts[0] } 
//       }));
//     }
    
//     return accounts;
//   } catch (error: any) {
//     if (error.code === 4001) {
//       console.warn("User rejected the connection request");
//     } else {
//       console.error('Error connecting to MetaMask:', error);
//     }
//     return [];
//   }
// }

// // Lazy loading for heavy imports
// const createMetaMaskWallet = () => {
//   // Import SDK components only when needed
//   const { ContractId, AccountId, TokenId } = require("@hashgraph/sdk");
//   const { ethers } = require("ethers");
//   const { ContractFunctionParameterBuilder } = require("../contractFunctionParameterBuilder");
//   const { appConfig } = require("../../../config");

//   class MetaMaskWallet {
//     private convertAccountIdToSolidityAddress(accountId: any): string {
//       const accountIdString = accountId.evmAddress !== null
//         ? accountId.evmAddress.toString()
//         : accountId.toSolidityAddress();

//       return `0x${accountIdString}`;
//     }

//     async transferHBAR(toAddress: any, amount: number) {
//       const provider = getProvider();
//       const signer = await provider.getSigner();
//       const tx = await signer.populateTransaction({
//         to: this.convertAccountIdToSolidityAddress(toAddress),
//         value: ethers.utils.parseEther(amount.toString()),
//       });
//       try {
//         const { hash } = await signer.sendTransaction(tx);
//         await provider.waitForTransaction(hash);
//         return hash;
//       } catch (error: any) {
//         console.warn(error.message ? error.message : error);
//         return null;
//       }
//     }

//     async transferFungibleToken(toAddress: any, tokenId: any, amount: number) {
//       const hash = await this.executeContractFunction(
//         ContractId.fromString(tokenId.toString()),
//         'transfer',
//         new ContractFunctionParameterBuilder()
//           .addParam({
//             type: "address",
//             name: "recipient",
//             value: this.convertAccountIdToSolidityAddress(toAddress)
//           })
//           .addParam({
//             type: "uint256",
//             name: "amount",
//             value: amount
//           }),
//         appConfig.constants.METAMASK_GAS_LIMIT_TRANSFER_FT
//       );
//       return hash;
//     }

//     async transferNonFungibleToken(toAddress: any, tokenId: any, serialNumber: number) {
//       const provider = getProvider();
//       const addresses = await provider.listAccounts();
//       const hash = await this.executeContractFunction(
//         ContractId.fromString(tokenId.toString()),
//         'transferFrom',
//         new ContractFunctionParameterBuilder()
//           .addParam({
//             type: "address",
//             name: "from",
//             value: addresses[0]
//           })
//           .addParam({
//             type: "address",
//             name: "to",
//             value: this.convertAccountIdToSolidityAddress(toAddress)
//           })
//           .addParam({
//             type: "uint256",
//             name: "nftId",
//             value: serialNumber
//           }),
//         appConfig.constants.METAMASK_GAS_LIMIT_TRANSFER_NFT
//       );
//       return hash;
//     }

//     async associateToken(tokenId: any) {
//       const hash = await this.executeContractFunction(
//         ContractId.fromString(tokenId.toString()),
//         'associate',
//         new ContractFunctionParameterBuilder(),
//         appConfig.constants.METAMASK_GAS_LIMIT_ASSOCIATE
//       );
//       return hash;
//     }

//     async executeContractFunction(contractId: any, functionName: string, functionParameters: any, gasLimit: number) {
//       const provider = getProvider();
//       const signer = await provider.getSigner();
//       const abi = [
//         `function ${functionName}(${functionParameters.buildAbiFunctionParams()})`
//       ];

//       const contract = new (require("ethers")).Contract(`0x${contractId.toSolidityAddress()}`, abi, signer);
//       try {
//         const txResult = await contract[functionName](
//           ...functionParameters.buildEthersParams(),
//           {
//             gasLimit: gasLimit === -1 ? undefined : gasLimit
//           }
//         );
//         return txResult.hash;
//       } catch (error: any) {
//         console.warn(error.message ? error.message : error);
//         return null;
//       }
//     }

//     disconnect() {
//       // Clear the context state when disconnecting
//       window.dispatchEvent(new CustomEvent('metamask-disconnected'));
//       alert("Please disconnect using the MetaMask extension.")
//     }
//   }

//   return new MetaMaskWallet();
// };

// // Create wallet instance lazily
// export const getMetamaskWallet = () => {
//   if (typeof window === 'undefined') return null;
//   return createMetaMaskWallet();
// };

// export const MetaMaskClient = () => {
//   const { setMetamaskAccountAddress } = useContext(MetamaskContext);
  
//   useEffect(() => {
//     if (typeof window === 'undefined') return;
    
//     const ethereum = getMetaMaskProvider();
//     if (!ethereum) {
//       console.log('MetaMask not detected');
//       return;
//     }

//     // Function to update account state
//     const updateAccounts = async (accounts: string[]) => {
//       console.log('Updating accounts:', accounts); // Debug log
//       if (accounts.length !== 0) {
//         setMetamaskAccountAddress(accounts[0]);
//       } else {
//         setMetamaskAccountAddress("");
//       }
//     };

//     // Check for existing connections
//     const checkConnection = async () => {
//       try {
//         const provider = getProvider();
//         const accounts = await provider.listAccounts();
//         await updateAccounts(accounts);
//       } catch (error) {
//         console.log('No existing MetaMask connection');
//         setMetamaskAccountAddress("");
//       }
//     };

//     // Listen for account changes from MetaMask
//     const handleAccountsChanged = (accounts: string[]) => {
//       console.log('MetaMask accounts changed:', accounts); // Debug log
//       updateAccounts(accounts);
//     };

//     // Listen for custom connection events
//     const handleCustomConnect = (event: CustomEvent) => {
//       console.log('Custom connect event:', event.detail); // Debug log
//       setMetamaskAccountAddress(event.detail.account);
//     };

//     const handleCustomDisconnect = () => {
//       console.log('Custom disconnect event'); // Debug log
//       setMetamaskAccountAddress("");
//     };

//     // Set up event listeners
//     ethereum.on("accountsChanged", handleAccountsChanged);
//     window.addEventListener('metamask-connected', handleCustomConnect as EventListener);
//     window.addEventListener('metamask-disconnected', handleCustomDisconnect);

//     // Check initial connection
//     checkConnection();

//     // Cleanup
//     return () => {
//       if (ethereum?.removeListener) {
//         ethereum.removeListener("accountsChanged", handleAccountsChanged);
//       }
//       window.removeEventListener('metamask-connected', handleCustomConnect as EventListener);
//       window.removeEventListener('metamask-disconnected', handleCustomDisconnect);
//     }
//   }, [setMetamaskAccountAddress]);

//   return null;
// }