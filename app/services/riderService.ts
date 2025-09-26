import { ContractId } from "@hashgraph/sdk";
import { WalletInterface } from "./wallets/walletInterface";
import { ContractFunctionParameterBuilder } from "./wallets/contractFunctionParameterBuilder";

const CONTRACT_ADDRESS = "0.0.6879372";

// Type definitions for rider registration
export interface RiderData {
  name: string;
  phoneNumber: number; // uint8 (0-255)
  vehicleNumber: string;
  homeAddress: string;
  country: string;
  capacity: number; // uint256
  vehicleImage: string; // IPFS hash
  vehicleRegistration: string; // IPFS hash
  vehicleType: VehicleType;
}

export enum VehicleType {
  Bike = 0,
  Car = 1,
  Truck = 2,
  Van = 3
}

export enum RiderStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  Banned = 3
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
  vehicleImage: string; // IPFS hash
  vehicleRegistrationImage: string; // IPFS hash
  vehicleType: VehicleType;
}

export interface RiderRegistrationResult {
  success: boolean;
  txHash?: string;
  riderId?: number;
  error?: string;
}

export interface CheckRiderResult {
  isRegistered: boolean;
  riderId?: number;
  riderDetails?: RiderDetails;
  riderStatus?: RiderStatus;
  error?: string;
}

// Wallet data type to work with your wallet interface
export type WalletData = [string, WalletInterface | null, string];

// Simple delay function
const delay = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));

/**
 * Register a new rider/agent on the blockchain
 * @param walletData - [accountId, walletInterface, network]
 * @param riderData - Rider registration data
 * @returns Promise<RiderRegistrationResult>
 */
export async function registerRider(
  walletData: WalletData,
  riderData: RiderData
): Promise<RiderRegistrationResult> {
  console.log(`\n=======================================`);
  console.log(`- Registering rider on blockchain...🟠`);

  try {
    const [accountId, walletInterface, network] = walletData;

    if (!walletInterface) {
      throw new Error("Wallet interface not available");
    }

    // Validate phone number (uint8 range)
    if (riderData.phoneNumber < 0 || riderData.phoneNumber > 255) {
      throw new Error("Phone number must be between 0 and 255");
    }

    // Validate vehicle type
    if (!Object.values(VehicleType).includes(riderData.vehicleType)) {
      throw new Error("Invalid vehicle type");
    }

    // FIRST: Check if rider is already registered
    console.log(`- Checking existing rider registration...`);
    const existingRegistration = await checkRiderRegistration(walletData);
    if (existingRegistration.isRegistered) {
      return {
        success: false,
        error: "Rider already registered",
        riderId: existingRegistration.riderId
      };
    }

    console.log(`- Registering new rider: ${riderData.name}`);
    console.log(`- Account ID: ${accountId}`);
    console.log(`- Vehicle: ${riderData.vehicleNumber} (${VehicleType[riderData.vehicleType]})`);
    console.log(`- Phone: ${riderData.phoneNumber}`);
    console.log(`- Capacity: ${riderData.capacity} kg`);
    console.log(`- Vehicle Image IPFS: ${riderData.vehicleImage}`);
    console.log(`- Vehicle Registration IPFS: ${riderData.vehicleRegistration}`);

    // Convert IPFS hashes to bytes
    const vehicleImageBytes = ipfsHashToBytes(riderData.vehicleImage);
    const vehicleRegistrationBytes = ipfsHashToBytes(riderData.vehicleRegistration);

    // Build contract function parameters
    const functionParameters = new ContractFunctionParameterBuilder()
      .addParam({
        type: "string",
        name: "_name",
        value: riderData.name
      })
      .addParam({
        type: "uint8",
        name: "_number",
        value: riderData.phoneNumber
      })
      .addParam({
        type: "string",
        name: "_vehicleNumber",
        value: riderData.vehicleNumber
      })
      .addParam({
        type: "string",
        name: "_homeAddress",
        value: riderData.homeAddress
      })
      .addParam({
        type: "string",
        name: "_country",
        value: riderData.country
      })
      .addParam({
        type: "uint256",
        name: "_capacity",
        value: riderData.capacity
      })
      .addParam({
        type: "bytes",
        name: "_image",
        value: vehicleImageBytes
      })
      .addParam({
        type: "bytes",
        name: "_vehicleRegistration",
        value: vehicleRegistrationBytes
      })
      .addParam({
        type: "uint8",
        name: "_vehicleType",
        value: riderData.vehicleType
      });

    // Execute the contract function
    const contractId = ContractId.fromString(CONTRACT_ADDRESS);
    const gasLimit = 400000; // Higher gas limit for rider registration

    console.log(`- Executing riderApplication contract function...`);
    const transactionResult = await walletInterface.executeContractFunction(
      contractId,
      "riderApplication",
      functionParameters,
      gasLimit
    );

    if (!transactionResult) {
      throw new Error("Transaction failed - no transaction ID returned");
    }

    const txHash = transactionResult.toString();
    console.log(`- Transaction submitted: ${txHash}`);

    // Wait for transaction to be processed
    console.log(`- Waiting for transaction confirmation...`);
    await delay(3000);

    // Check transaction status
    const success = await checkTransactionStatus(txHash, network, accountId);

    if (success.isSuccessful) {
      console.log(`- Rider registration completed successfully ✅`);
      
      // Get the rider ID from the blockchain
      const riderId = await getRiderIdFromTransaction(txHash, network);
      
      return {
        success: true,
        txHash: txHash,
        riderId: riderId || undefined
      };
    } else {
      throw new Error(success.error || "Transaction failed");
    }

  } catch (error: unknown) {
    console.error(`- Rider registration error:`, error);
    
    let errorMessage: string = "Rider registration failed";
    
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      
      if (message.includes("already registered")) {
        errorMessage = "Rider already registered";
      } else if (message.includes("insufficient funds") || 
                 message.includes("insufficient balance")) {
        errorMessage = "Insufficient HBAR balance for transaction";
      } else if (message.includes("user rejected") || 
                 message.includes("user denied") ||
                 message.includes("rejected")) {
        errorMessage = "Transaction rejected by user";
      } else if (message.includes("phone number")) {
        errorMessage = error.message;
      } else if (message.includes("gas") || message.includes("limit")) {
        errorMessage = "Transaction failed due to gas limit";
      } else if (message.includes("network") || message.includes("connection")) {
        errorMessage = "Network error - please check your connection";
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
 * Check if a rider is registered and get their status
 * @param walletData - [accountId, walletInterface, network]
 * @returns Promise<CheckRiderResult>
 */
export async function checkRiderRegistration(walletData: WalletData): Promise<CheckRiderResult> {
  try {
    const [accountId, walletInterface, network] = walletData;

    if (!walletInterface) {
      return {
        isRegistered: false,
        error: "Wallet interface not available"
      };
    }

    console.log(`- Checking rider registration for account: ${accountId}`);

    const mirrorNodeUrl = network === "testnet" 
      ? "https://testnet.mirrornode.hedera.com" 
      : "https://mainnet.mirrornode.hedera.com";

    try {
      // Convert account ID to EVM address format
      const evmAddress = accountId.startsWith("0x") ? accountId : `0x${accountId.replace(/\./g, '')}`;
      
      // Check recent contract transactions from this account to our contract
      const response = await fetch(
        `${mirrorNodeUrl}/api/v1/contracts/results?from=${evmAddress}&to=${CONTRACT_ADDRESS}&limit=10`
      );
      
      if (response.ok) {
        const data = await response.json();
        const results = data.results || [];
        
        // Look for successful riderApplication transactions
        const successfulRegistrations = results.filter((tx: any) => 
          tx.result === "SUCCESS" && 
          tx.function_parameters && 
          tx.function_parameters.includes("riderApplication")
        );
        
        if (successfulRegistrations.length > 0) {
          console.log(`- Found existing rider registration for account: ${accountId}`);
          const mostRecentTx = successfulRegistrations[0];
          
          // Get rider details from the transaction or blockchain state
          const riderDetails = await getRiderDetailsFromBlockchain(accountId, network);
          
          return {
            isRegistered: true,
            riderId: riderDetails?.id,
            riderDetails: riderDetails || undefined,
            riderStatus: riderDetails?.riderStatus
          };
        }
        
        // Check for failed attempts indicating already registered
        const failedRegistrations = results.filter((tx: any) => {
          if (tx.result !== "CONTRACT_REVERT_EXECUTED" || !tx.error_message) {
            return false;
          }
          
          const decodedError = decodeContractError(tx.error_message);
          return decodedError && decodedError.toLowerCase().includes("already registered");
        });
        
        if (failedRegistrations.length > 0) {
          console.log(`- Found failed registration attempts (rider already registered): ${accountId}`);
          const riderDetails = await getRiderDetailsFromBlockchain(accountId, network);
          
          return {
            isRegistered: true,
            riderId: riderDetails?.id,
            riderDetails: riderDetails || undefined,
            riderStatus: riderDetails?.riderStatus
          };
        }
      }
    } catch (apiError) {
      console.log("Mirror node check failed:", apiError);
    }

    return { isRegistered: false };

  } catch (error: unknown) {
    console.error(`- Check rider registration error:`, error);
    
    let errorMessage: string = "Failed to check rider registration";
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
 * Get rider details from blockchain state
 * @param accountId - Rider's account ID
 * @param network - Network (testnet/mainnet)
 * @returns Promise<RiderDetails | null>
 */
async function getRiderDetailsFromBlockchain(accountId: string, network: string): Promise<RiderDetails | null> {
  try {
    // This would require additional contract view function calls
    // For now, return null and implement when needed
    console.log(`- Getting rider details for ${accountId} from blockchain...`);
    return null;
  } catch (error) {
    console.error("Error getting rider details:", error);
    return null;
  }
}

/**
 * Get rider ID from successful transaction
 * @param txHash - Transaction hash
 * @param network - Network
 * @returns Promise<number | null>
 */
async function getRiderIdFromTransaction(txHash: string, network: string): Promise<number | null> {
  try {
    const mirrorNodeUrl = network === "testnet" 
      ? "https://testnet.mirrornode.hedera.com" 
      : "https://mainnet.mirrornode.hedera.com";

    // Try to get rider ID from transaction logs/events
    const response = await fetch(`${mirrorNodeUrl}/api/v1/contracts/results/${txHash}`);
    
    if (response.ok) {
      const txData = await response.json();
      
      // Look for logs/events that might contain the rider ID
      if (txData.logs && txData.logs.length > 0) {
        // Parse logs for rider registration events
        console.log(`- Transaction logs:`, txData.logs);
        // Implementation depends on your contract events
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting rider ID from transaction:", error);
    return null;
  }
}

/**
 * Check transaction status using Hedera Mirror Node
 */
async function checkTransactionStatus(
  evmTxHash: string,
  network: string,
  accountId: string
): Promise<{isSuccessful: boolean, error?: string}> {
  const mirrorNodeUrl = network === "testnet" 
    ? "https://testnet.mirrornode.hedera.com" 
    : "https://mainnet.mirrornode.hedera.com";
    
  console.log(`- Checking transaction status for: ${evmTxHash}`);

  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      await delay(2000);
      
      const response = await fetch(
        `${mirrorNodeUrl}/api/v1/contracts/results/${evmTxHash}`
      );
      
      if (response.ok) {
        const txData = await response.json();
        
        console.log(`- Transaction result:`, txData.result);
        console.log(`- Error message:`, txData.error_message);
        
        if (txData.result === "SUCCESS") {
          return { isSuccessful: true };
        } else if (txData.result === "CONTRACT_REVERT_EXECUTED") {
          let errorMessage = "Transaction reverted";
          
          if (txData.error_message) {
            try {
              const decoded = decodeContractError(txData.error_message);
              errorMessage = decoded || "Rider already registered";
              console.log(`- Decoded error: ${errorMessage}`);
            } catch (decodeErr) {
              console.log(`- Could not decode error message`);
              errorMessage = "Rider already registered";
            }
          }
          
          return { isSuccessful: false, error: errorMessage };
        } else if (txData.result && txData.result.includes("FAIL")) {
          return { 
            isSuccessful: false, 
            error: txData.error_message || "Transaction failed" 
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
    error: "Could not verify transaction status - please check HashScan" 
  };
}

/**
 * Decode contract error message from hex
 */
function decodeContractError(errorHex: string): string | null {
  try {
    if (!errorHex || errorHex === "0x") return null;
    
    const hex = errorHex.startsWith("0x") ? errorHex.slice(2) : errorHex;
    
    if (hex.startsWith("08c379a0")) {
      const dataStart = 8 + 64;
      const lengthHex = hex.slice(dataStart, dataStart + 64);
      const length = parseInt(lengthHex, 16);
      
      const stringStart = dataStart + 64;
      const stringHex = hex.slice(stringStart, stringStart + (length * 2));
      
      const errorMessage = Buffer.from(stringHex, 'hex').toString('utf8');
      return errorMessage;
    }
    
    return null;
  } catch (err) {
    console.log("Error decoding contract error:", err);
    return null;
  }
}

/**
 * Convert IPFS hash to bytes for smart contract
 * @param ipfsHash - IPFS hash string
 * @returns bytes representation
 */
function ipfsHashToBytes(ipfsHash: string): Uint8Array {
  try {
    // For now, convert string to bytes
    // You might want to implement proper IPFS hash encoding
    const encoder = new TextEncoder();
    return encoder.encode(ipfsHash);
  } catch (error) {
    console.error("Error converting IPFS hash to bytes:", error);
    return new Uint8Array();
  }
}

/**
 * Validate rider data before registration
 * @param riderData - Rider data to validate
 * @returns Validation result with errors if any
 */
export function validateRiderData(riderData: RiderData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Name validation
  if (!riderData.name || riderData.name.trim().length === 0) {
    errors.push("Name is required");
  } else if (riderData.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  } else if (riderData.name.trim().length > 100) {
    errors.push("Name cannot exceed 100 characters");
  }

  // Phone number validation (uint8 range)
  if (riderData.phoneNumber < 0 || riderData.phoneNumber > 255) {
    errors.push("Phone number must be between 0 and 255");
  }

  // Vehicle number validation
  if (!riderData.vehicleNumber || riderData.vehicleNumber.trim().length === 0) {
    errors.push("Vehicle number is required");
  }

  // Home address validation
  if (!riderData.homeAddress || riderData.homeAddress.trim().length === 0) {
    errors.push("Home address is required");
  }

  // Country validation
  if (!riderData.country || riderData.country.trim().length === 0) {
    errors.push("Country is required");
  }

  // Capacity validation
  if (riderData.capacity <= 0) {
    errors.push("Capacity must be greater than 0");
  }

  // IPFS hash validation
  if (!riderData.vehicleImage || riderData.vehicleImage.trim().length === 0) {
    errors.push("Vehicle image is required");
  }

  if (!riderData.vehicleRegistration || riderData.vehicleRegistration.trim().length === 0) {
    errors.push("Vehicle registration document is required");
  }

  // Vehicle type validation
  if (!Object.values(VehicleType).includes(riderData.vehicleType)) {
    errors.push("Invalid vehicle type");
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