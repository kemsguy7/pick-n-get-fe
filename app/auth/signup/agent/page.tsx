"use client"

import React, { useContext, useEffect, useState } from "react"
import { Check, Wallet, AlertCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { MetamaskContext } from "../../../contexts/MetamaskContext"
import { WalletConnectContext } from "../../../contexts/WalletConnectContext"
import { useWalletInterface } from "../../../services/wallets/useWalletInterface"
import { checkRiderRegistration } from "../../../services/riderService"
import { useAgentSignup } from "../../../contexts/AgentSignupContext"
import AppLayout from "../../../components/layout/AppLayout"

// Declare window.ethereum for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Convert wallet interface data to format expected by riderService
const createWalletData = (accountId: string, walletInterface: any, network: string = "testnet"): [string, any, string] => {
  return [accountId, walletInterface, network];
}

export default function AgentSignupStep1(): React.JSX.Element {
  const router = useRouter()
  
  // Get wallet contexts
  const metamaskCtx = useContext(MetamaskContext)
  const walletConnectCtx = useContext(WalletConnectContext)
  const { accountId, walletInterface } = useWalletInterface()
  
  // Get signup context
  const { updateWalletInfo, setCurrentStep } = useAgentSignup()
  
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(false)
  const [registrationError, setRegistrationError] = useState('')
  
  const isConnected = !!(accountId && walletInterface)

  // Set current step when component mounts
  useEffect(() => {
    setCurrentStep(1)
  }, [setCurrentStep])

  // Check if rider is already registered when wallet connects
  useEffect(() => {
    if (isConnected && accountId && walletInterface) {
      // Update wallet info in context
      const walletType = metamaskCtx.metamaskAccountAddress ? 'MetaMask' : 'WalletConnect'
      updateWalletInfo(accountId, walletType)
      
      // Check existing registration
      checkExistingRegistration()
    }
  }, [isConnected, accountId, walletInterface, metamaskCtx.metamaskAccountAddress, updateWalletInfo])

  const checkExistingRegistration = async (): Promise<void> => {
    setIsCheckingRegistration(true)
    setRegistrationError('')
    
    try {
      console.log("Checking existing rider registration...");
      
      const walletData = createWalletData(accountId!, walletInterface!)
      const result = await checkRiderRegistration(walletData)
      
      if (result.isRegistered) {
        console.log("Rider already registered, redirecting...");
        
        if (result.riderStatus === 0) { // Pending
          router.push('/agents/pending')
        } else if (result.riderStatus === 1) { // Approved
          router.push('/dashboard')
        } else if (result.riderStatus === 2) { // Rejected
          router.push('/agents/rejected')
        } else if (result.riderStatus === 3) { // Banned
          router.push('/agents/banned')
        } else {
          router.push('/dashboard')
        }
      } else {
        console.log("No existing registration found, proceeding with signup");
      }
    } catch (error: any) {
      console.error('Error checking registration:', error)
      setRegistrationError('Failed to check existing registration. You can still proceed with signup.')
    } finally {
      setIsCheckingRegistration(false)
    }
  }

  const handleConnectWallet = async (walletType: 'metamask' | 'walletconnect' | 'embedded') => {
    console.log(`Attempting to connect ${walletType} wallet...`);
    
    try {
      if (walletType === 'metamask') {
        if (!window.ethereum) {
          throw new Error('MetaMask is not installed')
        }
        // Check if connectMetamask exists, if not use a fallback
        if (metamaskCtx.connectMetamask) {
          await metamaskCtx.connectMetamask()
        } else {
          // Fallback: request accounts directly
          const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
          })
          console.log("MetaMask connected:", accounts[0])
        }
      } else if (walletType === 'walletconnect') {
        // Check if connectWallet exists, if not use a fallback
        if (walletConnectCtx.connectWallet) {
          await walletConnectCtx.connectWallet()
        } else {
          throw new Error('WalletConnect connection not available')
        }
      } else if (walletType === 'embedded') {
        console.log("Embedded wallet creation not yet implemented");
        throw new Error('Embedded wallet creation coming soon')
      }
    } catch (error: any) {
      console.error(`Failed to connect ${walletType}:`, error);
      setRegistrationError(error.message || `Failed to connect ${walletType}`)
    }
  }

  const handleContinue = () => {
    if (isConnected && !isCheckingRegistration) {
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

            {/* Error Display */}
            {registrationError && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <span className="text-yellow-700 text-sm">{registrationError}</span>
              </div>
            )}

            {/* Wallet Connection Content */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-black font-space-grotesk mb-2">Connect Your Wallet</h3>
                <p className="text-gray-600 text-sm font-inter">Securely connect using your Web3 wallet to register as an agent</p>
              </div>

              {isCheckingRegistration ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  </div>
                  <p className="text-blue-600 font-inter">Checking existing registration...</p>
                  <p className="text-sm text-gray-500 font-inter">Please wait while we verify your account status</p>
                </div>
              ) : !walletStatus.connected ? (
                <div className="space-y-4">
                  {/* Wallet Connection Instructions */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-gray-300 cursor-pointer">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <span className="text-orange-600 font-bold text-sm">M</span>
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-gray-800 font-inter">MetaMask</span>
                        <p className="text-xs text-gray-500">Use the wallet connection button in the header</p>
                      </div>
                      {typeof window !== 'undefined' && !window.ethereum && (
                        <span className="text-xs text-gray-500">Not Installed</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-gray-300 cursor-pointer">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">W</span>
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-gray-800 font-inter">WalletConnect</span>
                        <p className="text-xs text-gray-500">Use the wallet connection button in the header</p>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 font-medium mb-2">How to connect:</p>
                    <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                      <li>Use the "Connect Wallet" button in the header above</li>
                      <li>Choose your preferred wallet (MetaMask or WalletConnect)</li>
                      <li>Approve the connection in your wallet</li>
                      <li>Return here to continue registration</li>
                    </ol>
                  </div>

                  {/* Refresh Button */}
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-xl transition-colors font-inter"
                  >
                    Refresh Page
                  </button>
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
                  <p className="text-sm text-gray-500 font-inter">Ready to proceed with agent registration</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleContinue}
                disabled={!isConnected || isCheckingRegistration}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors font-space-grotesk flex items-center justify-center gap-2"
              >
                {isCheckingRegistration ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Checking Registration...
                  </>
                ) : (
                  'Continue →'
                )}
              </button>

              <button
                onClick={() => router.back()}
                disabled={isCheckingRegistration}
                className="w-full border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors font-space-grotesk"
              >
                ← Back
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-6 space-y-2">
              <p className="text-center text-sm text-gray-600 font-inter">
                Want to register as a recycler instead? <span className="text-green-500 cursor-pointer hover:underline" onClick={() => router.push('/auth/signup/recycler')}>Sign up here</span>
              </p>
              <div className="flex items-center justify-center">
                <span className="text-green-500 text-sm font-inter cursor-pointer">Join the sustainable revolution</span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700 font-inter text-center">
                <strong>Security:</strong> Your wallet connection is secure and encrypted. We never store your private keys.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}