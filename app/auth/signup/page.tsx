"use client"

import React, { useState } from "react"
import { Check, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import AppLayout from "../../components/layout/AppLayout"

interface UserRole {
  id: 'recycler' | 'agent' | 'vendor'
  title: string
  description: string
  icon: string
  bgColor: string
  selected: boolean
}

export default function SignupMainPage(): React.JSX.Element {
  const [selectedRole, setSelectedRole] = useState<'recycler' | 'agent' | 'vendor'>('recycler')
  const router = useRouter()

  const userRoles: UserRole[] = [
    {
      id: 'recycler',
      title: 'Recycler',
      description: 'Earn rewards by recycling waste materials',
      icon: '♻️',
      bgColor: 'bg-green-50',
      selected: selectedRole === 'recycler'
    },
    {
      id: 'agent',
      title: 'Pickup Agent',
      description: 'Collect recyclables and earn income',
      icon: '🚛',
      bgColor: 'bg-blue-50',
      selected: selectedRole === 'agent'
    },
    {
      id: 'vendor',
      title: 'Vendor',
      description: 'Sell sustainable products made from recycled materials',
      icon: '🏪',
      bgColor: 'bg-purple-50',
      selected: selectedRole === 'vendor'
    }
  ]

  const handleContinue = () => {
    switch (selectedRole) {
      case 'recycler':
        router.push('/auth/signup/recycler')
        break
      case 'agent':
        router.push('/auth/signup/agent')
        break
      case 'vendor':
        router.push('/auth/signup/vendor')
        break
    }
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
                <div className="bg-green-500 h-2 rounded-full w-1/2"></div>
              </div>
            </div>

            {/* Role Selection Content */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-black font-space-grotesk mb-2">Choose Your Role</h3>
                <p className="text-gray-600 text-sm font-inter">Select how you want to participate in the Pick'n'Get ecosystem</p>
              </div>

              <div className="space-y-3">
                {userRoles.map((role) => (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      role.selected
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {role.selected && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      <div className={`w-10 h-10 ${role.bgColor} rounded-lg flex items-center justify-center`}>
                        <span className="text-lg">{role.icon}</span>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-black font-space-grotesk">{role.title}</h4>
                        <p className="text-sm text-gray-600 font-inter">{role.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Button */}
            <div className="mt-6">
              <button
                onClick={handleContinue}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors font-space-grotesk flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-600 font-inter mt-4">
              Already have an account? <a href="#" className="text-green-500 hover:underline">Sign in here</a>
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-8 mt-8 text-center">
            <div className="text-white">
              <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs font-inter">Earn ECO Tokens</p>
            </div>
            <div className="text-white">
              <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs font-inter">Verified Platform</p>
            </div>
            <div className="text-white">
              <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs font-inter">Secure & Private</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}