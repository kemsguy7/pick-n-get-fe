"use client"
import { useState } from "react"
import { Calendar, Bike, Car, Truck, MapPin, AlertTriangle, Info } from "lucide-react"
import type { RecycleFormData } from "../../recycle/page"

interface PickupScheduleProps {
  formData: RecycleFormData
  updateFormData: (data: Partial<RecycleFormData>) => void
  onSubmit: () => void
  onBack: () => void
}

interface Vehicle {
  id: string
  name: string
  icon: React.ReactNode
  price: number
  minWeight?: number
}

interface Driver {
  id: string
  name: string
  rating: number
  distance: string
  price: number
  estimatedTime: string
}

const vehicles: Vehicle[] = [
  {
    id: 'bike',
    name: 'Bike',
    icon: <Bike className="w-5 h-5" />,
    price: 500,
    minWeight: 0
  },
  {
    id: 'car',
    name: 'Car',
    icon: <Car className="w-5 h-5" />,
    price: 1000,
    minWeight: 0
  },
  {
    id: 'van',
    name: 'Van',
    icon: <Truck className="w-5 h-5" />,
    price: 2000,
    minWeight: 0
  },
  {
    id: 'truck',
    name: 'Truck',
    icon: <Truck className="w-5 h-5" />,
    price: 3000,
    minWeight: 0
  }
]

const availableDrivers: Driver[] = [
  {
    id: '1',
    name: 'Samuel O.',
    rating: 4.8,
    distance: '2.1km away',
    price: 500,
    estimatedTime: '15-20 mins'
  },
  {
    id: '2',
    name: 'Jane A.',
    rating: 4.9,
    distance: '3.5km away',
    price: 1000,
    estimatedTime: '20-25 mins'
  },
  {
    id: '3',
    name: 'Emeka T.',
    rating: 4.7,
    distance: '5.0km away',
    price: 2000,
    estimatedTime: '25-30 mins'
  },
  {
    id: '4',
    name: 'Kofi M.',
    rating: 4.6,
    distance: '7.2km away',
    price: 3000,
    estimatedTime: '30-35 mins'
  }
]

export default function PickupSchedule({ formData, updateFormData, onSubmit, onBack }: PickupScheduleProps) {
  const [country, setCountry] = useState('Nigeria')
  const [address, setAddress] = useState(formData.address || 'Test Address, Lagos, Nigeria')
  const [date, setDate] = useState(formData.date || new Date().toISOString().split('T')[0])
  const [time, setTime] = useState(formData.time || '10:00')
  const [selectedVehicle, setSelectedVehicle] = useState<"bike" | "car" | "truck" | undefined>(formData.selectedVehicle || 'car')
  const [selectedDriver, setSelectedDriver] = useState<string>(formData.selectedDriver || '1')
  const [showDrivers, setShowDrivers] = useState(true) // Always show for testing

  // Mock weight from category (in real app, this would come from previous step)
  const estimatedWeight = parseFloat(formData.weight) || 2.5 // kg

  const handleVehicleSelect = (vehicleId: any) => {
    setSelectedVehicle(vehicleId)
    setShowDrivers(true)
    // Auto-select first driver for testing
    if (!selectedDriver) {
      setSelectedDriver('1')
    }
  }

  const handleDriverSelect = (driverId: string) => {
    setSelectedDriver(driverId)
  }

  const handleSubmit = () => {
    updateFormData({ 
      address, 
      date, 
      time,
      selectedVehicle,
      selectedDriver
    })
    onSubmit()
  }

  // Relaxed validation for testing - only require basic selections
  const isFormValid = selectedVehicle && selectedDriver

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-slate-700/50">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-blue-400 font-space-grotesk">Schedule Pickup</h2>
        </div>

        {/* Testing Notice */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <p className="text-blue-400 text-sm font-inter">
              🧪 Testing Mode: Just select a vehicle and driver to proceed. Full pickup integration coming soon!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Country Selection - Pre-filled for testing */}
            <div>
              <label className="block text-white font-medium mb-2 font-inter">Select Country *</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
              >
                <option value="Nigeria">Nigeria</option>
                <option value="Ghana">Ghana</option>
                <option value="Kenya">Kenya</option>
              </select>
            </div>

            {/* Address - Pre-filled for testing */}
            <div>
              <label className="block text-white font-medium mb-2 font-inter">Pickup Address *</label>
              <textarea
                rows={3}
                placeholder="Enter your full address including landmarks"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">Pre-filled for testing. You can modify if needed.</p>
            </div>

            {/* Date & Time - Pre-filled for testing */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2 font-inter">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2 font-inter">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                />
              </div>
            </div>

            {/* Vehicle Selection */}
            <div>
              <label className="block text-white font-medium mb-2 font-inter">Select Vehicle (with price) *</label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {vehicles.map((vehicle) => {
                  const isDisabled = estimatedWeight > 10 && vehicle.id === 'bike'
                  return (
                    <button
                      key={vehicle.id}
                      onClick={() => !isDisabled && handleVehicleSelect(vehicle.id)}
                      disabled={isDisabled}
                      className={`p-4 rounded-lg border transition-all duration-200 flex flex-col items-center gap-2 ${
                        selectedVehicle === vehicle.id
                          ? 'bg-green-500/20 border-green-500 text-green-400'
                          : isDisabled
                          ? 'bg-slate-700/30 border-slate-600/50 text-slate-500 cursor-not-allowed'
                          : 'bg-slate-700/50 border-slate-600 text-white hover:border-green-500/50 hover:bg-green-500/10'
                      }`}
                    >
                      {vehicle.icon}
                      <span className="font-medium text-sm">{vehicle.name}</span>
                      <span className="text-xs">₦{vehicle.price.toLocaleString()}</span>
                    </button>
                  )
                })}
              </div>

              {/* Success message */}
              {selectedVehicle && (
                <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
                  <Info className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <p className="text-green-400 text-sm font-inter">
                    {vehicles.find(v => v.id === selectedVehicle)?.name} selected successfully. Please choose a rider below.
                  </p>
                </div>
              )}
            </div>

            {/* Available Drivers - Always show if vehicle selected */}
            {selectedVehicle && (
              <div>
                <h3 className="text-white font-medium mb-4 font-inter">Available Riders (Demo)</h3>
                <div className="bg-black/60 rounded-xl p-4 space-y-3">
                  {availableDrivers.map((driver) => (
                    <button
                      key={driver.id}
                      onClick={() => handleDriverSelect(driver.id)}
                      className={`w-full p-4 rounded-lg border transition-all duration-200 flex items-center justify-between ${
                        selectedDriver === driver.id
                          ? 'bg-green-500/20 border-green-500 text-green-400'
                          : 'bg-slate-800 border-slate-600 text-white hover:border-green-500/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                          <Truck className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">{driver.name}</p>
                          <div className="flex items-center gap-1 text-sm">
                            <span className="text-yellow-400">★{driver.rating}</span>
                            <span className="text-gray-400">({driver.distance})</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₦{driver.price.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">{driver.estimatedTime}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Info */}
          <div className="space-y-6">
            {/* Pickup Information */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                  <Info className="w-3 h-3 text-white" />
                </div>
                <h3 className="text-blue-400 font-semibold font-space-grotesk">Testing Information</h3>
              </div>
              <ul className="space-y-2 text-sm font-inter">
                <li className="text-gray-300">• This is demo pickup scheduling</li>
                <li className="text-gray-300">• Just select any vehicle and driver</li>
                <li className="text-gray-300">• Real pickup integration coming soon</li>
                <li className="text-gray-300">• Focus is on blockchain recycling flow</li>
              </ul>
            </div>

            {/* Current Selection Summary */}
            {selectedVehicle && selectedDriver && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
                <h3 className="text-green-400 font-semibold font-space-grotesk mb-3">Selection Summary</h3>
                <div className="space-y-2 text-sm font-inter">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Vehicle:</span>
                    <span className="text-white">{vehicles.find(v => v.id === selectedVehicle)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Driver:</span>
                    <span className="text-white">{availableDrivers.find(d => d.id === selectedDriver)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Ready to submit:</span>
                    <span className="text-green-400">✅ Yes</span>
                  </div>
                </div>
              </div>
            )}
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
            disabled={!isFormValid}
            className={`px-6 py-3 rounded-lg font-semibold font-inter flex items-center gap-2 transition-all ${
              isFormValid
                ? 'gradient-button text-black hover:shadow-lg'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Submit Request
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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