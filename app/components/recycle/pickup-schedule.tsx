'use client';
import { useState } from 'react';
import { Calendar, Bike, Car, Truck, Info } from 'lucide-react';
import type { RecycleFormData } from '../../recycle/page';

interface PickupScheduleProps {
  formData: RecycleFormData;
  updateFormData: (data: Partial<RecycleFormData>) => void;
  onSubmit: () => void;
  onBack: () => void;
}

interface Vehicle {
  id: string;
  name: string;
  icon: React.ReactNode;
  price: number;
  minWeight?: number;
}

interface Driver {
  id: string;
  name: string;
  rating: number;
  distance: string;
  price: number;
  estimatedTime: string;
}

const vehicles: Vehicle[] = [
  {
    id: 'bike',
    name: 'Bike',
    icon: <Bike className="h-5 w-5" />,
    price: 500,
    minWeight: 0,
  },
  {
    id: 'car',
    name: 'Car',
    icon: <Car className="h-5 w-5" />,
    price: 1000,
    minWeight: 0,
  },
  {
    id: 'van',
    name: 'Van',
    icon: <Truck className="h-5 w-5" />,
    price: 2000,
    minWeight: 0,
  },
  {
    id: 'truck',
    name: 'Truck',
    icon: <Truck className="h-5 w-5" />,
    price: 3000,
    minWeight: 0,
  },
];

const availableDrivers: Driver[] = [
  {
    id: '1',
    name: 'Samuel O.',
    rating: 4.8,
    distance: '2.1km away',
    price: 500,
    estimatedTime: '15-20 mins',
  },
  {
    id: '2',
    name: 'Jane A.',
    rating: 4.9,
    distance: '3.5km away',
    price: 1000,
    estimatedTime: '20-25 mins',
  },
  {
    id: '3',
    name: 'Emeka T.',
    rating: 4.7,
    distance: '5.0km away',
    price: 2000,
    estimatedTime: '25-30 mins',
  },
  {
    id: '4',
    name: 'Kofi M.',
    rating: 4.6,
    distance: '7.2km away',
    price: 3000,
    estimatedTime: '30-35 mins',
  },
];

export default function PickupSchedule({
  formData,
  updateFormData,
  onSubmit,
  onBack,
}: PickupScheduleProps) {
  const [country, setCountry] = useState('Nigeria');
  const [address, setAddress] = useState(formData.address || 'Test Address, Lagos, Nigeria');
  const [date, setDate] = useState(formData.date || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(formData.time || '10:00');
  const [selectedVehicle, setSelectedVehicle] = useState<'bike' | 'car' | 'truck' | undefined>(
    formData.selectedVehicle || 'car',
  );
  const [selectedDriver, setSelectedDriver] = useState<string>(formData.selectedDriver || '1');
  const [showDrivers, setShowDrivers] = useState(true); // Always show for testing

  console.log(showDrivers);
  // Mock weight from category (in real app, this would come from previous step)
  const estimatedWeight = parseFloat(formData.weight) || 2.5; // kg

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(vehicleId as 'bike' | 'car' | 'truck');
    setShowDrivers(true);
    // Auto-select first driver for testing
    if (!selectedDriver) {
      setSelectedDriver('1');
    }
  };

  const handleDriverSelect = (driverId: string) => {
    setSelectedDriver(driverId);
  };

  const handleSubmit = () => {
    updateFormData({
      address,
      date,
      time,
      selectedVehicle,
      selectedDriver,
    });
    onSubmit();
  };

  // Relaxed validation for testing - only require basic selections
  const isFormValid = selectedVehicle && selectedDriver;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-sm lg:p-8">
        <div className="mb-6 flex items-center">
          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
            <Calendar className="h-4 w-4 text-white" />
          </div>
          <h2 className="font-space-grotesk text-xl font-semibold text-blue-400">
            Schedule Pickup
          </h2>
        </div>

        {/* Testing Notice */}
        <div className="mb-6 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 flex-shrink-0 text-blue-400" />
            <p className="font-inter text-sm text-blue-400">
              🧪 Testing Mode: Just select a vehicle and driver to proceed. Full pickup integration
              coming soon!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6 lg:col-span-2">
            {/* Country Selection - Pre-filled for testing */}
            <div>
              <label className="font-inter mb-2 block font-medium text-white">
                Select Country *
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-3 text-white transition-colors focus:border-green-500 focus:outline-none"
              >
                <option value="Nigeria">Nigeria</option>
                <option value="Ghana">Ghana</option>
                <option value="Kenya">Kenya</option>
              </select>
            </div>

            {/* Address - Pre-filled for testing */}
            <div>
              <label className="font-inter mb-2 block font-medium text-white">
                Pickup Address *
              </label>
              <textarea
                rows={3}
                placeholder="Enter your full address including landmarks"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full resize-none rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-3 text-white placeholder-gray-400 transition-colors focus:border-green-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-400">
                Pre-filled for testing. You can modify if needed.
              </p>
            </div>

            {/* Date & Time - Pre-filled for testing */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-inter mb-2 block font-medium text-white">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-3 text-white transition-colors focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-inter mb-2 block font-medium text-white">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-3 text-white transition-colors focus:border-green-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Vehicle Selection */}
            <div>
              <label className="font-inter mb-2 block font-medium text-white">
                Select Vehicle (with price) *
              </label>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {vehicles.map((vehicle) => {
                  const isDisabled = estimatedWeight > 10 && vehicle.id === 'bike';
                  return (
                    <button
                      key={vehicle.id}
                      onClick={() => !isDisabled && handleVehicleSelect(vehicle.id)}
                      disabled={isDisabled}
                      className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-all duration-200 ${
                        selectedVehicle === vehicle.id
                          ? 'border-green-500 bg-green-500/20 text-green-400'
                          : isDisabled
                            ? 'cursor-not-allowed border-slate-600/50 bg-slate-700/30 text-slate-500'
                            : 'border-slate-600 bg-slate-700/50 text-white hover:border-green-500/50 hover:bg-green-500/10'
                      }`}
                    >
                      {vehicle.icon}
                      <span className="text-sm font-medium">{vehicle.name}</span>
                      <span className="text-xs">₦{vehicle.price.toLocaleString()}</span>
                    </button>
                  );
                })}
              </div>

              {/* Success message */}
              {selectedVehicle && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3">
                  <Info className="h-5 w-5 flex-shrink-0 text-green-400" />
                  <p className="font-inter text-sm text-green-400">
                    {vehicles.find((v) => v.id === selectedVehicle)?.name} selected successfully.
                    Please choose a rider below.
                  </p>
                </div>
              )}
            </div>

            {/* Available Drivers - Always show if vehicle selected */}
            {selectedVehicle && (
              <div>
                <h3 className="font-inter mb-4 font-medium text-white">Available Riders (Demo)</h3>
                <div className="space-y-3 rounded-xl bg-black/60 p-4">
                  {availableDrivers.map((driver) => (
                    <button
                      key={driver.id}
                      onClick={() => handleDriverSelect(driver.id)}
                      className={`flex w-full items-center justify-between rounded-lg border p-4 transition-all duration-200 ${
                        selectedDriver === driver.id
                          ? 'border-green-500 bg-green-500/20 text-green-400'
                          : 'border-slate-600 bg-slate-800 text-white hover:border-green-500/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500">
                          <Truck className="h-5 w-5 text-white" />
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
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-6">
              <div className="mb-4 flex items-center">
                <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
                  <Info className="h-3 w-3 text-white" />
                </div>
                <h3 className="font-space-grotesk font-semibold text-blue-400">
                  Testing Information
                </h3>
              </div>
              <ul className="font-inter space-y-2 text-sm">
                <li className="text-gray-300">• This is demo pickup scheduling</li>
                <li className="text-gray-300">• Just select any vehicle and driver</li>
                <li className="text-gray-300">• Real pickup integration coming soon</li>
                <li className="text-gray-300">• Focus is on blockchain recycling flow</li>
              </ul>
            </div>

            {/* Current Selection Summary */}
            {selectedVehicle && selectedDriver && (
              <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-6">
                <h3 className="font-space-grotesk mb-3 font-semibold text-green-400">
                  Selection Summary
                </h3>
                <div className="font-inter space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Vehicle:</span>
                    <span className="text-white">
                      {vehicles.find((v) => v.id === selectedVehicle)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Driver:</span>
                    <span className="text-white">
                      {availableDrivers.find((d) => d.id === selectedDriver)?.name}
                    </span>
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
        <div className="mt-8 flex justify-between">
          <button
            onClick={onBack}
            className="font-inter rounded-lg bg-black px-6 py-3 text-white transition-colors hover:bg-gray-800"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`font-inter flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all ${
              isFormValid
                ? 'gradient-button text-black hover:shadow-lg'
                : 'cursor-not-allowed bg-gray-600 text-gray-400'
            }`}
          >
            Submit Request
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
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
  );
}
