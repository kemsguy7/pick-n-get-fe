"use client"

import React, { useState } from "react"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"
import AppLayout from "../../../../components/layout/AppLayout"

interface DocumentUploadForm {
  driversLicense: File | null
  vehicleRegistration: File | null
  insuranceCertificate: File | null
  vehiclePhotos: File | null
  profilePhoto: File | null
}

export default function AgentSignupStep4(): React.JSX.Element {
  const router = useRouter()
  const [formData, setFormData] = useState<DocumentUploadForm>({
    driversLicense: null,
    vehicleRegistration: null,
    insuranceCertificate: null,
    vehiclePhotos: null,
    profilePhoto: null
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = (fieldName: keyof DocumentUploadForm, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: file
    }))
  }

  const handleCreateAccount = async () => {
    setIsLoading(true)
    
    // Simulate account creation process
    setTimeout(() => {
      setIsLoading(false)
      router.push('/auth/signup/success')
    }, 3000)
  }

  const handleBack = () => {
    router.back()
  }

  const FileUploadField = ({ 
    label, 
    fieldName, 
    required = false, 
    file 
  }: { 
    label: string
    fieldName: keyof DocumentUploadForm
    required?: boolean
    file: File | null 
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
        <input
          type="file"
          id={fieldName}
          accept="image/*,.pdf"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0] || null
            handleFileUpload(fieldName, selectedFile)
          }}
          className="hidden"
        />
        <label
          htmlFor={fieldName}
          className="cursor-pointer block"
        >
          {file ? (
            <div className="text-center">
              <div className="w-8 h-8 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-sm text-green-600 font-medium font-inter">{file.name}</p>
              <p className="text-xs text-gray-500 font-inter">Click to change file</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-8 h-8 bg-gray-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg transition-colors font-inter">
                Choose File
              </button>
              <p className="text-xs text-gray-500 mt-1 font-inter">No file chosen</p>
            </div>
          )}
        </label>
      </div>
    </div>
  )

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

            {/* Document Upload Content */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-black font-space-grotesk mb-2">Upload Documents</h3>
                <p className="text-gray-600 text-sm font-inter">Provide valid documents to become a verified agent.</p>
              </div>

              <div className="space-y-4">
                <FileUploadField
                  label="Driver's License"
                  fieldName="driversLicense"
                  required={true}
                  file={formData.driversLicense}
                />

                <FileUploadField
                  label="Vehicle Registration Certificate"
                  fieldName="vehicleRegistration"
                  required={true}
                  file={formData.vehicleRegistration}
                />

                <FileUploadField
                  label="Insurance Certificate (Optional for Bikes)"
                  fieldName="insuranceCertificate"
                  file={formData.insuranceCertificate}
                />

                <FileUploadField
                  label="Vehicle Photos (front, back, side)"
                  fieldName="vehiclePhotos"
                  required={true}
                  file={formData.vehiclePhotos}
                />

                <FileUploadField
                  label="Profile Photo"
                  fieldName="profilePhoto"
                  required={true}
                  file={formData.profilePhoto}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleCreateAccount}
                disabled={isLoading}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl transition-colors font-space-grotesk flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Create Account
                  </>
                )}
              </button>

              <button
                onClick={handleBack}
                disabled={isLoading}
                className="w-full border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors font-space-grotesk"
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