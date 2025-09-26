"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Define the form data types
export interface PersonalInfo {
  firstName: string
  lastName: string
  phoneNumber: string // This will be converted to number (0-255) for blockchain
  homeAddress: string
  country: string
  nationalIdNumber: string
}

export interface VehicleInfo {
  vehicleType: 'bike' | 'car' | 'van' | 'truck'
  vehicleMakeModel: string
  vehiclePlateNumber: string
  vehicleColor: string
  carryingCapacity: string
}

export interface DocumentInfo {
  driversLicense?: {
    file: File
    cid: string
    url: string
  }
  vehicleRegistration?: {
    file: File
    cid: string
    url: string
  }
  insuranceCertificate?: {
    file: File
    cid: string
    url: string
  }
  vehiclePhotos?: {
    file: File
    cid: string
    url: string
  }
  profilePhoto?: {
    file: File
    cid: string
    url: string
  }
}

export interface AgentSignupData {
  walletConnected: boolean
  walletAddress?: string
  walletType?: string
  personalInfo: PersonalInfo
  vehicleInfo: VehicleInfo
  documentInfo: DocumentInfo
  currentStep: number
  completedSteps: number[]
}

// Context type
interface AgentSignupContextType {
  signupData: AgentSignupData
  updateWalletInfo: (walletAddress: string, walletType: string) => void
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void
  updateVehicleInfo: (info: Partial<VehicleInfo>) => void
  updateDocumentInfo: (info: Partial<DocumentInfo>) => void
  setCurrentStep: (step: number) => void
  markStepCompleted: (step: number) => void
  resetSignupData: () => void
  isStepCompleted: (step: number) => boolean
  canProceedToStep: (step: number) => boolean
  getFormCompletionPercentage: () => number
}

// Default signup data
const defaultSignupData: AgentSignupData = {
  walletConnected: false,
  personalInfo: {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    homeAddress: '',
    country: 'Ghana',
    nationalIdNumber: ''
  },
  vehicleInfo: {
    vehicleType: 'bike',
    vehicleMakeModel: '',
    vehiclePlateNumber: '',
    vehicleColor: '',
    carryingCapacity: '10'
  },
  documentInfo: {},
  currentStep: 1,
  completedSteps: []
}

// Create context
const AgentSignupContext = createContext<AgentSignupContextType | undefined>(undefined)

// Local storage key
const STORAGE_KEY = 'agent_signup_data'

// Provider component
export function AgentSignupProvider({ children }: { children: ReactNode }) {
  const [signupData, setSignupData] = useState<AgentSignupData>(defaultSignupData)

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY)
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        console.log("📥 Loaded signup data from localStorage:", parsedData)
        setSignupData(prev => ({ ...prev, ...parsedData }))
      }
    } catch (error) {
      console.error("❌ Failed to load signup data from localStorage:", error)
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      // Don't save File objects to localStorage (they're not serializable)
      const dataToSave = {
        ...signupData,
        documentInfo: Object.fromEntries(
          Object.entries(signupData.documentInfo).map(([key, value]) => [
            key,
            value ? { cid: value.cid, url: value.url } : undefined
          ])
        )
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
      console.log("💾 Saved signup data to localStorage")
    } catch (error) {
      console.error("❌ Failed to save signup data to localStorage:", error)
    }
  }, [signupData])

  // Update wallet information
  const updateWalletInfo = (walletAddress: string, walletType: string) => {
    console.log("🔗 Updating wallet info:", { walletAddress, walletType })
    setSignupData(prev => ({
      ...prev,
      walletConnected: true,
      walletAddress,
      walletType
    }))
  }

  // Update personal information
  const updatePersonalInfo = (info: Partial<PersonalInfo>) => {
    console.log("👤 Updating personal info:", info)
    setSignupData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info }
    }))
  }

  // Update vehicle information
  const updateVehicleInfo = (info: Partial<VehicleInfo>) => {
    console.log("🚗 Updating vehicle info:", info)
    setSignupData(prev => ({
      ...prev,
      vehicleInfo: { ...prev.vehicleInfo, ...info }
    }))
  }

  // Update document information
  const updateDocumentInfo = (info: Partial<DocumentInfo>) => {
    console.log("📄 Updating document info:", info)
    setSignupData(prev => ({
      ...prev,
      documentInfo: { ...prev.documentInfo, ...info }
    }))
  }

  // Set current step
  const setCurrentStep = (step: number) => {
    console.log("📍 Setting current step:", step)
    setSignupData(prev => ({
      ...prev,
      currentStep: step
    }))
  }

  // Mark step as completed
  const markStepCompleted = (step: number) => {
    console.log("✅ Marking step completed:", step)
    setSignupData(prev => ({
      ...prev,
      completedSteps: [...new Set([...prev.completedSteps, step])]
    }))
  }

  // Reset all signup data
  const resetSignupData = () => {
    console.log("🔄 Resetting signup data")
    setSignupData(defaultSignupData)
    localStorage.removeItem(STORAGE_KEY)
  }

  // Check if step is completed
  const isStepCompleted = (step: number): boolean => {
    return signupData.completedSteps.includes(step)
  }

  // Check if user can proceed to a specific step
  const canProceedToStep = (step: number): boolean => {
    switch (step) {
      case 1: // Wallet connection
        return true
      case 2: // Personal info
        return signupData.walletConnected
      case 3: // Vehicle info
        return signupData.walletConnected && 
               signupData.personalInfo.firstName.length > 0 &&
               signupData.personalInfo.lastName.length > 0 &&
               signupData.personalInfo.phoneNumber.length > 0 &&
               signupData.personalInfo.homeAddress.length > 0
      case 4: // Documents
        return signupData.walletConnected &&
               signupData.personalInfo.firstName.length > 0 &&
               signupData.vehicleInfo.vehiclePlateNumber.length > 0 &&
               signupData.vehicleInfo.vehicleMakeModel.length > 0
      default:
        return false
    }
  }

  // Get overall form completion percentage
  const getFormCompletionPercentage = (): number => {
    let completed = 0
    const total = 4

    // Step 1: Wallet connection
    if (signupData.walletConnected) completed++

    // Step 2: Personal info
    if (signupData.personalInfo.firstName && 
        signupData.personalInfo.lastName && 
        signupData.personalInfo.phoneNumber && 
        signupData.personalInfo.homeAddress) {
      completed++
    }

    // Step 3: Vehicle info
    if (signupData.vehicleInfo.vehiclePlateNumber && 
        signupData.vehicleInfo.vehicleMakeModel && 
        signupData.vehicleInfo.vehicleColor) {
      completed++
    }

    // Step 4: Documents
    const requiredDocs = ['driversLicense', 'vehicleRegistration', 'vehiclePhotos', 'profilePhoto']
    const uploadedDocs = requiredDocs.filter(doc => 
      signupData.documentInfo[doc as keyof DocumentInfo]?.cid
    )
    if (uploadedDocs.length === requiredDocs.length) {
      completed++
    }

    return Math.round((completed / total) * 100)
  }

  // Validation functions
  const validatePersonalInfo = (): string[] => {
    const errors: string[] = []
    const { personalInfo } = signupData

    if (!personalInfo.firstName.trim()) errors.push("First name is required")
    if (!personalInfo.lastName.trim()) errors.push("Last name is required")
    if (!personalInfo.phoneNumber.trim()) errors.push("Phone number is required")
    if (!personalInfo.homeAddress.trim()) errors.push("Home address is required")
    
    // Validate phone number range (0-255 for blockchain)
    const phoneNum = parseInt(personalInfo.phoneNumber)
    if (isNaN(phoneNum) || phoneNum < 0 || phoneNum > 255) {
      errors.push("Phone number must be between 0 and 255")
    }

    return errors
  }

  const validateVehicleInfo = (): string[] => {
    const errors: string[] = []
    const { vehicleInfo } = signupData

    if (!vehicleInfo.vehicleMakeModel.trim()) errors.push("Vehicle make/model is required")
    if (!vehicleInfo.vehiclePlateNumber.trim()) errors.push("Vehicle plate number is required")
    if (!vehicleInfo.vehicleColor.trim()) errors.push("Vehicle color is required")
    
    const capacity = parseInt(vehicleInfo.carryingCapacity)
    if (isNaN(capacity) || capacity <= 0) {
      errors.push("Carrying capacity must be a positive number")
    }

    return errors
  }

  const validateDocuments = (): string[] => {
    const errors: string[] = []
    const { documentInfo } = signupData

    if (!documentInfo.driversLicense?.cid) errors.push("Driver's license is required")
    if (!documentInfo.vehicleRegistration?.cid) errors.push("Vehicle registration is required")
    if (!documentInfo.vehiclePhotos?.cid) errors.push("Vehicle photos are required")
    if (!documentInfo.profilePhoto?.cid) errors.push("Profile photo is required")

    return errors
  }

  const contextValue: AgentSignupContextType = {
    signupData,
    updateWalletInfo,
    updatePersonalInfo,
    updateVehicleInfo,
    updateDocumentInfo,
    setCurrentStep,
    markStepCompleted,
    resetSignupData,
    isStepCompleted,
    canProceedToStep,
    getFormCompletionPercentage
  }

  return (
    <AgentSignupContext.Provider value={contextValue}>
      {children}
    </AgentSignupContext.Provider>
  )
}

// Custom hook to use the context
export function useAgentSignup() {
  const context = useContext(AgentSignupContext)
  if (context === undefined) {
    throw new Error('useAgentSignup must be used within an AgentSignupProvider')
  }
  return context
}

// Export default for convenience
export default AgentSignupContext