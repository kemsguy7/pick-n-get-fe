"use client"

import { useState } from "react"
import AppLayout from "../components/layout/AppLayout"

import StatCard, {StatCardProps} from "../components/ui/statCard"
import { 
  Truck, 
  DollarSign, 
  Star, 
  CheckCircle,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  User,
  Navigation,
  Eye,
  TrendingUp,
  Activity,
  BarChart3
} from 'lucide-react'

interface AgentProfileProps {
  name: string
  location: string
  isActive: boolean
  rating: number
  totalPickups: number
  totalEarnings: number
  completionRate: number
}

interface PickupOrder {
  id: string
  customerName: string
  address: string
  weight: string
  earnings: number
  status: 'in-progress' | 'pending'
  timeAgo: string
}

interface AvailableJob {
  id: string
  customerName: string
  address: string
  distance: string
  estimatedWeight: string
  estimatedEarnings: number
  priority: 'high' | 'medium' | 'low'
}

export default function AgentDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard')

  // Agent profile data
  const agentProfile: AgentProfileProps = {
    name: "Emeka Nwankwo",
    location: "Victoria Island, Lagos",
    isActive: true,
    rating: 4.8,
    totalPickups: 156,
    totalEarnings: 2450.75,
    completionRate: 96
  }

  // Stats data for different tabs
  const statsData: StatCardProps[] = [
    {
      icon: Truck,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      title: 'Total Pickups',
      titleColor: 'text-green-600',
      value: '156',
      valueColor: 'text-green-600',
      subtitle: '+8 this week',
      subtitleColor: 'text-green-500',
      backgroundColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      icon: DollarSign,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      title: 'Total Earnings',
      titleColor: 'text-blue-600',
      value: '$2450.75',
      valueColor: 'text-blue-600',
      subtitle: '+$125 this week',
      subtitleColor: 'text-blue-500',
      backgroundColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: Star,
      iconColor: 'text-yellow-600',
      iconBgColor: 'bg-yellow-100',
      title: 'Rating',
      titleColor: 'text-yellow-600',
      value: '4.8',
      valueColor: 'text-yellow-600',
      subtitle: 'Excellent service',
      subtitleColor: 'text-yellow-500',
      backgroundColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      icon: CheckCircle,
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
      title: 'Completion Rate',
      titleColor: 'text-purple-600',
      value: '96%',
      valueColor: 'text-purple-600',
      subtitle: 'To next level',
      subtitleColor: 'text-purple-500',
      backgroundColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ]

  // Active pickup orders
  const activePickups: PickupOrder[] = [
    {
      id: 'REC123456',
      customerName: 'Mike Chen',
      address: '456 Eco Ave, Abuja',
      weight: '8.2kg',
      earnings: 28.75,
      status: 'in-progress',
      timeAgo: '2 hours ago'
    },
    {
      id: 'REC123455',
      customerName: 'Emma Wilson',
      address: '789 Recycle Rd, Kano',
      weight: '22.1kg',
      earnings: 67.2,
      status: 'pending',
      timeAgo: '1 hour ago'
    }
  ]

  // Available jobs
  const availableJobs: AvailableJob[] = [
    {
      id: 'JOB001',
      customerName: 'John Doe',
      address: '321 Clean St, Lagos',
      distance: '2.3 km',
      estimatedWeight: '12kg',
      estimatedEarnings: 38.5,
      priority: 'high'
    },
    {
      id: 'JOB002',
      customerName: 'Lisa Park',
      address: '654 Green Ave, Abuja',
      distance: '4.1 km',
      estimatedWeight: '18.5kg',
      estimatedEarnings: 55.75,
      priority: 'medium'
    }
  ]

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Eye },
    { id: 'active-pickups', label: 'Active Pickups', icon: Activity },
    { id: 'available-jobs', label: 'Available Jobs', icon: MapPin },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ]

  return (
    <AppLayout showHeader={true} showSidebar={true} showFooter={true}>
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-slate-900 to-black p-4 lg:p-6 dashboard-container">
        <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
          
          {/* Agent Profile Section */}
          <div className="flex flex-col lg:flex-row mt-4 lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <User className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2 font-space-grotesk flex items-center gap-3">
                  {agentProfile.name} <Truck className="w-6 h-6 lg:w-8 lg:h-8 text-green-400" />
                </h1>
                <p className="text-lg secondary-text font-inter">
                  {agentProfile.location}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    agentProfile.isActive 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {agentProfile.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-white font-medium">{agentProfile.rating}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-inter flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Call Agent
              </button>
              <button className="gradient-button px-6 py-2 rounded-lg text-black font-semibold hover:shadow-lg transition-all duration-200 font-inter flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Message
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 stats-grid">
            {statsData.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Tab Navigation */}
          <div className="flex overflow-x-auto bg-[#1a2928] rounded-lg p-1 gap-1 tab-nav">
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

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'dashboard' && <DashboardTab agentProfile={agentProfile} />}
            {activeTab === 'active-pickups' && <ActivePickupsTab pickups={activePickups} />}
            {activeTab === 'available-jobs' && <AvailableJobsTab jobs={availableJobs} />}
            {activeTab === 'analytics' && <AnalyticsTab />}
          </div>
        </div>
      </div>
    </AppLayout>
  )

  // Tab Components
  function DashboardTab({ agentProfile }: { agentProfile: AgentProfileProps }) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress */}
        <div className="bg-black rounded-2xl p-6 border border-[#A5D6A74D]">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-white text-primary font-semibold font-space-grotesk">Weekly Progress</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Pickups Completed</span>
              <span className="text-white font-medium">18 / 25</span>
            </div>
            
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div className="bg-green-500 h-3 rounded-full" style={{ width: '72%' }}></div>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-green-400 font-medium">72% complete</span>
              <span className="text-gray-400">7 remaining</span>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="bg-black rounded-2xl p-6 border border-[#A5D6A74D]">
          <div className="flex items-center text-primary gap-2 mb-4">
            <Truck className="w-5 h-5" />
            <h3 className="text-white text-primary font-semibold font-space-grotesk">Vehicle Information</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-xl font-bold text-green-600 font-space-grotesk">Van</p>
              <p className="text-green-600 text-sm font-inter">Vehicle Type</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-xl font-bold text-blue-600 font-space-grotesk">500kg</p>
              <p className="text-blue-600 text-sm font-inter">Capacity</p>
            </div>
            <div className="col-span-2 bg-gray-100 rounded-lg p-4 text-center">
              <p className="text-xl font-bold text-gray-600 font-space-grotesk">NGN-LAG-123-ABC</p>
              <p className="text-gray-600 text-sm font-inter">Plate Number</p>
            </div>
          </div>
        </div>

        {/* Recent Pickup Activity */}
        <div className="lg:col-span-2 bg-black rounded-2xl p-6 border border-[#A5D6A74D]">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-green-400" />
            <h3 className="text-white font-semibold font-space-grotesk">Recent Pickup Activity</h3>
          </div>
          
          <div className="space-y-4">
            {[
              { customer: 'Sarah Johnson', address: '123 Green St, Lagos', amount: '+$45.5', time: '2 hours ago', status: 'completed' },
              { customer: 'Mike Chen', address: '456 Eco Ave, Abuja', amount: '+$28.75', time: '30 mins ago', status: 'in-progress' },
              { customer: 'Emma Wilson', address: '789 Recycle Rd, Kano', amount: '+$67.2', time: '1 hour ago', status: 'pending' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-[#D9D9D933] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#DCFCE7] rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{activity.customer}</p>
                    <p className="text-gray-400 text-sm font-inter font-normal">{activity.address}</p>
                    <p className="text-gray-500 text-xs">{activity.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold">{activity.amount}</p>
                  <span className={`px-2 py-1 font-roboto rounded-lg text-xs font-medium ${
                    activity.status === 'completed' ? 'bg-[#EEEEEE] text-info-purple' :
                    activity.status === 'in-progress' ? 'bg-green-500/20 text-green-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  function ActivePickupsTab({ pickups }: { pickups: PickupOrder[] }) {
    return (
      <div className="bg-black rounded-2xl p-6 border border-[#A5D6A74D]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold font-space-grotesk">Active Pickup Orders ({pickups.length})</h3>
          <button className="text-green-400 hover:text-green-300 transition-colors font-inter text-sm">
            Refresh Orders
          </button>
        </div>
        
        <div className="space-y-4">
          {pickups.map((pickup) => (
            <div key={pickup.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-white font-medium font-space-grotesk">{pickup.customerName}</h4>
                  <p className="text-gray-400 text-sm flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {pickup.address}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">Weight: {pickup.weight}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold">${pickup.earnings}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    pickup.status === 'in-progress' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {pickup.status}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2">
                  <Navigation className="w-4 h-4" />
                  Navigate
                </button>
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  Call Customer
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors font-medium">
                  Complete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  function AvailableJobsTab({ jobs }: { jobs: AvailableJob[] }) {
    return (
      <div className="bg-black rounded-2xl p-6 border border-[#A5D6A74D]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold font-space-grotesk">Available Pickup Jobs</h3>
          <button className="text-green-400 hover:text-green-300 transition-colors font-inter text-sm">
            Refresh Jobs
          </button>
        </div>
        
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-medium font-space-grotesk">{job.customerName}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      job.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {job.priority} priority
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {job.address} • {job.distance}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">Est. Weight: {job.estimatedWeight}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold">Est. ${job.estimatedEarnings}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors font-medium">
                  Accept Job
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors font-medium">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  function AnalyticsTab() {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="bg-black rounded-2xl p-6 border border-[#A5D6A74D]">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-white" />
            <h3 className="text-white font-semibold font-space-grotesk">Performance Metrics</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">On-time Delivery</span>
                <span className="text-white font-medium">94%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Customer Satisfaction</span>
                <span className="text-white font-medium">4.8/5</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '96%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Pickup Accuracy</span>
                <span className="text-white font-medium">98%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings Breakdown */}
        <div className="bg-black rounded-2xl p-6 border border-[#A5D6A74D]">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-blue-400" />
            <h3 className="text-white font-semibold font-space-grotesk">Earnings Breakdown</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600 font-space-grotesk">$1,250</p>
              <p className="text-green-600 text-sm font-inter">This Month</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600 font-space-grotesk">$325</p>
              <p className="text-blue-600 text-sm font-inter">Capacity</p>
            </div>
            <div className="col-span-2 bg-gray-100 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-600 font-space-grotesk">$45.50</p>
              <p className="text-gray-600 text-sm font-inter">Average per Pickup</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
