const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config:any, { isServer }:any) => {
    // Only apply polyfills for client-side builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Node.js specific modules - disable them
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        dns: false,
        module: false,
        // New polyfills needed
        http2: require.resolve('http2-wrapper'),
        // Existing polyfills
        buffer: require.resolve('buffer'),
        stream: require.resolve('stream-browserify'),
        crypto: require.resolve('crypto-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        url: require.resolve('url'),
        zlib: require.resolve('browserify-zlib'),
        assert: require.resolve('assert'),
        os: require.resolve('os-browserify/browser'),
        path: require.resolve('path-browserify'),
        vm: require.resolve('vm-browserify'),
      };

      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        })
      );

      // Ignore grpc and other problematic native modules
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^grpc$/,
          contextRegExp: /@grpc\/grpc-js/,
        }),
        new webpack.IgnorePlugin({
          resourceRegExp: /^http2$/,
        })
      );
    }

    return config;
  },
  // Important: Exclude Hedera SDK from server-side rendering
  experimental: {
    esmExternals: 'loose'
  },
};

module.exports = nextConfig;