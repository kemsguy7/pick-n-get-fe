"use client"

import { useState } from "react"
import type { RecycleFormData } from "./page"

interface PickupScheduleProps {
  formData: RecycleFormData
  updateFormData: (data: Partial<RecycleFormData>) => void
  onSubmit: () => void
  onBack: () => void
}

export default function PickupSchedule({ formData, updateFormData, onSubmit, onBack }: PickupScheduleProps) {
  const [address, setAddress] = useState(formData.address)
  const [date, setDate] = useState(formData.date)
  const [time, setTime] = useState(formData.time)

  const handleSubmit = () => {
    updateFormData({ address, date, time })
    onSubmit()
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-blue-400 font-space-grotesk">Schedule Pickup</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address */}
            <div>
              <label className="block text-white font-medium mb-2 font-inter">Pickup Address *</label>
              <textarea
                rows={3}
                placeholder="Enter your full address including landmarks"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors resize-none"
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2 font-inter">Preferred Date *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2 font-inter">Preferred Time *</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                >
                  <option value="">Select time</option>
                  <option value="08:00-10:00">8:00 AM - 10:00 AM</option>
                  <option value="10:00-12:00">10:00 AM - 12:00 PM</option>
                  <option value="12:00-14:00">12:00 PM - 2:00 PM</option>
                  <option value="14:00-16:00">2:00 PM - 4:00 PM</option>
                  <option value="16:00-18:00">4:00 PM - 6:00 PM</option>
                </select>
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-white font-medium mb-2 font-inter">Add Photos (Optional)</label>
              <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-green-500/50 transition-colors">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-400 font-inter">Helps our agents verify and process faster</p>
              </div>
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="space-y-6">
            {/* Pickup Information */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-blue-400 font-semibold font-space-grotesk">Pickup Information</h3>
              </div>
              <ul className="space-y-2 text-sm font-inter">
                <li className="text-gray-300">• Free pickup for orders above 5kg</li>
                <li className="text-gray-300">• Pickup fee: ₦200 for orders below 5kg</li>
                <li className="text-gray-300">• Available: Monday - Saturday, 8AM - 6PM</li>
                <li className="text-gray-300">• Agent will call 30 minutes before arrival</li>
              </ul>
            </div>

            {/* Preparation Tips */}
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-2">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-orange-400 font-semibold font-space-grotesk">Preparation Tips</h3>
              </div>
              <ul className="space-y-2 text-sm font-inter">
                <li className="text-gray-300">• Clean items before pickup</li>
                <li className="text-gray-300">• Separate different material types</li>
                <li className="text-gray-300">• Have items ready at pickup location</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="bg-black px-6 py-3 rounded-lg text-white hover:bg-gray-800 transition-colors font-inter"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={!address || !date || !time}
            className="bg-gradient-to-r from-yellow-400 to-green-500 px-6 py-3 rounded-lg text-black font-semibold hover:from-yellow-500 hover:to-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-inter flex items-center"
          >
            Submit Request
            <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
