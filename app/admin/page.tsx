"use client"
import { useState } from "react"
import { Users, CheckCircle, BarChart3, Settings, TrendingUp, AlertTriangle, Info, Clock, DollarSign } from 'lucide-react'
import AppLayout from "../components/layout/AppLayout"
import StatCard, { StatCardProps } from "../components/ui/statCard"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

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

          {/* Bottom Section - Revenue Analytics & User Distribution */}
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
          </div>

          {/* Platform Performance Metrics */}
          <div className="bg-black/80 rounded-2xl p-6 border border-slate-700/50">
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
      </div>
    </AppLayout>
  )
}