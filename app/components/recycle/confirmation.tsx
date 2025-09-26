"use client"

import { useState, useContext, useEffect } from "react"
import { Check, Loader2, AlertCircle, ExternalLink } from "lucide-react"
import type { RecycleFormData } from "../../recycle/page"
import { MetamaskContext } from "../../contexts/MetamaskContext"
import { WalletConnectContext } from "../../contexts/WalletConnectContext"
import { useWalletInterface } from "../../services/wallets/useWalletInterface"
import { recycleItem, RecycleItemData } from "../../services/recycleService"

interface ConfirmationProps {
  formData: RecycleFormData
  onReset: () => void
}

// Convert wallet interface data to format expected by recycleService
const createWalletData = (accountId: string, walletInterface: any, network: string = "testnet"): [string, any, string] => {
  return [accountId, walletInterface, network];
}

export default function Confirmation({ formData, onReset }: ConfirmationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [error, setError] = useState<string>('')
  const [txHash, setTxHash] = useState<string>('')
  const [actualEarnings, setActualEarnings] = useState<number>(0)
  const [itemId, setItemId] = useState<number>(0)

  // Get wallet contexts
  const metamaskCtx = useContext(MetamaskContext)
  const walletConnectCtx = useContext(WalletConnectContext)
  const { accountId, walletInterface } = useWalletInterface()

  // Determine connection status
  const isConnected = !!(accountId && walletInterface)

  const calculateEarnings = () => {
    if (!formData.category || !formData.weight) return 0
    return Number.parseFloat(formData.weight) * formData.category.rate
  }

  const estimatedEarnings = calculateEarnings()

  // Auto-submit on component mount
  useEffect(() => {
    if (isConnected && submitStatus === 'pending') {
      handleBlockchainSubmission()
    } else if (!isConnected && submitStatus === 'pending') {
      setError('Wallet not connected')
      setSubmitStatus('error')
    }
  }, [isConnected, submitStatus])

  const handleBlockchainSubmission = async () => {
    if (!isConnected || !formData.category || !formData.weight) {
      setError('Missing required data for submission')
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // Prepare recycling item data
      const recycleData: RecycleItemData = {
        type: formData.category.id,
        weight: parseFloat(formData.weight),
        description: formData.description || `${formData.category.name} - ${formData.weight}kg`,
        // Note: In a full implementation, ill'd later handle photo upload here
        // imageData: formData.photos.length > 0 ? await convertPhotoToBytes(formData.photos[0]) : undefined
      }

      const walletData = createWalletData(accountId!, walletInterface!)
      const result = await recycleItem(walletData, recycleData)

      if (result.success) {
        setTxHash(result.txHash || '')
        setActualEarnings(result.estimatedEarnings || estimatedEarnings)
        setItemId(result.itemId || 1)
        setSubmitStatus('success')
      } else {
        throw new Error(result.error || 'Submission failed')
      }

    } catch (err: any) {
      console.error('Blockchain submission error:', err)
      setError(err.message)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getWalletStatus = () => {
    if (metamaskCtx.metamaskAccountAddress) {
      return { type: 'MetaMask', address: metamaskCtx.metamaskAccountAddress }
    } else if (walletConnectCtx.accountId) {
      return { type: 'WalletConnect', address: walletConnectCtx.accountId }
    }
    return { type: 'None', address: '' }
  }

  const walletStatus = getWalletStatus()

  if (submitStatus === 'pending' || isSubmitting) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 text-center">
          <div className="mb-8">
            <Loader2 className="w-16 h-16 text-green-400 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">
              Submitting to Blockchain...
            </h2>
            <p className="text-gray-300 font-inter">
              {isSubmitting ? 'Processing your recycling request on the blockchain...' : 'Preparing submission...'}
            </p>
            <p className="text-sm text-gray-400 font-inter mt-2">
              This may take a few moments. Please don't close this window.
            </p>
          </div>

          {/* Submission Progress */}
          <div className="bg-black/60 rounded-xl p-6 max-w-md mx-auto">
            <h3 className="text-white font-semibold mb-4 font-space-grotesk">Submitting via {walletStatus.type}</h3>
            <div className="space-y-3 text-sm font-inter text-left">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Form data validated</span>
              </div>
              <div className="flex items-center gap-2">
                {isSubmitting ? <Loader2 className="w-4 h-4 text-blue-400 animate-spin" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-400" />}
                <span className="text-gray-300">Submitting to contract</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                <span className="text-gray-300">Awaiting confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (submitStatus === 'error') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 text-center">
          <div className="mb-8">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-400 mb-4 font-space-grotesk">Submission Failed</h2>
            <p className="text-gray-300 font-inter mb-4">
              There was an error submitting your recycling request to the blockchain.
            </p>
            
            {/* Error Details */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm font-inter">{error}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                setSubmitStatus('pending')
                setError('')
                handleBlockchainSubmission()
              }}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg text-white transition-colors font-inter"
            >
              Try Again
            </button>
            <button
              onClick={onReset}
              className="bg-gray-500 hover:bg-gray-600 px-6 py-3 rounded-lg text-white transition-colors font-inter"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 text-center">
        <div className="mb-8">
          <Check className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-green-400 mb-4 font-space-grotesk">
            Recycling Request Submitted Successfully! 🎉
          </h2>
          <p className="text-gray-300 font-inter">Your recycling request has been recorded on the blockchain.</p>
          <p className="text-gray-300 font-inter">Our verified agent will contact you soon for pickup.</p>
        </div>

        {/* Blockchain Confirmation */}
        {txHash && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
            <h3 className="text-green-400 font-semibold mb-2 font-space-grotesk">Blockchain Confirmation</h3>
            <div className="flex items-center justify-center gap-2 text-sm font-inter">
              <span className="text-gray-300">Transaction Hash:</span>
              <code className="text-green-400 font-mono text-xs break-all">{txHash}</code>
              <a
                href={`https://hashscan.io/testnet/transaction/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* Request Summary */}
        <div className="bg-white/95 rounded-xl p-6 mb-8 text-left max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center font-space-grotesk">Request Summary</h3>
          <div className="space-y-3 text-sm font-inter">
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="text-gray-800 font-medium">{formData.category?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Weight:</span>
              <span className="text-gray-800 font-medium">{formData.weight} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Earning:</span>
              <span className="text-green-600 font-semibold">₦{actualEarnings.toFixed(2)}</span>
            </div>
            {itemId && (
              <div className="flex justify-between">
                <span className="text-gray-600">Item ID:</span>
                <span className="text-gray-800 font-medium">#{itemId}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Submitted via:</span>
              <span className="text-gray-800 font-medium">{walletStatus.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="text-green-600 font-medium">Pending Pickup</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-black px-6 py-3 rounded-lg text-white hover:bg-gray-800 transition-colors font-inter flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Track Pickup Status
          </button>
          <button
            onClick={onReset}
            className="bg-gradient-to-r from-yellow-400 to-green-500 px-6 py-3 rounded-lg text-black font-semibold hover:from-yellow-500 hover:to-green-600 transition-all font-inter flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Submit Another Item
          </button>
        </div>
      </div>
    </div>
  )
}