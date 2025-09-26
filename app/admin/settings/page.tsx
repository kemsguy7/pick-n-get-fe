"use client"
import { useState } from "react"
import { Users, CheckCircle, BarChart3, Settings, Shield } from 'lucide-react'
import AppLayout from "../../components/layout/AppLayout"
import StatCard, { StatCardProps } from "../../components/ui/statCard"

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('settings')
  const [selectedMaterial, setSelectedMaterial] = useState('Paper & Cardboard')
  const [pricePerKg, setPricePerKg] = useState('$10/kg')
  const [fundingAmount, setFundingAmount] = useState('$1000')
  
  // Platform settings state
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [autoApprovals, setAutoApprovals] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  
  // Security settings state
  const [twoFactorAuth, setTwoFactorAuth] = useState(true)
  const [apiRateLimiting, setApiRateLimiting] = useState(true)
  const [auditLogging, setAuditLogging] = useState(true)

  // Stats data for settings page
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'approvals', label: 'Approvals', icon: CheckCircle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
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

          {/* Settings Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Pricing & Contracts */}
            <div className="bg-black/80 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-primary font-semibold mb-6 font-space-grotesk text-lg">Pricing & Contracts</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm font-inter mb-2">Set Rate of Price:</label>
                  <select 
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    className="w-full bg-[#1a2928] border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
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
            <div className="bg-black/80 rounded-xl p-6 border border-slate-700/50">
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
                
                <div className="grid grid-cols-2 gap-3">
                  <button className="gradient-button text-black font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-200 font-inter">
                    Fund Contract
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors font-inter">
                    Get Contract Balance
                  </button>
                </div>
              </div>
            </div>

            {/* Platform Settings */}
            <div className="bg-black/80 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-primary" />
                <h3 className="text-primary font-semibold font-space-grotesk text-lg">Platform Settings</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium font-inter">Maintenance Mode</p>
                    <p className="text-gray-400 text-sm font-inter">Enable system maintenance</p>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3 text-gray-400 text-sm">
                      {maintenanceMode ? 'Enabled' : 'Disabled'}
                    </span>
                    <button
                      onClick={() => setMaintenanceMode(!maintenanceMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        maintenanceMode ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium font-inter">Auto Approvals</p>
                    <p className="text-gray-400 text-sm font-inter">Automatically approve verified users</p>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3 text-gray-400 text-sm">
                      {autoApprovals ? 'Enabled' : 'Disabled'}
                    </span>
                    <button
                      onClick={() => setAutoApprovals(!autoApprovals)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        autoApprovals ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          autoApprovals ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium font-inter">Email Notifications</p>
                    <p className="text-gray-400 text-sm font-inter">Send system notifications via email</p>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3 text-gray-400 text-sm">
                      {emailNotifications ? 'Enabled' : 'Disabled'}
                    </span>
                    <button
                      onClick={() => setEmailNotifications(!emailNotifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        emailNotifications ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-black/80 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-red-400" />
                <h3 className="text-red-400 font-semibold font-space-grotesk text-lg">Security Settings</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium font-inter">Two-Factor Auth</p>
                    <p className="text-gray-400 text-sm font-inter">Require 2FA for admin access</p>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3 text-green-400 text-sm font-medium">Enabled</span>
                    <button
                      onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        twoFactorAuth ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium font-inter">API Rate Limiting</p>
                    <p className="text-gray-400 text-sm font-inter">Limit API request rates</p>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3 text-green-400 text-sm font-medium">Active</span>
                    <button
                      onClick={() => setApiRateLimiting(!apiRateLimiting)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        apiRateLimiting ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          apiRateLimiting ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium font-inter">Audit Logging</p>
                    <p className="text-gray-400 text-sm font-inter">Log all admin actions</p>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3 text-green-400 text-sm font-medium">Active</span>
                    <button
                      onClick={() => setAuditLogging(!auditLogging)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        auditLogging ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          auditLogging ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}