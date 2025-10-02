"use client"

import React, { useState, useEffect } from "react"
import { MapPin, Phone, AlertCircle, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAgentSignup } from "../../../../contexts/AgentSignupContext"
import AppLayout from "../../../../components/layout/AppLayout"

export default function AgentSignupStep2(): React.JSX.Element {
  const router = useRouter()
  const { signupData, updatePersonalInfo, setCurrentStep, markStepCompleted, canProceedToStep } = useAgentSignup()
 
console.log("🔄 Component re-render - Personal Info Page");
console.log("📊 Current signup data:", signupData);
  
  const [errors, setErrors] = useState<string[]>([])
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

  // Set current step when component mounts
  useEffect(() => {
  setCurrentStep(2)
}, []) // Empty dependency array


  // Check if user can access this step
 useEffect(() => {
  if (!canProceedToStep(2)) {
    console.log("Cannot proceed to step 2, redirecting to step 1")
    router.push('/auth/signup/agent')
  }
}, []) // Empty dependency array - only check once on mount

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value } = e.target
  
  // Add this guard to prevent unnecessary updates
  if (signupData.personalInfo[name as keyof typeof signupData.personalInfo] === value) {
    return; // Don't update if value hasn't changed
  }
  
  console.log(`🔄 Input changed: ${name} = ${value}`);
  
  // Mark field as touched
  setTouchedFields(prev => new Set([...prev, name]))
  
  // Update the context
  updatePersonalInfo({ [name]: value })
  
  // Clear errors when user starts typing
  if (errors.length > 0) {
    validateForm({ ...signupData.personalInfo, [name]: value })
  }
}

  const validateForm:any = (data = signupData.personalInfo): string[] => {
    const newErrors: string[] = []

    if (!data.firstName.trim()) newErrors.push("First name is required")
    if (!data.lastName.trim()) newErrors.push("Last name is required")
    if (!data.phoneNumber.trim()) newErrors.push("User ID number is required")
    if (!data.homeAddress.trim()) newErrors.push("Home address is required")
    // if (!data.nationalIdNumber.trim()) newErrors.push("National ID number is required")
    
    // Validate phone number range (0-255 for blockchain)
    const phoneNum = parseInt(data.phoneNumber)
    if (data.phoneNumber && (isNaN(phoneNum) || phoneNum < 0 || phoneNum > 255)) {
      newErrors.push("User ID number must be between 0 and 255")
    }

    // Validate name lengths
    if (data.firstName && data.firstName.length < 2) {
      newErrors.push("First name must be at least 2 characters")
    }
    if (data.lastName && data.lastName.length < 2) {
      newErrors.push("Last name must be at least 2 characters")
    }

    // Validate address length
    if (data.homeAddress && data.homeAddress.length < 10) {
      newErrors.push("Home address must be at least 10 characters")
    }

    setErrors(newErrors)
    return newErrors
  }

  const handleContinue = () => {
    // Mark all fields as touched for validation display
    const allFields = new Set(['firstName', 'lastName', 'phoneNumber', 'homeAddress'])
    setTouchedFields(allFields)
    
    const validationErrors = validateForm()
    if (validationErrors.length === 0) {
      markStepCompleted(2)
      router.push('/auth/signup/agent/vehicle')
    }
  }

  const handleBack = () => {
    router.back()
  }

  const getFieldError = (fieldName: string): string | null => {
    if (!touchedFields.has(fieldName)) return null
    return errors.find(error => error.toLowerCase().includes(fieldName.toLowerCase())) || null
  }

  const isFormValid = () => {
    const data = signupData.personalInfo;
    
    // Check if all required fields are filled
    const hasRequiredFields = data.firstName.trim() &&
                            data.lastName.trim() &&
                            data.phoneNumber.trim() &&
                            data.homeAddress.trim(); 

    // Fix the phone number validation logic
    const phoneNum = parseInt(data.phoneNumber);
    const isValidPhone = data.phoneNumber.trim() ? (!isNaN(phoneNum) && phoneNum >= 0 && phoneNum <= 255) : false;
    
    // Check minimum lengths
    const isValidLength = (data.firstName.length >= 2) &&
                        (data.lastName.length >= 2) &&
                        (data.homeAddress.length >= 10);
    
    return hasRequiredFields && isValidPhone && isValidLength;
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
                <span className="text-sm text-gray-500 font-inter">Step 2 of 4</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-2/4"></div>
              </div>
            </div>

            {/* Error Display */}
            {errors.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-700 text-sm font-medium">Please fix the following errors:</span>
                </div>
                <ul className="text-red-600 text-sm space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-xs">• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Wallet Status */}
            {signupData.walletConnected && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-green-700 text-sm text-wrap">Wallet connected: {signupData.walletAddress?.substring(0, 6)}...{signupData.walletAddress?.substring(-4)}</span>
              </div>
            )}

            {/* Personal Information Content */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-black font-space-grotesk mb-2">Personal Information</h3>
                <p className="text-gray-600 text-sm font-inter">Tell us about yourself to complete your agent profile</p>
              </div>

              <div className="space-y-4">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-inter">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={signupData.personalInfo.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-inter ${
                        getFieldError('firstName') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {getFieldError('firstName') && (
                      <p className="text-red-500 text-xs mt-1">{getFieldError('firstName')}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-inter">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={signupData.personalInfo.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-inter ${
                        getFieldError('lastName') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {getFieldError('lastName') && (
                      <p className="text-red-500 text-xs mt-1">{getFieldError('lastName')}</p>
                    )}
                  </div>
                </div>

                {/* User ID Number (Phone Number for blockchain) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-inter">
                    User ID Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="number"
                      name="phoneNumber"
                      value={signupData.personalInfo.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="123"
                      min="0"
                      max="255"
                      className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-inter ${
                        getFieldError('phoneNumber') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter a unique number between 0-255. This will be your identification number in the system.
                  </p>
                  {getFieldError('phoneNumber') && (
                    <p className="text-red-500 text-xs mt-1">{getFieldError('phoneNumber')}</p>
                  )}
                </div>

                {/* Home Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-inter">
                    Home Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <textarea
                      name="homeAddress"
                      value={signupData.personalInfo.homeAddress}
                      onChange={handleInputChange}
                      placeholder="123 Housing Estate, Cape Town"
                      rows={3}
                      className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none font-inter ${
                        getFieldError('homeAddress') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    This field must be at least 10 characters long.
                  </p>
                  {getFieldError('homeAddress') && (
                    <p className="text-red-500 text-xs mt-1">{getFieldError('homeAddress')}</p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-inter">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="country"
                      value={signupData.personalInfo.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white font-inter"
                    >
                      <option value="Ghana">Ghana</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="Kenya">Kenya</option>
                      <option value="South Africa">South Africa</option>
                      <option value="Uganda">Uganda</option>
                      <option value="Tanzania">Tanzania</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* National ID Number */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-inter">
                    National ID Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nationalIdNumber"
                    value={signupData.personalInfo.nationalIdNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your national ID number"
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-inter ${
                      getFieldError('nationalIdNumber') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {getFieldError('nationalIdNumber') && (
                    <p className="text-red-500 text-xs mt-1">{getFieldError('nationalIdNumber')}</p>
                  )}
                </div> */}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleContinue}
                disabled={!isFormValid()}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors font-space-grotesk flex items-center justify-center gap-2"
              >
                Vehicle Information →
              </button>

              <button
                onClick={handleBack}
                className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors font-space-grotesk"
              >
                ← Back
              </button>
            </div>

            {/* Form Progress Indicator */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{Math.round((Object.values(signupData.personalInfo).filter(val => val.trim()).length / 6) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-green-500 h-1 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min((Object.values(signupData.personalInfo).filter(val => val.trim()).length / 6) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}