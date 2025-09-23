import { AccountId, ContractId } from "@hashgraph/sdk";
import { TokenId } from "@hashgraph/sdk";
import { ContractFunctionParameterBuilder } from "./contractFunctionParameterBuilder";

// Interface that all wallet implementations must follow
export interface WalletInterface {
  // Transfer HBAR to another account
  transferHBAR(toAddress: AccountId, amount: number): Promise<string | null>;
  
  // Transfer fungible tokens
  transferFungibleToken(toAddress: AccountId, tokenId: TokenId, amount: number): Promise<string | null>;
  
  // Transfer non-fungible tokens (NFTs)
  transferNonFungibleToken(toAddress: AccountId, tokenId: TokenId, serialNumber: number): Promise<string | null>;
  
  // Associate token with account
  associateToken(tokenId: TokenId): Promise<string | null>;
  
  // Execute contract function
  executeContractFunction(
    contractId: ContractId, 
    functionName: string, 
    functionParameters: ContractFunctionParameterBuilder, 
    gasLimit: number
  ): Promise<string | null>;
  
  // Disconnect wallet
  disconnect(): void;
}