"use client"

import { useState } from "react"
import AppLayout from "../components/layout/AppLayout"
import ProductCard, { ProductCardProps } from "../components/ui/ProductCard"
import ProductListCard from "../components/shop/ProductListCard"
import ShoppingCart from "../components/shop/shoppingCart"
import { 
  Search,
  Filter,
  Grid3X3,
  List,
  ChevronDown,
  ShoppingBag,
  Recycle,
  Heart,
  Star
} from 'lucide-react'

interface CategoryFilter {
  id: string
  name: string
  icon: React.ReactNode
  count: number
}

interface CartItem extends ProductCardProps {
  quantity: number
}

export default function EcoShopPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [favoriteItems, setFavoriteItems] = useState<string[]>([])

  // Categories
  const categories: CategoryFilter[] = [
    { id: 'all', name: 'All Categories', icon: <Recycle className="w-4 h-4" />, count: 12 },
    { id: 'bags', name: 'Bags & Accessories', icon: <ShoppingBag className="w-4 h-4" />, count: 3 },
    { id: 'furniture', name: 'Furniture', icon: <div className="w-4 h-4 bg-green-500 rounded" />, count: 2 },
    { id: 'office', name: 'Office Supplies', icon: <div className="w-4 h-4 bg-blue-500 rounded" />, count: 4 },
    { id: 'fitness', name: 'Fitness & Wellness', icon: <div className="w-4 h-4 bg-purple-500 rounded" />, count: 2 },
    { id: 'garden', name: 'Home & Garden', icon: <div className="w-4 h-4 bg-orange-500 rounded" />, count: 1 },
  ]

  // Products data
  const productsData: ProductCardProps[] = [
    {
      id: '1',
      image: '/api/placeholder/400/400',
      name: 'Recycled Ocean Plastic Backpack',
      description: 'Durable and stylish backpack made from 100% recycled ocean plastic bottles. Perfect for daily use with multiple compartments.',
      price: 95.99,
      currency: '₦',
      originalPrice: 120.00,
      rating: 4.7,
      reviewCount: 127,
      brand: 'EcoCarr Lagos',
      inStock: 27,
      recycledPercentage: 95,
      isVerified: true,
      ecoTokens: 580,
      freeShipping: true,
      shippingThreshold: 50000
    },
    {
      id: '2',
      image: '/api/placeholder/400/400',
      name: 'Tire Ottoman Seat',
      description: 'Comfortable ottoman made from upcycled car tires with eco-friendly cushioning and modern design.',
      price: 205.99,
      currency: '₦',
      rating: 4.6,
      reviewCount: 97,
      brand: 'Sustainable Furniture Co.',
      inStock: 24,
      recycledPercentage: 95,
      isVerified: true,
      ecoTokens: 920,
      freeShipping: true,
      shippingThreshold: 50000
    },
    {
      id: '3',
      image: '/api/placeholder/400/400',
      name: 'Recycled Paper Desk Organizer',
      description: 'Multi-compartment desk organizer made from 100% recycled paper. Lightweight yet sturdy design.',
      price: 54.99,
      currency: '₦',
      rating: 4.8,
      reviewCount: 156,
      brand: 'Green Office Solutions',
      inStock: 45,
      recycledPercentage: 85,
      isVerified: true,
      ecoTokens: 500,
      freeShipping: true,
      shippingThreshold: 50000
    },
    {
      id: '4',
      image: '/api/placeholder/400/400',
      name: 'Eco Yoga Mat - Recycled Rubber',
      description: 'Premium yoga mat made from recycled rubber tires with excellent grip, cushioning and durability.',
      price: 75.99,
      currency: '₦',
      rating: 4.9,
      reviewCount: 203,
      brand: 'Zen Eco Products',
      inStock: 18,
      recycledPercentage: 90,
      isVerified: true,
      ecoTokens: 450,
      freeShipping: true,
      shippingThreshold: 50000
    },
    {
      id: '5',
      image: '/api/placeholder/400/400',
      name: 'Recycled Plastic Garden Planter',
      description: 'Durable outdoor planter made from recycled plastic waste. Weather-resistant and UV-stable.',
      price: 62.99,
      currency: '₦',
      rating: 4.3,
      reviewCount: 89,
      brand: 'Garden Green',
      inStock: 23,
      recycledPercentage: 85,
      isVerified: true,
      ecoTokens: 400,
      freeShipping: true,
      shippingThreshold: 50000
    },
    {
      id: '6',
      image: '/api/placeholder/400/400',
      name: 'Upcycled Denim Tote Bag',
      description: 'Stylish tote bag made from upcycled denim fabric. Each bag is unique with its own wash pattern.',
      price: 95.99,
      currency: '₦',
      rating: 4.7,
      reviewCount: 134,
      brand: 'Sustainable Style',
      inStock: 31,
      recycledPercentage: 100,
      isVerified: true,
      ecoTokens: 550,
      freeShipping: true,
      shippingThreshold: 50000
    }
  ]

  const handleAddToCart = (productId: string) => {
    const product = productsData.find(p => p.id === productId)
    if (product) {
      setCartItems(prev => {
        const existingItem = prev.find(item => item.id === productId)
        if (existingItem) {
          return prev.map(item => 
            item.id === productId 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
        return [...prev, { ...product, quantity: 1 }]
      })
    }
  }

  const handleToggleFavorite = (productId: string) => {
    setFavoriteItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const filteredProducts = productsData.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || 
                           product.name.toLowerCase().includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <AppLayout showHeader={true} showSidebar={true} showFooter={true}>
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-slate-900 to-black p-4 lg:p-6 dashboard-container">
        <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
          
          {/* Header */}
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 font-space-grotesk flex items-center justify-center gap-3">
              EcoShop <ShoppingBag className="w-8 h-8 lg:w-10 lg:h-10 text-green-400" />
            </h1>
            <p className="text-lg secondary-text font-inter">
              Discover amazing products made from recycled materials.
            </p>
            <p className="secondary-text font-inter text-sm">
              Every purchase supports the circular economy
            </p>
          </div>

          {/* Featured Products Pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            <span className="px-4 py-2 bg-[#DCFCE7] text-primary rounded-full text-sm font-medium">
              100% Eco-Friendly
            </span>
            <span className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
              Verified Vendors
            </span>
            <span className="px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
              Pay with ECO Tokens
            </span>
            <span className="px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
              Carbon-Neutral Shipping
            </span>
          </div>

          {/* Featured Products Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 font-space-grotesk flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400" />
              Featured Products
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Featured Product 1 */}
              <div className="relative bg-slate-800 rounded-2xl overflow-hidden border border-[#A5D6A74D]">
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Featured Eco Product
                  </span>
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-xs font-medium">
                    95% Recycled
                  </span>
                </div>
                
                <div className="flex">
                  <div className="w-1/2 p-6">
                    <img 
                      src="/api/placeholder/300/300" 
                      alt="Recycled Ocean Plastic Backpack"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="w-1/2 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-white font-bold text-xl font-space-grotesk mb-3">
                        Recycled Ocean Plastic Backpack
                      </h3>
                      <p className="text-gray-300 text-sm mb-4 font-inter">
                        Durable and stylish backpack made from 100% recycled ocean plastic bottles. Perfect for daily use with multiple compartments.
                      </p>
                      
                      <div className="flex items-center gap-1 mb-4">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-white font-medium text-sm">4.8</span>
                        <span className="text-gray-400 text-sm">(127 reviews)</span>
                      </div>

                      <div className="flex items-center gap-4 mb-4 text-xs text-gray-300">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span>89,340kg CO₂ saved</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span>12.5L of water saved</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-white font-bold text-2xl font-space-grotesk">₦65.99</span>
                          <p className="text-green-400 text-sm">920ECO</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">by EcoCraft Lagos</p>
                          <p className="text-xs text-gray-400">24 in stock</p>
                        </div>
                      </div>
                      
                      <button className="w-full gradient-button text-black font-semibold py-3 rounded-lg">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Product 2 */}
              <div className="relative bg-slate-800 rounded-2xl overflow-hidden border border-[#A5D6A74D]">
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Featured Eco Product
                  </span>
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-xs font-medium">
                    95% Recycled
                  </span>
                </div>
                
                <div className="flex">
                  <div className="w-1/2 p-6">
                    <img 
                      src="/api/placeholder/300/300" 
                      alt="Tire Ottoman Seat"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="w-1/2 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-white font-bold text-xl font-space-grotesk mb-3">
                        Tire Ottoman Seat
                      </h3>
                      <p className="text-gray-300 text-sm mb-4 font-inter">
                        Comfortable ottoman made from upcycled car tires with eco-friendly cushioning. Perfect for modern living spaces.
                      </p>
                      
                      <div className="flex items-center gap-1 mb-4">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-white font-medium text-sm">4.6</span>
                        <span className="text-gray-400 text-sm">(89 reviews)</span>
                      </div>

                      <div className="flex items-center gap-4 mb-4 text-xs text-gray-300">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span>15.7kg CO₂ saved</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span>45L of water saved</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-white font-bold text-2xl font-space-grotesk">₦89.99</span>
                          <p className="text-green-400 text-sm">1800ECO</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">by Sustainable Furniture Co.</p>
                          <p className="text-xs text-gray-400">12 in stock</p>
                        </div>
                      </div>
                      
                      <button className="w-full gradient-button text-black font-semibold py-3 rounded-lg">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search, Filters & View Toggle */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search eco-friendly products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            {/* Category & Sort Dropdowns */}
            <div className="flex gap-4">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-slate-800 border border-[#D9D9D94D] rounded-lg px-4 py-3 pr-8 text-white focus:outline-none focus:border-green-500"
                  style={{ backdropFilter: 'blur(4px)' }}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-slate-800 border border-[#D9D9D94D] rounded-lg px-4 py-3 pr-8 text-white focus:outline-none focus:border-green-500"
                  style={{ backdropFilter: 'blur(4px)' }}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Most Eco-Friendly</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Shop by Category */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 font-space-grotesk">Shop by Category</h2>
            <p className="secondary-text font-inter mb-6">
              Select the type of materials you want to recycle. Each category has different rates and requirements.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {categories.slice(1).map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-xl border transition-all duration-200 text-center ${
                    selectedCategory === category.id
                      ? 'bg-green-500/20 border-green-500 text-green-400'
                      : 'bg-slate-800 border-slate-600 text-white hover:border-green-500/50'
                  }`}
                >
                  <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                    {category.icon}
                  </div>
                  <p className="text-sm font-medium font-inter">{category.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* View Toggle and Products Count */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                  viewMode === 'grid' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                  viewMode === 'list' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                List View
              </button>
            </div>
            
            <span className="text-gray-400 text-sm">
              {filteredProducts.length} products found
            </span>
          </div>

          {/* Products Grid/List */}
          <div>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorited={favoriteItems.includes(product.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <ProductListCard
                    key={product.id}
                    {...product}
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorited={favoriteItems.includes(product.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Shopping Impact */}
          <div className="bg-[#DCFCE7] rounded-2xl p-6 border border-green-200 mt-12">
            <h3 className="text-primary font-semibold font-space-grotesk mb-4 flex items-center gap-2">
              <Recycle className="w-5 h-5" />
              Your Shopping Impact
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600 font-space-grotesk">0kg</p>
                <p className="text-green-600 text-sm font-inter">CO₂ Saved</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-600 font-space-grotesk">0L</p>
                <p className="text-blue-600 text-sm font-inter">Water Saved</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-purple-600 font-space-grotesk">0kg</p>
                <p className="text-purple-600 text-sm font-inter">Waste Diverted</p>
              </div>
            </div>
            
            <p className="text-center text-gray-600 text-sm mt-4 font-inter">
              Every purchase supports sustainable manufacturing and helps reduce environmental impact.
            </p>
          </div>
        </div>
      </div>

      {/* Shopping Cart Modal */}
      {showCart && (
        <ShoppingCart
          items={cartItems}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={(id, quantity) => {
            if (quantity === 0) {
              setCartItems(prev => prev.filter(item => item.id !== id))
            } else {
              setCartItems(prev => prev.map(item => 
                item.id === id ? { ...item, quantity } : item
              ))
            }
          }}
        />
      )}
    </AppLayout>
  )
}
