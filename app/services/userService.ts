import { ContractId } from '@hashgraph/sdk';
import { WalletInterface } from './wallets/walletInterface';
import { ContractFunctionParameterBuilder } from './wallets/contractFunctionParameterBuilder';

const CONTRACT_ADDRESS = '0.0.6879372';

// Type definitions
export interface UserData {
  name: string;
  homeAddress: string;
  phoneNumber: string;
}

export interface UserDetails {
  id: number;
  userAddress: string;
  homeAddress: string;
  phoneNumber: number;
  name: string;
}

export interface RegistrationResult {
  success: boolean;
  txHash?: string;
  userId?: number;
  error?: string;
}

export interface CheckRegistrationResult {
  isRegistered: boolean;
  userId?: number;
  userDetails?: UserDetails;
  error?: string;
}

interface MirrorNodeTransaction {
  result?: string;
  function_parameters?: string;
  error_message?: string;
}

// Updated wallet data type to work with your wallet interface
export type WalletData = [string, WalletInterface | null, string];

// Simple delay function
const delay = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));

/**
 * Register a new user on the blockchain using Hedera wallet interface
 * @param walletData - [accountId, walletInterface, network]
 * @param userData - { name, homeAddress, phoneNumber }
 * @returns Promise<RegistrationResult>
 */
export async function registerUser(
  walletData: WalletData,
  userData: UserData,
): Promise<RegistrationResult> {
  console.log(`\n=======================================`);
  console.log(`- Registering user on blockchain...🟠`);

  try {
    const [accountId, walletInterface, network] = walletData;

    if (!walletInterface) {
      throw new Error('Wallet interface not available');
    }

    // Validate phone number first
    const phoneNumber: number = parseInt(userData.phoneNumber);
    if (isNaN(phoneNumber) || phoneNumber < 0 || phoneNumber > 255) {
      throw new Error('User ID number must be between 0 and 255');
    }

    // FIRST: Check if user is already registered
    console.log(`- Checking existing registration...`);
    const existingRegistration = await checkUserRegistration(walletData);
    if (existingRegistration.isRegistered) {
      return {
        success: false,
        error: 'User already registered',
        userId: existingRegistration.userId,
      };
    }

    console.log(`- Registering new user: ${userData.name}`);
    console.log(`- Account ID: ${accountId}`);
    console.log(`- Address: ${userData.homeAddress}`);
    console.log(`- User ID: ${userData.phoneNumber}`);

    // Build contract function parameters
    const functionParameters = new ContractFunctionParameterBuilder()
      .addParam({
        type: 'string',
        name: '_address',
        value: userData.homeAddress,
      })
      .addParam({
        type: 'uint8',
        name: '_number',
        value: phoneNumber,
      })
      .addParam({
        type: 'string',
        name: '_name',
        value: userData.name,
      });

    // Execute the contract function using wallet interface
    const contractId = ContractId.fromString(CONTRACT_ADDRESS);
    const gasLimit = 300000;

    console.log(`- Executing contract function...`);
    const transactionResult = await walletInterface.executeContractFunction(
      contractId,
      'registerUser',
      functionParameters,
      gasLimit,
    );

    if (!transactionResult) {
      throw new Error('Transaction failed - no transaction ID returned');
    }

    const txHash = transactionResult.toString();
    console.log(`- Transaction submitted: ${txHash}`);

    // Wait for transaction to be processed and check result
    console.log(`- Waiting for transaction confirmation...`);
    await delay(3000); // Initial wait

    // Check transaction status using mirror node
    const success = await checkTransactionStatus(txHash, network, accountId);

    if (success.isSuccessful) {
      console.log(`- User registration completed successfully ✅`);
      return {
        success: true,
        txHash: txHash,
        userId: phoneNumber, // Use the phoneNumber as userId since that's what we're storing
      };
    } else {
      throw new Error(success.error || 'Transaction failed');
    }
  } catch (error: unknown) {
    console.error(`- Registration error:`, error);

    let errorMessage: string = 'Registration failed';

    if (error instanceof Error) {
      // Handle specific Hedera/contract errors
      const message = error.message.toLowerCase();

      if (
        message.includes('already registered') ||
        message.includes('user already have an id') ||
        message.includes('alreadyregistered')
      ) {
        errorMessage = 'User already registered';
      } else if (
        message.includes('insufficient funds') ||
        message.includes('insufficient balance')
      ) {
        errorMessage = 'Insufficient HBAR balance for transaction';
      } else if (
        message.includes('user rejected') ||
        message.includes('user denied') ||
        message.includes('rejected')
      ) {
        errorMessage = 'Transaction rejected by user';
      } else if (message.includes('user id') || message.includes('phone number')) {
        errorMessage = error.message;
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
 * Check transaction status using Hedera Mirror Node
 * @param txHash - EVM transaction hash from wallet
 * @param network - Network (testnet/mainnet)
 * @param accountId - Account ID that submitted the transaction
 * @returns Promise with success status and error details
 */
async function checkTransactionStatus(
  evmTxHash: string,
  network: string,
  accountId: string,
): Promise<{ isSuccessful: boolean; error?: string }> {
  const mirrorNodeUrl =
    network === 'testnet'
      ? 'https://testnet.mirrornode.hedera.com'
      : 'https://mainnet.mirrornode.hedera.com';

  console.log(accountId);
  console.log(`- Checking transaction status for: ${evmTxHash}`);

  // Try multiple times to get transaction result
  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      await delay(2000); // Wait 2 seconds between attempts

      // Use the correct endpoint for contract results with EVM hash
      const response = await fetch(`${mirrorNodeUrl}/api/v1/contracts/results/${evmTxHash}`);

      if (response.ok) {
        const txData = await response.json();

        console.log(`- Transaction result:`, txData.result);
        console.log(`- Error message:`, txData.error_message);

        if (txData.result === 'SUCCESS') {
          return { isSuccessful: true };
        } else if (txData.result === 'CONTRACT_REVERT_EXECUTED') {
          // Decode the error message from hex
          let errorMessage = 'Transaction reverted';

          if (txData.error_message) {
            try {
              // The error_message is in hex format, decode it
              const errorHex = txData.error_message;
              const decoded = decodeContractError(errorHex);
              errorMessage = decoded || 'User already registered';

              console.log(`- Decoded error: ${errorMessage}`);
            } catch (decodeErr) {
              console.log(`- Could not decode error message`, decodeErr);
              errorMessage = 'User already registered';
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

  // If we couldn't get status after multiple attempts, treat as failure
  return {
    isSuccessful: false,
    error: 'Could not verify transaction status - please check HashScan',
  };
}

/**
 * Decode contract error message from hex
 * @param errorHex - Hex encoded error message
 * @returns Decoded error string
 */
function decodeContractError(errorHex: string): string | null {
  try {
    if (!errorHex || errorHex === '0x') return null;

    // Remove 0x prefix
    const hex = errorHex.startsWith('0x') ? errorHex.slice(2) : errorHex;

    // Contract errors typically start with 08c379a0 (Error(string) selector)
    if (hex.startsWith('08c379a0')) {
      // Skip the selector (8 chars) and offset (64 chars)
      const dataStart = 8 + 64;
      // Get the string length (next 64 chars)
      const lengthHex = hex.slice(dataStart, dataStart + 64);
      const length = parseInt(lengthHex, 16);

      // Get the actual string data
      const stringStart = dataStart + 64;
      const stringHex = hex.slice(stringStart, stringStart + length * 2);

      // Convert hex to string
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
 * Check if a user is registered using mirror node API
 * @param walletData - [accountId, walletInterface, network]
 * @returns Promise<CheckRegistrationResult>
 */
export async function checkUserRegistration(
  walletData: WalletData,
): Promise<CheckRegistrationResult> {
  try {
    const [accountId, walletInterface, network] = walletData;

    if (!walletInterface) {
      return {
        isRegistered: false,
        error: 'Wallet interface not available',
      };
    }

    console.log(`- Checking registration for account: ${accountId}`);

    const mirrorNodeUrl =
      network === 'testnet'
        ? 'https://testnet.mirrornode.hedera.com'
        : 'https://mainnet.mirrornode.hedera.com';

    try {
      // Convert account ID to EVM address format for API call
      const evmAddress = accountId.startsWith('0x')
        ? accountId
        : `0x${accountId.replace(/\./g, '')}`;

      // Check recent contract transactions from this account to our contract
      const response = await fetch(
        `${mirrorNodeUrl}/api/v1/contracts/results?from=${evmAddress}&to=${CONTRACT_ADDRESS}&limit=10`,
      );

      if (response.ok) {
        const data = await response.json();
        const results = data.results || [];

        // Look for successful registerUser transactions
        const successfulRegistrations = results.filter(
          (tx: MirrorNodeTransaction) =>
            tx.result === 'SUCCESS' &&
            tx.function_parameters &&
            tx.function_parameters.includes('a2b5e320'), // registerUser function selector
        );

        if (successfulRegistrations.length > 0) {
          console.log(`- Found existing successful registration for account: ${accountId}`);
          // Get the userId from the most recent successful registration
          const mostRecentTx = successfulRegistrations[0];
          const userId = decodeUserIdFromTransaction(mostRecentTx);

          return {
            isRegistered: true,
            ...(userId !== null ? { userId } : {}),
          };
        }

        // Check for failed attempts by decoding error messages dynamically
        const failedRegistrations = results.filter((tx: MirrorNodeTransaction) => {
          if (tx.result !== 'CONTRACT_REVERT_EXECUTED' || !tx.error_message) {
            return false;
          }

          // Decode the error message and check if it contains registration-related errors
          const decodedError = decodeContractError(tx.error_message);
          return (
            decodedError &&
            (decodedError.toLowerCase().includes('already') ||
              decodedError.toLowerCase().includes('registered') ||
              decodedError.toLowerCase().includes('have an id'))
          );
        });

        if (failedRegistrations.length > 0) {
          console.log(
            `- Found failed registration attempts (user already registered): ${accountId}`,
          );
          // Try to get userId from the failed transaction parameters
          const mostRecentFailedTx = failedRegistrations[0];
          const userId = decodeUserIdFromTransaction(mostRecentFailedTx);

          return {
            isRegistered: true,
            ...(userId !== null ? { userId } : {}),
          };
        }
      }
    } catch (apiError) {
      console.log('Mirror node check failed:', apiError);
      // Don't throw error, let registration attempt proceed
    }

    return { isRegistered: false };
  } catch (error: unknown) {
    console.error(`- Check registration error:`, error);

    let errorMessage: string = 'Failed to check registration';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      isRegistered: false,
      error: errorMessage,
    };
  }
}

/**
 * Decode userId (phoneNumber) from transaction parameters
 * @param transaction - Transaction object from mirror node
 * @returns userId or null if can't decode
 */
function decodeUserIdFromTransaction(transaction: MirrorNodeTransaction): number | null {
  try {
    if (!transaction.function_parameters) return null;

    const params = transaction.function_parameters;
    // registerUser function parameters: string _address, uint8 _number, string _name
    // The uint8 _number is our userId, it's the second parameter

    // Skip function selector (8 chars) and first parameter offset
    // Look for the uint8 parameter (should be 64 characters in, representing the number)
    const hex = params.startsWith('0x') ? params.slice(2) : params;

    // Function selector: a2b5e320 (8 chars)
    // First param offset: 64 chars
    // Second param (uint8): next 64 chars, but uint8 is just the last 2 chars
    const selectorAndFirstParam = 8 + 64;
    const uint8ParamHex = hex.slice(selectorAndFirstParam, selectorAndFirstParam + 64);

    // Extract the actual uint8 value (last 2 characters of the 64-char hex)
    const uint8Hex = uint8ParamHex.slice(-2);
    const userId = parseInt(uint8Hex, 16);

    // Validate it's within uint8 range
    if (userId >= 0 && userId <= 255) {
      return userId;
    }

    return null;
  } catch (error) {
    console.log('Error decoding userId from transaction:', error);
    return null;
  }
}

/**
 * Validate user data before registration
 * @param userData - User data to validate
 * @returns Validation result with errors if any
 */
export function validateUserData(userData: UserData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Name validation
  if (!userData.name || userData.name.trim().length === 0) {
    errors.push('Name is required');
  } else if (userData.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  } else if (userData.name.trim().length > 100) {
    errors.push('Name cannot exceed 100 characters');
  }

  // Home address validation
  if (!userData.homeAddress || userData.homeAddress.trim().length === 0) {
    errors.push('Home address is required');
  } else if (userData.homeAddress.trim().length < 10) {
    errors.push('Home address must be at least 10 characters long');
  } else if (userData.homeAddress.trim().length > 500) {
    errors.push('Home address cannot exceed 500 characters');
  }

  // Phone number validation
  if (!userData.phoneNumber || userData.phoneNumber.trim().length === 0) {
    errors.push('Phone number is required');
  } else {
    const phoneNum: number = parseInt(userData.phoneNumber);
    if (isNaN(phoneNum)) {
      errors.push('Phone number must be a valid number');
    } else if (phoneNum < 0 || phoneNum > 255) {
      errors.push('Phone number must be between 0 and 255');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Export contract address for external use
 */
export const getContractAddress = (): string => CONTRACT_ADDRESS;
