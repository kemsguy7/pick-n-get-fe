import { ContractId, AccountId } from '@hashgraph/sdk';
import { TokenId } from '@hashgraph/sdk';
import { ethers } from 'ethers';
import { useContext, useEffect } from 'react';
import { appConfig } from '../../../config';
import { MetamaskContext } from '../../../contexts/MetamaskContext';
import { ContractFunctionParameterBuilder } from '../contractFunctionParameterBuilder';
import { WalletInterface } from '../walletInterface';

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on(event: 'accountsChanged', handler: (accounts: string[]) => void): void;
  on(event: string, handler: (...args: unknown[]) => void): void;
  removeListener?(event: 'accountsChanged', handler: (accounts: string[]) => void): void;
  removeListener?(event: string, handler: (...args: unknown[]) => void): void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}
const currentNetworkConfig = appConfig.networks.testnet;

export const switchToHederaNetwork = async (ethereum: EthereumProvider) => {
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: currentNetworkConfig.chainId }], // chainId must be in hexadecimal numbers
    });
  } catch (error) {
    const err = error as { code?: number };
    if (err.code === 4902) {
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
                decimals: 18,
              },
              rpcUrls: [currentNetworkConfig.jsonRpcUrl],
            },
          ],
        });
      } catch (addError) {
        console.error(addError);
      }
    }
    console.error(error);
  }
};

// Move window access inside functions, not at module level
const getProvider = () => {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be called in the browser environment');
  }
  const { ethereum } = window;
  if (!ethereum) {
    throw new Error('Metamask is not installed! Go install the extension!');
  }

  return new ethers.providers.Web3Provider(ethereum);
};

// returns a list of accounts
// otherwise empty array
export const connectToMetamask = async () => {
  // FIXED: Add client-side check
  if (typeof window === 'undefined') {
    console.warn('MetaMask can only be accessed in the browser');
    return [];
  }

  try {
    const { ethereum } = window;
    if (!ethereum) {
      alert('Metamask is not installed! Please install the MetaMask extension.');
      return [];
    }

    const provider = getProvider();
    let accounts: string[] = [];

    await switchToHederaNetwork(ethereum);
    accounts = await provider.send('eth_requestAccounts', []);

    return accounts;
  } catch (error) {
    const err = error as { code?: number };
    if (err.code === 4001) {
      // EIP-1193 userRejectedRequest error
      console.warn('Please connect to Metamask.');
    } else {
      console.error('Error connecting to MetaMask:', error);
    }
    return [];
  }
};

class MetaMaskWallet implements WalletInterface {
  private convertAccountIdToSolidityAddress(accountId: AccountId): string {
    const accountIdString =
      accountId.evmAddress !== null
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
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(message);
      return null;
    }
  }

  async transferFungibleToken(toAddress: AccountId, tokenId: TokenId, amount: number) {
    const hash = await this.executeContractFunction(
      ContractId.fromString(tokenId.toString()),
      'transfer',
      new ContractFunctionParameterBuilder()
        .addParam({
          type: 'address',
          name: 'recipient',
          value: this.convertAccountIdToSolidityAddress(toAddress),
        })
        .addParam({
          type: 'uint256',
          name: 'amount',
          value: amount,
        }),
      appConfig.constants.METAMASK_GAS_LIMIT_TRANSFER_FT,
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
          type: 'address',
          name: 'from',
          value: addresses[0],
        })
        .addParam({
          type: 'address',
          name: 'to',
          value: this.convertAccountIdToSolidityAddress(toAddress),
        })
        .addParam({
          type: 'uint256',
          name: 'nftId',
          value: serialNumber,
        }),
      appConfig.constants.METAMASK_GAS_LIMIT_TRANSFER_NFT,
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
      appConfig.constants.METAMASK_GAS_LIMIT_ASSOCIATE,
    );

    return hash;
  }

  // Purpose: build contract execute transaction and send to metamask for signing and execution
  // Returns: Promise<string | null>
  async executeContractFunction(
    contractId: ContractId,
    functionName: string,
    functionParameters: ContractFunctionParameterBuilder,
    gasLimit: number,
    payableAmount?: string | number,
  ) {
    const provider = getProvider();
    const signer = await provider.getSigner();
    const abi = [`function ${functionName}(${functionParameters.buildAbiFunctionParams()})`];

    const contract = new ethers.Contract(`0x${contractId.toEvmAddress()}`, abi, signer);
    try {
      const ethersOverrides: { gasLimit?: number; value?: ethers.BigNumber } = {
        gasLimit: gasLimit === -1 ? undefined : gasLimit,
      };

      //FIX: Handle HBAR payment correctly
      if (payableAmount !== undefined && payableAmount !== null) {
        let valueInTinybars: string;

        if (typeof payableAmount === 'string') {
          // Already in tinybars as string
          valueInTinybars = payableAmount;
        } else {
          // Convert HBAR to tinybars (1 HBAR = 100,000,000 tinybars)
          valueInTinybars = Math.floor(payableAmount * 1e8).toString();
        }

        console.log(`💰 Payment details:`);
        console.log(`   - Amount: ${Number(valueInTinybars) / 1e8} HBAR`);
        console.log(`   - Tinybars: ${valueInTinybars}`);

        // ✅ Use tinybars directly (Hedera uses 8 decimals, not 18 like Ethereum)
        ethersOverrides.value = ethers.BigNumber.from(valueInTinybars);
      }

      const txResult = await contract[functionName](
        ...functionParameters.buildEthersParams(),
        ethersOverrides,
      );

      console.log(`✅ Transaction submitted: ${txResult.hash}`);

      // Wait for transaction confirmation
      console.log(`⏳ Waiting for confirmation...`);
      await provider.waitForTransaction(txResult.hash);
      console.log(`✅ Transaction confirmed!`);

      return txResult.hash;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('❌ MetaMask execution error:', message);
      console.error('Full error:', error);
      return null;
    }
  }

  disconnect() {
    alert('Please disconnect using the Metamask extension.');
  }
}

export const metamaskWallet = new MetaMaskWallet();

export const MetaMaskClient = () => {
  const { setMetamaskAccountAddress } = useContext(MetamaskContext);

  useEffect(() => {
    // FIXED: Only run on client side
    if (typeof window === 'undefined') return;

    // set the account address if already connected
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log('MetaMask not detected');
        return;
      }

      const provider = getProvider();
      provider.listAccounts().then((signers) => {
        if (signers.length !== 0) {
          setMetamaskAccountAddress(signers[0]);
        } else {
          setMetamaskAccountAddress('');
        }
      });

      // listen for account changes and update the account address
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length !== 0) {
          setMetamaskAccountAddress(accounts[0]);
        } else {
          setMetamaskAccountAddress('');
        }
      };

      ethereum.on('accountsChanged', handleAccountsChanged);

      // cleanup by removing listeners
      return () => {
        if (ethereum?.removeListener) {
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('MetaMask client error:', message);
    }
  }, [setMetamaskAccountAddress]);

  return null;
};
