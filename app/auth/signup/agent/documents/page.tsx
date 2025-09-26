"use client"

import React, { useState, useContext, useEffect } from "react"
import { Check, Loader2, AlertCircle, Upload, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { MetamaskContext } from "../../../../contexts/MetamaskContext"
import { WalletConnectContext } from "../../../../contexts/WalletConnectContext"
import { useAgentSignup  } from "../../../../contexts/AgentSignupContext"
import { useWalletInterface } from "../../../../services/wallets/useWalletInterface"
import { registerRider, validateRiderData, RiderData, VehicleType } from "../../../../services/riderService"
import {  validateFile } from "../../../../apis/ipfsApi"
import AppLayout from "../../../../components/layout/AppLayout"
import { testPinataConnection } from "../../../../apis/ipfsApi"

interface DocumentUploadForm {
  driversLicense: File | null
  vehicleRegistration: File | null
  insuranceCertificate: File | null
  vehiclePhotos: File | null
  profilePhoto: File | null
}

interface UploadProgress {
  driversLicense: { uploading: boolean; progress: number; cid?: string; error?: string }
  vehicleRegistration: { uploading: boolean; progress: number; cid?: string; error?: string }
  insuranceCertificate: { uploading: boolean; progress: number; cid?: string; error?: string }
  vehiclePhotos: { uploading: boolean; progress: number; cid?: string; error?: string }
  profilePhoto: { uploading: boolean; progress: number; cid?: string; error?: string }
}

// Convert wallet interface data to format expected by riderService
const createWalletData = (accountId: string, walletInterface: any, network: string = "testnet"): [string, any, string] => {
  return [accountId, walletInterface, network];
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
  
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    driversLicense: { uploading: false, progress: 0 },
    vehicleRegistration: { uploading: false, progress: 0 },
    insuranceCertificate: { uploading: false, progress: 0 },
    vehiclePhotos: { uploading: false, progress: 0 },
    profilePhoto: { uploading: false, progress: 0 }
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Get wallet contexts
  const metamaskCtx = useContext(MetamaskContext)
  const walletConnectCtx = useContext(WalletConnectContext)
  const { accountId, walletInterface } = useWalletInterface()

  // Determine connection status
  const isConnected = !!(accountId && walletInterface)

  // Get signup context
  const { signupData, updateDocumentInfo, setCurrentStep, markStepCompleted, canProceedToStep } = useAgentSignup()

  // Set current step when component mounts
  useEffect(() => {
    setCurrentStep(4)
  }, [setCurrentStep])

  // Check if user can access this step
  useEffect(() => {
    if (!canProceedToStep(4)) {
      console.log("Cannot proceed to step 4, redirecting...")
      router.push('/auth/signup/agent/vehicle')
    }
  }, [canProceedToStep, router])

  useEffect(() => {
  // Test IPFS connection when component mounts
  const testConnection = async () => {
    try {
      const connection = await testPinataConnection();
      if (!connection.success) {
        console.error('❌ IPFS connection failed:', connection.error);
        setError('IPFS service unavailable. Please try again later.');
      }
    } catch (error) {
      console.error('❌ IPFS connection test error:', error);
    }
  };
  
  testConnection();
}, []);

  // const handleFileUpload = async (fieldName: keyof DocumentUploadForm, file: File | null) => {
  //   console.log(`📁 File upload initiated for ${fieldName}:`, file?.name);
    
  //   if (!file) {
  //     setFormData(prev => ({
  //       ...prev,
  //       [fieldName]: null
  //     }))
  //     setUploadProgress(prev => ({
  //       ...prev,
  //       [fieldName]: { uploading: false, progress: 0 }
  //     }))
      
  //     // Remove from context as well
  //     updateDocumentInfo({ [fieldName]: undefined })
  //     return
  //   }

  //   // Validate file before upload
  //   const validation = await validateFile(file, {
  //     maxSize: 10 * 1024 * 1024, // 10MB
  //     allowedTypes: ['image/*', 'application/pdf'],
  //     requiredExtensions: ['jpg', 'jpeg', 'png', 'pdf']
  //   })

  //   if (!validation.isValid) {
  //     console.error(`❌ File validation failed for ${fieldName}:`, validation.errors);
  //     setUploadProgress(prev => ({
  //       ...prev,
  //       [fieldName]: { 
  //         uploading: false, 
  //         progress: 0, 
  //         error: validation.errors?.[0] || 'File validation failed' 
  //       }
  //     }))
  //     return
  //   }

  //   // Start upload process
  //   setFormData(prev => ({
  //     ...prev,
  //     [fieldName]: file
  //   }))

  //   setUploadProgress(prev => ({
  //     ...prev,
  //     [fieldName]: { uploading: true, progress: 10 }
  //   }))

  //   try {
  //     console.log(`🚀 Starting IPFS upload for ${fieldName}...`);
      
  //     // Simulate progress during upload
  //     const progressInterval = setInterval(() => {
  //       setUploadProgress(prev => ({
  //         ...prev,
  //         [fieldName]: { 
  //           ...prev[fieldName], 
  //           progress: Math.min(prev[fieldName].progress + 10, 90) 
  //         }
  //       }))
  //     }, 500)

  //     // Upload to IPFS
  //     const uploadResult = await uploadToIPFS(file, `${fieldName}-${Date.now()}-${file.name}`)
      
  //     clearInterval(progressInterval)

  //     if (uploadResult.success) {
  //       console.log(`✅ IPFS upload successful for ${fieldName}:`, uploadResult.cid);
  //       setUploadProgress(prev => ({
  //         ...prev,
  //         [fieldName]: { 
  //           uploading: false, 
  //           progress: 100, 
  //           cid: uploadResult.cid 
  //         }
  //       }))
        
  //       // Update context with uploaded file info
  //       updateDocumentInfo({ 
  //         [fieldName]: {
  //           file,
  //           cid: uploadResult.cid!,
  //           url: uploadResult.url!
  //         }
  //       })
  //     } else {
  //       console.error(`❌ IPFS upload failed for ${fieldName}:`, uploadResult.error);
  //       setUploadProgress(prev => ({
  //         ...prev,
  //         [fieldName]: { 
  //           uploading: false, 
  //           progress: 0, 
  //           error: uploadResult.error || 'Upload failed' 
  //         }
  //       }))
  //     }

  //   } catch (error: any) {
  //     console.error(`💥 Upload error for ${fieldName}:`, error);
  //     setUploadProgress(prev => ({
  //       ...prev,
  //       [fieldName]: { 
  //         uploading: false, 
  //         progress: 0, 
  //         error: error.message || 'Upload failed' 
  //       }
  //     }))
  //   }
  // }
  const handleFileUpload = async (fieldName: keyof DocumentUploadForm, file: File | null) => {
  console.log(`📁 File upload initiated for ${fieldName}:`, file?.name);
  
  if (!file) {
    setFormData(prev => ({
      ...prev,
      [fieldName]: null
    }))
    setUploadProgress(prev => ({
      ...prev,
      [fieldName]: { uploading: false, progress: 0 }
    }))
    
    // Remove from context as well
    updateDocumentInfo({ [fieldName]: undefined })
    return
  }

  try {
    // Validate file before upload
    const validation = await validateFile(file, {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
    })

    if (!validation.isValid) {
      console.error(`❌ File validation failed for ${fieldName}:`, validation.errors);
      setUploadProgress(prev => ({
        ...prev,
        [fieldName]: { 
          uploading: false, 
          progress: 0, 
          error: validation.errors?.[0] || 'File validation failed' 
        }
      }))
      return
    }

    // Rest of your upload logic...
  } catch (error) {
    console.error(`💥 Validation error for ${fieldName}:`, error);
    setUploadProgress(prev => ({
      ...prev,
      [fieldName]: { 
        uploading: false, 
        progress: 0, 
        error: 'File validation error' 
      }
    }))
  }
};

  const removeFile = (fieldName: keyof DocumentUploadForm) => {
    console.log(`🗑️ Removing file for ${fieldName}`);
    setFormData(prev => ({
      ...prev,
      [fieldName]: null
    }))
    setUploadProgress(prev => ({
      ...prev,
      [fieldName]: { uploading: false, progress: 0 }
    }))
  }

  // const validateRequiredDocuments = (): string | null => {
  //   const required = ['driversLicense', 'vehicleRegistration', 'vehiclePhotos', 'profilePhoto'] as const
    
  //   for (const field of required) {
  //     // Check both upload progress and context data
  //     if (!uploadProgress[field].cid && !signupData.documentInfo[field]?.cid) {
  //       return `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`
  //     }
  //   }
    
  //   return null
  // }
const validateRequiredDocuments = (): string | null => {
  const required = ['driversLicense', 'vehicleRegistration', 'vehiclePhotos', 'profilePhoto'] as const
  
  for (const field of required) {
    // Check both current upload progress and context data
    const hasCID = uploadProgress[field].cid || signupData.documentInfo?.[field]?.cid;
    
    if (!hasCID) {
      const fieldName = field.replace(/([A-Z])/g, ' $1').toLowerCase();
      return `${fieldName} is required`;
    }
  }
  
  return null;
};

  const handleCreateAccount = async () => {
    console.log("🎯 Starting account creation process...");
    
    setIsLoading(true)
    setError('')
    setSuccess('')
    setLoadingMessage('Validating documents...')

    try {
      if (!isConnected || !accountId) {
        throw new Error('Wallet not connected')
      }

      // Validate required documents
      const documentError = validateRequiredDocuments()
      if (documentError) {
        throw new Error(documentError)
      }

      setLoadingMessage('Preparing rider registration data...')

      // Get form data from context instead of localStorage
      const { personalInfo, vehicleInfo, documentInfo } = signupData
      
      // Validate all required data is present
      if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.phoneNumber) {
        throw new Error('Personal information is incomplete')
      }
      
      if (!vehicleInfo.vehiclePlateNumber || !vehicleInfo.vehicleMakeModel) {
        throw new Error('Vehicle information is incomplete')
      }
      
      if (!documentInfo.vehiclePhotos?.cid || !documentInfo.vehicleRegistration?.cid) {
        throw new Error('Required documents are missing')
      }
      
      // Prepare rider data for blockchain registration
      const riderData: RiderData = {
        name: `${personalInfo.firstName} ${personalInfo.lastName}`,
        phoneNumber: parseInt(personalInfo.phoneNumber),
        vehicleNumber: vehicleInfo.vehiclePlateNumber,
        homeAddress: personalInfo.homeAddress,
        country: personalInfo.country,
        capacity: parseInt(vehicleInfo.carryingCapacity) || 10,
        vehicleImage: documentInfo.vehiclePhotos.cid,
        vehicleRegistration: documentInfo.vehicleRegistration.cid,
        vehicleType: VehicleType[vehicleInfo.vehicleType as keyof typeof VehicleType]
      }

      console.log("📋 Rider data prepared:", {
        name: riderData.name,
        phoneNumber: riderData.phoneNumber,
        vehicleNumber: riderData.vehicleNumber,
        vehicleType: VehicleType[riderData.vehicleType],
        capacity: riderData.capacity,
        vehicleImageCID: riderData.vehicleImage,
        vehicleRegistrationCID: riderData.vehicleRegistration
      });

      // Validate rider data
      const validation = validateRiderData(riderData)
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '))
      }

      setLoadingMessage('Submitting registration to blockchain...')

      // Register rider on blockchain
      const walletData = createWalletData(accountId, walletInterface)
      const result = await registerRider(walletData, riderData)

      if (result.success) {
        console.log("🎉 Rider registration successful!");
        
        // Mark step as completed
        markStepCompleted(4)
        
        setLoadingMessage('')
        setSuccess(`Registration successful! Your rider ID is: ${result.riderId}. Transaction: ${result.txHash}`)
        
        setTimeout(() => {
          router.push('/auth/signup/success')
        }, 4000)
      } else {
        throw new Error(result.error || 'Registration failed')
      }

    } catch (error: any) {
      console.error('💥 Account creation error:', error);
      setLoadingMessage('')
      setError(error.message || 'Account creation failed')
    } finally {
      if (!success) {
        setIsLoading(false)
      }
    }
  }

  const handleBack = () => {
    router.back()
  }

  const FileUploadField = ({ 
    label, 
    fieldName, 
    required = false, 
    file,
    progress,
    description
  }: { 
    label: string
    fieldName: keyof DocumentUploadForm
    required?: boolean
    file: File | null
    progress: UploadProgress[keyof UploadProgress]
    description?: string
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {description && (
        <p className="text-xs text-gray-500 mb-2 font-inter">{description}</p>
      )}
      
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
          disabled={progress.uploading || isLoading}
        />
        
        {progress.uploading ? (
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
            </div>
            <p className="text-sm text-blue-600 font-medium font-inter">Uploading...</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1 font-inter">{progress.progress}%</p>
          </div>
        ) : progress.cid ? (
          <div className="text-center">
            <div className="w-8 h-8 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
              <Check className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-sm text-green-600 font-medium font-inter">{file?.name}</p>
            <p className="text-xs text-gray-500 font-inter">Uploaded to IPFS</p>
            <p className="text-xs text-green-500 font-mono break-all mt-1">{progress.cid.substring(0, 20)}...</p>
            <button
              onClick={() => removeFile(fieldName)}
              className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center gap-1 mx-auto"
              disabled={isLoading}
            >
              <X className="w-3 h-3" />
              Remove
            </button>
          </div>
        ) : progress.error ? (
          <div className="text-center">
            <div className="w-8 h-8 bg-red-100 rounded-full mx-auto mb-2 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-sm text-red-600 font-medium font-inter">Upload Failed</p>
            <p className="text-xs text-red-500 font-inter">{progress.error}</p>
            <label
              htmlFor={fieldName}
              className="mt-2 inline-block bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium py-1 px-3 rounded-lg transition-colors font-inter cursor-pointer"
            >
              Try Again
            </label>
          </div>
        ) : (
          <label
            htmlFor={fieldName}
            className="cursor-pointer block"
          >
            <div className="text-center">
              <div className="w-8 h-8 bg-gray-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Upload className="w-4 h-4 text-gray-400" />
              </div>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg transition-colors font-inter">
                Choose File
              </button>
              <p className="text-xs text-gray-500 mt-1 font-inter">
                {file ? file.name : 'No file chosen'}
              </p>
              <p className="text-xs text-gray-400 mt-1 font-inter">
                Max 10MB • JPG, PNG, PDF
              </p>
            </div>
          </label>
        )}
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

            {/* Document Upload Content */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-black font-space-grotesk mb-2">Upload Documents</h3>
                <p className="text-gray-600 text-sm font-inter">Provide valid documents to become a verified agent. Files will be securely stored on IPFS.</p>
              </div>

              <div className="space-y-4">
                <FileUploadField
                  label="Driver's License"
                  fieldName="driversLicense"
                  required={true}
                  file={formData.driversLicense}
                  progress={uploadProgress.driversLicense}
                  description="Clear photo of your valid driver's license"
                />

                <FileUploadField
                  label="Vehicle Registration Certificate"
                  fieldName="vehicleRegistration"
                  required={true}
                  file={formData.vehicleRegistration}
                  progress={uploadProgress.vehicleRegistration}
                  description="Official vehicle registration document"
                />

                <FileUploadField
                  label="Insurance Certificate"
                  fieldName="insuranceCertificate"
                  file={formData.insuranceCertificate}
                  progress={uploadProgress.insuranceCertificate}
                  description="Optional for bikes, required for cars/trucks"
                />

                <FileUploadField
                  label="Vehicle Photos"
                  fieldName="vehiclePhotos"
                  required={true}
                  file={formData.vehiclePhotos}
                  progress={uploadProgress.vehiclePhotos}
                  description="Clear photos showing front, back, and side views"
                />

                <FileUploadField
                  label="Profile Photo"
                  fieldName="profilePhoto"
                  required={true}
                  file={formData.profilePhoto}
                  progress={uploadProgress.profilePhoto}
                  description="Professional headshot for your agent profile"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleCreateAccount}
                disabled={isLoading || !isConnected || !!validateRequiredDocuments()}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl transition-colors font-space-grotesk flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {loadingMessage || 'Creating Account...'}
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

            {/* Upload Status Summary */}
            {Object.values(uploadProgress).some(p => p.cid || p.error) && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Upload Status:</p>
                <div className="space-y-1 text-xs">
                  {Object.entries(uploadProgress).map(([key, progress]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                      <span className={progress.cid ? 'text-green-600' : progress.error ? 'text-red-600' : 'text-gray-500'}>
                        {progress.cid ? '✓ Uploaded' : progress.error ? '✗ Failed' : '○ Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}