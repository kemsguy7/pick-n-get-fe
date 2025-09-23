import { ContractFunctionParameters } from "@hashgraph/sdk";

// Contract function parameter builder for Hedera smart contracts
export interface ContractFunctionParameter {
  type: string;
  name: string;
  value: any;
}

export class ContractFunctionParameterBuilder {
  private parameters: ContractFunctionParameter[] = [];

  addParam(param: ContractFunctionParameter): ContractFunctionParameterBuilder {
    this.parameters.push(param);
    return this;
  }

  // Build ABI function parameters for contract interface
  buildAbiFunctionParams(): string {
    return this.parameters.map(param => `${param.type} ${param.name}`).join(', ');
  }

  // Build ethers.js compatible parameters
  buildEthersParams(): any[] {
    return this.parameters.map(param => param.value);
  }

  // Build Hedera API (HAPI) compatible parameters for WalletConnect
  buildHAPIParams(): ContractFunctionParameters {
    const contractParams = new ContractFunctionParameters();
    
    this.parameters.forEach(param => {
      switch (param.type.toLowerCase()) {
        case 'string':
          contractParams.addString(param.value);
          break;
        case 'uint256':
        case 'uint':
          contractParams.addUint256(param.value);
          break;
        case 'int256':
        case 'int':
          contractParams.addInt256(param.value);
          break;
        case 'address':
          contractParams.addAddress(param.value);
          break;
        case 'bool':
          contractParams.addBool(param.value);
          break;
        case 'bytes':
          contractParams.addBytes(param.value);
          break;
        case 'bytes32':
          contractParams.addBytes32(param.value);
          break;
        case 'uint8':
          contractParams.addUint8(param.value);
          break;
        case 'uint32':
          contractParams.addUint32(param.value);
          break;
        case 'uint64':
          contractParams.addUint64(param.value);
          break;
        case 'int8':
          contractParams.addInt8(param.value);
          break;
        case 'int32':
          contractParams.addInt32(param.value);
          break;
        case 'int64':
          contractParams.addInt64(param.value);
          break;
        default:
          // For unknown types, try to add as string
          console.warn(`Unknown parameter type: ${param.type}, adding as string`);
          contractParams.addString(param.value.toString());
          break;
      }
    });
    
    return contractParams;
  }

  // Get all parameters
  getParameters(): ContractFunctionParameter[] {
    return this.parameters;
  }

  // Clear all parameters
  clear(): ContractFunctionParameterBuilder {
    this.parameters = [];
    return this;
  }
}