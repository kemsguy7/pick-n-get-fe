//import abi from "../abis/abi";
import { ContractId } from "@hashgraph/sdk";
import { WalletInterface } from "./wallets/walletInterface";
import { ContractFunctionParameterBuilder, ContractFunctionParameterBuilderParam } from "./wallets/contractFunctionParameterBuilder";


const CONTRACT_ADDRESS = "0.0.6879372";

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
  userData: UserData
): Promise<RegistrationResult> {
  console.log(`\n=======================================`);
  console.log(`- Registering user on blockchain...🟠`);

  try {
    const [accountId, walletInterface, network] = walletData;

    if (!walletInterface) {
      throw new Error("Wallet interface not available");
    }

    // Validate phone number first
    const phoneNumber: number = parseInt(userData.phoneNumber);
    if (isNaN(phoneNumber) || phoneNumber < 0 || phoneNumber > 255) {
      throw new Error("Phone number must be between 0 and 255");
    }

    console.log(`- Registering new user: ${userData.name}`);
    console.log(`- Account ID: ${accountId}`);
    console.log(`- Address: ${userData.homeAddress}`);
    console.log(`- Phone: ${userData.phoneNumber}`);

    // Build contract function parameters using your ContractFunctionParameterBuilder
    const functionParameters = new ContractFunctionParameterBuilder()
      .addParam({
        type: "string",
        name: "_address", 
        value: userData.homeAddress
      })
      .addParam({
        type: "uint8",
        name: "_number",
        value: phoneNumber
      })
      .addParam({
        type: "string", 
        name: "_name",
        value: userData.name
      });

    // Execute the contract function using wallet interface
    const contractId = ContractId.fromString(CONTRACT_ADDRESS);
    const gasLimit = 300000;

    const transactionResult = await walletInterface.executeContractFunction(
      contractId,
      "registerUser",
      functionParameters,
      gasLimit
    );

    if (!transactionResult) {
      throw new Error("Transaction failed - no transaction ID returned");
    }

    const txHash = transactionResult.toString();
    console.log(`- Transaction submitted: ${txHash}`);

    // Wait for transaction to be processed
    await delay(5000);

    console.log(`- User registration completed successfully ✅`);

    return {
      success: true,
      txHash: txHash,
      userId: 1 // We can't easily get the userId with this interface, so we return a placeholder
    };

  } catch (error: unknown) {
    console.error(`- Registration error:`, error);
    
    let errorMessage: string = "Registration failed";
    
    if (error instanceof Error) {
      if (error.message.includes("user already have an id") || 
          error.message.includes("already registered")) {
        errorMessage = "User already registered";
      } else if (error.message.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for transaction";
      } else if (error.message.includes("user rejected") || 
                 error.message.includes("User rejected")) {
        errorMessage = "Transaction rejected by user";
      } else if (error.message.includes("Phone number")) {
        errorMessage = error.message;
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Check if a user is registered (simplified version for wallet interface)
 * @param walletData - [accountId, walletInterface, network]
 * @returns Promise<CheckRegistrationResult>
 */
export async function checkUserRegistration(walletData: WalletData): Promise<CheckRegistrationResult> {
  try {
    const [accountId, walletInterface, network] = walletData;

    if (!walletInterface) {
      return { 
        isRegistered: false, 
        error: "Wallet interface not available" 
      };
    }

    console.log(`- Checking registration for account: ${accountId}`);

    // For now, we'll return not registered since checking with your wallet interface
    // would require a different approach (likely a contract view call)
    // This can be implemented later when we add view function support to your wallet interface

    return { 
      isRegistered: false 
    };

  } catch (error: unknown) {
    console.error(`- Check registration error:`, error);
    
    let errorMessage: string = "Failed to check registration";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return { 
      isRegistered: false, 
      error: errorMessage 
    };
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
    errors.push("Name is required");
  } else if (userData.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  } else if (userData.name.trim().length > 100) {
    errors.push("Name cannot exceed 100 characters");
  }

  // Home address validation
  if (!userData.homeAddress || userData.homeAddress.trim().length === 0) {
    errors.push("Home address is required");
  } else if (userData.homeAddress.trim().length < 10) {
    errors.push("Home address must be at least 10 characters long");
  } else if (userData.homeAddress.trim().length > 500) {
    errors.push("Home address cannot exceed 500 characters");
  }

  // Phone number validation
  if (!userData.phoneNumber || userData.phoneNumber.trim().length === 0) {
    errors.push("Phone number is required");
  } else {
    const phoneNum: number = parseInt(userData.phoneNumber);
    if (isNaN(phoneNum)) {
      errors.push("Phone number must be a valid number");
    } else if (phoneNum < 0 || phoneNum > 255) {
      errors.push("Phone number must be between 0 and 255");
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Export contract address for external use
 */
export const getContractAddress = (): string => CONTRACT_ADDRESS;