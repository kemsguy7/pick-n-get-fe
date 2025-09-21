"use client"
import { useState } from "react"
import { Gift } from "lucide-react"
import AppLayout from "../components/layout/AppLayout"
import StatCard, { StatCardProps } from "../components/ui/statCard"
import ProductCard, { ProductCardProps } from "../components/ui/ProductCard"
import AchievementCard, { AchievementCardProps } from "../components/dashboard/AchievementCard"
import { 
  Recycle, 
  DollarSign, 
  Leaf, 
  TrendingUp, 
  Sprout,
  Shield,
  Trophy,
  Globe,
  ShoppingBag,
  Activity,
  Award,
  Wallet,
  Plus,
  Eye
} from 'lucide-react'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

  // Stats data for different tabs
  const statsData: Record<string, StatCardProps[]> = {
    overview: [
      {
        icon: Recycle,
        iconColor: 'text-green-600',
        iconBgColor: 'bg-green-100',
        title: 'Total Recycled',
        titleColor: 'text-green-600',
        value: '47.3kg',
        valueColor: 'text-green-600',
        subtitle: '+12% from last month',
        subtitleColor: 'text-green-500',
        backgroundColor: 'bg-green-50',
        borderColor: 'border-green-200',
        trend: {
          value: '+1 trees',
          color: 'text-green-500',
          icon: TrendingUp
        }
      },
      {
        icon: DollarSign,
        iconColor: 'text-blue-600',
        iconBgColor: 'bg-blue-100',
        title: 'Total Earned',
        titleColor: 'text-blue-600',
        value: '₦2082.50',
        valueColor: 'text-blue-600',
        subtitle: '1450 ECO tokens',
        subtitleColor: 'text-blue-500',
        backgroundColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      },
      {
        icon: Leaf,
        iconColor: 'text-green-600',
        iconBgColor: 'bg-green-100',
        title: 'CO₂ Saved',
        titleColor: 'text-green-600',
        value: '23.4kg',
        valueColor: 'text-green-600',
        subtitle: '≈ 1 trees',
        subtitleColor: 'text-green-500',
        backgroundColor: 'bg-green-50',
        borderColor: 'border-green-200'
      },
      {
        icon: TrendingUp,
        iconColor: 'text-purple-600',
        iconBgColor: 'bg-purple-100',
        title: 'Rank Progress',
        titleColor: 'text-purple-600',
        value: '65%',
        valueColor: 'text-purple-600',
        subtitle: 'To next level',
        subtitleColor: 'text-purple-500',
        backgroundColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
      }
    ],
    activity: [
      // Activity-specific stats would go here
    ],
    shop: [
      // Shop-specific stats would go here
    ]
  }

  // Products data
  const productsData: ProductCardProps[] = [
    {
      id: '1',
      image: '/api/placeholder/300/300',
      name: 'Recycled Ocean Plastic Backpack',
      description: 'Durable and stylish backpack made from 100% recycled ocean plastic bottles. Perfect for daily use.',
      price: 95.99,
      currency: '₦',
      originalPrice: 120.00,
      rating: 4.7,
      reviewCount: 124,
      brand: 'Coastal Lagos',
      inStock: 27,
      recycledPercentage: 95,
      isVerified: true,
      ecoTokens: 580,
      freeShipping: true,
      shippingThreshold: 50000
    },
    {
      id: '2',
      image: '/api/placeholder/300/300',
      name: 'Tire Ottoman Seat',
      description: 'Comfortable ottoman made from upcycled car tires with eco-friendly cushioning and modern design.',
      price: 205.99,
      currency: '₦',
      rating: 4.6,
      reviewCount: 97,
      brand: 'Sustainable Furniture Co.',
      inStock: 24,
      recycledPercentage: 95,
      isVerified: true,
      ecoTokens: 920,
      freeShipping: true,
      shippingThreshold: 50000
    },
    {
      id: '3',
      image: '/api/placeholder/300/300',
      name: 'Recycled Paper Desk Organizer',
      description: 'Multi-compartment desk organizer made from 100% recycled paper. Lightweight yet sturdy design.',
      price: 54.99,
      currency: '₦',
      rating: 4.8,
      reviewCount: 156,
      brand: 'Green Office Solutions',
      inStock: 45,
      recycledPercentage: 85,
      isVerified: true,
      ecoTokens: 500,
      freeShipping: true,
      shippingThreshold: 50000
    }
  ]

  // Achievements data
  const achievementsData: AchievementCardProps[] = [
    {
      icon: Sprout,
      title: 'First Recycler',
      status: 'earned',
      description: 'Complete your first recycling submission'
    },
    {
      icon: Shield,
      title: 'Eco Warrior',
      status: 'earned',
      description: 'Recycle 10kg of materials'
    },
    {
      icon: Trophy,
      title: 'Green Champion',
      status: 'locked',
      description: 'Recycle 50kg of materials'
    },
    {
      icon: Globe,
      title: 'Planet Saver',
      status: 'locked',
      description: 'Save 100kg of CO₂ emissions'
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'wallet', label: 'Wallet', icon: Wallet }
  ]

  return (
    <AppLayout showHeader={true} showSidebar={true} showFooter={true}>
      <div className="min-h-screen  p-4 lg:p-6 dashboard-container">
        <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row mt-4 lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-gradient bg-transparent bg-clip-text mb-2 font-space-grotesk flex items-center gap-3">
                Welcome back, Adaora <Recycle className="w-8 h-8 lg:w-10 lg:h-10 text-green-400" />
              </h1>
              <p className="text-lg  secondary-text font-inter">
                Your eco-impact is making a difference in Lagos
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4  bg-[#DCFCE7] text-primary text-white rounded-lg hover:bg-white/20 font-semibold transition-colors font-inter flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" />
                8 - Eco Champion
              </button>
              <button className="gradient-button px-6 py-2 rounded-lg text-black font-semibold hover:shadow-lg flex items-center transition-all duration-200 font-inter gap-2">
                <Recycle className="w-4 h-4 text-black" />
                Recycle Now
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 stats-grid">
            {statsData.overview.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
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

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'activity' && <ActivityTab />}
            {activeTab === 'shop' && <ShopTab productsData={productsData} />}
            {activeTab === 'achievements' && <AchievementsTab achievementsData={achievementsData} />}
            {activeTab === 'wallet' && <WalletTab />}
          </div>
        </div>
      </div>
    </AppLayout>
  )

  // Tab Components
  function OverviewTab() {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Goal Progress */}
        <div className="bg-black/80 rounded-2xl  p-6 border border-slate-700/50">
          <div className="flex items-center gap-2  mb-4">
            <Recycle className="w-5 h-5 text-primary" />
            <h3 className="text-white text-primary font-semibold font-space-grotesk">Monthly Goal Progress</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Current Progress</span>
              <span className="text-white font-medium">32.5kg / 50kg</span>
            </div>
            
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div className="bg-green-500 h-3 rounded-full" style={{ width: '65%' }}></div>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-green-400 font-medium">65% complete</span>
              <span className="text-gray-400">17.5kg remaining</span>
            </div>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="bg-black/80 rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center text-primary gap-2 mb-4">
            <Leaf className="w-5 h-5 " />
            <h3 className="text-white text-primary font-semibold font-space-grotesk">Environmental Impact</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600 font-space-grotesk">23.4kg</p>
              <p className="text-green-600 text-sm font-inter">CO₂ Saved</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600 font-space-grotesk">118L</p>
              <p className="text-blue-600 text-sm font-inter">Water Saved</p>
            </div>
            <div className="col-span-2 bg-purple-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-purple-600 font-space-grotesk">1</p>
              <p className="text-purple-600 text-sm font-inter">Trees equivalent</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-black rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-6">
            <Recycle className="w-5 h-5 text-green-400" />
            <h3 className="text-white font-semibold font-inter">Recent Recycling Activity</h3>
          </div>
          
          <div className="space-y-4">
            {[
              { amount: '5.2kg', type: 'recycled', date: '2025-01-15 T10:30:00Z', status: 'completed', earnings: '+₦' },
              { amount: '12.5kg', type: 'recycled', date: '2025-01-18 T09:15:00Z', status: 'collected', earnings: '+₦' },
              { amount: '2.8kg', type: 'recycled', date: '2025-01-20 T16:00:00Z', status: 'pending', earnings: '+₦' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-[#D9D9D933] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Recycle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{activity.amount} {activity.type}</p>
                    <p className="text-gray-400 text-sm font-inter font-normal">{new Date(activity.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold">{activity.earnings}</p>
                  <span className={`px-2 py-1 font-roboto rounded-lg text-xs font-medium ${
                    activity.status === 'completed' ? 'bg-[#EEEEEE] text-info-purple' :
                    activity.status === 'collected' ? 'bg-blue-500/20 text-blue-400' :
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

  function ActivityTab() {
    return (
      <div className=" rounded-2xl   bg-black  p-6 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-white" />
          <h3 className="text-white font-semibold font-space-grotesk">Recent Transaction</h3>
        </div>
        
        <div className="space-y-4">
          {[
            { type: 'Plastic bottles recycling', date: '2025-01-15 14:30', amount: '+₦1,008' },
            { type: 'Eco-friendly notebook', date: '2025-01-14', amount: '-15 USDC' },
            { type: 'Electronic waste', date: '2025-01-13', amount: '+₦2,008' }
          ].map((transaction, index) => (
            <div key={index} className="flex items-center justify-between  p-4 border border-[#D9D9D933] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#DCFCE7] rounded-full flex items-center justify-center">
                  <Recycle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{transaction.type}</p>
                  <p className="text-gray-400 text-sm">{transaction.date}</p>
                </div>
              </div>
              <span className={`font-semibold ${transaction.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {transaction.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  function ShopTab({ productsData }: { productsData: ProductCardProps[] }) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold font-space-grotesk text-xl">Recommended for You</h3>
          <button className="text-green-400 hover:text-green-300 transition-colors font-inter flex items-center gap-1">
            View All Products
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 products-grid">
          {productsData.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* Special Offers */}
        <div className="bg-[#edfff3] rounded-2xl p-6 border border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="w-5 h-5 text-green-600 primary-gradient-text" />
            <h3 className="primary-gradient-text  font-medium  font-inter">Special Offers</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 border border-black">
              <div className="flex items-center gap-2 mb-2">
                <Recycle className="w-4 h-4 text-green-600" />
                <span className="text-green-600 font-medium font-inter">Eco Starter Pack</span>
              </div>
              <p className="text-black/60 text-sm mb-3">Get 20% off on your first eco-product purchase</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600 font-space-grotesk">500 ECO</span>
                <button className="bg-green-600 text-black hover:text-white px-4 py-2 rounded-lg font-inter text-xs font-normal hover:bg-green-700 transition-colors  ">
                  Claim
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-black">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-green-600" />
                <span className="text-green-600 font-medium font-inter">Recycler's Reward</span>
              </div>
              <p className="text-black/60 text-sm mb-3">Free shipping on orders above ₦50,000</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600 font-space-grotesk">Free</span>
                <button className="bg-gray-800 hover:text-white text-info-darker font-space-grotesk px-4 py-2 rounded-lg text-sm font-medium">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  function AchievementsTab({ achievementsData }: { achievementsData: AchievementCardProps[] }) {
    return (
      <div className="bg-black/80 rounded-2xl p-6 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h3 className="text-white font-semibold font-space-grotesk">Achievements & Badges</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievementsData.map((achievement, index) => (
            <AchievementCard key={index} {...achievement} />
          ))}
        </div>
      </div>
    )
  }

  function WalletTab() {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wallet Balance */}
        <div className="bg-black/80 rounded-2xl p-6 border border-green-500/30 shadow-border-green">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="w-5 h-5 text-green-400" />
            <h3 className="text-white font-semibold font-space-grotesk">Wallet Balance</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
              <span className="text-white font-medium">ECO Tokens</span>
              <span className="text-green-400 font-bold">1450</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
              <span className="text-white font-medium">HBAR</span>
              <span className="text-blue-400 font-bold">505.05</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
              <span className="text-white font-medium">Total Value</span>
              <span className="text-white font-bold">$2,205</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors font-medium">
                Send
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium">
                Receive
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-black/80 rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-white font-semibold mb-4 font-space-grotesk">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium">
              <Recycle className="w-5 h-5" />
              Submit Recycling
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
              <ShoppingBag className="w-5 h-5" />
              Browse Shop
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium">
              <DollarSign className="w-5 h-5" />
              Pay Bills
            </button>
          </div>
        </div>
      </div>
    )
  }
}