'use client';
import { Suspense, useState, useEffect } from 'react';
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
  X,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import StatCard, { StatCardProps } from '../components/ui/statCard';
import { useRouter, useSearchParams } from 'next/navigation';
import { WalletInterface } from '../services/wallets/walletInterface';
import { useWalletInterface } from '../services/wallets/useWalletInterface';
import { approveRider, banRider } from '../services/adminService';
import DocumentReviewModal from '../components/modals/DocumentReviewModal'; // Adjust path as needed

// ✅ PROPER TYPES
interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRiders: number;
  activeAgents: number;
  verifiedVendors: number;
  pendingApprovals: number;
  platformRevenue: string;
  totalEarnings: number;
  userGrowthRate: string;
  pickupGrowthRate: string;
  approvedToday: number;
  rejectedToday: number;
}

interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  priority: string;
}

interface PendingRider {
  riderId: number;
  name: string;
  phoneNumber: string;
  vehicleNumber: string;
  vehicleType: string;
  country: string;
  capacity: number;
  homeAddress: string;
  walletAddress?: string;
  approvalStatus: string;
  riderStatus: string;
  submissionDate: string;
  vehicleMakeModel?: string;
  vehiclePlateNumber?: string;
  vehicleColor?: string;
  documents: {
    profileImage?: string;
    driversLicense?: string;
    vehicleRegistration?: string;
    insuranceCertificate?: string;
    vehiclePhotos?: string;
  };
}

interface RecentActivity {
  type: string;
  message: string;
  timestamp: string;
  details?: Record<string, any>;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api/v1';

const createWalletData = (
  accountId: string,
  walletInterface: WalletInterface | null,
  network: string = 'testnet',
): [string, WalletInterface | null, string] => {
  return [accountId, walletInterface, network];
};

function AdminDashboardContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedMaterial, setSelectedMaterial] = useState('Paper & Cardboard');
  const [pricePerKg, setPricePerKg] = useState('$10/kg');
  const [fundingAmount, setFundingAmount] = useState('$1000');

  // ✅ DYNAMIC DATA STATE
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalRiders: 0,
    activeAgents: 0,
    verifiedVendors: 0,
    pendingApprovals: 0,
    platformRevenue: '$0',
    totalEarnings: 0,
    userGrowthRate: '+0.0%',
    pickupGrowthRate: '+0.0%',
    approvedToday: 0,
    rejectedToday: 0,
  });

  const [pendingRiders, setPendingRiders] = useState<PendingRider[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingPending, setIsLoadingPending] = useState(true);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);

  // Document review modal state
  const [documentModalOpen, setDocumentModalOpen] = useState(false);
  const [selectedRiderForReview, setSelectedRiderForReview] = useState<PendingRider | null>(null);

  // Approval state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'ban' | null>(null);

  const { accountId, walletInterface } = useWalletInterface();
  const isConnected = !!(accountId && walletInterface);

  // ✅ FETCH REAL DASHBOARD STATS
  const fetchDashboardStats = async () => {
    try {
      setIsLoadingStats(true);
      console.log('📊 Fetching dashboard stats...');

      const response = await fetch(`${BACKEND_URL}/admin/stats/dashboard`);
      const data = await response.json();

      if (data.status === 'success') {
        setDashboardStats(data.data);
        console.log('✅ Dashboard stats loaded');
      } else {
        throw new Error(data.message || 'Failed to fetch dashboard stats');
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', error);
      setErrorMessage('Failed to load dashboard statistics');
    } finally {
      setIsLoadingStats(false);
    }
  };

  // ✅ FETCH PENDING RIDERS
  const fetchPendingRiders = async () => {
    try {
      setIsLoadingPending(true);
      console.log('🔍 Fetching pending riders...');

      const response = await fetch(`${BACKEND_URL}/admin/riders/pending`);
      const data = await response.json();

      if (data.status === 'success') {
        setPendingRiders(data.data.riders);
        console.log(`✅ Loaded ${data.data.count} pending riders`);
      } else {
        throw new Error(data.message || 'Failed to fetch pending riders');
      }
    } catch (error) {
      console.error('❌ Error fetching pending riders:', error);
      setErrorMessage('Failed to load pending riders');
    } finally {
      setIsLoadingPending(false);
    }
  };

  // ✅ FETCH RECENT ACTIVITY
  const fetchRecentActivity = async () => {
    try {
      setIsLoadingActivity(true);
      console.log('📈 Fetching recent activity...');

      const response = await fetch(`${BACKEND_URL}/admin/activity/recent?limit=5`);
      const data = await response.json();

      if (data.status === 'success') {
        setRecentActivity(data.data.activities);
        console.log('✅ Recent activity loaded');
      } else {
        throw new Error(data.message || 'Failed to fetch recent activity');
      }
    } catch (error) {
      console.error('❌ Error fetching recent activity:', error);
    } finally {
      setIsLoadingActivity(false);
    }
  };

  // ✅ FETCH SYSTEM ALERTS
  const fetchSystemAlerts = async () => {
    try {
      console.log('🚨 Fetching system alerts...');

      const response = await fetch(`${BACKEND_URL}/admin/alerts/system`);
      const data = await response.json();

      if (data.status === 'success') {
        setSystemAlerts(data.data.alerts);
        console.log('✅ System alerts loaded');
      } else {
        throw new Error(data.message || 'Failed to fetch system alerts');
      }
    } catch (error) {
      console.error('❌ Error fetching system alerts:', error);
    }
  };

  // Handle tab query parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'users', 'approvals', 'analytics', 'settings'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // ✅ LOAD ALL DATA ON COMPONENT MOUNT
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchDashboardStats(),
        fetchPendingRiders(),
        fetchRecentActivity(),
        fetchSystemAlerts(),
      ]);
    };

    loadData();
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.replace(`/admin?tab=${tabId}`, { scroll: false });
  };

  // ✅ DYNAMIC STATS DATA
  const statsData: StatCardProps[] = [
    {
      icon: Users,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      title: 'Total Users',
      titleColor: 'text-green-600',
      value: isLoadingStats ? '...' : dashboardStats.totalUsers.toLocaleString(),
      valueColor: 'text-green-600',
      subtitle: dashboardStats.userGrowthRate + ' from last month',
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
      value: isLoadingStats ? '...' : dashboardStats.activeAgents.toString(),
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
      value: isLoadingStats ? '...' : dashboardStats.verifiedVendors.toString(),
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
      value: isLoadingStats ? '...' : dashboardStats.platformRevenue,
      valueColor: 'text-green-600',
      subtitle: dashboardStats.pickupGrowthRate + ' from last month',
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

  // ✅ HANDLE DOCUMENT REVIEW
  const handleReviewDocuments = (rider: PendingRider) => {
    setSelectedRiderForReview(rider);
    setDocumentModalOpen(true);
  };

  // ✅ APPROVAL HANDLERS
  const handleApprove = async (rider: PendingRider) => {
    if (!isConnected) {
      setErrorMessage('Please connect your wallet first');
      return;
    }

    console.log(`🎯 Starting approval process for rider ID: ${rider.riderId}`);

    setIsProcessing(true);
    setProcessingId(rider.riderId.toString());
    setActionType('approve');
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const walletData = createWalletData(accountId!, walletInterface!);
      const result = await approveRider(walletData, rider.riderId);

      if (result.success) {
        setSuccessMessage(
          `✅ Successfully approved ${rider.name}! Transaction: ${result.txHash?.substring(0, 10)}...`,
        );
        console.log(`🎉 Approval successful for ${rider.name}`);

        // Refresh data after approval
        await Promise.all([fetchPendingRiders(), fetchDashboardStats()]);

        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        throw new Error(result.error || 'Approval failed');
      }
    } catch (error) {
      console.error('❌ Approval error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to approve rider';
      setErrorMessage(errorMessage);
    } finally {
      setIsProcessing(false);
      setProcessingId(null);
      setActionType(null);
    }
  };

  const handleReject = async (rider: PendingRider) => {
    if (!isConnected) {
      setErrorMessage('Please connect your wallet first');
      return;
    }

    console.log(`🎯 Starting rejection process for rider ID: ${rider.riderId}`);

    setIsProcessing(true);
    setProcessingId(rider.riderId.toString());
    setActionType('ban');
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const walletData = createWalletData(accountId!, walletInterface!);
      const result = await banRider(walletData, rider.riderId);

      if (result.success) {
        setSuccessMessage(
          `✅ Successfully rejected ${rider.name}! Transaction: ${result.txHash?.substring(0, 10)}...`,
        );
        console.log(`🎉 Rejection successful for ${rider.name}`);

        // Refresh data after rejection
        await Promise.all([fetchPendingRiders(), fetchDashboardStats()]);

        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        throw new Error(result.error || 'Rejection failed');
      }
    } catch (error) {
      console.error('❌ Rejection error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to reject rider';
      setErrorMessage(errorMessage);
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
                Manage and monitor the EcoCleans platform
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
              <button
                onClick={() => setErrorMessage('')}
                className="ml-auto rounded p-1 hover:bg-red-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* System Alerts */}
          <div className="rounded-2xl border border-orange-200 bg-[#FFF4E8E5] p-6">
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <h3 className="font-inter font-semibold text-[#FF8C00]">
                System Alerts ({systemAlerts.length})
              </h3>
            </div>

            <div className="space-y-3">
              {systemAlerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
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
                      {alert.type === 'error' ? (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      ) : alert.type === 'warning' ? (
                        <Info className="h-5 w-5 text-orange-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-inter text-base font-medium text-black">{alert.title}</p>
                      <p className="font-inter text-xs text-[#1E2A28CC]">{alert.message}</p>
                    </div>
                  </div>
                  <span className="font-inter text-xs text-[#1E2A28CC]">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
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

      {/* Document Review Modal */}
      {selectedRiderForReview && (
        <DocumentReviewModal
          isOpen={documentModalOpen}
          onClose={() => {
            setDocumentModalOpen(false);
            setSelectedRiderForReview(null);
          }}
          riderData={selectedRiderForReview}
        />
      )}
    </AppLayout>
  );

  // ✅ TAB COMPONENTS
  function OverviewTab() {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Environmental Impact */}
        <div className="rounded-2xl border border-slate-700/50 bg-black/80 p-6">
          <div className="mb-6 flex items-center gap-2">
            <BarChart3 className="text-primary h-5 w-5" />
            <h3 className="font-space-grotesk text-primary font-semibold">Environmental Impact</h3>
          </div>

          <div className="font-inter mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white p-4 text-center">
              <p className="text-primary text-base font-semibold">125.6T</p>
              <p className="font-inter text-primary text-xs font-normal">Materials Recycled</p>
            </div>
            <div className="text-info-darker rounded-2xl bg-white p-4 text-center">
              <p className="font-inter text-base font-bold">78.4T</p>
              <p className="font-inter text-xs font-normal">CO2 Saved</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white text-center">
            <div className="font-inter text-info-purple flex flex-col items-center gap-1 py-4 font-semibold">
              <div className="text-base font-semibold">3564</div>
              <div className="text-xs font-normal">Trees Equivalent</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="font-inter rounded-2xl border border-slate-700/50 bg-black/80 p-6">
          <div className="mb-6 flex items-center gap-2">
            <h3 className="text-base font-medium text-white">Recent Activity</h3>
            {isLoadingActivity && <Loader2 className="h-4 w-4 animate-spin text-green-500" />}
          </div>

          <div className="space-y-4">
            {recentActivity.slice(0, 3).map((activity, index) => (
              <div
                key={index}
                className="font-inter notification-border flex items-center justify-between rounded-lg border p-4 text-white"
              >
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-white">{activity.message}</div>
                  <div className="lighter-green-text text-xs font-normal">{activity.type}</div>
                </div>
                <div className="lighter-green-text text-xs font-normal">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function UsersTab() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-space-grotesk text-2xl font-semibold text-white">User Management</h3>
          <button
            onClick={() => router.push('/admin/users')}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            View All Users
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-black/80 p-6">
          <p className="text-white">User management content will be loaded here...</p>
          <p className="mt-2 text-sm text-gray-400">
            Click "View All Users" to see detailed user management.
          </p>
        </div>
      </div>
    );
  }

  function ApprovalsTab() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-space-grotesk text-2xl font-bold text-white">
            Pending Approvals ({isLoadingPending ? '...' : pendingRiders.length})
          </h3>
          <button
            onClick={() => router.push('/admin/approvals')}
            className="gradient-button font-space-grotesk flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-lg"
          >
            View All Approvals
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Loading State */}
        {isLoadingPending && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            <span className="ml-2 text-gray-400">Loading pending approvals...</span>
          </div>
        )}

        {/* No Pending Approvals */}
        {!isLoadingPending && pendingRiders.length === 0 && (
          <div className="rounded-xl border border-slate-700/50 bg-black/80 p-12 text-center">
            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-gray-500" />
            <h3 className="mb-2 text-lg font-semibold text-white">No Pending Approvals</h3>
            <p className="text-gray-400">All rider applications have been processed.</p>
          </div>
        )}

        {/* Approval Cards - Show only first 3 */}
        {!isLoadingPending && pendingRiders.length > 0 && (
          <div className="space-y-4">
            {pendingRiders.slice(0, 3).map((rider) => (
              <div
                key={rider.riderId}
                className="rounded-xl border border-slate-700/50 bg-black/80 p-6 transition-all hover:border-green-500/30"
              >
                <div className="mb-6 flex items-start gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-700">
                    <span className="text-lg font-bold text-white">
                      {rider.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h4 className="font-inter text-lg font-medium text-white">{rider.name}</h4>
                      <span
                        className={`rounded-lg px-3 py-1 text-xs font-medium ${
                          rider.vehicleType === 'Car'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {rider.vehicleType}
                      </span>
                    </div>
                    <p className="font-inter mb-1 text-sm font-normal text-white/80">
                      {rider.phoneNumber}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-white/80">
                      <span>{rider.country}</span>
                      <span>•</span>
                      <span>{rider.vehicleNumber}</span>
                      <span>•</span>
                      <span>Capacity: {rider.capacity}kg</span>
                      <span>•</span>
                      <span>Rider #{rider.riderId}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  {/* ✅ UPDATED REVIEW DOCUMENTS BUTTON */}
                  <button
                    onClick={() => handleReviewDocuments(rider)}
                    className="font-inter notification-border flex flex-1 items-center justify-center gap-2 rounded-lg border px-6 py-3 text-base font-normal text-white transition-colors hover:bg-gray-800"
                  >
                    Review Documents
                  </button>

                  <button
                    onClick={() => handleApprove(rider)}
                    disabled={isProcessing || !isConnected}
                    className="font-space-grotesk secondary-green-bg flex min-w-[140px] items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-medium text-black transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:bg-gray-600"
                  >
                    {isProcessing &&
                    processingId === rider.riderId.toString() &&
                    actionType === 'approve' ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Approving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 rounded-full text-black" />
                        Approve
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleReject(rider)}
                    disabled={isProcessing || !isConnected}
                    className="font-inter notification-border flex min-w-[140px] items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-600"
                  >
                    {isProcessing &&
                    processingId === rider.riderId.toString() &&
                    actionType === 'ban' ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <X className="error-border text-error font-space-grotesk h-5 w-5 rounded-full border" />
                        Reject
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function AnalyticsTab() {
    return (
      <div className="space-y-6">
        <h3 className="font-space-grotesk text-2xl font-semibold text-white">
          Analytics Dashboard
        </h3>
        <div className="rounded-xl border border-slate-700/50 bg-black/80 p-6">
          <p className="text-white">Analytics and reporting features coming soon...</p>
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
      </div>
    );
  }
}

export default function AdminDashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-green-500" />
            <p className="text-white">Loading dashboard...</p>
          </div>
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
