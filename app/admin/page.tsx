"use client"
import { useState, useEffect, useContext } from "react"
import { Users, CheckCircle, BarChart3, Settings, TrendingUp, AlertTriangle, Info, Clock, DollarSign, Search, Filter, X, Loader2, ChevronRight } from 'lucide-react'
import AppLayout from "../components/layout/AppLayout"
import StatCard, { StatCardProps } from "../components/ui/statCard"
import { useRouter, useSearchParams } from "next/navigation"
import { MetamaskContext } from "../contexts/MetamaskContext"
import { WalletConnectContext } from "../contexts/WalletConnectContext"
import { useWalletInterface } from "../services/wallets/useWalletInterface"
import { approveRider, banRider } from "../services/adminService"


interface User {
  id: string
  name: string
  location: string
  avatar: string
  status: 'ACTIVE' | 'PENDING' | 'AGENT'
  userType: 'Recycler' | 'Vendor' | 'Agent'
  recycled: string
  earned: string
  userId: string
}

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
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMaterial, setSelectedMaterial] = useState('Paper & Cardboard')
  const [pricePerKg, setPricePerKg] = useState('$10/kg')
  const [fundingAmount, setFundingAmount] = useState('$1000')
  
  // Approval state
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

  // Handle tab query parameter
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['overview', 'users', 'approvals', 'analytics', 'settings'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    router.replace(`/admin?tab=${tabId}`, { scroll: false })
  }

  // Stats data for admin dashboard
  const statsData: StatCardProps[] = [
    {
      icon: Users,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      title: 'Total Users',
      titleColor: 'text-green-600',
      value: '12,450',
      valueColor: 'text-green-600',
      subtitle: '+15.2% from last month',
      subtitleColor: 'text-green-500',
      backgroundColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      icon: TrendingUp,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      title: 'Active Agents',
      titleColor: 'text-blue-600',
      value: '156',
      valueColor: 'text-blue-600',
      subtitle: '89% completion rate',
      subtitleColor: 'text-blue-500',
      backgroundColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: CheckCircle,
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
      title: 'Verified Vendors',
      titleColor: 'text-purple-600',
      value: '89',
      valueColor: 'text-purple-600',
      subtitle: '4.8 avg rating',
      subtitleColor: 'text-purple-500',
      backgroundColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      icon: DollarSign,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      title: 'Platform Revenue',
      titleColor: 'text-green-600',
      value: '$245,780.5',
      valueColor: 'text-green-600',
      subtitle: '+12% from last month',
      subtitleColor: 'text-green-500',
      backgroundColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'approvals', label: 'Approvals', icon: CheckCircle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const systemAlerts = [
    {
      type: 'error',
      title: 'Server Performance',
      message: 'High CPU usage detected on main server',
      time: '5 minutes ago',
      icon: AlertTriangle
    },
    {
      type: 'warning', 
      title: 'Payment Gateway',
      message: 'Increased transaction failures',
      time: '1 hour ago',
      icon: Info
    },
    {
      type: 'info',
      title: 'Scheduled Maintenance',
      message: 'Database backup completed successfully',
      time: '3 hours ago',
      icon: Clock
    }
  ]
  const users: User[] = [
    {
      id: '1',
      name: 'Adaora Okafor',
      location: 'Lagos, Nigeria',
      avatar: '/api/placeholder/40/40',
      status: 'ACTIVE',
      userType: 'Recycler',
      recycled: '47.3kg',
      earned: '$156.75',
      userId: '#U001'
    },
    {
      id: '2',
      name: 'Green Products Ltd',
      location: 'Abuja, Nigeria',
      avatar: '/api/placeholder/40/40',
      status: 'PENDING',
      userType: 'Vendor',
      recycled: '32.1kg',
      earned: '$98.5',
      userId: '#V001'
    },
    {
      id: '3',
      name: 'Georgina Wilson',
      location: 'Lagos, Nigeria',
      avatar: '/api/placeholder/40/40',
      status: 'AGENT',
      userType: 'Agent',
      recycled: '47.3kg',
      earned: '$156.75',
      userId: '#A002'
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

  const revenueData = {
    thisMonth: '$45,780',
    thisWeek: '$12,450',
    growthRate: '+15.2%'
  }

  const userDistribution = {
    regularUsers: { percentage: 89, label: 'Regular Users' },
    agents: { percentage: 8, label: 'Agents' },
    vendors: { percentage: 3, label: 'Vendors' }
  }

  const performanceMetrics = [
    { label: 'User Engagement', percentage: 87 },
    { label: 'System Uptime', percentage: 99.8 },
    { label: 'Transaction Success', percentage: 96.2 }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-[#DCFCE7] text-primary border border-green-200'
      case 'PENDING':
        return 'bg-orange-100 text-orange-600 border border-orange-200'
      case 'AGENT':
        return 'bg-blue-100 text-blue-600 border border-blue-200'
      case 'NEW':
        return 'bg-orange-100 text-orange-600 border border-orange-200'
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
                Welcome, Kemsguy
              </h1>
              <p className="text-lg secondary-text font-inter">
                Manage and monitor the PicknGet platform
              </p>
            </div>
            <div className="flex gap-3">
              {!isConnected ? (
                <div className="px-6 py-2 bg-orange-100 border border-orange-300 rounded-lg text-orange-700 text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Connect wallet for admin actions
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
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-700 font-medium">{errorMessage}</span>
            </div>
          )}

          {/* System Alerts */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h3 className="text-orange-600 font-semibold font-space-grotesk">System Alerts (3)</h3>
            </div>
            
            <div className="space-y-3">
              {systemAlerts.map((alert, index) => (
                <div key={index} className="bg-white rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      alert.type === 'error' ? 'bg-red-100' :
                      alert.type === 'warning' ? 'bg-orange-100' : 'bg-blue-100'
                    }`}>
                      <alert.icon className={`w-5 h-5 ${
                        alert.type === 'error' ? 'text-red-600' :
                        alert.type === 'warning' ? 'text-orange-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 font-space-grotesk">{alert.title}</p>
                      <p className="text-sm text-gray-600 font-inter">{alert.message}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 font-inter">{alert.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex overflow-x-auto bg-[#1a2928] rounded-lg p-1 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
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

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'users' && <UsersTab />}
            {activeTab === 'approvals' && <ApprovalsTab />}
            {activeTab === 'analytics' && <AnalyticsTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </div>
      </div>
    </AppLayout>
  )
  // Tab Components
  function OverviewTab() {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Analytics */}
        <div className="bg-black/80 rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-green-400" />
            <h3 className="text-white font-semibold font-space-grotesk">Revenue Analytics</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600 font-space-grotesk">{revenueData.thisMonth}</p>
              <p className="text-green-600 text-sm font-inter">This Month</p>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600 font-space-grotesk">{revenueData.thisWeek}</p>
              <p className="text-blue-600 text-sm font-inter">This Week</p>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-green-400 font-semibold">
              <TrendingUp className="w-4 h-4" />
              <span>Growth Rate: {revenueData.growthRate}</span>
            </div>
          </div>
        </div>

        {/* User Distribution */}
        <div className="bg-black/80 rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-blue-400" />
            <h3 className="text-white font-semibold font-space-grotesk">User Distribution</h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(userDistribution).map(([key, data]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-white font-medium font-inter">{data.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                  <span className="text-white font-semibold text-sm min-w-[35px]">{data.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Performance Metrics */}
        <div className="lg:col-span-2 bg-black/80 rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-white font-semibold mb-6 font-space-grotesk">Platform Performance Metrics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-white mb-2 font-space-grotesk">
                  {metric.percentage}%
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${metric.percentage}%` }}
                  />
                </div>
                <p className="text-gray-400 text-sm font-inter">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  function UsersTab() {
    const handleViewProfile = (userId: string) => {
      router.push(`/admin/users/${userId}/profile`)
    }

    const handleManageUser = (userId: string) => {
      router.push(`/admin/users/${userId}`)
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold font-space-grotesk text-2xl">User Management</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#1a2928] border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 min-w-[250px]"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-black border border-slate-600 rounded-lg text-white hover:bg-slate-700 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user.id} className="bg-black rounded-xl p-6 border border-slate-700/50 hover:border-green-500/30 transition-all">
              <div className="flex items-start gap-3 mb-4">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-white font-semibold font-space-grotesk text-lg truncate">{user.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                      {user.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm font-inter">{user.location}</p>
                  <p className="text-gray-500 text-sm font-inter">{user.userId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <span className="text-gray-400 block">Recycled:</span>
                  <span className="text-white font-semibold">{user.recycled}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">{user.userType}</span>
                  <span className="text-green-400 font-semibold">Earned: {user.earned}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleViewProfile(user.id)}
                  className="w-full py-2 px-4 bg-transparent border border-slate-600 rounded-lg text-white text-sm font-medium hover:bg-slate-700 transition-colors"
                >
                  View Profile
                </button>
                <button 
                  onClick={() => handleManageUser(user.id)}
                  className="w-full py-2 px-4 bg-transparent border border-slate-600 rounded-lg text-white text-sm font-medium hover:bg-slate-700 transition-colors"
                >
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  function ApprovalsTab() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold font-space-grotesk text-2xl">Pending Approvals ({pendingApprovals.length})</h3>
          <button 
            onClick={() => router.push('/admin/approvals')}
            className="gradient-button px-6 py-3 rounded-lg text-black font-semibold hover:shadow-lg transition-all duration-200 font-inter flex items-center gap-2"
          >
            View All Approvals
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {pendingApprovals.map((approval) => (
            <div key={approval.id} className="bg-black rounded-xl p-6 border border-slate-700/50 hover:border-green-500/30 transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={approval.avatar} 
                    alt={approval.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-semibold font-space-grotesk text-lg">{approval.name}</h4>
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        approval.userType === 'vendor' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {approval.userType}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm font-inter mb-1">{approval.email}</p>
                    <p className="text-gray-500 text-sm font-inter">{approval.location} • {approval.documents} documents • Rider #{approval.riderId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm font-inter">{approval.submissionDate}</span>
                  
                  <div className="flex gap-2">
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
    )
  }
  function AnalyticsTab() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Revenue Analytics */}
          <div className="bg-black rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-green-400" />
              <h3 className="text-green-400 font-semibold font-space-grotesk text-lg">Revenue Analytics</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg p-6 text-center">
                <p className="text-3xl font-bold text-green-600 font-space-grotesk mb-1">{revenueData.thisMonth}</p>
                <p className="text-green-600 text-sm font-inter font-medium">This Month</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center">
                <p className="text-3xl font-bold text-blue-600 font-space-grotesk mb-1">{revenueData.thisWeek}</p>
                <p className="text-blue-600 text-sm font-inter font-medium">This Week</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium font-inter">Growth Rate</span>
                <span className="text-green-400 font-semibold text-lg">{revenueData.growthRate}</span>
              </div>
              <div className="w-full bg-white rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>

          {/* User Distribution */}
          <div className="bg-black rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-blue-400" />
              <h3 className="text-blue-400 font-semibold font-space-grotesk text-lg">User Distribution</h3>
            </div>
            
            <div className="space-y-6">
              {Object.entries(userDistribution).map(([key, data]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium font-inter">{data.label}</span>
                    <span className="text-white font-bold text-lg">{data.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
  function SettingsTab() {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pricing & Contracts */}
        <div className="bg-black rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-primary font-semibold mb-6 font-space-grotesk text-lg">Pricing & Contracts</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm font-inter mb-2">Set Rate of Price:</label>
              <select 
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="w-full bg-[#1a2928] border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 appearance-none cursor-pointer"
              >
                <option value="Paper & Cardboard">Paper & Cardboard</option>
                <option value="Plastic">Plastic</option>
                <option value="Metal">Metal</option>
                <option value="Glass">Glass</option>
              </select>
            </div>
            
            <div>
              <input
                type="text"
                placeholder="e.g., $10/kg"
                value={pricePerKg}
                onChange={(e) => setPricePerKg(e.target.value)}
                className="w-full bg-[#1a2928] border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
              />
            </div>
            
            <button className="w-full gradient-button text-black font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-200 font-inter">
              Update Price
            </button>
          </div>
        </div>

        {/* Contract Management */}
        <div className="bg-black rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-primary font-semibold mb-6 font-space-grotesk text-lg">Contract Management</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm font-inter mb-2">Amount to Fund:</label>
              <input
                type="text"
                placeholder="e.g., $1000"
                value={fundingAmount}
                onChange={(e) => setFundingAmount(e.target.value)}
                className="w-full bg-[#1a2928] border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <button className="w-full gradient-button text-black font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-200 font-inter">
                Fund Contract
              </button>
              <button className="w-full bg-gray-800 hover:bg-gray-700 text-primary border border-slate-600 font-semibold py-3 px-4 rounded-lg transition-colors font-inter">
                Get Contract Balance
              </button>
            </div>
          </div>
        </div>

        {/* Platform Settings */}
        <div className="bg-black rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-primary" />
            <h3 className="text-primary font-semibold font-space-grotesk text-lg">Platform Settings</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="text-white font-medium font-inter">Maintenance Mode</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm font-inter min-w-[70px] text-right">
                  Disabled
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="text-white font-medium font-inter">Auto Approvals</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm font-inter min-w-[70px] text-right">
                  Enabled
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="text-white font-medium font-inter">Email Notifications</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm font-inter min-w-[70px] text-right">
                  Enabled
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-black rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-red-400" />
            <h3 className="text-red-400 font-semibold font-space-grotesk text-lg">Security Settings</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="text-white font-medium font-inter">Two-Factor Auth</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-green-500 text-black px-3 py-1 rounded-lg text-sm font-medium font-inter">
                  Enabled
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="text-white font-medium font-inter">API Rate Limiting</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-green-500 text-black px-3 py-1 rounded-lg text-sm font-medium font-inter">
                  Active
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="text-white font-medium font-inter">Audit Logging</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-green-500 text-black px-3 py-1 rounded-lg text-sm font-medium font-inter">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}