"use client"

import React, { useState, useEffect, useContext, ChangeEvent } from "react"
import { Check, Loader2, AlertCircle, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { MetamaskContext } from "../../../contexts/MetamaskContext"
import { WalletConnectContext } from "../../../contexts/WalletConnectContext"
import { useWalletInterface } from "../../../services/wallets/useWalletInterface"
import { registerUser, checkUserRegistration, UserData } from "../../../services/userService"
import AppLayout from "../../../components/layout/AppLayout"

interface UserFormData {
  name: string;
  homeAddress: string;
  phoneNumber: string; // This will store the user ID number (0-255)
}

// Convert wallet interface data to format expected by userService
const createWalletData = (accountId: string, walletInterface: any, network: string = "testnet"): [string, any, string] => {
  return [accountId, walletInterface, network];
}

export default function SignupPage(): React.JSX.Element {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadingMessage, setLoadingMessage] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const router = useRouter()

  // Get wallet contexts
  const metamaskCtx = useContext(MetamaskContext)
  const walletConnectCtx = useContext(WalletConnectContext)
  const { accountId, walletInterface } = useWalletInterface()

  // Determine connection status
  const isConnected = !!(accountId && walletInterface)

  // User form data
  const [userForm, setUserForm] = useState<UserFormData>({
    name: '',
    homeAddress: '',
    phoneNumber: '',
  })

  // Check if user is already registered on component mount
  useEffect(() => {
    if (isConnected && accountId) {
      checkExistingRegistration()
    }
  }, [isConnected, accountId])

  const checkExistingRegistration = async (): Promise<void> => {
    try {
      if (!accountId || !walletInterface) return;
      
      const walletData = createWalletData(accountId, walletInterface)
      const result = await checkUserRegistration(walletData)
      if (result.isRegistered) {
        setSuccess('User already registered! Redirecting to dashboard...')
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (error) {
      console.error('Error checking registration:', error)
    }
  }

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target
    setUserForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleContinue = (): void => {
    if (currentStep === 1) {
      setCurrentStep(2)
    } else if (currentStep === 2 && isConnected) {
      setCurrentStep(3)
    } else if (currentStep === 2 && !isConnected) {
      setError('Please connect your wallet to continue')
    }
  }

  const validateForm = (): string | null => {
    if (!userForm.name.trim()) return 'Name is required'
    if (!userForm.homeAddress.trim()) return 'Home address is required'
    if (!userForm.phoneNumber.trim()) return 'User ID number is required'
    
    const phoneNum = parseInt(userForm.phoneNumber)
    if (isNaN(phoneNum) || phoneNum < 0 || phoneNum > 255) {
      return 'User ID number must be a valid number between 0-255'
    }
    
    return null
  }

  const handleSubmit = async (): Promise<void> => {
    setIsLoading(true)
    setError('')
    setSuccess('')
    setLoadingMessage('Preparing transaction...')

    try {
      if (!isConnected || !accountId) {
        throw new Error('Wallet not connected')
      }

      // Validate form
      const validationError = validateForm()
      if (validationError) {
        throw new Error(validationError)
      }

      setLoadingMessage('Checking existing registration...')

      // Register user
      const userData: UserData = {
        name: userForm.name,
        homeAddress: userForm.homeAddress,
        phoneNumber: userForm.phoneNumber
      }

      const walletData = createWalletData(accountId, walletInterface)
      
      setLoadingMessage('Submitting transaction to blockchain...')
      const result = await registerUser(walletData, userData)

      if (result.success) {
        setLoadingMessage('')
        setSuccess(`Registration successful! Your user ID is: ${result.userId}. Transaction: ${result.txHash}`)
        setTimeout(() => {
          router.push('/dashboard')
        }, 4000)
      } else {
        throw new Error(result.error || 'Registration failed')
      }

    } catch (error: any) {
      console.error('Registration error:', error)
      setLoadingMessage('')
      setError(error.message)
    } finally {
      if (!success) {
        setIsLoading(false)
      }
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

  const getStepContent = (): React.JSX.Element | null => {
    const walletStatus = getWalletStatus()

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-black font-space-grotesk mb-2">Welcome to Pick'n'Get</h3>
              <p className="text-gray-600 text-sm font-inter">Join our recycling platform to earn rewards by recycling waste materials</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded"></div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-black font-space-grotesk">Recycler Account</h4>
                  <p className="text-sm text-gray-600 font-inter">Earn ECO tokens by recycling waste materials and contributing to a sustainable future</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500" />
                <span>Earn rewards for recycling</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500" />
                <span>Track your environmental impact</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500" />
                <span>Get pickup services for your recyclables</span>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-black font-space-grotesk mb-2">Connect Wallet</h3>
              <p className="text-gray-600 text-sm font-inter">Connect your Hedera wallet to continue with registration</p>
            </div>

            {!walletStatus.connected ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-inter">No wallet connected</p>
                <div className="text-sm text-gray-500 font-inter mb-4">
                  Please use the wallet connection in the header to connect your wallet, then return to continue registration.
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors font-space-grotesk"
                >
                  Refresh Page
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-green-600 font-inter">Wallet Connected Successfully</p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-700">Connected via {walletStatus.type}</p>
                  <p className="text-xs text-gray-500 font-mono">{walletStatus.address}</p>
                </div>
                <p className="text-sm text-gray-500 font-inter">Ready to proceed with registration</p>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-black font-space-grotesk mb-2">Your Information</h3>
              <p className="text-gray-600 text-sm font-inter">Please provide your details to complete registration</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={userForm.name}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Home Address</label>
                <textarea
                  name="homeAddress"
                  value={userForm.homeAddress}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your complete home address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User ID Number</label>
                <input
                  type="number"
                  name="phoneNumber"
                  value={userForm.phoneNumber}
                  onChange={handleFormChange}
                  min="0"
                  max="255"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter a unique number (0-255)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a unique number between 0-255. This will be your identification number in the system.
                  <br />
                  <span className="text-amber-600">Note: Due to smart contract limitations, we use numeric IDs instead of phone numbers.</span>
                </p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

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
                <span className="text-sm text-gray-500 font-inter">Step {currentStep} of 3</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {/* Success Display */}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-green-700 text-sm">{success}</span>
              </div>
            )}

            {/* Step Content */}
            {getStepContent()}

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              {currentStep < 3 ? (
                <button
                  onClick={handleContinue}
                  disabled={currentStep === 2 && !isConnected}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors font-space-grotesk flex items-center justify-center gap-2"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !isConnected}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors font-space-grotesk flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {loadingMessage || 'Registering on Blockchain...'}
                    </>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              )}

              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  disabled={isLoading}
                  className="w-full border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors font-space-grotesk"
                >
                  ← Back
                </button>
              )}
            </div>

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-600 font-inter mt-4">
              Already have an account? <a href="#" className="text-green-500 hover:underline">Sign in here</a>
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-8 mt-8 text-center">
            <div className="text-white">
              <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs font-inter">Blockchain Verified</p>
            </div>
            <div className="text-white">
              <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs font-inter">Earn ECO Tokens</p>
            </div>
            <div className="text-white">
              <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs font-inter">Secure & Private</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}