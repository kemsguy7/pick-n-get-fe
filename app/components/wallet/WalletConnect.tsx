"use client"

import { Wallet } from "lucide-react"

interface WalletConnectProps {
  onConnect: () => void
}

export default function WalletConnect({ onConnect }: WalletConnectProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-black/80 rounded-2xl p-8 lg:p-12 border border-slate-700/50 text-center">
        {/* Wallet Icon */}
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Wallet className="w-10 h-10 text-green-400" />
        </div>

        {/* Title */}
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 font-space-grotesk">
          Connect Wallet
        </h2>

        {/* Description */}
        <p className="text-gray-300 mb-8 font-inter text-lg">
          Connect your Web3 wallet to start earning ECO tokens from recycling
        </p>

        {/* Connect Button */}
        <button
          onClick={onConnect}
          className="gradient-button font-semibold px-8 py-4 rounded-xl text-lg 
            hover:shadow-lg transition-all duration-200 focus-visible mb-6 inline-flex items-center gap-2"
        >
          <Wallet className="w-5 h-5" />
          Connect Wallet
        </button>

        {/* Supported Wallets */}
        <p className="text-gray-500 text-sm font-inter">
          Supported wallets: MetaMask, WalletConnect, Coinbase Wallet
        </p>
      </div>
    </div>
  )
}
