"use client"

import type { RecycleFormData } from "./page"

interface ConfirmationProps {
  formData: RecycleFormData
  onReset: () => void
}

export default function Confirmation({ formData, onReset }: ConfirmationProps) {
  const calculateEarnings = () => {
    if (!formData.category || !formData.weight) return 0
    return Number.parseFloat(formData.weight) * formData.category.rate
  }

  const earnings = calculateEarnings()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 text-center">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-green-400 mb-4 font-space-grotesk">Recycling Request Submitted! 🎉</h2>
          <p className="text-gray-300 font-inter">Your recycling request has been successfully submitted.</p>
          <p className="text-gray-300 font-inter">Our verified agent will contact you soon.</p>
        </div>

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
              <span className="text-green-600 font-semibold">₦{earnings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pickup Date:</span>
              <span className="text-gray-800 font-medium">{formData.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Request ID:</span>
              <span className="text-gray-800 font-medium">{formData.requestId}</span>
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
            Track Pickup
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
            Submit Another
          </button>
        </div>
      </div>
    </div>
  )
}
