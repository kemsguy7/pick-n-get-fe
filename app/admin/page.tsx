'use client';
import { useState, useEffect, useContext } from 'react';
import {
  Users,
  CheckCircle,
  BarChart3,
  Settings,
  TrendingUp,
  AlertTriangle,
  Info,
  Clock,
  DollarSign,
  Search,
  Filter,
  X,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import StatCard, { StatCardProps } from '../components/ui/statCard';
import { useRouter, useSearchParams } from 'next/navigation';
import { MetamaskContext } from '../contexts/MetamaskContext';
import { WalletConnectContext } from '../contexts/WalletConnectContext';
import { useWalletInterface } from '../services/wallets/useWalletInterface';
import { approveRider, banRider } from '../services/adminService';

interface User {
  id: string;
  name: string;
  location: string;
  avatar: string;
  status: 'ACTIVE' | 'PENDING' | 'AGENT';
  userType: 'Recycler' | 'Vendor' | 'Agent';
  recycled: string;
  earned: string;
  userId: string;
}

interface PendingApproval {
  id: string;
  riderId: number;
  name: string;
  email: string;
  location: string;
  documents: number;
  submissionDate: string;
  status: 'NEW' | 'PENDING';
  avatar: string;
  userType: 'agent' | 'vendor';
}

// Convert wallet interface data to format expected by adminService
const createWalletData = (
  accountId: string,
  walletInterface: any,
  network: string = 'testnet',
): [string, any, string] => {
  return [accountId, walletInterface, network];
};
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('Paper & Cardboard');
  const [pricePerKg, setPricePerKg] = useState('$10/kg');
  const [fundingAmount, setFundingAmount] = useState('$1000');

  // Approval state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'ban' | null>(null);

  // Get wallet contexts
  // const metamaskCtx = useContext(MetamaskContext);
  // const walletConnectCtx = useContext(WalletConnectContext);
  const { accountId, walletInterface } = useWalletInterface();

  // Determine connection status
  const isConnected = !!(accountId && walletInterface);

  // Handle tab query parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'users', 'approvals', 'analytics', 'settings'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.replace(`/admin?tab=${tabId}`, { scroll: false });
  };

  // Stats data for admin dashboard
  const statsData: StatCardProps[] = [
    {
      icon: Users,
      iconColor: 'text-primary',
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

  const systemAlerts = [
    {
      type: 'error',
      title: 'Server Performance',
      message: 'High CPU usage detected on main server',
      time: '5 minutes ago',
      icon: AlertTriangle,
    },
    {
      type: 'warning',
      title: 'Payment Gateway',
      message: 'Increased transaction failures',
      time: '1 hour ago',
      icon: Info,
    },
    {
      type: 'info',
      title: 'Scheduled Maintenance',
      message: 'Database backup completed successfully',
      time: '3 hours ago',
      icon: Clock,
    },
  ];
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
      userId: '#U001',
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
      userId: '#V001',
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
      userId: '#A002',
    },
  ];

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
      userType: 'agent',
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
      userType: 'vendor',
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
      userType: 'agent',
    },
  ];

  const revenueData = {
    thisMonth: '125.6T',
    thisWeek: '78.4T',
    growthRate: '+15.2%',
  };

  const recentActivity = {
    regularUsers: {
      notification: 'New User Registered',
      name: 'Sarah Johnson',
      time: '2 minutes ago',
    },
    agents: {
      notification: 'Agent Verification Pending',
      name: 'Mike Chen',
      time: '10 minutes ago',
    },
    vendors: { notification: 'Vendor Approved', name: 'EcoGreen Solutions', time: '5 minutes ago' },
  };

  const performanceMetrics = [
    { label: 'User Engagement', percentage: 87 },
    { label: 'System Uptime', percentage: 99.8 },
    { label: 'Transaction Success', percentage: 96.2 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-[#DCFCE7] text-primary border border-green-200';
      case 'PENDING':
        return 'bg-orange-100 text-orange-600 border border-orange-200';
      case 'AGENT':
        return 'bg-blue-100 text-blue-600 border border-blue-200';
      case 'NEW':
        return 'bg-orange-100 text-orange-600 border border-orange-200';
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  const handleApprove = async (approval: PendingApproval) => {
    if (!isConnected) {
      setErrorMessage('Please connect your wallet first');
      return;
    }

    console.log(`🎯 Starting approval process for rider ID: ${approval.riderId}`);

    setIsProcessing(true);
    setProcessingId(approval.id);
    setActionType('approve');
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const walletData = createWalletData(accountId!, walletInterface!);
      const result = await approveRider(walletData, approval.riderId);

      if (result.success) {
        setSuccessMessage(
          `✅ Successfully approved ${approval.name}! Transaction: ${result.txHash?.substring(0, 10)}...`,
        );
        console.log(`🎉 Approval successful for ${approval.name}`);

        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        throw new Error(result.error || 'Approval failed');
      }
    } catch (error: any) {
      console.error('❌ Approval error:', error);
      setErrorMessage(error.message || 'Failed to approve rider');
    } finally {
      setIsProcessing(false);
      setProcessingId(null);
      setActionType(null);
    }
  };

  const handleReject = async (approval: PendingApproval) => {
    if (!isConnected) {
      setErrorMessage('Please connect your wallet first');
      return;
    }

    console.log(`🎯 Starting ban process for rider ID: ${approval.riderId}`);

    setIsProcessing(true);
    setProcessingId(approval.id);
    setActionType('ban');
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const walletData = createWalletData(accountId!, walletInterface!);
      const result = await banRider(walletData, approval.riderId);

      if (result.success) {
        setSuccessMessage(
          `✅ Successfully rejected ${approval.name}! Transaction: ${result.txHash?.substring(0, 10)}...`,
        );
        console.log(`🎉 Rejection successful for ${approval.name}`);

        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        throw new Error(result.error || 'Rejection failed');
      }
    } catch (error: any) {
      console.error('❌ Rejection error:', error);
      setErrorMessage(error.message || 'Failed to reject rider');
    } finally {
      setIsProcessing(false);
      setProcessingId(null);
      setActionType(null);
    }
  };

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
              {!isConnected ? (
                <div className="flex items-center gap-2 rounded-lg border border-orange-300 bg-orange-100 px-6 py-2 text-sm font-medium text-orange-700">
                  <AlertTriangle className="h-4 w-4" />
                  Connect wallet for admin actions
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-lg border border-green-300 bg-green-100 px-6 py-2 text-sm font-medium text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  Connected: {accountId?.substring(0, 8)}...
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {statsData.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-700">{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-medium text-red-700">{errorMessage}</span>
            </div>
          )}

          {/* System Alerts */}
          <div className="rounded-2xl border border-orange-200 bg-[#FFF4E8E5] p-6">
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <h3 className="font-inter font-semibold text-[#FF8C00]">System Alerts (3)</h3>
            </div>

            <div className="space-y-3">
              {systemAlerts.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-white p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        alert.type === 'error'
                          ? 'bg-red-100'
                          : alert.type === 'warning'
                            ? 'bg-orange-100'
                            : 'bg-blue-100'
                      }`}
                    >
                      <alert.icon
                        className={`h-5 w-5 ${
                          alert.type === 'error'
                            ? 'text-red-600'
                            : alert.type === 'warning'
                              ? 'text-orange-600'
                              : 'text-blue-600'
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-inter text-base font-medium text-black">{alert.title}</p>
                      <p className="font-inter text-xs text-[#1E2A28CC]">{alert.message}</p>
                    </div>
                  </div>
                  <span className="font-inter text-xs text-[#1E2A28CC]">{alert.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 overflow-x-auto rounded-lg bg-[#1a2928] p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
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
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'users' && <UsersTab />}
            {activeTab === 'approvals' && <ApprovalsTab />}
            {activeTab === 'analytics' && <AnalyticsTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </div>
      </div>
    </AppLayout>
  );
  // Tab Components
  function OverviewTab() {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Analytics */}
        <div className="rounded-2xl border border-slate-700/50 bg-black/80 p-6">
          <div className="mb-6 flex items-center gap-2">
            <BarChart3 className="text-primary h-5 w-5" />
            <h3 className="font-space-grotesk text-primary font-semibold"> Environmental Impact</h3>
          </div>

          <div className="font-inter mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white p-4 text-center">
              <p className="text-primary text-base font-semibold">{revenueData.thisMonth}</p>
              <p className="font-inter text-primary text-xs font-normal">125.6T</p>
            </div>
            <div className="text-info-darker rounded-2xl bg-white p-4 text-center">
              <p className="font-inter text-base font-bold">{revenueData.thisWeek}</p>
              <p className="font-inter text-xs font-normal">CO2 Saved</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white text-center">
            <div className="font-inter text-info-purple flex flex-col items-center gap-1 py-4 font-semibold">
              <div className="text-base font-semibold"> 3564 </div>
              <div className="text-xs font-normal"> Trees Equivalent</div>
            </div>
          </div>
        </div>

        {/* User Distribution */}
        <div className="font-inter rounded-2xl border border-slate-700/50 bg-black/80 p-6">
          <div className="mb-6 flex items-center gap-2">
            <h3 className="text-base font-medium text-white">Recent Activity</h3>
          </div>

          <div className="space-y-4">
            {Object.entries(recentActivity).map(([key, data]) => (
              <div
                key={key}
                className="font-inter notification-border flex items-center justify-between rounded-lg border p-4 text-white"
              >
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-white">{data.notification}</div>
                  <div className="lighter-green-text text-xs font-normal">{data.name}</div>
                </div>

                <div className="lighter-green-text text-xs font-normal">{data.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Performance Metrics */}
        <div className="rounded-2xl border border-slate-700/50 bg-black/80 p-6 lg:col-span-2">
          <h3 className="font-space-grotesk mb-6 font-semibold text-white">
            Platform Performance Metrics
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {performanceMetrics.map((metric, index) => (
              <div key={index}>
                <div className="font-inter mb-1 flex items-center justify-between">
                  <div className="text-xs font-normal text-white">{metric.label} </div>
                  <div className="mb-2 text-[13px] font-semibold text-white">
                    {metric.percentage}%
                  </div>
                </div>

                <div className="bg-inactive mb-2 h-3 w-full rounded-full">
                  <div
                    className="h-3 rounded-full bg-white transition-all duration-500"
                    style={{ width: `${metric.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function UsersTab() {
    const handleViewProfile = (userId: string) => {
      router.push(`/admin/users/${userId}/profile`);
    };

    const handleManageUser = (userId: string) => {
      router.push(`/admin/users/${userId}`);
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-space-grotesk text-2xl font-semibold text-white">User Management</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="min-w-[250px] rounded-lg border border-slate-600 bg-[#1a2928] py-2 pr-4 pl-10 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
              />
            </div>
            <button className="flex items-center gap-2 rounded-lg border border-slate-600 bg-black px-4 py-2 text-white transition-colors hover:bg-slate-700">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="rounded-xl border border-slate-700/50 bg-black p-6 transition-all hover:border-green-500/30"
            >
              <div className="mb-4 flex items-start gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <h4 className="font-space-grotesk truncate text-lg font-semibold text-white">
                      {user.name}
                    </h4>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(user.status)}`}
                    >
                      {user.status}
                    </span>
                  </div>
                  <p className="font-inter text-sm text-gray-400">{user.location}</p>
                  <p className="font-inter text-sm text-gray-500">{user.userId}</p>
                </div>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-gray-400">Recycled:</span>
                  <span className="font-semibold text-white">{user.recycled}</span>
                </div>
                <div>
                  <span className="block text-gray-400">{user.userType}</span>
                  <span className="font-semibold text-green-400">Earned: {user.earned}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleViewProfile(user.id)}
                  className="w-full rounded-lg border border-slate-600 bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
                >
                  View Profile
                </button>
                <button
                  onClick={() => handleManageUser(user.id)}
                  className="w-full rounded-lg border border-slate-600 bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
                >
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  function ApprovalsTab() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-space-grotesk text-2xl font-semibold text-white">
            Pending Approvals ({pendingApprovals.length})
          </h3>
          <button
            onClick={() => router.push('/admin/approvals')}
            className="gradient-button font-inter flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-lg"
          >
            View All Approvals
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          {pendingApprovals.map((approval) => (
            <div
              key={approval.id}
              className="rounded-xl border border-slate-700/50 bg-black p-6 transition-all hover:border-green-500/30"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={approval.avatar}
                    alt={approval.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <h4 className="font-space-grotesk text-lg font-semibold text-white">
                        {approval.name}
                      </h4>
                      <span
                        className={`rounded-lg px-3 py-1 text-xs font-medium ${
                          approval.userType === 'vendor'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {approval.userType}
                      </span>
                    </div>
                    <p className="font-inter mb-1 text-sm text-gray-400">{approval.email}</p>
                    <p className="font-inter text-sm text-gray-500">
                      {approval.location} • {approval.documents} documents • Rider #
                      {approval.riderId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-inter text-sm text-gray-400">
                    {approval.submissionDate}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(approval)}
                      disabled={isProcessing || !isConnected}
                      className="flex min-w-[100px] items-center justify-center gap-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-600"
                    >
                      {isProcessing && processingId === approval.id && actionType === 'approve' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Approving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleReject(approval)}
                      disabled={isProcessing || !isConnected}
                      className="flex min-w-[100px] items-center justify-center gap-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-600"
                    >
                      {isProcessing && processingId === approval.id && actionType === 'ban' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4" />
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
    );
  }
  function AnalyticsTab() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Revenue Analytics */}
          <div className="rounded-xl border border-slate-700/50 bg-black p-6">
            <div className="mb-6 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-400" />
              <h3 className="font-space-grotesk text-lg font-semibold text-green-400">
                Revenue Analytics
              </h3>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-white p-6 text-center">
                <p className="font-space-grotesk mb-1 text-3xl font-bold text-green-600">
                  {revenueData.thisMonth}
                </p>
                <p className="font-inter text-sm font-medium text-green-600">This Month</p>
              </div>
              <div className="rounded-lg bg-white p-6 text-center">
                <p className="font-space-grotesk mb-1 text-3xl font-bold text-blue-600">
                  {revenueData.thisWeek}
                </p>
                <p className="font-inter text-sm font-medium text-blue-600">This Week</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-inter font-medium text-white">Growth Rate</span>
                <span className="text-lg font-semibold text-green-400">
                  {revenueData.growthRate}
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-white">
                <div className="h-3 rounded-full bg-green-500" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>

          {/* User Distribution */}
          <div className="rounded-xl border border-slate-700/50 bg-black p-6">
            <div className="mb-6 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-400" />
              <h3 className="font-space-grotesk text-lg font-semibold text-blue-400">
                User Distribution
              </h3>
            </div>

            <div className="space-y-6">
              {Object.entries(userDistribution).map(([key, data]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-inter font-medium text-white">{data.label}</span>
                    <span className="text-lg font-bold text-white">{data.percentage}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-700">
                    <div
                      className="h-2 rounded-full bg-white transition-all duration-500"
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  function SettingsTab() {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pricing & Contracts */}
        <div className="rounded-xl border border-slate-700/50 bg-black p-6">
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
                className="w-full cursor-pointer appearance-none rounded-lg border border-slate-600 bg-[#1a2928] px-4 py-3 text-white focus:border-green-500 focus:outline-none"
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
        <div className="rounded-xl border border-slate-700/50 bg-black p-6">
          <h3 className="text-primary font-space-grotesk mb-6 text-lg font-semibold">
            Contract Management
          </h3>

          <div className="space-y-4">
            <div>
              <label className="font-inter mb-2 block text-sm text-gray-400">Amount to Fund:</label>
              <input
                type="text"
                placeholder="e.g., $1000"
                value={fundingAmount}
                onChange={(e) => setFundingAmount(e.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-[#1a2928] px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button className="gradient-button font-inter w-full rounded-lg px-4 py-3 font-semibold text-black transition-all duration-200 hover:shadow-lg">
                Fund Contract
              </button>
              <button className="text-primary font-inter w-full rounded-lg border border-slate-600 bg-gray-800 px-4 py-3 font-semibold transition-colors hover:bg-gray-700">
                Get Contract Balance
              </button>
            </div>
          </div>
        </div>

        {/* Platform Settings */}
        <div className="rounded-xl border border-slate-700/50 bg-black p-6">
          <div className="mb-6 flex items-center gap-2">
            <Settings className="text-primary h-5 w-5" />
            <h3 className="text-primary font-space-grotesk text-lg font-semibold">
              Platform Settings
            </h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-inter font-medium text-white">Maintenance Mode</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-inter min-w-[70px] text-right text-sm text-gray-400">
                  Disabled
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-inter font-medium text-white">Auto Approvals</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-inter min-w-[70px] text-right text-sm text-gray-400">
                  Enabled
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-inter font-medium text-white">Email Notifications</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-inter min-w-[70px] text-right text-sm text-gray-400">
                  Enabled
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="rounded-xl border border-slate-700/50 bg-black p-6">
          <div className="mb-6 flex items-center gap-2">
            <Settings className="h-5 w-5 text-red-400" />
            <h3 className="font-space-grotesk text-lg font-semibold text-red-400">
              Security Settings
            </h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-inter font-medium text-white">Two-Factor Auth</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-inter rounded-lg bg-green-500 px-3 py-1 text-sm font-medium text-black">
                  Enabled
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-inter font-medium text-white">API Rate Limiting</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-inter rounded-lg bg-green-500 px-3 py-1 text-sm font-medium text-black">
                  Active
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-inter font-medium text-white">Audit Logging</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-inter rounded-lg bg-green-500 px-3 py-1 text-sm font-medium text-black">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
