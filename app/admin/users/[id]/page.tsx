"use client"
import { useState } from "react"
import { ArrowLeft, CheckCircle } from 'lucide-react'
import AppLayout from '../../../components/layout/AppLayout'

interface UserDetails {
  name: string
  userId: string
  email: string
  phone: string
  role: string
  country: string
  itemsRecycled: number
  status: string
  balance: string
}

export default function ManageUserPage() {
  const [currentAction, setCurrentAction] = useState<'default' | 'approve' | 'pay' | 'ban' | 'delete' | 'success'>('default')
  const [actionType, setActionType] = useState<'approve' | 'pay' | 'ban' | 'delete'>('approve')
  const [paymentAmount, setPaymentAmount] = useState('')
  const [banReason, setBanReason] = useState('')

  const userDetails: UserDetails = {
    name: 'Adaora Okafor',
    userId: '#U001',
    email: 'adaoraokafor@example.com',
    phone: '+234 812 345 6789',
    role: 'Recycler',
    country: 'Nigeria',
    itemsRecycled: 12,
    status: 'Active',
    balance: '120 HBAR'
  }

  const handleAction = (action: 'approve' | 'pay' | 'ban' | 'delete') => {
    setActionType(action)
    setCurrentAction(action)
  }

  const handleConfirmAction = () => {
    setCurrentAction('success')
  }

  const renderActionContent = () => {
    switch (currentAction) {
      case 'approve':
        return (
          <div className="bg-black/80 rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <h3 className="text-white font-semibold font-space-grotesk">Approve User</h3>
            </div>
            <p className="text-gray-400 mb-6 font-inter">
              Check documents and confirm approval.
            </p>
            <button
              onClick={handleConfirmAction}
              className="gradient-button px-6 py-2 rounded-lg text-black font-semibold hover:shadow-lg transition-all duration-200 font-inter"
            >
              Confirm Approval
            </button>
          </div>
        )

      case 'pay':
        return (
          <div className="bg-black/80 rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-white font-semibold font-space-grotesk mb-4">Pay User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm font-inter mb-2">Amount:</label>
                <input
                  type="text"
                  placeholder="Enter Amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full bg-[#1a2928] border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                />
              </div>
              <button
                onClick={handleConfirmAction}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors font-inter"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        )

      case 'ban':
        return (
          <div className="bg-black/80 rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-white font-semibold font-space-grotesk mb-4">Ban User</h3>
            <div className="space-y-4">
              <textarea
                placeholder="Enter Reason"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                rows={4}
                className="w-full bg-[#1a2928] border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 resize-none"
              />
              <button
                onClick={handleConfirmAction}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors font-inter"
              >
                Confirm Ban
              </button>
            </div>
          </div>
        )

      case 'delete':
        return (
          <div className="bg-black/80 rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <h3 className="text-red-400 font-semibold font-space-grotesk">Delete User</h3>
            </div>
            <p className="text-gray-400 mb-6 font-inter">
              This action cannot be undone. Are you sure?
            </p>
            <button
              onClick={handleConfirmAction}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors font-inter"
            >
              Confirm Delete
            </button>
          </div>
        )

      case 'success':
        const successMessages = {
          approve: 'User has been approved!',
          pay: 'Payment Sent Successfully!',
          ban: 'User has been banned!',
          delete: 'User deleted permanently!'
        }
        
        return (
          <div className="bg-black/80 rounded-xl p-6 border border-slate-700/50">
            <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-green-400 font-semibold font-space-grotesk">
                {successMessages[actionType]}
              </p>
            </div>
            <button
              onClick={() => setCurrentAction('default')}
              className="mt-4 flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors font-inter"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Users
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <AppLayout showHeader={true} showSidebar={true} showFooter={true}>
      <div className="min-h-screen p-4 lg:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentAction('default')}
              className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors font-inter"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Users
            </button>
            <h1 className="text-2xl lg:text-3xl font-bold text-primary font-space-grotesk">
              Manage User
            </h1>
          </div>

          {/* User Info Card */}
          <div className="bg-black/80 rounded-xl p-6 border border-slate-700/50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-inter">Name:</span>
                  <span className="text-white font-semibold font-space-grotesk">{userDetails.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-inter">Email:</span>
                  <span className="text-white font-inter">{userDetails.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-inter">Phone:</span>
                  <span className="text-white font-inter">{userDetails.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-inter">Role:</span>
                  <span className="text-white font-inter">{userDetails.role}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-inter">User ID:</span>
                  <span className="text-white font-semibold font-space-grotesk">{userDetails.userId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-inter">Country:</span>
                  <span className="text-white font-inter">{userDetails.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-inter">Items Recycled:</span>
                  <span className="text-white font-inter">{userDetails.itemsRecycled}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-inter">Status:</span>
                  <span className="bg-[#DCFCE7] text-primary px-3 py-1 rounded-full text-xs font-medium">
                    {userDetails.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-inter">Balance:</span>
                  <span className="text-white font-inter">{userDetails.balance}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {currentAction === 'default' && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                <button
                  onClick={() => handleAction('pay')}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors font-inter"
                >
                  Pay User
                </button>
                <button
                  onClick={() => handleAction('ban')}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors font-inter"
                >
                  Ban User
                </button>
                <button
                  onClick={() => handleAction('approve')}
                  className="gradient-button text-black font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-200 font-inter"
                >
                  Approve User
                </button>
                <button
                  onClick={() => handleAction('delete')}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors font-inter"
                >
                  Delete User
                </button>
              </div>
            )}
          </div>

          {/* Action Content */}
          {renderActionContent()}
        </div>
      </div>
    </AppLayout>
  )
}