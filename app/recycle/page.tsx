"use client"

import { useState, useContext } from "react"
import { AlertCircle } from "lucide-react"
import AppLayout from "../components/layout/AppLayout"
import StepIndicator from "../components/recycle/step-indicator"
import SelectCategory from "../components/recycle/select-category"
import ItemDetails from "../components/recycle/item-details"
import PickupSchedule from "../components/recycle/pickup-schedule"
import Confirmation from "../components/recycle/confirmation"
// import { MetamaskContext } from "../contexts/MetamaskContext"
// import { WalletConnectContext } from "../contexts/WalletConnectContext"
import { useWalletInterface } from "../services/wallets/useWalletInterface"

export interface RecycleFormData {
  category: {
    id: string
    name: string
    icon: string
    rate: number
    description: string
    examples: string[]
  } | null
  weight: string
  description: string
  photos: File[]
  address: string
  date: string
  time: string
  requestId?: string
  selectedVehicle?: 'bike' | 'car' | 'truck'
  selectedDriver?: string
}

export default function RecyclePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<RecycleFormData>({
    category: null,
    weight: "",
    description: "",
    photos: [],
    address: "",
    date: "",
    time: "",
  })

  // Get wallet connection status
  // const metamaskCtx = useContext(MetamaskContext)
  // const walletConnectCtx = useContext(WalletConnectContext)
  const { accountId, walletInterface } = useWalletInterface()
  const isConnected = !!(accountId && walletInterface)

  const updateFormData = (data: Partial<RecycleFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const submitForm = () => {
    // Generate a mock request ID (in real app, this might come from backend)
    const requestId = `#REC${Math.floor(Math.random() * 1000000)}`
    updateFormData({ requestId })
    nextStep()
  }

  // Wallet connection warning
  if (!isConnected) {
    return (
      <AppLayout showHeader={true} showSidebar={true} showFooter={true}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">
              Wallet Connection Required
            </h2>
            <p className="text-gray-300 font-inter mb-6">
              You need to connect your wallet to submit recycling items to the blockchain.
            </p>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
              <p className="text-blue-400 text-sm font-inter">
                Connect your wallet using the header menu to access blockchain recycling features.
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg text-white transition-colors font-inter"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout showHeader={true} showSidebar={true} showFooter={true}> 
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-space-grotesk">
              Submit Recycling Items ♻️
            </h1>
            <p className="text-lg text-gray-300 font-inter secondary-text">
              Turn your waste into rewards while helping the environment
            </p>
            
            {/* Wallet Status Indicator */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mt-4 max-w-md mx-auto">
              <p className="text-green-400 text-sm font-inter">
                ✅ Wallet Connected - Ready to submit to blockchain
              </p>
            </div>
          </div>

          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} />

          {/* Step Content */}
          <div className="mt-12 pb-16 md:pb-24">
            {currentStep === 1 && (
              <SelectCategory formData={formData} updateFormData={updateFormData} onNext={nextStep} />
            )}
            {currentStep === 2 && (
              <ItemDetails formData={formData} updateFormData={updateFormData} onNext={nextStep} onBack={prevStep} />
            )}
            {currentStep === 3 && (
              <PickupSchedule
                formData={formData}
                updateFormData={updateFormData}
                onSubmit={submitForm}
                onBack={prevStep}
              />
            )}
            {currentStep === 4 && (
              <Confirmation
                formData={formData}
                onReset={() => {
                  setCurrentStep(1)
                  setFormData({
                    category: null,
                    weight: "",
                    description: "",
                    photos: [],
                    address: "",
                    date: "",
                    time: "",
                  })
                }}
              />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}