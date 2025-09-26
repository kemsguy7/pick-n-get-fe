"use client"
import { useState } from "react"
import { Users, CheckCircle, BarChart3, Settings, Clock } from 'lucide-react'
import AppLayout from "../../components/layout/AppLayout"
import StatCard, { StatCardProps } from "../../components/ui/statCard"

interface PendingApproval {
  id: string
  name: string
  email: string
  location: string
  documents: number
  submissionDate: string
  status: 'NEW' | 'PENDING'
  avatar: string
}

export default function AdminApprovalsPage() {
  const [activeTab, setActiveTab] = useState('approvals')

  // Stats data for approvals page
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
      icon: Users,
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
      icon: Users,
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

  const pendingApprovals: PendingApproval[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      location: 'Lagos, Nigeria',
      documents: 3,
      submissionDate: '2025-01-15',
      status: 'NEW',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: '2',
      name: 'Green Products Ltd',
      email: 'info@greenproducts.com',
      location: 'Abuja, Nigeria',
      documents: 5,
      submissionDate: '2025-01-14',
      status: 'PENDING',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: '3',
      name: 'Emma Wilson',
      email: 'emma@example.com',
      location: 'Kano, Nigeria',
      documents: 4,
      submissionDate: '2025-01-13',
      status: 'NEW',
      avatar: '/api/placeholder/40/40'
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
              <button className="px-6 py-2 bg-white/20 backdrop-blur-custom text-white rounded-lg hover:bg-white/30 transition-colors font-inter flex items-center gap-2">
                Export Data
              </button>
              <button className="gradient-button px-6 py-2 rounded-lg text-black font-semibold hover:shadow-lg transition-all duration-200 font-inter">
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {statsData.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* System Alerts */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <h3 className="text-orange-600 font-semibold font-space-grotesk">System Alerts (3)</h3>
            </div>
            
            <div className="space-y-3">
              {[
                { title: 'Server Performance', message: 'High CPU usage detected on main server', time: '5 minutes ago', type: 'error' },
                { title: 'Payment Gateway', message: 'Increased transaction failures', time: '1 hour ago', type: 'warning' },
                { title: 'Scheduled Maintenance', message: 'Database backup completed successfully', time: '3 hours ago', type: 'info' }
              ].map((alert, index) => (
                <div key={index} className="bg-white rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      alert.type === 'error' ? 'bg-red-500' :
                      alert.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                    }`}></div>
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
              <h3 className="text-white font-semibold font-space-grotesk text-xl">Pending Approvals (23)</h3>
              <button className="gradient-button px-6 py-2 rounded-lg text-black font-semibold hover:shadow-lg transition-all duration-200 font-inter">
                Bulk Approve
              </button>
            </div>

            {/* Approval Cards */}
            <div className="space-y-4">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="bg-black/80 rounded-xl p-6 border border-slate-700/50 hover:border-green-500/30 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img 
                        src={approval.avatar} 
                        alt={approval.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="text-white font-semibold font-space-grotesk">{approval.name}</h4>
                        <p className="text-gray-400 text-sm font-inter">{approval.email}</p>
                        <p className="text-gray-500 text-xs font-inter">{approval.location} • {approval.documents} documents</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(approval.status)}`}>
                        {approval.status}
                      </span>
                      <span className="text-gray-400 text-sm font-inter">{approval.submissionDate}</span>
                      
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors">
                          Review Documents
                        </button>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm font-medium transition-colors">
                            Approve
                          </button>
                          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium transition-colors">
                            Reject
                          </button>
                        </div>
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