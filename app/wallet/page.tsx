
"use client"

import { useState } from "react"
import AppLayout from "../components/layout/AppLayout"
import WalletConnect from "../components/wallet/WalletConnect"
import WalletConnected from "../components/wallet/WalletConnected"

export default function WalletPage() {
  const [isWalletConnected, setIsWalletConnected] = useState(false)

  const handleWalletConnect = () => {
    setIsWalletConnected(true)
  }

  const handleWalletDisconnect = () => {
    setIsWalletConnected(false)
  }

  return (
    <AppLayout showHeader={true} showSidebar={true} showFooter={true}>
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-slate-900 to-black p-4 lg:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 font-space-grotesk">
              Wallet 💰
            </h1>
            <p className="text-lg text-gray-300 font-inter">
              Manage your crypto assets and eco-tokens securely
            </p>
          </div>

          {/* Wallet Component */}
          {!isWalletConnected ? (
            <WalletConnect onConnect={handleWalletConnect} />
          ) : (
            <WalletConnected onDisconnect={handleWalletDisconnect} />
          )}
        </div>
      </div>
    </AppLayout>
  )
}
