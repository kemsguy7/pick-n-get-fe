// Hedera configuration for testnet and mainnet
export const appConfig = {
  networks: {
    testnet: {
      network: 'testnet',
      chainId: '0x128', // 296 in decimal (Hedera testnet)
      jsonRpcUrl: 'https://testnet.hashio.io/api',
      mirrorNodeUrl: 'https://testnet.mirrornode.hedera.com'
    },
    mainnet: {
      network: 'mainnet', 
      chainId: '0x127', // 295 in decimal (Hedera mainnet)
      jsonRpcUrl: 'https://mainnet.hashio.io/api',
      mirrorNodeUrl: 'https://mainnet.mirrornode.hedera.com'
    }
  },
  constants: {
    // Gas limits for different operations
    METAMASK_GAS_LIMIT_TRANSFER_FT: 100000,
    METAMASK_GAS_LIMIT_TRANSFER_NFT: 150000,
    METAMASK_GAS_LIMIT_ASSOCIATE: 100000,
    
    // WalletConnect configuration
    WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
    
    // Hedera network settings
    HEDERA_NETWORK: process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet',
  }
}

// Helper to get current network config
export const getCurrentNetworkConfig = () => {
  const network = appConfig.constants.HEDERA_NETWORK as keyof typeof appConfig.networks;
  return appConfig.networks[network] || appConfig.networks.testnet;
};