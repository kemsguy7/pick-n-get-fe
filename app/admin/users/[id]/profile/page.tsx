"use client"
import { ArrowLeft } from 'lucide-react'
import AppLayout from '../../../../components/layout/AppLayout'

interface RecyclingHistoryItem {
  itemId: string
  category: string
  weight: string
  date: string
  payout: string
}

export default function UserProfilePage() {
  const recyclingHistory: RecyclingHistoryItem[] = [
    {
      itemId: '#I101',
      category: 'Plastic',
      weight: '5kg',
      date: '2025-09-10',
      payout: '15 HBAR'
    },
    {
      itemId: '#I102',
      category: 'Metal',
      weight: '12kg',
      date: '2025-09-14',
      payout: '30 HBAR'
    },
    {
      itemId: '#I102',
      category: 'Metal',
      weight: '12kg',
      date: '2025-09-14',
      payout: '30 HBAR'
    }
  ]

  return (
    <AppLayout showHeader={true} showSidebar={true} showFooter={true}>
      <div className="min-h-screen p-4 lg:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors font-inter">
              <ArrowLeft className="w-4 h-4" />
              Back to Users
            </button>
            <h1 className="text-2xl lg:text-3xl font-bold text-primary font-space-grotesk">
              User Profile
            </h1>
          </div>

          {/* User Profile Card */}
          <div className="bg-black/80 rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-4 mb-6">
              <img 
                src="/api/placeholder/80/80" 
                alt="Adaora Okafor"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold text-primary font-space-grotesk">Adaora Okafor</h2>
                <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                  <div>
                    <span className="text-gray-400">User ID:</span>
                    <span className="text-white ml-2 font-semibold">#U001</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Country:</span>
                    <span className="text-white ml-2">Nigeria</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Email:</span>
                    <span className="text-white ml-2">adaoraokafor@example.com</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Items Recycled:</span>
                    <span className="text-white ml-2">12</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Phone:</span>
                    <span className="text-white ml-2">+234 812 345 6789</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <span className="bg-[#DCFCE7] text-primary px-2 py-1 rounded-full text-xs font-medium ml-2">
                      Active
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Role:</span>
                    <span className="text-white ml-2">Recycler</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Balance:</span>
                    <span className="text-white ml-2">120 HBAR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recycling History */}
          <div className="bg-black/80 rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-white font-semibold mb-6 font-space-grotesk text-xl">Recycling History</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-green-500 to-blue-500 text-black">
                    <th className="text-left p-4 rounded-l-lg font-semibold">Item ID</th>
                    <th className="text-left p-4 font-semibold">Category</th>
                    <th className="text-left p-4 font-semibold">Weight</th>
                    <th className="text-left p-4 font-semibold">Date</th>
                    <th className="text-left p-4 rounded-r-lg font-semibold">Payout</th>
                  </tr>
                </thead>
                <tbody>
                  {recyclingHistory.map((item, index) => (
                    <tr key={index} className="border-b border-slate-700/50">
                      <td className="p-4 text-white font-semibold">{item.itemId}</td>
                      <td className="p-4 text-white">{item.category}</td>
                      <td className="p-4 text-white">{item.weight}</td>
                      <td className="p-4 text-white">{item.date}</td>
                      <td className="p-4 text-white">{item.payout}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}