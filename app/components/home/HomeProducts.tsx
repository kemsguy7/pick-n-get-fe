"use client"

interface Product {
  id: number
  name: string
  price: string
  tokens: number
  recycledPercentage: number
  image: string
}

const products: Product[] = [
  {
    id: 1,
    name: "Recycled Ocean Plastic Backpack",
    price: "$45.99",
    tokens: 920,
    recycledPercentage: 95,
    image: "/placeholder-iw54h.png",
  },
  {
    id: 2,
    name: "Tire Ottoman Seat",
    price: "$89.99",
    tokens: 4800,
    recycledPercentage: 80,
    image: "/placeholder-22v71.png",
  },
  {
    id: 3,
    name: "Recycled Paper Desk Organizer",
    price: "$24.99",
    tokens: 2499,
    recycledPercentage: 100,
    image: "/placeholder-21554.png",
  },
  {
    id: 4,
    name: "Eco Yoga Mat- Recycled Rubber",
    price: "$67.99",
    tokens: 1360,
    recycledPercentage: 100,
    image: "/placeholder-vvvre.png",
  },
]

export function EcoProducts() {
  return (
    <section className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 font-space-grotesk text-balance">
            Eco-Friendly Products
          </h2>
          <p className="text-lg md:text-xl font-normal text-gray-300 max-w-3xl mx-auto font-inter secondary-text text-pretty">
            Shop sustainable products made from recycled materials and support the cultural economy
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-black backdrop-blur-sm shadow-border-green rounded-[20px] overflow-hidden border-[0.2px] border-[#1DE9B6]   hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Product Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
              </div>

              {/* Product Info */}
              <div className="p-6">
                {/* Recycled Badge */}
                <div className="mb-4 bg-white font-roboto font-medium inline-block px-3 py-0 rounded-lg">
                  <span className=" text-primary  text-sm font-semibold font-inter">
                    {product.recycledPercentage}% Recycled
                  </span>
                </div>
                <h3 className="text-white font-bold text-lg mb-4 font-space-grotesk leading-tight">
                  {product.name}
                </h3>

                {/* Price and Tokens */}
                <div className="flex items-center justify-between">
                  <span className="text-white font-space-grotesk  font-medium text-xl font-inter">{product.price}</span>
                  <div className="flex items-center gap-1">
                    {/* ECO Token Icon */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-green-500">
                      <circle cx="12" cy="12" r="10" fill="currentColor" />
                      <path d="M8 12h8M12 8v8" stroke="black" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span className="text-green-500 font-normal text-lg font-space-grotesk font-inter">
                      {product.tokens.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products Button */}
        <div className="text-center">
          <button className="bg-black font-space-grotesk hover:bg-emerald-400 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all duration-300 hover:transform hover:scale-105 font-inter inline-flex items-center gap-2">
            View All Products
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default EcoProducts;