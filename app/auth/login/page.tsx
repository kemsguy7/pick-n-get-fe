"use client"

import React, { useState } from "react"
import { Check, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import AppLayout from "../../components/layout/AppLayout"
import { getAuth, signInWithPhoneNumber } from "firebase/auth";
import { setUpRecaptcha } from "@/lib/firebaseRecaptcha";
import { app } from "@/lib/firebase";
import { useAuthStore } from "@/lib/authStore";

const page = () => {
    const router = useRouter();
    const { setConfirmationResult } = useAuthStore();

    const [phone, setPhone] = useState("");
    
    const handleSendOTP = async () => {
    const auth = getAuth(app);
    const verifier = setUpRecaptcha("recaptcha-container");
        try {
        const confirmation = await signInWithPhoneNumber(auth, phone, verifier);
        setConfirmationResult(confirmation);
        localStorage.setItem("verificationId", confirmation.verificationId);
        router.push("/auth/verify");
        } catch (error) {
        console.error("SMS not sent", error);
        }
  };

  return (
    <AppLayout showHeader={true} showFooter={false} showSidebar={false}>
      <div id="recaptcha-container" className="min-h-screen body-gradient flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-lg"></div>
            </div>
            <h1 className="text-2xl font-bold text-white font-space-grotesk">Welcome to Pick'n'Get</h1>
            <p className="text-gray-300 font-inter">Sign in to your sustainable future</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl p-6">
            {/* Progress Header */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-black font-space-grotesk mb-2">Sign In</h2>
                  {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-black mb-2 font-inter">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+2340000000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors font-inter"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    📞
                  </div>
                </div>
              </div>
                <div className="mt-6 space-y-3">
                    <button
                    onClick={handleSendOTP}
                    className="font-space-grotesk flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                    > Submit
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
          <div className="flex items-center justify-center gap-8 mt-8 text-center">
            <div className="text-white">
              <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs font-inter">Earn ECO Tokens</p>
            </div>
            <div className="text-white">
              <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs font-inter">Verified Platform</p>
            </div>
            <div className="text-white">
              <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs font-inter">Secure & Private</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default page