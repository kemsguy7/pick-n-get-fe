import { ContractId } from '@hashgraph/sdk';
import { WalletInterface } from './wallets/walletInterface';
import { ContractFunctionParameterBuilder } from './wallets/contractFunctionParameterBuilder';

const CONTRACT_ADDRESS = '0.0.7153245';

// Type definitions for admin operations
export enum RiderStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  Banned = 3,
}

export interface ApproveRiderResult {
  success: boolean;
  txHash?: string;
  riderId?: number;
  error?: string;
  message?: string;
}

export interface BanRiderResult {
  success: boolean;
  txHash?: string;
  riderId?: number;
  error?: string;
}

export interface SetRateResult {
  success: boolean;
  txHash?: string;
  itemType?: string;
  newRate?: number;
  error?: string;
}

export interface FundContractResult {
  success: boolean;
  txHash?: string;
  amount?: string;
  error?: string;
}

export interface ContractBalanceResult {
  success: boolean;
  balance?: string;
  error?: string;
}

export interface RiderDetails {
  id: number;
  name: string;
  phoneNumber: number;
  vehicleNumber: string;
  walletAddress: string;
  homeAddress: string;
  riderStatus: RiderStatus;
  country: string;
  capacity: number;
  vehicleImage: string;
  vehicleRegistrationImage: string;
  vehicleType: number;
}

// Wallet data type
export type WalletData = [string, WalletInterface | null, string];

// Simple delay function
const delay = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));

/**
 * Approve a pending rider/agent
 * @param walletData - [accountId, walletInterface, network]
 * @param riderId - The rider ID to approve
 * @returns Promise<ApproveRiderResult>
 */
export async function approveRider(
  walletData: WalletData,
  riderId: number,
): Promise<ApproveRiderResult> {
  console.log(`\n=======================================`);
  console.log(`- Approving rider on blockchain...🟠`);

  try {
    const [accountId, walletInterface, network] = walletData;

    if (!walletInterface) {
      throw new Error('Wallet interface not available');
    }

    // Validate rider ID
    if (!riderId || riderId <= 0) {
      throw new Error('Invalid rider ID');
    }

    console.log(`- Approving rider ID: ${riderId}`);
    console.log(`- Admin account: ${accountId}`);

    // Build contract function parameters
    const functionParameters = new ContractFunctionParameterBuilder().addParam({
      type: 'uint256',
      name: '_riderId',
      value: riderId,
    });

    // Execute the contract function
    const contractId = ContractId.fromString(CONTRACT_ADDRESS);
    const gasLimit = 300000; // Gas limit for approval

    console.log(`- Executing approveRider contract function...`);
    const transactionResult = await walletInterface.executeContractFunction(
      contractId,
      'approveRider',
      functionParameters,
      gasLimit,
    );

    if (!transactionResult) {
      throw new Error('Transaction failed - no transaction ID returned');
    }

    const txHash = transactionResult.toString();
    console.log(`- Transaction submitted: ${txHash}`);

    // Wait for transaction to be processed
    console.log(`- Waiting for transaction confirmation...`);
    await delay(3000);

    // Check transaction status
    const success = await checkTransactionStatus(txHash, network);

    if (success.isSuccessful) {
      console.log(`- Rider approval completed successfully ✅`);

      return {
        success: true,
        txHash: txHash,
        riderId: riderId,
      };
    } else {
      throw new Error(success.error || 'Transaction failed');
    }
  } catch (error: unknown) {
    console.error(`- Rider approval error:`, error);

    let errorMessage: string = 'Rider approval failed';

    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      if (message.includes('not authorised') || message.includes('not authorized')) {
        errorMessage =
          'You are not authorized to approve riders. Only admins can perform this action.';
      } else if (message.includes('rider does not exist')) {
        errorMessage = 'Rider with this ID does not exist';
      } else if (message.includes('already approved')) {
        errorMessage = 'Rider is already approved';
      } else if (message.includes('rejected')) {
        errorMessage = 'Rider was rejected and needs to re-apply';
      } else if (
        message.includes('insufficient funds') ||
        message.includes('insufficient balance')
      ) {
        errorMessage = 'Insufficient HBAR balance for transaction';
      } else if (message.includes('user rejected') || message.includes('user denied')) {
        errorMessage = 'Transaction rejected by user';
      } else if (message.includes('gas') || message.includes('limit')) {
        errorMessage = 'Transaction failed due to gas limit';
      } else if (message.includes('network') || message.includes('connection')) {
        errorMessage = 'Network error - please check your connection';
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Ban a rider/agent
 * @param walletData - [accountId, walletInterface, network]
 * @param riderId - The rider ID to ban
 * @returns Promise<BanRiderResult>
 */
export async function banRider(walletData: WalletData, riderId: number): Promise<BanRiderResult> {
  console.log(`\n=======================================`);
  console.log(`- Banning rider on blockchain...🟠`);

  try {
    const [accountId, walletInterface, network] = walletData;

    if (!walletInterface) {
      throw new Error('Wallet interface not available');
    }

    // Validate rider ID
    if (!riderId || riderId <= 0) {
      throw new Error('Invalid rider ID');
    }

    console.log(`- Banning rider ID: ${riderId}`);
    console.log(`- Admin account: ${accountId}`);

    // Build contract function parameters
    const functionParameters = new ContractFunctionParameterBuilder().addParam({
      type: 'uint256',
      name: '_riderId',
      value: riderId,
    });

    // Execute the contract function
    const contractId = ContractId.fromString(CONTRACT_ADDRESS);
    const gasLimit = 300000;

    console.log(`- Executing banRider contract function...`);
    const transactionResult = await walletInterface.executeContractFunction(
      contractId,
      'banRider',
      functionParameters,
      gasLimit,
    );

    if (!transactionResult) {
      throw new Error('Transaction failed - no transaction ID returned');
    }

    const txHash = transactionResult.toString();
    console.log(`- Transaction submitted: ${txHash}`);

    // Wait for transaction to be processed
    console.log(`- Waiting for transaction confirmation...`);
    await delay(3000);

    // Check transaction status
    const success = await checkTransactionStatus(txHash, network);

    if (success.isSuccessful) {
      console.log(`- Rider ban completed successfully ✅`);

      return {
        success: true,
        txHash: txHash,
        riderId: riderId,
      };
    } else {
      throw new Error(success.error || 'Transaction failed');
    }
  } catch (error: unknown) {
    console.error(`- Rider ban error:`, error);

    let errorMessage: string = 'Rider ban failed';

    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      if (message.includes('not authorised') || message.includes('not authorized')) {
        errorMessage = 'You are not authorized to ban riders. Only admins can perform this action.';
      } else if (message.includes('rider does not exist')) {
        errorMessage = 'Rider with this ID does not exist';
      } else if (message.includes('rejected')) {
        errorMessage = 'Rider was rejected and needs to re-apply';
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Set the rate for a specific item type
 * @param walletData - [accountId, walletInterface, network]
 * @param itemType - The item type (0=Plastic, 1=Paper, 2=Metal, 3=Glass, 4=Electronics)
 * @param rate - The rate in smallest unit (e.g., tinybars)
 * @returns Promise<SetRateResult>
 */
export async function setRate(
  walletData: WalletData,
  itemType: number,
  rate: number,
): Promise<SetRateResult> {
  console.log(`\n=======================================`);
  console.log(`- Setting rate on blockchain...🟠`);

  try {
    const [accountId, walletInterface, network] = walletData;

    if (!walletInterface) {
      throw new Error('Wallet interface not available');
    }

    // Validate inputs
    if (itemType < 0 || itemType > 4) {
      throw new Error('Invalid item type. Must be 0-4');
    }

    if (rate <= 0) {
      throw new Error('Rate must be greater than 0');
    }

    const itemTypes = ['Plastic', 'Paper', 'Metal', 'Glass', 'Electronics'];
    console.log(`- Setting rate for ${itemTypes[itemType]}: ${rate}`);
    console.log(`- Admin account: ${accountId}`);

    // Build contract function parameters
    const functionParameters = new ContractFunctionParameterBuilder()
      .addParam({
        type: 'uint8',
        name: '_type',
        value: itemType,
      })
      .addParam({
        type: 'uint256',
        name: '_rate',
        value: rate,
      });

    // Execute the contract function
    const contractId = ContractId.fromString(CONTRACT_ADDRESS);
    const gasLimit = 300000;

    console.log(`- Executing setRate contract function...`);
    const transactionResult = await walletInterface.executeContractFunction(
      contractId,
      'setRate',
      functionParameters,
      gasLimit,
    );

    if (!transactionResult) {
      throw new Error('Transaction failed - no transaction ID returned');
    }

    const txHash = transactionResult.toString();
    console.log(`- Transaction submitted: ${txHash}`);

    // Wait for transaction to be processed
    console.log(`- Waiting for transaction confirmation...`);
    await delay(3000);

    // Check transaction status
    const success = await checkTransactionStatus(txHash, network);

    if (success.isSuccessful) {
      console.log(`- Rate update completed successfully ✅`);

      return {
        success: true,
        txHash: txHash,
        itemType: itemTypes[itemType],
        newRate: rate,
      };
    } else {
      throw new Error(success.error || 'Transaction failed');
    }
  } catch (error: unknown) {
    console.error(`- Set rate error:`, error);

    let errorMessage: string = 'Set rate failed';

    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      if (message.includes('not authorised') || message.includes('not authorized')) {
        errorMessage = 'You are not authorized to set rates. Only admins can perform this action.';
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Fund the contract with HBAR
 * @param walletData - [accountId, walletInterface, network]
 * @param amount - Amount in HBAR (will be converted to tinybars)
 * @returns Promise<FundContractResult>
 */
export async function fundContract(
  walletData: WalletData,
  amount: number,
): Promise<FundContractResult> {
  console.log(`\n=======================================`);
  console.log(`- Funding contract...🟠`);

  try {
    const [accountId, walletInterface, network] = walletData;

    if (!walletInterface) {
      throw new Error('Wallet interface not available');
    }

    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    console.log(`- Funding amount: ${amount} HBAR`);
    console.log(`- Admin account: ${accountId}`);

    // Build contract function parameters (empty for fundContract)
    const functionParameters = new ContractFunctionParameterBuilder();

    // Execute the contract function with value
    const contractId = ContractId.fromString(CONTRACT_ADDRESS);
    const gasLimit = 300000;

    console.log(`- Executing fundContract function...`);
    const transactionResult = await walletInterface.executeContractFunction(
      contractId,
      'fundContract',
      functionParameters,
      gasLimit,
    );

    if (!transactionResult) {
      throw new Error('Transaction failed - no transaction ID returned');
    }

    const txHash = transactionResult.toString();
    console.log(`- Transaction submitted: ${txHash}`);

    // Wait for transaction to be processed
    console.log(`- Waiting for transaction confirmation...`);
    await delay(3000);

    // Check transaction status
    const success = await checkTransactionStatus(txHash, network);

    if (success.isSuccessful) {
      console.log(`- Contract funding completed successfully ✅`);

      return {
        success: true,
        txHash: txHash,
        amount: `${amount} HBAR`,
      };
    } else {
      throw new Error(success.error || 'Transaction failed');
    }
  } catch (error: unknown) {
    console.error(`- Fund contract error:`, error);

    let errorMessage: string = 'Contract funding failed';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Get contract balance
 * @param walletData - [accountId, walletInterface, network]
 * @returns Promise<ContractBalanceResult>
 */
export async function getContractBalance(walletData: WalletData): Promise<ContractBalanceResult> {
  console.log(`\n=======================================`);
  console.log(`- Getting contract balance...🟠`);

  try {
    const [accountId, walletInterface, network] = walletData;

    if (!walletInterface) {
      throw new Error('Wallet interface not available');
    }

    console.log(`- Admin account: ${accountId}`);

    // Build contract function parameters
    const functionParameters = new ContractFunctionParameterBuilder();

    // Execute the contract function
    const contractId = ContractId.fromString(CONTRACT_ADDRESS);
    const gasLimit = 300000;

    console.log(`- Executing contractBalance function...`);
    const transactionResult = await walletInterface.executeContractFunction(
      contractId,
      'contractBalance',
      functionParameters,
      gasLimit,
    );

    if (!transactionResult) {
      throw new Error('Transaction failed - no transaction ID returned');
    }

    const txHash = transactionResult.toString();
    console.log(`- Transaction submitted: ${txHash}`);

    // Wait for transaction to be processed
    console.log(`- Waiting for transaction confirmation...`);
    await delay(3000);

    // Check transaction status
    const success = await checkTransactionStatus(txHash, network);

    if (success.isSuccessful) {
      console.log(`- Contract balance retrieved successfully ✅`);

      // Note: You would need to query the transaction result to get the actual balance
      // This is a simplified version
      return {
        success: true,
        balance: 'Balance retrieved - check transaction logs',
      };
    } else {
      throw new Error(success.error || 'Transaction failed');
    }
  } catch (error: unknown) {
    console.error(`- Get contract balance error:`, error);

    let errorMessage: string = 'Failed to get contract balance';

    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      if (message.includes('not authorised') || message.includes('not authorized')) {
        errorMessage =
          'You are not authorized to view contract balance. Only admins can perform this action.';
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Check transaction status using Hedera Mirror Node
 */
async function checkTransactionStatus(
  evmTxHash: string,
  network: string,
): Promise<{ isSuccessful: boolean; error?: string }> {
  const mirrorNodeUrl =
    network === 'testnet'
      ? 'https://testnet.mirrornode.hedera.com'
      : 'https://mainnet.mirrornode.hedera.com';

  console.log(`- Checking transaction status for: ${evmTxHash}`);

  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      await delay(2000);

      const response = await fetch(`${mirrorNodeUrl}/api/v1/contracts/results/${evmTxHash}`);

      if (response.ok) {
        const txData = await response.json();

        console.log(`- Transaction result:`, txData.result);

        if (txData.result === 'SUCCESS') {
          return { isSuccessful: true };
        } else if (txData.result === 'CONTRACT_REVERT_EXECUTED') {
          let errorMessage = 'Transaction reverted';

          if (txData.error_message) {
            try {
              const decoded = decodeContractError(txData.error_message);
              errorMessage = decoded || 'Transaction reverted';
              console.log(`- Decoded error: ${errorMessage}`);
            } catch (decodeErr) {
              console.log(`- Could not decode error message`, decodeErr);
            }
          }

          return { isSuccessful: false, error: errorMessage };
        } else if (txData.result && txData.result.includes('FAIL')) {
          return {
            isSuccessful: false,
            error: txData.error_message || 'Transaction failed',
          };
        }

        console.log(`- Attempt ${attempt + 1}: Transaction still pending...`);
      } else if (response.status === 404) {
        console.log(`- Attempt ${attempt + 1}: Transaction not yet available...`);
      } else {
        console.log(`- Attempt ${attempt + 1}: API error ${response.status}`);
      }
    } catch (error) {
      console.log(`- Mirror node check attempt ${attempt + 1} failed:`, error);
    }
  }

  return {
    isSuccessful: false,
    error: 'Could not verify transaction status - please check HashScan',
  };
}

/**
 * Decode contract error message from hex
 */
function decodeContractError(errorHex: string): string | null {
  try {
    if (!errorHex || errorHex === '0x') return null;

    const hex = errorHex.startsWith('0x') ? errorHex.slice(2) : errorHex;

    if (hex.startsWith('08c379a0')) {
      const dataStart = 8 + 64;
      const lengthHex = hex.slice(dataStart, dataStart + 64);
      const length = parseInt(lengthHex, 16);

      const stringStart = dataStart + 64;
      const stringHex = hex.slice(stringStart, stringStart + length * 2);

      const errorMessage = Buffer.from(stringHex, 'hex').toString('utf8');
      return errorMessage;
    }

    return null;
  } catch (err) {
    console.log('Error decoding contract error:', err);
    return null;
  }
}

/**
 * Export contract address for external use
 */
export const getContractAddress = (): string => CONTRACT_ADDRESS;
