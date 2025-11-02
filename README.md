**Pick-n-Get Web Application for Decentralized Recycling Platform**

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Hedera Testnet wallet (MetaMask or HashPack)
- Pinata API keys
- Firebase project

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

**Access:** `http://localhost:3000`

## Make sure backend server is running before trying to start test the frontend

---

## ⚙️ Environment Configuration

Create `.env` with the following:

```bash
# Backend API
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5000/api/v1

# Hedera Network
NEXT_PUBLIC_HEDERA_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ADDRESS=0.0.7162853

# Pinata (IPFS)
IPFS_WRITE_API_KEY=your_pinata_api_key
IPFS_WRITE_API_SECRET=your_pinata_secret
NEXT_PUBLIC_IPFS_WRITE_JWT=your_pinata_jwt
NEXT_PUBLIC_GATEWAY_URL=https://gateway.pinata.cloud

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Google Maps (Optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
MAP_ID=your_map_id

# Mapbox (Optional)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
```

---

## 📂 Project Structure

```
app/
├── auth/                    # Authentication flows
│   ├── login/              # Login page
│   └── signup/
│       ├── agent/          # Rider registration (4 steps)
│       ├── recycler/       # User registration
│       ├── vendor/         # Vendor registration
│       └── success/        # Success page
│
├── dashboard/              # User dashboard
├── recycle/                # Recycling submission flow
├── shop/                   # Marketplace
│   ├── [id]/              # Product details
│   └── page.tsx           # Shop listing
├── tracking/               # Delivery tracking
├── admin/                  # Admin panel
│   ├── approvals/         # Rider approvals
│   └── users/             # User management
├── vendors/                # Vendor dashboard
│   └── add-product/       # Product creation
├── agents/                 # Rider dashboard
│
├── components/             # Reusable components
│   ├── layout/            # AppLayout, Header, Footer
│   ├── wallet/            # Wallet connection
│   ├── recycle/           # Recycling components
│   ├── shop/              # Shop components
│   └── ui/                # UI components
│
├── services/               # Blockchain services
│   ├── userService.ts     # User registration
│   ├── riderService.ts    # Rider registration
│   ├── recycleService.ts  # Recycling submission
│   ├── productService.ts  # Marketplace operations
│   ├── adminService.ts    # Admin functions
│   └── wallets/           # Wallet integrations
│       ├── walletInterface.ts
│       ├── metamaskClient.ts
│       └── walletConnectClient.tsx
│
├── contexts/               # React contexts
│   ├── AuthContext.tsx    # Authentication state
│   ├── MetamaskContext.tsx
│   ├── WalletConnectContext.tsx
│   └── AgentSignupContext.tsx
│
├── apis/                   # API integration
│   ├── backendApi.ts      # Backend REST calls
│   ├── hederaApi.ts       # Hedera SDK
│   ├── ipfsApi.js         # IPFS/Pinata
│   └── paymentApi.ts      # Payment processing
│
├── config/                 # Configuration
│   ├── constants.ts       # App constants
│   ├── networks.ts        # Network configs
│   └── type.ts            # TypeScript types
│
└── types/                  # Type definitions
```

---

## 🔑 Key Features

### Wallet Integration

- **MetaMask:** EVM-compatible wallet
- **WalletConnect:** Mobile wallet support
- **Unified API:** Single interface for all wallets

### User Flows

**Recycler Registration:**

1. Connect wallet
2. Enter personal info (name, address, phone)
3. Upload profile picture (optional)
4. Submit to blockchain
5. Save to backend

**Rider Registration (4 Steps):**

1. **Connect Wallet** — Wallet connection
2. **Personal Info** — Name, phone, address, country
3. **Vehicle Details** — Type, make/model, plate, capacity
4. **Documents** — Upload driver's license, registration, insurance, photos

**Recycling Submission:**

1. **Select Category** — Choose material type
2. **Item Details** — Weight, description, photos
3. **Pickup Schedule** — Address, date, time, select rider
4. **Confirmation** — Review and submit to blockchain

**Vendor Product Listing:**

1. Connect wallet
2. Fill product details
3. Upload product image to Hedera File Service
4. Set price (USD → auto-converted to HBAR)
5. Submit to blockchain

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run dev:turbo        # Start with Turbopack

# Production
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues

# Cleanup
npm run clean            # Remove build artifacts
npm run restart          # Clean + reinstall + dev
```

### Code Style

- **Linting:** ESLint + Prettier
- **TypeScript:** Strict mode enabled
- **Formatting:** Prettier with Tailwind plugin

---

## 🔐 Security Best Practices

### Wallet Security

- Never store private keys in frontend
- Always verify transaction details
- Use hardware wallets for large amounts

### API Security

- HTTPS only for production
- Rate limiting on sensitive endpoints
- Input validation before submission

### File Uploads

- Validate file types and sizes
- Scan uploads before storing
- Use IPFS for immutable storage

---

## 🐛 Troubleshooting

### Common Issues

**Wallet won't connect:**

```bash
# Ensure correct network
MetaMask → Settings → Networks → Add Network
Name: Hedera Testnet
RPC: https://testnet.hashio.io/api
Chain ID: 296
Currency: HBAR
```

**Build errors:**

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**TypeScript errors:**

```bash
# Check TypeScript version
npx tsc --version

# Regenerate types
npm run type-check
```

**IPFS upload fails:**

```bash
# Verify Pinata keys in .env.local
# Check file size (<10MB recommended)
# Ensure API keys have write permissions
```

---

## 📦 Dependencies

### Core

- Next.js 15.5.2
- React 19
- TypeScript 5

### Blockchain

- @hashgraph/sdk 2.73.1
- @hashgraph/hedera-wallet-connect 1.5.1
- ethers 5.7.2

### UI

- Tailwind CSS 4.1.12
- lucide-react 0.542.0

### Storage

- pinata 2.5.0
- firebase 12.3.0

### Utilities

- dotenv 17.2.2
- zustand 5.0.8

---

## 📄 License

UNLICENSED — Research and hackathon purposes only.

---

## 📞 Support

- **GitHub Issues:** [Report bugs](https://github.com/kemsguy7/pick-n-get-fe/issues)
- **Email:** support@pick-n-get.io
- **Docs:** [Full Documentation](../README.md)

---

**Built with Next.js 15 + Hedera Hashgraph**
