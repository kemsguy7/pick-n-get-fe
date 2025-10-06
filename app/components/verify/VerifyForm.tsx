"use client"

import React, { useState } from "react"
import { Check, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import AppLayout from "../../components/layout/AppLayout"
import { useAuthStore } from "@/lib/authStore";
import { PhoneAuthProvider, getAuth, signInWithCredential } from "firebase/auth";

const VerifyForm = () => {
  const router = useRouter();
  const [code, setCode] = useState("");
  const { confirmationResult } = useAuthStore();

  const handleVerify = async () => {
    if (!confirmationResult) {
      alert("Session expired. Please try again.");
      router.push("/auth/login");
      return;
    }
    try {
      const verificationId = localStorage.getItem("verificationId");
      const credential = PhoneAuthProvider.credential(verificationId!, code);
      const result = await signInWithCredential(getAuth(), credential);
      console.log("User signed in:", result.user);
      router.push("/dashboard")
    } catch (error) {
      console.error("Invalid code", error);
    }
  };

  return (
    <AppLayout showHeader={true} showFooter={false} showSidebar={false}>
      <div className="min-h-screen body-gradient flex items-center justify-center p-4">
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
                <h2 className="text-lg font-semibold text-black font-space-grotesk mb-2">Verify Token</h2>
                  {/* Token */}
              <div>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors font-inter"
                  />
                </div>
              </div>
                <div className="mt-6 space-y-3">
                    <button
                    onClick={handleVerify}
                    className="font-space-grotesk flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                    > Submit
                    </button>
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

export default VerifyForm