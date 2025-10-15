'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AppLayout from '../../components/layout/AppLayout';
import { getAuth, signInWithPhoneNumber } from 'firebase/auth';
import { setUpRecaptcha } from '@/lib/firebaseRecaptcha';
import { app } from '@/lib/firebase';
import { useAuthStore } from '@/lib/authStore';

const LoginPage = () => {
  const router = useRouter();
  const { setConfirmationResult } = useAuthStore();

  const [phone, setPhone] = useState('');

  const handleSendOTP = async () => {
    const auth = getAuth(app);
    const verifier = setUpRecaptcha('recaptcha-container');
    try {
      const confirmation = await signInWithPhoneNumber(auth, phone, verifier);
      setConfirmationResult(confirmation);
      localStorage.setItem('verificationId', confirmation.verificationId);
      router.push('/auth/verify');
    } catch (error) {
      console.error('SMS not sent', error);
    }
  };

  return (
    <AppLayout showHeader={true} showFooter={false} showSidebar={false}>
      <div
        id="recaptcha-container"
        className="body-gradient flex min-h-screen items-center justify-center p-4"
      >
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500">
              <div className="h-8 w-8 rounded-lg bg-white"></div>
            </div>
            <h1 className="font-space-grotesk text-2xl font-bold text-white">
              Welcome to Pick'n'Get
            </h1>
            <p className="font-inter text-gray-300">Sign in to your sustainable future</p>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl bg-white p-6">
            {/* Progress Header */}
            <div className="mb-6">
              <h2 className="font-space-grotesk mb-2 text-lg font-semibold text-black">Sign In</h2>
              {/* Phone */}
              <div>
                <label className="font-inter mb-2 block text-sm font-medium text-black">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+2340000000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="font-inter w-full rounded-lg border border-gray-300 py-2 pr-3 pl-10 transition-colors focus:border-green-500 focus:outline-none"
                  />
                  <div className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400">
                    📞
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleSendOTP}
                  className="font-space-grotesk flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {' '}
                  Submit
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <p className="font-inter text-center text-sm text-gray-600">
                Don't have an account Sign up here?{' '}
                <span
                  className="cursor-pointer text-green-500 hover:underline"
                  onClick={() => router.push('/auth/signup/recycler')}
                >
                  Sign up here
                </span>
              </p>
              <div className="flex items-center justify-center">
                <span className="font-inter cursor-pointer text-sm text-green-500">
                  Join the sustainable revolution
                </span>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 flex items-center justify-center gap-8 text-center">
            <div className="text-white">
              <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                <Check className="h-4 w-4 text-white" />
              </div>
              <p className="font-inter text-xs">Earn ECO Tokens</p>
            </div>
            <div className="text-white">
              <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                <Check className="h-4 w-4 text-white" />
              </div>
              <p className="font-inter text-xs">Verified Platform</p>
            </div>
            <div className="text-white">
              <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                <Check className="h-4 w-4 text-white" />
              </div>
              <p className="font-inter text-xs">Secure & Private</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LoginPage;
