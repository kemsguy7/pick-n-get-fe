'use client';

import { useState, useContext, useEffect } from 'react';
import { Check, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import type { RecycleFormData } from '../../recycle/page';
import { MetamaskContext } from '../../contexts/MetamaskContext';
import { WalletConnectContext } from '../../contexts/WalletConnectContext';
import { useWalletInterface } from '../../services/wallets/useWalletInterface';
import { recycleItem, RecycleItemData } from '../../services/recycleService';

import { WalletInterface } from '../../services/wallets/walletInterface';

interface ConfirmationProps {
  formData: RecycleFormData;
  onReset: () => void;
}

// Convert wallet interface data to format expected by recycleService

const createWalletData = (
  accountId: string,
  walletInterface: WalletInterface | null,
  network: string = 'testnet',
): [string, WalletInterface | null, string] => {
  return [accountId, walletInterface, network];
};

export default function Confirmation({ formData, onReset }: ConfirmationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [error, setError] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [actualEarnings, setActualEarnings] = useState<number>(0);
  const [itemId, setItemId] = useState<number>(0);

  // Get wallet contexts
  const metamaskCtx = useContext(MetamaskContext);
  const walletConnectCtx = useContext(WalletConnectContext);
  const { accountId, walletInterface } = useWalletInterface();

  // Determine connection status
  const isConnected = !!(accountId && walletInterface);

  const calculateEarnings = () => {
    if (!formData.category || !formData.weight) return 0;
    return Number.parseFloat(formData.weight) * formData.category.rate;
  };

  const estimatedEarnings = calculateEarnings();

  // Auto-submit on component mount
  useEffect(() => {
    if (isConnected && submitStatus === 'pending') {
      handleBlockchainSubmission();
    } else if (!isConnected && submitStatus === 'pending') {
      setError('Wallet not connected');
      setSubmitStatus('error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, submitStatus]);
  const handleBlockchainSubmission = async () => {
    if (!isConnected || !formData.category || !formData.weight) {
      setError('Missing required data for submission');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Prepare recycling item data
      const recycleData: RecycleItemData = {
        type: formData.category.id,
        weight: parseFloat(formData.weight),
        description: formData.description || `${formData.category.name} - ${formData.weight}kg`,
        // Note: In a full implementation, ill'd later handle photo upload here
        // imageData: formData.photos.length > 0 ? await convertPhotoToBytes(formData.photos[0]) : undefined
      };

      const walletData = createWalletData(accountId!, walletInterface!);
      const result = await recycleItem(walletData, recycleData);

      if (result.success) {
        setTxHash(result.txHash || '');
        setActualEarnings(result.estimatedEarnings || estimatedEarnings);
        setItemId(result.itemId || 1);
        setSubmitStatus('success');
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (err) {
      console.error('Blockchain submission error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWalletStatus = () => {
    if (metamaskCtx.metamaskAccountAddress) {
      return { type: 'MetaMask', address: metamaskCtx.metamaskAccountAddress };
    } else if (walletConnectCtx.accountId) {
      return { type: 'WalletConnect', address: walletConnectCtx.accountId };
    }
    return { type: 'None', address: '' };
  };

  const walletStatus = getWalletStatus();

  if (submitStatus === 'pending' || isSubmitting) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 text-center backdrop-blur-sm">
          <div className="mb-8">
            <Loader2 className="mx-auto mb-4 h-16 w-16 animate-spin text-green-400" />
            <h2 className="font-space-grotesk mb-4 text-2xl font-bold text-white">
              Submitting to Blockchain...
            </h2>
            <p className="font-inter text-gray-300">
              {isSubmitting
                ? 'Processing your recycling request on the blockchain...'
                : 'Preparing submission...'}
            </p>
            <p className="font-inter mt-2 text-sm text-gray-400">
              This may take a few moments. Please don't close this window.
            </p>
          </div>

          {/* Submission Progress */}
          <div className="mx-auto max-w-md rounded-xl bg-black/60 p-6">
            <h3 className="font-space-grotesk mb-4 font-semibold text-white">
              Submitting via {walletStatus.type}
            </h3>
            <div className="font-inter space-y-3 text-left text-sm">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">Form data validated</span>
              </div>
              <div className="flex items-center gap-2">
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-gray-400" />
                )}
                <span className="text-gray-300">Submitting to contract</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-gray-400" />
                <span className="text-gray-300">Awaiting confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitStatus === 'error') {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 text-center backdrop-blur-sm">
          <div className="mb-8">
            <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-400" />
            <h2 className="font-space-grotesk mb-4 text-2xl font-bold text-red-400">
              Submission Failed
            </h2>
            <p className="font-inter mb-4 text-gray-300">
              There was an error submitting your recycling request to the blockchain.
            </p>

            {/* Error Details */}
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
              <p className="font-inter text-sm text-red-400">{error}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={() => {
                setSubmitStatus('pending');
                setError('');
                handleBlockchainSubmission();
              }}
              className="font-inter rounded-lg bg-blue-500 px-6 py-3 text-white transition-colors hover:bg-blue-600"
            >
              Try Again
            </button>
            <button
              onClick={onReset}
              className="font-inter rounded-lg bg-gray-500 px-6 py-3 text-white transition-colors hover:bg-gray-600"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 text-center backdrop-blur-sm">
        <div className="mb-8">
          <Check className="mx-auto mb-4 h-16 w-16 text-green-400" />
          <h2 className="font-space-grotesk mb-4 text-3xl font-bold text-green-400">
            Recycling Request Submitted Successfully! 🎉
          </h2>
          <p className="font-inter text-gray-300">
            Your recycling request has been recorded on the blockchain.
          </p>
          <p className="font-inter text-gray-300">
            Our verified agent will contact you soon for pickup.
          </p>
        </div>

        {/* Blockchain Confirmation */}
        {txHash && (
          <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
            <h3 className="font-space-grotesk mb-2 font-semibold text-green-400">
              Blockchain Confirmation
            </h3>
            <div className="font-inter flex items-center justify-center gap-2 text-sm">
              <span className="text-gray-300">Transaction Hash:</span>
              <code className="font-mono text-xs break-all text-green-400">{txHash}</code>
              <a
                href={`https://hashscan.io/testnet/transaction/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}

        {/* Request Summary */}
        <div className="mx-auto mb-8 max-w-md rounded-xl bg-white/95 p-6 text-left">
          <h3 className="font-space-grotesk mb-4 text-center text-lg font-semibold text-gray-800">
            Request Summary
          </h3>
          <div className="font-inter space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="font-medium text-gray-800">{formData.category?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Weight:</span>
              <span className="font-medium text-gray-800">{formData.weight} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Earning:</span>
              <span className="font-semibold text-green-600">₦{actualEarnings.toFixed(2)}</span>
            </div>
            {itemId && (
              <div className="flex justify-between">
                <span className="text-gray-600">Item ID:</span>
                <span className="font-medium text-gray-800">#{itemId}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Submitted via:</span>
              <span className="font-medium text-gray-800">{walletStatus.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-green-600">Pending Pickup</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button className="font-inter flex items-center justify-center rounded-lg bg-black px-6 py-3 text-white transition-colors hover:bg-gray-800">
            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Track Pickup Status
          </button>
          <button
            onClick={onReset}
            className="font-inter flex items-center justify-center rounded-lg bg-gradient-to-r from-yellow-400 to-green-500 px-6 py-3 font-semibold text-black transition-all hover:from-yellow-500 hover:to-green-600"
          >
            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Submit Another Item
          </button>
        </div>
      </div>
    </div>
  );
}
