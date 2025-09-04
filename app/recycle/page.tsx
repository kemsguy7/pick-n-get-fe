"use client"

import { useState } from "react"

import StepIndicator from "../components/recycle/step-indicator"
import SelectCategory from "../components/recycle/select-category"
import ItemDetails from "../components/recycle/item-details"
import PickupSchedule from "../components/recycle/pickup-schedule"
import Confirmation from "../components/recycle/confirmation"

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
    // Generate request ID
    const requestId = `#REC${Math.floor(Math.random() * 1000000)}`
    updateFormData({ requestId })
    nextStep()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-slate-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-space-grotesk">
            Submit Recycling Items ♻️
          </h1>
          <p className="text-lg text-gray-300 font-inter">Turn your waste into rewards while helping the environment</p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Step Content */}
        <div className="mt-12">
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
  )
}
