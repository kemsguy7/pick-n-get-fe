'use client';
import { useState } from 'react';
import { Users, CheckCircle, BarChart3, Settings, Shield } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import StatCard, { StatCardProps } from '../../components/ui/statCard';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('settings');
  const [selectedMaterial, setSelectedMaterial] = useState('Paper & Cardboard');
  const [pricePerKg, setPricePerKg] = useState('$10/kg');
  const [fundingAmount, setFundingAmount] = useState('$1000');

  // Platform settings state
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoApprovals, setAutoApprovals] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Security settings state
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [apiRateLimiting, setApiRateLimiting] = useState(true);
  const [auditLogging, setAuditLogging] = useState(true);

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
      borderColor: 'border-green-200',
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
      borderColor: 'border-blue-200',
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
      borderColor: 'border-purple-200',
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
      borderColor: 'border-green-200',
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'approvals', label: 'Approvals', icon: CheckCircle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <AppLayout showHeader={true} showSidebar={true} showFooter={true}>
      <div className="min-h-screen p-4 lg:p-6">
        <div className="mx-auto max-w-7xl space-y-6 lg:space-y-8">
          {/* Header Section */}
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-green-gradient font-space-grotesk mb-2 bg-transparent bg-clip-text text-3xl font-bold md:text-4xl lg:text-5xl">
                Welcome, Kemsguy
              </h1>
              <p className="secondary-text font-inter text-lg">
                Manage and monitor the PicknGet platform
              </p>
            </div>
            <div className="flex gap-3">
              <button className="backdrop-blur-custom font-inter flex items-center gap-2 rounded-lg bg-white/20 px-6 py-2 text-white transition-colors hover:bg-white/30">
                Export Data
              </button>
              <button className="gradient-button font-inter rounded-lg px-6 py-2 font-semibold text-black transition-all duration-200 hover:shadow-lg">
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {statsData.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* System Alerts */}
          <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              <h3 className="font-space-grotesk font-semibold text-orange-600">
                System Alerts (3)
              </h3>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: 'Server Performance',
                  message: 'High CPU usage detected on main server',
                  time: '5 minutes ago',
                  type: 'error',
                },
                {
                  title: 'Payment Gateway',
                  message: 'Increased transaction failures',
                  time: '1 hour ago',
                  type: 'warning',
                },
                {
                  title: 'Scheduled Maintenance',
                  message: 'Database backup completed successfully',
                  time: '3 hours ago',
                  type: 'info',
                },
              ].map((alert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-white p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        alert.type === 'error'
                          ? 'bg-red-500'
                          : alert.type === 'warning'
                            ? 'bg-orange-500'
                            : 'bg-blue-500'
                      }`}
                    ></div>
                    <div>
                      <p className="font-space-grotesk font-medium text-gray-800">{alert.title}</p>
                      <p className="font-inter text-sm text-gray-600">{alert.message}</p>
                    </div>
                  </div>
                  <span className="font-inter text-sm text-gray-500">{alert.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 overflow-x-auto rounded-lg bg-[#1a2928] p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex min-w-0 flex-1 items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-primary bg-[#EDFFF3]'
                    : 'lighter-green-text hover:bg-white/10 hover:text-white'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Pricing & Contracts */}
            <div className="rounded-xl border border-slate-700/50 bg-black/80 p-6">
              <h3 className="text-primary font-space-grotesk mb-6 text-lg font-semibold">
                Pricing & Contracts
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="font-inter mb-2 block text-sm text-gray-400">
                    Set Rate of Price:
                  </label>
                  <select
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    className="w-full rounded-lg border border-slate-600 bg-[#1a2928] px-4 py-3 text-white focus:border-green-500 focus:outline-none"
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
                    className="w-full rounded-lg border border-slate-600 bg-[#1a2928] px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                  />
                </div>

                <button className="gradient-button font-inter w-full rounded-lg px-4 py-3 font-semibold text-black transition-all duration-200 hover:shadow-lg">
                  Update Price
                </button>
              </div>
            </div>

            {/* Contract Management */}
            <div className="rounded-xl border border-slate-700/50 bg-black/80 p-6">
              <h3 className="text-primary font-space-grotesk mb-6 text-lg font-semibold">
                Contract Management
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="font-inter mb-2 block text-sm text-gray-400">
                    Amount to Fund:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., $1000"
                    value={fundingAmount}
                    onChange={(e) => setFundingAmount(e.target.value)}
                    className="w-full rounded-lg border border-slate-600 bg-[#1a2928] px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="gradient-button font-inter rounded-lg px-4 py-3 font-semibold text-black transition-all duration-200 hover:shadow-lg">
                    Fund Contract
                  </button>
                  <button className="font-inter rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700">
                    Get Contract Balance
                  </button>
                </div>
              </div>
            </div>

            {/* Platform Settings */}
            <div className="rounded-xl border border-slate-700/50 bg-black/80 p-6">
              <div className="mb-6 flex items-center gap-2">
                <Settings className="text-primary h-5 w-5" />
                <h3 className="text-primary font-space-grotesk text-lg font-semibold">
                  Platform Settings
                </h3>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-inter font-medium text-white">Maintenance Mode</p>
                    <p className="font-inter text-sm text-gray-400">Enable system maintenance</p>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3 text-sm text-gray-400">
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

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-inter font-medium text-white">Auto Approvals</p>
                    <p className="font-inter text-sm text-gray-400">
                      Automatically approve verified users
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3 text-sm text-gray-400">
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

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-inter font-medium text-white">Email Notifications</p>
                    <p className="font-inter text-sm text-gray-400">
                      Send system notifications via email
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3 text-sm text-gray-400">
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
            <div className="rounded-xl border border-slate-700/50 bg-black/80 p-6">
              <div className="mb-6 flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-400" />
                <h3 className="font-space-grotesk text-lg font-semibold text-red-400">
                  Security Settings
                </h3>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-inter font-medium text-white">Two-Factor Auth</p>
                    <p className="font-inter text-sm text-gray-400">Require 2FA for admin access</p>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3 text-sm font-medium text-green-400">Enabled</span>
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

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-inter font-medium text-white">API Rate Limiting</p>
                    <p className="font-inter text-sm text-gray-400">Limit API request rates</p>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3 text-sm font-medium text-green-400">Active</span>
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

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-inter font-medium text-white">Audit Logging</p>
                    <p className="font-inter text-sm text-gray-400">Log all admin actions</p>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3 text-sm font-medium text-green-400">Active</span>
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
  );
}
