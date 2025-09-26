"use client"

import React, { useState, useContext } from "react"
import { Check, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { MetamaskContext } from "../../../contexts/MetamaskContext"
import { WalletConnectContext } from "../../../contexts/WalletConnectContext"
import { useWalletInterface } from "../../../services/wallets/useWalletInterface"
import AppLayout from "../../../components/layout/AppLayout"

export default function AgentSignupStep1(): React.JSX.Element {
  const router = useRouter()
  
  // Get wallet contexts
  const metamaskCtx = useContext(MetamaskContext)
  const walletConnectCtx = useContext(WalletConnectContext)
  const { accountId } = useWalletInterface()
  
  const isConnected = !!(metamaskCtx.metamaskAccountAddress || walletConnectCtx.accountId)

  const handleContinue = () => {
    if (isConnected) {
      router.push('/auth/signup/agent/personal-info')
    }
  }

  const getWalletStatus = () => {
    if (metamaskCtx.metamaskAccountAddress) {
      return {
        type: 'MetaMask',
        address: metamaskCtx.metamaskAccountAddress,
        connected: true
      }
    } else if (walletConnectCtx.accountId) {
      return {
        type: 'WalletConnect',
        address: walletConnectCtx.accountId,
        connected: walletConnectCtx.isConnected
      }
    }
    return {
      type: 'None',
      address: '',
      connected: false
    }
  }

  const walletStatus = getWalletStatus()

  return (
    <AppLayout showHeader={true} showFooter={false} showSidebar={false}>
      <div className="min-h-screen body-gradient flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-lg"></div>
            </div>
            <h1 className="text-2xl font-bold text-white font-space-grotesk">Join Pick'n'Get</h1>
            <p className="text-gray-300 font-inter">Start your sustainable journey today</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl p-6">
            {/* Progress Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-black font-space-grotesk">Create Account</h2>
                <span className="text-sm text-gray-500 font-inter">Step 1 of 4</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-1/4"></div>
              </div>
            </div>

            {/* Wallet Connection Content */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-black font-space-grotesk mb-2">Connect Your Wallet</h3>
                <p className="text-gray-600 text-sm font-inter">Securely connect using your Web3 wallet</p>
              </div>

              {!walletStatus.connected ? (
                <div className="space-y-4">
                  {/* Wallet Options */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-gray-300 cursor-pointer">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <span className="text-orange-600 font-bold text-sm">M</span>
                      </div>
                      <span className="font-medium text-gray-800 font-inter">Metamask</span>
                    </div>

                    <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-gray-300 cursor-pointer">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">W</span>
                      </div>
                      <span className="font-medium text-gray-800 font-inter">WalletConnect</span>
                    </div>

                    <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-gray-300 cursor-pointer">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">C</span>
                      </div>
                      <span className="font-medium text-gray-800 font-inter">Coinbase Wallet</span>
                    </div>
                  </div>

                  {/* Create Embedded Wallet */}
                  <button className="w-full bg-green-100 hover:bg-green-200 text-green-800 font-semibold py-3 px-4 rounded-xl transition-colors font-inter flex items-center justify-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Create Embedded Wallet
                  </button>
                  <p className="text-center text-xs text-gray-500 font-inter">New to Web3? Create an embedded wallet for easy access</p>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="text-green-600 font-inter font-medium">Wallet Connected Successfully</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700">Connected via {walletStatus.type}</p>
                    <p className="text-xs text-gray-500 font-mono break-all">{walletStatus.address}</p>
                  </div>
                  <p className="text-sm text-gray-500 font-inter">Ready to proceed with registration</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleContinue}
                disabled={!isConnected}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors font-space-grotesk flex items-center justify-center gap-2"
              >
                Continue →
              </button>

              <button
                onClick={() => router.back()}
                className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors font-space-grotesk"
              >
                ← Back
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-6 space-y-2">
              <p className="text-center text-sm text-gray-600 font-inter">
                Don't have an account? <span className="text-green-500 cursor-pointer">Sign up for free</span>
              </p>
              <div className="flex items-center justify-center">
                <span className="text-green-500 text-sm font-inter cursor-pointer">🌱 Join the sustainable revolution</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}