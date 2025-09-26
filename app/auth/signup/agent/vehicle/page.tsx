"use client"

import React, { useState } from "react"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"
import AppLayout from "../../../../components/layout/AppLayout"

interface VehicleInfoForm {
  vehicleType: 'bike' | 'car' | 'van' | 'truck'
  vehicleMakeModel: string
  vehiclePlateNumber: string
  vehicleColor: string
  carryingCapacity: string
}

export default function AgentSignupStep3(): React.JSX.Element {
  const router = useRouter()
  const [formData, setFormData] = useState<VehicleInfoForm>({
    vehicleType: 'bike',
    vehicleMakeModel: '',
    vehiclePlateNumber: '',
    vehicleColor: '',
    carryingCapacity: 'in kg'
  })

  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false)
  const [showCapacityDropdown, setShowCapacityDropdown] = useState(false)

  const vehicleTypes = [
    { value: 'bike', label: 'Bike', selected: formData.vehicleType === 'bike' },
    { value: 'car', label: 'Car', selected: formData.vehicleType === 'car' },
    { value: 'van', label: 'Van', selected: formData.vehicleType === 'van' },
    { value: 'truck', label: 'Truck', selected: formData.vehicleType === 'truck' }
  ]

  const capacityOptions = ['in kg', '5 kg', '10 kg', '20 kg', '50 kg', '100 kg']

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleVehicleTypeSelect = (type: 'bike' | 'car' | 'van' | 'truck') => {
    setFormData(prev => ({
      ...prev,
      vehicleType: type
    }))
    setShowVehicleDropdown(false)
  }

  const handleCapacitySelect = (capacity: string) => {
    setFormData(prev => ({
      ...prev,
      carryingCapacity: capacity
    }))
    setShowCapacityDropdown(false)
  }

  const handleContinue = () => {
    router.push('/auth/signup/agent/documents')
  }

  const handleBack = () => {
    router.back()
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
                <span className="text-sm text-gray-500 font-inter">Step 4 of 4</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-full"></div>
              </div>
            </div>

            {/* Vehicle Information Content */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-black font-space-grotesk mb-2">Vehicle Information</h3>
                <p className="text-gray-600 text-sm font-inter">Help us match the right rides for recycling pickups.</p>
              </div>

              <div className="space-y-4">
                {/* Vehicle Type */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-inter">Vehicle Type</label>
                  <div
                    onClick={() => setShowVehicleDropdown(!showVehicleDropdown)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white cursor-pointer flex items-center justify-between font-inter"
                  >
                    <span className="capitalize">{formData.vehicleType}</span>
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
                          <span>{vehicle.label}</span>
                          {vehicle.selected && <Check className="w-4 h-4 text-green-500" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Vehicle Make/Model */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-inter">Vehicle Make/Model</label>
                  <input
                    type="text"
                    name="vehicleMakeModel"
                    value={formData.vehicleMakeModel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-inter"
                  />
                </div>

                {/* Vehicle Plate Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-inter">Vehicle Plate Number</label>
                  <input
                    type="text"
                    name="vehiclePlateNumber"
                    value={formData.vehiclePlateNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-inter"
                  />
                </div>

                {/* Vehicle Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-inter">Vehicle Color</label>
                  <input
                    type="text"
                    name="vehicleColor"
                    value={formData.vehicleColor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-inter"
                  />
                </div>

                {/* Carrying Capacity */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-inter">Carrying Capacity</label>
                  <div
                    onClick={() => setShowCapacityDropdown(!showCapacityDropdown)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white cursor-pointer flex items-center justify-between font-inter"
                  >
                    <span>{formData.carryingCapacity}</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {showCapacityDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      {capacityOptions.map((capacity) => (
                        <div
                          key={capacity}
                          onClick={() => handleCapacitySelect(capacity)}
                          className="px-3 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center justify-between font-inter"
                        >
                          <span>{capacity}</span>
                          {formData.carryingCapacity === capacity && <Check className="w-4 h-4 text-green-500" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleContinue}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors font-space-grotesk flex items-center justify-center gap-2"
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
          </div>
        </div>
      </div>
    </AppLayout>
  )
}