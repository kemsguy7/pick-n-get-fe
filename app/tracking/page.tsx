
"use client"

import { useState } from "react"
import AppLayout from "../components/layout/AppLayout"
import { 
  Search,
  MapPin,
  Clock,
  CheckCircle,
  Phone,
  User,
  Package,
  Truck,
  Star,
  Calendar
} from 'lucide-react'

interface TrackingOrder {
  id: string
  status: 'in-transit' | 'collected' | 'verified'
  category: string
  weight: string
  agent: string
  eta: string
}

interface OrderTimelineStep {
  title: string
  description: string
  timestamp: string
  completed: boolean
  current?: boolean
}

interface AgentInfo {
  name: string
  vehicle: string
  capacity: string
  rating: number
  pickups: number
}

export default function TrackingPage() {
  const [activeTab, setActiveTab] = useState('active-orders')
  const [trackingId, setTrackingId] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  // Sample tracking data
  const activeOrders: TrackingOrder[] = [
    {
      id: 'REC123456',
      status: 'in-transit',
      category: 'Plastic Bottles & Containers',
      weight: '3.2kg',
      agent: 'John Adebayo',
      eta: '15 mins'
    },
    {
      id: 'REC123455',
      status: 'collected',
      category: 'Electronic Waste',
      weight: '5.1kg',
      agent: 'Sarah Okolie',
      eta: 'Processing'
    },
    {
      id: 'REC123454',
      status: 'verified',
      category: 'Metal Scrap',
      weight: '2.8kg',
      agent: 'Mike Johnson',
      eta: 'Payment pending'
    }
  ]

  const orderHistory = [
    { id: 'REC123453', amount: '5.2kg', type: 'recycled', date: '2025-01-15T10:30:00Z', status: 'pending' },
    { id: 'REC123452', amount: '12.5kg', type: 'recycled', date: '2025-01-18T09:15:00Z', status: 'collected' },
    { id: 'REC123451', amount: '2.8kg', type: 'recycled', date: '2025-01-20T16:00:00Z', status: 'completed' }
  ]

  const orderTimeline: OrderTimelineStep[] = [
    {
      title: 'Request Submitted',
      description: 'Your recycling request has been received',
      timestamp: '2025-08-15 09:00',
      completed: true
    },
    {
      title: 'Agent Assigned',
      description: 'Verified agent assigned to your pickup',
      timestamp: '2025-08-19 09:30',
      completed: true
    },
    {
      title: 'Agent En Route',
      description: 'Agent is on the way to pickup location',
      timestamp: '2025-08-20 14:15',
      completed: true,
      current: true
    },
    {
      title: 'Items Collected',
      description: 'Items collected and being transported',
      timestamp: 'Expected: 15:00',
      completed: false
    },
    {
      title: 'Weight Verified',
      description: 'Items weighed and verified at facility',
      timestamp: 'Expected: 16:00',
      completed: false
    },
    {
      title: 'Payment Processed',
      description: 'ECO tokens credited to your wallet',
      timestamp: 'Expected: 16:30',
      completed: false
    }
  ]

  const agentInfo: AgentInfo = {
    name: 'Emeka Nwankwo',
    vehicle: 'Van',
    capacity: '500kg',
    rating: 4.8,
    pickups: 342
  }

  const tabs = [
    { id: 'active-orders', label: 'Active Orders' },
    { id: 'detailed-tracking', label: 'Detailed Tracking' },
    { id: 'order-history', label: 'Order History' }
  ]

  const handleTrack = () => {
    if (trackingId) {
      setSelectedOrder(trackingId)
      setActiveTab('detailed-tracking')
    }
  }

  return (
    <AppLayout showHeader={true} showSidebar={true} showFooter={true}>
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-slate-900 to-black p-4 lg:p-6">
        <div className="max-w-6xl mx-auto space-y-6 lg:space-y-8">
          
          {/* Header */}
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 font-space-grotesk flex items-center justify-center gap-3">
              Track Your Orders <MapPin className="w-8 h-8 lg:w-10 lg:h-10 text-green-400" />
            </h1>
            <p className="text-lg secondary-text font-inter">
              Real-time tracking for your recycling pickups and deliveries
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter tracking ID (e.g., REC12345)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                />
              </div>
              <button
                onClick={handleTrack}
                className="gradient-button px-6 py-3 rounded-lg text-black font-semibold hover:shadow-lg transition-all duration-200"
              >
                Track
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex overflow-x-auto bg-[#1a2928] rounded-lg p-1 gap-1 tab-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-0 px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#EDFFF3] text-primary'
                    : 'lighter-green-text hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'active-orders' && <ActiveOrdersTab orders={activeOrders} />}
            {activeTab === 'detailed-tracking' && (
              selectedOrder ? 
                <DetailedTrackingTab orderId={selectedOrder} timeline={orderTimeline} agent={agentInfo} /> : 
                <NoActiveTrackingTab />
            )}
            {activeTab === 'order-history' && <OrderHistoryTab orders={orderHistory} />}
          </div>
        </div>
      </div>
    </AppLayout>
  )

  // Tab Components
  function ActiveOrdersTab({ orders }: { orders: TrackingOrder[] }) {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'in-transit': return 'bg-blue-500/20 text-blue-400'
        case 'collected': return 'bg-yellow-500/20 text-yellow-400'
        case 'verified': return 'bg-green-500/20 text-green-400'
        default: return 'bg-gray-500/20 text-gray-400'
      }
    }

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'in-transit': return <Truck className="w-5 h-5" />
        case 'collected': return <Package className="w-5 h-5" />
        case 'verified': return <CheckCircle className="w-5 h-5" />
        default: return <Clock className="w-5 h-5" />
      }
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-black rounded-xl p-6 border border-[#A5D6A74D]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold font-space-grotesk">{order.id}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">{order.category}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Weight:</span>
                <span className="text-white font-medium">{order.weight}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">{order.agent}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">ETA: {order.eta}</span>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => {
                  setSelectedOrder(order.id)
                  setActiveTab('detailed-tracking')
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              >
                {getStatusIcon(order.status)}
                Track
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium">
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  function DetailedTrackingTab({ orderId, timeline, agent }: { 
    orderId: string, 
    timeline: OrderTimelineStep[], 
    agent: AgentInfo 
  }) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Timeline */}
        <div className="lg:col-span-2 bg-black rounded-xl p-6 border border-[#A5D6A74D]">
          <h3 className="text-white font-semibold font-space-grotesk mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Order Timeline - {orderId}
          </h3>
          
          <div className="space-y-6">
            {timeline.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed 
                      ? 'bg-green-500 text-white' 
                      : step.current 
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <div className="w-2 h-2 bg-current rounded-full" />
                    )}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className={`w-0.5 h-8 mt-2 ${
                      step.completed ? 'bg-green-500' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
                
                <div className="flex-1 pb-8">
                  <h4 className={`font-medium ${
                    step.completed || step.current ? 'text-white' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </h4>
                  <p className="text-gray-400 text-sm mt-1">{step.description}</p>
                  <p className="text-gray-500 text-xs mt-2">{step.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Info & Live Location */}
        <div className="space-y-6">
          {/* Assigned Agent */}
          <div className="bg-black rounded-xl p-6 border border-[#A5D6A74D]">
            <h3 className="text-white font-semibold font-space-grotesk mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Assigned Agent
            </h3>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-white font-medium">{agent.name}</h4>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-yellow-400 text-sm">{agent.rating}</span>
                  <span className="text-gray-400 text-sm">({agent.pickups} pickups)</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                Call Agent
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg transition-colors font-medium text-sm">
                Message
              </button>
            </div>
          </div>

          {/* Live Location */}
          <div className="bg-black rounded-xl p-6 border border-[#A5D6A74D]">
            <h3 className="text-white font-semibold font-space-grotesk mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Live Location
            </h3>
            
            {/* Mock Map */}
            <div className="bg-gray-200 rounded-lg h-48 mb-4 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Interactive Map</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Current Location:</span>
                <span className="text-white">Victoria Island, Lagos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Destination:</span>
                <span className="text-white">Nigerian Air Force Base, Ikeja, Lagos State</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">ETA:</span>
                <span className="text-green-400 font-medium">15:00</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-black rounded-xl p-6 border border-[#A5D6A74D]">
            <h3 className="text-white font-semibold font-space-grotesk mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Summary
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Category:</span>
                <span className="text-white">Plastic Bottles & Containers</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Weight:</span>
                <span className="text-white">3.2kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estimated Earnings:</span>
                <span className="text-green-400 font-medium">₦38.40</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  function NoActiveTrackingTab() {
    return (
      <div className="bg-black rounded-xl p-12 border border-[#A5D6A74D] text-center">
        <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-white font-semibold font-space-grotesk text-xl mb-2">No Active Tracking</h3>
        <p className="text-gray-400 mb-6">
          Enter a tracking ID above or select an active order to view detailed tracking information.
        </p>
        <button 
          onClick={() => setActiveTab('active-orders')}
          className="gradient-button px-6 py-2 rounded-lg text-black font-semibold hover:shadow-lg transition-all duration-200"
        >
          View Active Orders
        </button>
      </div>
    )
  }

  function OrderHistoryTab({ orders }: { orders: any[] }) {
    return (
      <div className="bg-black rounded-xl p-6 border border-[#A5D6A74D]">
        <h3 className="text-white font-semibold font-space-grotesk mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Order History
        </h3>
        
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-[#D9D9D933] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#DCFCE7] rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-white font-medium">{order.amount} {order.type}</p>
                  <p className="text-gray-400 text-sm">{new Date(order.date).toLocaleDateString()}</p>
                  <p className="text-gray-500 text-xs">{order.id}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 font-roboto rounded-lg text-xs font-medium ${
                  order.status === 'completed' ? 'bg-[#EEEEEE] text-info-purple' :
                  order.status === 'collected' ? 'bg-green-500/20 text-green-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}