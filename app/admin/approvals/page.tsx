"use client"
import { useState, useContext } from "react"
import { Users, CheckCircle, BarChart3, Settings, AlertCircle, Loader2, X, ChevronRight } from 'lucide-react'
import AppLayout from "../../components/layout/AppLayout"
import StatCard, { StatCardProps } from "../../components/ui/statCard"
import { MetamaskContext } from "../../contexts/MetamaskContext"
import { WalletConnectContext } from "../../contexts/WalletConnectContext"
import { useWalletInterface } from "../../services/wallets/useWalletInterface"
import { approveRider, banRider } from "../../services/adminService"

interface PendingApproval {
  id: string
  riderId: number
  name: string
  email: string
  location: string
  documents: number
  submissionDate: string
  status: 'NEW' | 'PENDING'
  avatar: string
  userType: 'agent' | 'vendor'
}

// Convert wallet interface data to format expected by adminService
const createWalletData = (accountId: string, walletInterface: any, network: string = "testnet"): [string, any, string] => {
  return [accountId, walletInterface, network];
}

export default function AdminApprovalsPage() {
  const [activeTab, setActiveTab] = useState('approvals')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [actionType, setActionType] = useState<'approve' | 'ban' | null>(null)

  // Get wallet contexts
  const metamaskCtx = useContext(MetamaskContext)
  const walletConnectCtx = useContext(WalletConnectContext)
  const { accountId, walletInterface } = useWalletInterface()

  // Determine connection status
  const isConnected = !!(accountId && walletInterface)

  // Stats data for approvals page
  const statsData: StatCardProps[] = [
    {
      icon: Users,
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-100',
      title: 'Pending Approvals',
      titleColor: 'text-orange-600',
      value: '23',
      valueColor: 'text-orange-600',
      subtitle: '15 agents, 8 vendors',
      subtitleColor: 'text-orange-500',
      backgroundColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      icon: CheckCircle,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      title: 'Approved Today',
      titleColor: 'text-blue-600',
      value: '8',
      valueColor: 'text-blue-600',
      subtitle: '6 agents, 2 vendors',
      subtitleColor: 'text-blue-500',
      backgroundColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: X,
      iconColor: 'text-red-600',
      iconBgColor: 'bg-red-100',
      title: 'Rejected Today',
      titleColor: 'text-red-600',
      value: '2',
      valueColor: 'text-red-600',
      subtitle: '1 agent, 1 vendor',
      subtitleColor: 'text-red-500',
      backgroundColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      icon: Users,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      title: 'Avg. Approval Time',
      titleColor: 'text-green-600',
      value: '2.5 hrs',
      valueColor: 'text-green-600',
      subtitle: 'Down 30% this week',
      subtitleColor: 'text-green-500',
      backgroundColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ]

  const pendingApprovals: PendingApproval[] = [
    {
      id: '1',
      riderId: 1,
      name: 'John Doe',
      email: 'john@example.com',
      location: 'Lagos, Nigeria',
      documents: 3,
      submissionDate: '2025-01-15',
      status: 'NEW',
      avatar: '/api/placeholder/40/40',
      userType: 'agent'
    },
    {
      id: '2',
      riderId: 2,
      name: 'Green Products Ltd',
      email: 'info@greenproducts.com',
      location: 'Abuja, Nigeria',
      documents: 5,
      submissionDate: '2025-01-14',
      status: 'PENDING',
      avatar: '/api/placeholder/40/40',
      userType: 'vendor'
    },
    {
      id: '3',
      riderId: 3,
      name: 'Emma Wilson',
      email: 'emma@example.com',
      location: 'Kano, Nigeria',
      documents: 4,
      submissionDate: '2025-01-13',
      status: 'NEW',
      avatar: '/api/placeholder/40/40',
      userType: 'agent'
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'approvals', label: 'Approvals', icon: CheckCircle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-orange-100 text-orange-600 border border-orange-200'
      case 'PENDING':
        return 'bg-blue-100 text-blue-600 border border-blue-200'
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200'
    }
  }

  const handleApprove = async (approval: PendingApproval) => {
    if (!isConnected) {
      setErrorMessage("Please connect your wallet first")
      return
    }

    console.log(`🎯 Starting approval process for rider ID: ${approval.riderId}`);
    
    setIsProcessing(true)
    setProcessingId(approval.id)
    setActionType('approve')
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const walletData = createWalletData(accountId!, walletInterface!)
      const result = await approveRider(walletData, approval.riderId)

      if (result.success) {
        setSuccessMessage(`✅ Successfully approved ${approval.name}! Transaction: ${result.txHash?.substring(0, 10)}...`)
        console.log(`🎉 Approval successful for ${approval.name}`);
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(''), 5000)
      } else {
        throw new Error(result.error || 'Approval failed')
      }
    } catch (error: any) {
      console.error('❌ Approval error:', error);
      setErrorMessage(error.message || 'Failed to approve rider')
    } finally {
      setIsProcessing(false)
      setProcessingId(null)
      setActionType(null)
    }
  }

  const handleReject = async (approval: PendingApproval) => {
    if (!isConnected) {
      setErrorMessage("Please connect your wallet first")
      return
    }

    console.log(`🎯 Starting ban process for rider ID: ${approval.riderId}`);
    
    setIsProcessing(true)
    setProcessingId(approval.id)
    setActionType('ban')
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const walletData = createWalletData(accountId!, walletInterface!)
      const result = await banRider(walletData, approval.riderId)

      if (result.success) {
        setSuccessMessage(`✅ Successfully rejected ${approval.name}! Transaction: ${result.txHash?.substring(0, 10)}...`)
        console.log(`🎉 Rejection successful for ${approval.name}`);
        
        setTimeout(() => setSuccessMessage(''), 5000)
      } else {
        throw new Error(result.error || 'Rejection failed')
      }
    } catch (error: any) {
      console.error('❌ Rejection error:', error);
      setErrorMessage(error.message || 'Failed to reject rider')
    } finally {
      setIsProcessing(false)
      setProcessingId(null)
      setActionType(null)
    }
  }

  return (
    <AppLayout showHeader={true} showSidebar={true} showFooter={true}>
      <div className="min-h-screen p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row mt-4 lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-gradient bg-transparent bg-clip-text mb-2 font-space-grotesk">
                Pending Approvals
              </h1>
              <p className="text-lg secondary-text font-inter">
                Review and approve agent and vendor applications
              </p>
            </div>
            <div className="flex gap-3">
              {!isConnected ? (
                <div className="px-6 py-2 bg-orange-100 border border-orange-300 rounded-lg text-orange-700 text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Connect wallet to manage approvals
                </div>
              ) : (
                <div className="px-6 py-2 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Connected: {accountId?.substring(0, 8)}...
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {statsData.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-700 font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex overflow-x-auto bg-[#1a2928] rounded-lg p-1 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-0 px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-[#EDFFF3] text-primary'
                    : 'lighter-green-text hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Pending Approvals Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold font-space-grotesk text-xl">
                Review Applications ({pendingApprovals.length})
              </h3>
            </div>

            {/* Approval Cards */}
            <div className="space-y-4">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="bg-black/80 rounded-xl p-6 border border-slate-700/50 hover:border-green-500/30 transition-all">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <img 
                        src={approval.avatar} 
                        alt={approval.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-semibold font-space-grotesk text-lg">{approval.name}</h4>
                          <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                            approval.userType === 'vendor' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {approval.userType}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm font-inter mb-1">{approval.email}</p>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-gray-500 font-inter">{approval.location}</span>
                          <span className="text-gray-600">•</span>
                          <span className="text-gray-500 font-inter">{approval.documents} documents</span>
                          <span className="text-gray-600">•</span>
                          <span className="text-gray-500 font-inter">Rider ID: #{approval.riderId}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getStatusBadge(approval.status)}`}>
                        {approval.status}
                      </span>
                      <span className="text-gray-400 text-sm font-inter whitespace-nowrap">{approval.submissionDate}</span>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => window.open(`/admin/approvals/${approval.id}`, '_blank')}
                          className="px-4 py-2 bg-gray-800 border border-slate-600 rounded-lg text-white text-sm font-medium hover:bg-slate-700 transition-colors flex items-center gap-1"
                        >
                          Review
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        
                        <button 
                          onClick={() => handleApprove(approval)}
                          disabled={isProcessing || !isConnected}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-1 min-w-[100px] justify-center"
                        >
                          {isProcessing && processingId === approval.id && actionType === 'approve' ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Approving...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </>
                          )}
                        </button>
                        
                        <button 
                          onClick={() => handleReject(approval)}
                          disabled={isProcessing || !isConnected}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-1 min-w-[100px] justify-center"
                        >
                          {isProcessing && processingId === approval.id && actionType === 'ban' ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Rejecting...
                            </>
                          ) : (
                            <>
                              <X className="w-4 h-4" />
                              Reject
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}