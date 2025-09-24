// import type { NextConfig } from "next";
// import webpack from 'webpack';

// const nextConfig: NextConfig = {
//   webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
//     config.resolve.fallback = {
//       ...config.resolve.fallback,
//       buffer: require.resolve('buffer/'),
//       stream: require.resolve('stream-browserify'),
//       crypto: require.resolve('crypto-browserify'),
//       assert: require.resolve('assert/'),
//       http: require.resolve('stream-http'),
//       https: require.resolve('https-browserify'),
//       os: require.resolve('os-browserify/browser'),
//       url: require.resolve('url/'),
//       zlib: require.resolve('browserify-zlib'),
//       path: require.resolve('path-browserify'),
//       fs: false,
//       net: false,
//       tls: false,
//     };
    
//     config.plugins.push(
//       new webpack.ProvidePlugin({
//         Buffer: ['buffer', 'Buffer'],
//         process: 'process/browser',
//       })
//     );
    
//     // Ignore node-specific modules in browser
//     config.externals = config.externals || [];
//     if (!isServer) {
//       config.externals.push({
//         'utf-8-validate': 'commonjs utf-8-validate',
//         'bufferutil': 'commonjs bufferutil',
//       });
//     }
    
//     return config;
//   },
//   // Enable experimental features if needed
//   experimental: {
//     esmExternals: 'loose',
//   },
//   // Transpile the Hedera packages
//   transpilePackages: [
//     '@hashgraph/sdk',
//     '@hashgraph/proto',
//     '@hashgraph/hedera-wallet-connect'
//   ],
// };

// export default nextConfig;

// next.config.js
const webpack = require('webpack');

module.exports = {
  webpack: (config:any) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve('buffer/'),
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      url: require.resolve('url/'),
      zlib: require.resolve('browserify-zlib'),
      assert: require.resolve('assert/'),
      os: require.resolve('os-browserify/browser'),
      path: require.resolve('path-browserify'),
    };
    
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      })
    );
    
    return config;
  },
};