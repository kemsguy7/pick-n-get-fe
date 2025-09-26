"use client"
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import AppLayout from "../../../../components/layout/AppLayout"

interface RecyclingHistoryItem {
  itemId: string
  category: string
  weight: string
  date: string
  payout: string
}

export default function UserProfilePage() {
  const router = useRouter()
  
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

  const handleBackToUsers = () => {
    // Navigate back to admin dashboard and set users tab as active
    router.push('/admin?tab=users')
  }

  return (
    <AppLayout showHeader={true} showSidebar={true} showFooter={true}>
      <div className="min-h-screen p-4 lg:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl lg:text-3xl font-bold text-primary font-space-grotesk">
              User Profile
            </h1>
            <button 
              onClick={handleBackToUsers}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white transition-colors font-inter text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Users
            </button>
          </div>

          {/* User Profile Card */}
          <div className="bg-black rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-start gap-6 mb-8">
              <img 
                src="/api/placeholder/80/80" 
                alt="Adaora Okafor"
                className="w-20 h-20 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-primary font-space-grotesk mb-4">Adaora Okafor</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-inter">User ID:</span>
                    <span className="text-white font-semibold font-space-grotesk">#U001</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-inter">Country:</span>
                    <span className="text-white font-inter">Nigeria</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-inter">Email:</span>
                    <span className="text-white font-inter">adaoraokafor@example.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-inter">Items Recycled:</span>
                    <span className="text-white font-inter">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-inter">Phone:</span>
                    <span className="text-white font-inter">+234 812 345 6789</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-inter">Status:</span>
                    <span className="bg-[#DCFCE7] text-primary px-3 py-1 rounded-full text-xs font-medium">
                      Active
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-inter">Role:</span>
                    <span className="text-white font-inter">Recycler</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-inter">Balance:</span>
                    <span className="text-white font-inter">120 HBAR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recycling History */}
          <div className="bg-black rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-white font-semibold mb-6 font-space-grotesk text-xl">Recycling History</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-green-500 to-green-400 text-black">
                    <th className="text-left p-4 rounded-l-lg font-semibold font-inter">Item ID</th>
                    <th className="text-left p-4 font-semibold font-inter">Category</th>
                    <th className="text-left p-4 font-semibold font-inter">Weight</th>
                    <th className="text-left p-4 font-semibold font-inter">Date</th>
                    <th className="text-left p-4 rounded-r-lg font-semibold font-inter">Payout</th>
                  </tr>
                </thead>
                <tbody>
                  {recyclingHistory.map((item, index) => (
                    <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 text-white font-semibold font-space-grotesk">{item.itemId}</td>
                      <td className="p-4 text-white font-inter">{item.category}</td>
                      <td className="p-4 text-white font-inter">{item.weight}</td>
                      <td className="p-4 text-white font-inter">{item.date}</td>
                      <td className="p-4 text-white font-inter">{item.payout}</td>
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