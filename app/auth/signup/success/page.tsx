"use client"

import React from "react"
import { useRouter } from "next/navigation"
import AppLayout from "../../../components/layout/AppLayout"

export default function SignupSuccessPage(): React.JSX.Element {
  const router = useRouter()

  const handleGoToDashboard = () => {
    router.push('/dashboard')
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

          {/* Success Card */}
          <div className="bg-gray-800/90 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 text-center">
            <div className="space-y-6">
              {/* Success Message */}
              <div>
                <h2 className="text-2xl font-bold text-green-400 font-space-grotesk mb-4">
                  Account Successfully Created! 🎉
                </h2>
                <p className="text-gray-300 font-inter leading-relaxed">
                  Your account has been successfully created. Go ahead and save to save our environment.
                </p>
              </div>

              {/* Go to Dashboard Button */}
              <button
                onClick={handleGoToDashboard}
                className="w-full bg-gradient-to-r from-yellow-400 to-green-500 hover:from-yellow-500 hover:to-green-600 text-black font-semibold py-4 px-6 rounded-xl transition-all duration-200 font-space-grotesk text-lg"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}