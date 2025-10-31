'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '../components/layout/AppLayout';
import StatCard, { StatCardProps } from '../components/ui/statCard';
import { useWalletInterface } from '../services/wallets/useWalletInterface';
import {
  Package,
  DollarSign,
  Star,
  TrendingUp,
  Eye,
  ShoppingCart,
  BarChart3,
  Leaf,
  Plus,
  Edit,
  AlertCircle,
} from 'lucide-react';

// ✅ DEMO MODE - Using mock data
const MOCK_STATS = {
  totalProducts: 12,
  totalRevenue: 12450.75,
  totalSales: 156,
  avgRating: 4.8,
  monthlyGrowth: 12.5,
};

const MOCK_PRODUCTS = [
  {
    productId: '1',
    name: 'Recycled Bamboo Notebook',
    description: 'Eco-friendly notebook made from 100% recycled bamboo fibers',
    price: 15.99,
    quantity: 50,
    category: 'Office Supplies',
    imageUrl: '/placeholder-product.png',
    recycledPercentage: 100,
    status: 'Available',
    createdAt: new Date().toISOString(),
  },
  {
    productId: '2',
    name: 'Upcycled Denim Tote Bag',
    description: 'Stylish tote bag made from repurposed denim jeans',
    price: 29.99,
    quantity: 30,
    category: 'Bags & Accessories',
    imageUrl: '/placeholder-product.png',
    recycledPercentage: 95,
    status: 'Available',
    createdAt: new Date().toISOString(),
  },
];

const MOCK_ORDERS = [
  {
    orderId: '1001',
    customerName: 'John Doe',
    productName: 'Recycled Bamboo Notebook',
    quantity: 2,
    totalAmount: 31.98,
    status: 'Delivered',
    orderDate: new Date().toISOString(),
    deliveryAddress: '123 Green St, Eco City',
  },
  {
    orderId: '1002',
    customerName: 'Jane Smith',
    productName: 'Upcycled Denim Tote Bag',
    quantity: 1,
    totalAmount: 29.99,
    status: 'Processing',
    orderDate: new Date().toISOString(),
    deliveryAddress: '456 Sustainable Ave, Green Town',
  },
];

export default function VendorDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const { accountId, walletInterface } = useWalletInterface();

  const isConnected = !!(accountId && walletInterface);

  // ✅ AUTH GUARDS REMOVED
  if (!isConnected) {
    return (
      <AppLayout showHeader={true} showSidebar={true} showFooter={true}>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-4 h-16 w-16 text-yellow-400" />
            <h2 className="mb-4 text-2xl font-bold text-yellow-400">Connect Wallet</h2>
            <p className="text-gray-600">
              Please connect your wallet to access the vendor dashboard.
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const statsData: StatCardProps[] = [
    {
      icon: Package,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      title: 'Total Products',
      titleColor: 'text-green-600',
      value: MOCK_STATS.totalProducts.toString(),
      valueColor: 'text-green-600',
      subtitle: '+3 this month',
      subtitleColor: 'text-green-500',
      backgroundColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      icon: DollarSign,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      title: 'Total Revenue',
      titleColor: 'text-blue-600',
      value: `$${MOCK_STATS.totalRevenue.toFixed(2)}`,
      valueColor: 'text-blue-600',
      subtitle: '+12% from last month',
      subtitleColor: 'text-blue-500',
      backgroundColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      icon: ShoppingCart,
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
      title: 'Total Sales',
      titleColor: 'text-purple-600',
      value: MOCK_STATS.totalSales.toString(),
      valueColor: 'text-purple-600',
      subtitle: '156 this month',
      subtitleColor: 'text-purple-500',
      backgroundColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      icon: Star,
      iconColor: 'text-yellow-600',
      iconBgColor: 'bg-yellow-100',
      title: 'Avg Rating',
      titleColor: 'text-yellow-600',
      value: MOCK_STATS.avgRating.toString(),
      valueColor: 'text-yellow-600',
      subtitle: 'Excellent reviews',
      subtitleColor: 'text-yellow-500',
      backgroundColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
  ];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Eye },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'sustainability', label: 'Sustainability', icon: Leaf },
  ];

  return (
    <AppLayout showHeader={true} showSidebar={true} showFooter={true}>
      <div className="dashboard-container min-h-screen p-4 lg:p-6">
        <div className="mx-auto max-w-7xl space-y-6 lg:space-y-8">
          {/* Header */}
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-primary font-space-grotesk mb-2 flex items-center gap-3 text-2xl font-bold lg:text-3xl">
                Vendor Dashboard (DEMO)
                <Package className="h-6 w-6 text-green-400 lg:h-8 lg:w-8" />
              </h1>
              <p className="secondary-text font-inter text-lg">Eco-friendly product vendor</p>
              <div className="mt-1 flex items-center gap-3 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  Connected: {accountId}
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push('/vendors/add-product')}
              className="gradient-button flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-black"
            >
              <Plus className="h-5 w-5" />
              Add Product
            </button>
          </div>

          {/* Stats */}
          <div className="stats-grid grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {statsData.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Tabs */}
          <div className="tab-nav flex gap-1 overflow-x-auto rounded-lg bg-[#1a2928] p-1">
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

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'dashboard' && <DashboardTab />}
            {activeTab === 'products' && <ProductsTab />}
            {activeTab === 'orders' && <OrdersTab />}
            {activeTab === 'analytics' && <AnalyticsTab />}
            {activeTab === 'sustainability' && <SustainabilityTab />}
          </div>
        </div>
      </div>
    </AppLayout>
  );

  function DashboardTab() {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#A5D6A74D] bg-black p-6">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <h3 className="font-space-grotesk font-semibold text-white">Monthly Performance</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-gray-400">Revenue</span>
                <span className="font-medium text-white">$12,450.75</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-700">
                <div className="h-3 rounded-full bg-blue-500" style={{ width: '67%' }}></div>
              </div>
            </div>

            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-gray-400">Sales</span>
                <span className="font-medium text-white">156 orders</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-700">
                <div className="h-3 rounded-full bg-purple-500" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#A5D6A74D] bg-black p-6">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            <h3 className="font-space-grotesk font-semibold text-white">Key Metrics</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-green-50 p-4 text-center">
              <p className="font-space-grotesk text-xl font-bold text-green-600">3.2%</p>
              <p className="font-inter text-sm text-green-600">Conversion Rate</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-4 text-center">
              <p className="font-space-grotesk text-xl font-bold text-blue-600">4.8/5</p>
              <p className="font-inter text-sm text-blue-600">Customer Rating</p>
            </div>
            <div className="rounded-lg bg-purple-50 p-4 text-center">
              <p className="font-space-grotesk text-xl font-bold text-purple-600">1.5%</p>
              <p className="font-inter text-sm text-purple-600">Return Rate</p>
            </div>
            <div className="rounded-lg bg-orange-50 p-4 text-center">
              <p className="font-space-grotesk text-xl font-bold text-orange-600">$79.8</p>
              <p className="font-inter text-sm text-orange-600">Avg Order</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function ProductsTab() {
    return (
      <div className="rounded-2xl border border-[#A5D6A74D] bg-black p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-space-grotesk font-semibold text-white">
            Product Inventory ({MOCK_PRODUCTS.length})
          </h3>
          <button
            onClick={() => router.push('/vendors/add-product')}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_PRODUCTS.map((product) => (
            <div
              key={product.productId}
              className="overflow-hidden rounded-lg border border-slate-700/50 bg-slate-900/50"
            >
              <div className="relative aspect-square">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400">
                    {product.status}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h4 className="font-space-grotesk mb-2 font-medium text-white">{product.name}</h4>
                <p className="mb-3 line-clamp-2 text-sm text-gray-400">{product.description}</p>

                <div className="mb-3 flex items-center justify-between">
                  <span className="font-space-grotesk text-lg font-bold text-white">
                    ${product.price}
                  </span>
                  <span className="text-sm text-gray-400">Stock: {product.quantity}</span>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    <Edit className="mx-auto h-4 w-4" />
                  </button>
                  <button className="flex-1 rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium text-white hover:bg-slate-600">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function OrdersTab() {
    return (
      <div className="rounded-2xl border border-[#A5D6A74D] bg-black p-6">
        <h3 className="font-space-grotesk mb-6 font-semibold text-white">
          Recent Orders ({MOCK_ORDERS.length})
        </h3>

        <div className="space-y-4">
          {MOCK_ORDERS.map((order) => (
            <div
              key={order.orderId}
              className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-space-grotesk font-medium text-white">
                    {order.customerName}
                  </h4>
                  <p className="text-sm text-gray-400">{order.productName}</p>
                  <p className="text-xs text-gray-500">
                    Qty: {order.quantity} • {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-space-grotesk font-bold text-white">
                    ${order.totalAmount.toFixed(2)}
                  </p>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      order.status === 'Delivered'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function AnalyticsTab() {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#A5D6A74D] bg-black p-6">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            <h3 className="font-space-grotesk font-semibold text-white">Sales Analytics</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-gray-400">Weekly Growth</span>
                <span className="font-medium text-white">+15.2%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-700">
                <div className="h-2 rounded-full bg-green-500" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-gray-400">Monthly Growth</span>
                <span className="font-medium text-white">+8.7%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-700">
                <div className="h-2 rounded-full bg-blue-500" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#A5D6A74D] bg-black p-6">
          <div className="mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-400" />
            <h3 className="font-space-grotesk font-semibold text-white">Revenue Breakdown</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-green-50 p-4 text-center">
              <p className="font-space-grotesk text-xl font-bold text-green-600">$8,450</p>
              <p className="font-inter text-sm text-green-600">Product Sales</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-4 text-center">
              <p className="font-space-grotesk text-xl font-bold text-blue-600">$4,000</p>
              <p className="font-inter text-sm text-blue-600">ECO Token Sales</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function SustainabilityTab() {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-green-200 bg-[#DCFCE7] p-6">
          <div className="mb-4 flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            <h3 className="font-space-grotesk font-semibold text-green-900">
              Sustainability Score
            </h3>
          </div>

          <div className="mb-6 text-center">
            <p className="font-space-grotesk text-6xl font-bold text-green-600">95%</p>
            <p className="font-inter text-green-700">Excellent sustainability practices</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-white p-4 text-center">
              <p className="font-space-grotesk text-2xl font-bold text-green-600">85%</p>
              <p className="font-inter text-sm text-green-600">Recycled Materials</p>
            </div>
            <div className="rounded-lg bg-white p-4 text-center">
              <p className="font-space-grotesk text-2xl font-bold text-blue-600">92%</p>
              <p className="font-inter text-sm text-blue-600">Carbon Neutral</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
