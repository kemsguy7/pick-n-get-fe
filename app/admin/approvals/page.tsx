'use client';
import { useState } from 'react';
import {
  Users,
  CheckCircle,
  BarChart3,
  Settings,
  AlertCircle,
  Loader2,
  X,
  ChevronRight,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import StatCard, { StatCardProps } from '../../components/ui/statCard';
import { WalletInterface } from '../../services/wallets/walletInterface';
import { useWalletInterface } from '../../services/wallets/useWalletInterface';
import { approveRider, banRider } from '../../services/adminService';

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
  walletInterface: WalletInterface | null,
  network: string = 'testnet',
): [string, WalletInterface | null, string] => {
  return [accountId, walletInterface, network];
};
export default function AdminApprovalsPage() {
  const [activeTab, setActiveTab] = useState('approvals');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'ban' | null>(null);

  const { accountId, walletInterface } = useWalletInterface();

  // Determine connection status
  const isConnected = !!(accountId && walletInterface);

  // Stats data for approvals page
  const statsData: StatCardProps[] = [
    {
      icon: Users,
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-100',
      title: 'Pending Approvals',
      titleColor: 'text-orange-600',
      value: '23',
      valueColor: 'text-orange-600',
      subtitle: '15 agents, 8 vendors',
      subtitleColor: 'text-orange-500',
      backgroundColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      icon: CheckCircle,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      title: 'Approved Today',
      titleColor: 'text-blue-600',
      value: '8',
      valueColor: 'text-blue-600',
      subtitle: '6 agents, 2 vendors',
      subtitleColor: 'text-blue-500',
      backgroundColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      icon: X,
      iconColor: 'text-red-600',
      iconBgColor: 'bg-red-100',
      title: 'Rejected Today',
      titleColor: 'text-red-600',
      value: '2',
      valueColor: 'text-red-600',
      subtitle: '1 agent, 1 vendor',
      subtitleColor: 'text-red-500',
      backgroundColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      icon: Users,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      title: 'Avg. Approval Time',
      titleColor: 'text-green-600',
      value: '2.5 hrs',
      valueColor: 'text-green-600',
      subtitle: 'Down 30% this week',
      subtitleColor: 'text-green-500',
      backgroundColor: 'bg-green-50',
      borderColor: 'border-green-200',
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'approvals', label: 'Approvals', icon: CheckCircle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-orange-100 text-orange-600 border border-orange-200';
      case 'PENDING':
        return 'bg-blue-100 text-blue-600 border border-blue-200';
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

        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        throw new Error(result.error || 'Approval failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to approve rider';
      console.error('❌ Approval error:', error);
      setErrorMessage(errorMessage);
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
    } catch (error: unknown) {
      console.error('❌ Rejection error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to reject rider');
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
                Pending Approvals
              </h1>
              <p className="secondary-text font-inter text-lg">
                Review and approve agent and vendor applications
              </p>
            </div>
            <div className="flex gap-3">
              {!isConnected ? (
                <div className="flex items-center gap-2 rounded-lg border border-orange-300 bg-orange-100 px-6 py-2 text-sm font-medium text-orange-700">
                  <AlertCircle className="h-4 w-4" />
                  Connect wallet to manage approvals
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
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="font-medium text-red-700">{errorMessage}</span>
            </div>
          )}

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

          {/* Pending Approvals Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-space-grotesk text-xl font-semibold text-white">
                Review Applications ({pendingApprovals.length})
              </h3>
            </div>

            {/* Approval Cards */}
            <div className="space-y-4">
              {pendingApprovals.map((approval) => (
                <div
                  key={approval.id}
                  className="rounded-xl border border-slate-700/50 bg-black/80 p-6 transition-all hover:border-green-500/30"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-1 items-center gap-4">
                      <img
                        src={approval.avatar}
                        alt={approval.name}
                        className="h-14 w-14 rounded-full object-cover"
                      />
                      <div className="min-w-0 flex-1">
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
                        <div className="flex items-center gap-3 text-sm">
                          <span className="font-inter text-gray-500">{approval.location}</span>
                          <span className="text-gray-600">•</span>
                          <span className="font-inter text-gray-500">
                            {approval.documents} documents
                          </span>
                          <span className="text-gray-600">•</span>
                          <span className="font-inter text-gray-500">
                            Rider ID: #{approval.riderId}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-lg px-3 py-1 text-xs font-medium ${getStatusBadge(approval.status)}`}
                      >
                        {approval.status}
                      </span>
                      <span className="font-inter text-sm whitespace-nowrap text-gray-400">
                        {approval.submissionDate}
                      </span>

                      <div className="flex gap-2">
                        <button
                          onClick={() => window.open(`/admin/approvals/${approval.id}`, '_blank')}
                          className="flex items-center gap-1 rounded-lg border border-slate-600 bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
                        >
                          Review
                          <ChevronRight className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleApprove(approval)}
                          disabled={isProcessing || !isConnected}
                          className="flex min-w-[100px] items-center justify-center gap-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-600"
                        >
                          {isProcessing &&
                          processingId === approval.id &&
                          actionType === 'approve' ? (
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
        </div>
      </div>
    </AppLayout>
  );
}
