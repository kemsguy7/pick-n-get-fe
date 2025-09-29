"use client"

import React, { useState, useEffect } from "react"
import { Check, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAgentSignup  } from "../../../../contexts/AgentSignupContext"
import AppLayout from "../../../../components/layout/AppLayout"

export default function AgentSignupStep3(): React.JSX.Element {
  const router = useRouter()
  const { signupData, updateVehicleInfo, setCurrentStep, markStepCompleted, canProceedToStep } = useAgentSignup()
  
  const [errors, setErrors] = useState<string[]>([])
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false)
  const [showCapacityDropdown, setShowCapacityDropdown] = useState(false)

  // Set current step when component mounts
  useEffect(() => {
    setCurrentStep(3)
  }, [])

  // Check if user can access this step
  useEffect(() => {
    if (!canProceedToStep(3)) {
      console.log("Cannot proceed to step 3, redirecting...")
      router.push('/auth/signup/agent/personal-info')
    }
  }, [])

  const vehicleTypes = [
    { value: 'bike', label: 'Bike', selected: signupData.vehicleInfo.vehicleType === 'bike' },
    { value: 'car', label: 'Car', selected: signupData.vehicleInfo.vehicleType === 'car' },
    { value: 'van', label: 'Van', selected: signupData.vehicleInfo.vehicleType === 'van' },
    { value: 'truck', label: 'Truck', selected: signupData.vehicleInfo.vehicleType === 'truck' }
  ]

  const capacityOptions = ['5', '10', '20', '50', '100', '200', '500']

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Mark field as touched
    setTouchedFields(prev => new Set([...prev, name]))
    
    // Update the context
    updateVehicleInfo({ [name]: value })
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      validateForm({ ...signupData.vehicleInfo, [name]: value })
    }
  }

  const handleVehicleTypeSelect = (type: 'bike' | 'car' | 'van' | 'truck') => {
    setTouchedFields(prev => new Set([...prev, 'vehicleType']))
    updateVehicleInfo({ vehicleType: type })
    setShowVehicleDropdown(false)
    
    // Auto-adjust default capacity based on vehicle type
    const defaultCapacities: Record<typeof type, string> = {
      bike: '10',
      car: '50',
      van: '200',
      truck: '500'
    }
    
    if (!signupData.vehicleInfo.carryingCapacity || signupData.vehicleInfo.carryingCapacity === 'in kg') {
      updateVehicleInfo({ carryingCapacity: defaultCapacities[type] })
    }
  }

  const handleCapacitySelect = (capacity: string) => {
    setTouchedFields(prev => new Set([...prev, 'carryingCapacity']))
    updateVehicleInfo({ carryingCapacity: capacity })
    setShowCapacityDropdown(false)
  }

  const validateForm = (data = signupData.vehicleInfo): string[] => {
    const newErrors: string[] = []

    if (!data.vehicleMakeModel.trim()) newErrors.push("Vehicle make/model is required")
    if (!data.vehiclePlateNumber.trim()) newErrors.push("Vehicle plate number is required")
    if (!data.vehicleColor.trim()) newErrors.push("Vehicle color is required")
    
    const capacity = parseInt(data.carryingCapacity)
    if (!data.carryingCapacity || isNaN(capacity) || capacity <= 0) {
      newErrors.push("Valid carrying capacity is required")
    }

    // Validate plate number format (basic validation)
    if (data.vehiclePlateNumber && data.vehiclePlateNumber.length < 3) {
      newErrors.push("Vehicle plate number must be at least 3 characters")
    }

    // Validate make/model length
    if (data.vehicleMakeModel && data.vehicleMakeModel.length < 2) {
      newErrors.push("Vehicle make/model must be at least 2 characters")
    }

    setErrors(newErrors)
    return newErrors
  }

  const handleContinue = () => {
    // Mark all fields as touched for validation display
    const allFields = new Set(['vehicleMakeModel', 'vehiclePlateNumber', 'vehicleColor', 'carryingCapacity'])
    setTouchedFields(allFields)
    
    const validationErrors = validateForm()
    if (validationErrors.length === 0) {
      markStepCompleted(3)
      router.push('/auth/signup/agent/documents')
    }
  }

  const handleBack = () => {
    router.back()
  }

  const getFieldError = (fieldName: string): string | null => {
    if (!touchedFields.has(fieldName)) return null
    return errors.find(error => error.toLowerCase().includes(fieldName.toLowerCase().replace(/([A-Z])/g, ' $1'))) || null
  }

    const isFormValid = () => {
      const data = signupData.vehicleInfo;
      
      // Check if all required fields are filled
      const hasRequiredFields = data.vehicleMakeModel.trim() &&
                              data.vehiclePlateNumber.trim() &&
                              data.vehicleColor.trim() &&
                              data.carryingCapacity;
      
      // Check field lengths without calling validateForm
      const isValidLength = data.vehicleMakeModel.length >= 2 &&
                          data.vehiclePlateNumber.length >= 3;
      
      // Check capacity is valid
      const capacity = parseInt(data.carryingCapacity);
      const isValidCapacity = !isNaN(capacity) && capacity > 0;
      
      return hasRequiredFields && isValidLength && isValidCapacity;
  }

  const getVehicleTypeEmoji = (type: string): string => {
    const emojis: Record<string, string> = {
      bike: '🏍️',
      car: '🚗',
      van: '🚐',
      truck: '🚛'
    }
    return emojis[type] || '🚗'
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
                <span className="text-sm text-gray-500 font-inter">Step 3 of 4</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
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

            {/* Vehicle Information Content */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-black font-space-grotesk mb-2">Vehicle Information</h3>
                <p className="text-gray-600 text-sm font-inter">Help us match the right rides for recycling pickups.</p>
              </div>

              <div className="space-y-4">
                {/* Vehicle Type */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-inter">
                    Vehicle Type <span className="text-red-500">*</span>
                  </label>
                  <div
                    onClick={() => setShowVehicleDropdown(!showVehicleDropdown)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white cursor-pointer flex items-center justify-between font-inter"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getVehicleTypeEmoji(signupData.vehicleInfo.vehicleType)}</span>
                      <span className="capitalize">{signupData.vehicleInfo.vehicleType}</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {showVehicleDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      {vehicleTypes.map((vehicle) => (
                        <div
                          key={vehicle.value}
                          onClick={() => handleVehicleTypeSelect(vehicle.value as 'bike' | 'car' | 'van' | 'truck')}
                          className="px-3 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center justify-between font-inter"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getVehicleTypeEmoji(vehicle.value)}</span>
                            <span>{vehicle.label}</span>
                          </div>
                          {vehicle.selected && <Check className="w-4 h-4 text-green-500" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Vehicle Make/Model */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-inter">
                    Vehicle Make/Model <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="vehicleMakeModel"
                    value={signupData.vehicleInfo.vehicleMakeModel}
                    onChange={handleInputChange}
                    placeholder="e.g., Toyota Corolla, Honda CBR"
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-inter ${
                      getFieldError('vehicleMakeModel') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {getFieldError('vehicleMakeModel') && (
                    <p className="text-red-500 text-xs mt-1">{getFieldError('vehicleMakeModel')}</p>
                  )}
                </div>

                {/* Vehicle Plate Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-inter">
                    Vehicle Plate Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="vehiclePlateNumber"
                    value={signupData.vehicleInfo.vehiclePlateNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., ABC-123, GH-1234-20"
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-inter ${
                      getFieldError('vehiclePlateNumber') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {getFieldError('vehiclePlateNumber') && (
                    <p className="text-red-500 text-xs mt-1">{getFieldError('vehiclePlateNumber')}</p>
                  )}
                </div>

                {/* Vehicle Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-inter">
                    Vehicle Color <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="vehicleColor"
                    value={signupData.vehicleInfo.vehicleColor}
                    onChange={handleInputChange}
                    placeholder="e.g., Red, Blue, White"
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-inter ${
                      getFieldError('vehicleColor') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {getFieldError('vehicleColor') && (
                    <p className="text-red-500 text-xs mt-1">{getFieldError('vehicleColor')}</p>
                  )}
                </div>

                {/* Carrying Capacity */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-inter">
                    Carrying Capacity (kg) <span className="text-red-500">*</span>
                  </label>
                  <div
                    onClick={() => setShowCapacityDropdown(!showCapacityDropdown)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white cursor-pointer flex items-center justify-between font-inter"
                  >
                    <span>{signupData.vehicleInfo.carryingCapacity} kg</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {showCapacityDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {capacityOptions.map((capacity) => (
                        <div
                          key={capacity}
                          onClick={() => handleCapacitySelect(capacity)}
                          className="px-3 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center justify-between font-inter"
                        >
                          <span>{capacity} kg</span>
                          {signupData.vehicleInfo.carryingCapacity === capacity && <Check className="w-4 h-4 text-green-500" />}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum weight your vehicle can safely carry for recycling pickups
                  </p>
                </div>
              </div>

              {/* Vehicle Type Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Vehicle Type Information:</h4>
                <div className="text-xs text-blue-700 space-y-1">
                  <p><strong>Bike:</strong> Ideal for small recyclables, documents pickup</p>
                  <p><strong>Car:</strong> Perfect for medium-sized waste collection</p>
                  <p><strong>Van:</strong> Great for bulk recyclables and multiple pickups</p>
                  <p><strong>Truck:</strong> Best for large-scale waste collection</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleContinue}
                disabled={!isFormValid()}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors font-space-grotesk flex items-center justify-center gap-2"
              >
                Upload Documents →
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
                <span>Vehicle Info Progress</span>
                <span>{Math.round((Object.values(signupData.vehicleInfo).filter(val => val && val.trim()).length / 5) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-green-500 h-1 rounded-full transition-all duration-300" 
                  style={{ width: `${(Object.values(signupData.vehicleInfo).filter(val => val && val.trim()).length / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}