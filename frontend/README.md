# Ethio-Origin Frontend

> A modern, blockchain-powered supply chain transparency platform connecting Ethiopian farmers directly to global consumers.

Ethio-Origin Frontend is a React-based web application that provides an intuitive interface for tracking agricultural products (coffee, tea, flowers) from farm to market using Cardano blockchain technology. The platform empowers farmers, processors, and consumers with real-time product verification and transparent supply chain data.

---

## 🌟 Features

### For Farmers
- **🌾 Harvest Registration**: Easy-to-use multi-step form for registering new harvests
- **📊 Batch Management**: Track all your registered batches with real-time status updates
- **⛓️ Blockchain Integration**: Mint NFTs for product batches on Cardano blockchain
- **💰 Direct Tipping**: Receive tips directly from consumers via wallet integration

### For Processors
- **📦 Batch Scanning**: Quick QR code scanning for batch identification
- **🔄 Status Updates**: Record processing stages with quality metrics (weight, moisture, cupping scores)
- **📝 Quality Records**: Document processing methods and quality assessments
- **🔍 Traceability**: View complete batch history and farmer information

### For Consumers
- **🔎 Product Verification**: Scan QR codes to verify product authenticity
- **📜 Journey Timeline**: Visual timeline showing product journey from farm to retail
- **👨‍🌾 Farmer Stories**: Learn about the farmers behind your products
- **🎁 Tip Farmers**: Send ADA tips directly to farmers supporting their work

---

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 4
- **Styling**: Tailwind CSS 3
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM 7
- **PWA**: Vite PWA Plugin
- **Blockchain**: Cardano (integration ready)
- **HTTP Client**: Native Fetch API with custom wrapper

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 16.0.0 (LTS recommended)
- **npm** >= 8.0.0 or **yarn** >= 1.22.0
- **Backend API** running (see [Backend Setup](#backend-api-integration))

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/AstralJugs69/Ethio-origin-frontend.git
cd Ethio-origin-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Cardano Network Configuration
VITE_CARDANO_NETWORK=preprod

# App Configuration (optional)
VITE_APP_URL=http://localhost:5173
```

> **Note**: Copy from `.env.example` and update with your actual values.

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production-ready bundle to `dist/` |
| `npm run preview` | Preview production build locally |

---

## 🌐 Backend API Integration

This frontend requires a running backend API. The backend should implement the following endpoints:

### Required Endpoints

```
GET    /api/batches              # List all batches
GET    /api/batches/:id          # Get batch details with journey
POST   /api/batches              # Create new batch
PATCH  /api/batches/:id/status   # Update batch status
GET    /api/health               # API health check (optional)
```

### API Service Layer

All API calls are centralized in [`src/services/api.ts`](src/services/api.ts) which provides:

- **Type-safe requests**: Full TypeScript support with typed responses
- **Error handling**: Structured error handling with `ApiError` class
- **Network resilience**: Automatic error detection for connection failures
- **Environment configuration**: Dynamic base URL from environment variables

**Example Usage:**

```typescript
import { getAllBatches, createBatch } from './services/api';

// Fetch batches
const batches = await getAllBatches();

// Create batch
const newBatch = await createBatch({
  cropType: 'coffee',
  weight: 100,
  location: 'Guji Zone',
  variety: 'Heirloom',
  harvestDate: '2025-12-04',
  process: 'Natural',
  elevation: '2100m',
  gps: '5.8500° N, 39.0500° E'
});
```

See [Backend Integration Guide](docs/SUPABASE_SETUP.md) for complete API specifications.

---

## 📁 Project Structure

```
Ethio-Origin-frontend/
├── public/                      # Static assets
│   ├── icons/                   # App icons
│   └── logo.svg                 # Brand logo
├── src/
│   ├── components/              # React components
│   │   ├── auth/                # Wallet connection components
│   │   ├── common/              # Reusable UI components
│   │   ├── consumer/            # Consumer portal components
│   │   ├── farmer/              # Farmer portal components
│   │   ├── layout/              # Layout components
│   │   ├── processor/           # Processor portal components
│   │   └── ui/                  # Base UI components (Button, Card)
│   ├── hooks/                   # Custom React hooks
│   │   ├── useBatches.ts        # Batch management hook
│   │   ├── useLocalStorage.ts   # Persistent storage hook
│   │   └── useWallet.ts         # Cardano wallet hook
│   ├── services/                # External services
│   │   └── api.ts               # HTTP API client
│   ├── styles/                  # Global styles
│   ├── types/                   # TypeScript type definitions
│   │   ├── cardano.ts           # Cardano-specific types
│   │   └── supplychain.ts       # Supply chain domain types
│   └── utils/                   # Utility functions
│       ├── constants.ts         # App constants
│       ├── formatters.ts        # Data formatters
│       └── qrGenerator.ts       # QR code utilities
├── .env.example                 # Environment variables template
├── index.html                   # HTML entry point
├── package.json                 # Dependencies
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── vite.config.ts               # Vite configuration
```

---

## 🧩 Key Components

### Portal Components

- **`FarmerPortal`**: Harvest registration and batch management
- **`ProcessorPortal`**: Batch scanning and status updates
- **`ConsumerVerification`**: Product verification and farmer stories

### Common Components

- **`WalletConnector`**: Cardano wallet integration (Nami, Eternl, Flint)
- **`QRCodeDisplay`**: Batch QR code generation and display
- **`LoadingSpinner`**: Consistent loading states

### UI Components

Built with Tailwind CSS and class-variance-authority for consistent, accessible design:
- `Button`: Multiple variants (primary, secondary, outline, ghost)
- `Card`: Content containers with header/footer support

---

## 🎨 Styling

This project uses **Tailwind CSS** for styling with a custom design system:

### Color Palette
- **Primary**: Emerald (agriculture/growth theme)
- **Accent**: Stone (neutral, earthy tones)
- **Status Colors**: Green, Blue, Orange, Red

### Typography
- Base font size: 16px
- Font family: System fonts (optimized for performance)

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

---

## 🔐 Authentication & Wallet

### Cardano Wallet Integration

The app supports multiple Cardano wallets:
- **Nami Wallet**
- **Eternl Wallet**
- **Flint Wallet**

**Wallet Connection Flow:**
1. User clicks "Connect Wallet"
2. Available wallets detected via browser extensions
3. User selects preferred wallet
4. Wallet prompts for authorization
5. Connected wallet address stored in app state

**Implementation:**
```typescript
import { useWallet } from './hooks/useWallet';

const { wallet, connectWallet, disconnectWallet } = useWallet();

// Connect
await connectWallet('nami');

// Check connection
if (wallet) {
  console.log('Connected:', wallet.address);
}
```

---

## 📦 Build & Deployment

### Production Build

```bash
npm run build
```

Output: `dist/` directory with optimized assets

**Build Optimizations:**
- Code splitting
- Tree shaking
- Asset minification
- PWA service worker generation

### Preview Production Build

```bash
npm run preview
```

### Deployment Options

**Static Hosting:**
- Netlify
- Vercel  
- GitHub Pages
- AWS S3 + CloudFront

**Configuration:**
Ensure environment variables are set in your hosting platform's dashboard.

---

## 🔄 Progressive Web App (PWA)

This application is a fully-featured PWA:

- ✅ **Offline Support**: Service worker caching
- ✅ **Installable**: Add to home screen on mobile
- ✅ **Responsive**: Optimized for all screen sizes
- ✅ **Fast Loading**: Asset precaching and runtime caching

**Service Worker:** Automatically generated during build via `vite-plugin-pwa`

---

## 🧪 Development Guidelines

### Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Consistent code formatting (configure Prettier if needed)
- **Naming Conventions**:
  - Components: PascalCase (`FarmerPortal.tsx`)
  - Hooks: camelCase with `use` prefix (`useBatches.ts`)
  - Utilities: camelCase (`formatDate.ts`)

### Component Guidelines

```typescript
// ✅ Good: Typed props, named export
interface MyComponentProps {
  id: string;
  onSubmit: (data: FormData) => void;
}

export default function MyComponent({ id, onSubmit }: MyComponentProps) {
  // Component logic
}
```

### State Management

- **Local State**: `useState` for component-specific state
- **Persistent State**: `useLocalStorage` hook for data that survives refreshes
- **Global State**: React Context (if needed for app-wide state)

---

## 🐛 Troubleshooting

### Common Issues

**Issue: "Cannot connect to backend API"**
```
Solution: 
1. Ensure backend is running at configured URL
2. Check VITE_API_BASE_URL in .env.local
3. Verify CORS is enabled on backend
4. Check browser console for detailed error
```

**Issue: "Build fails with TypeScript errors"**
```
Solution:
1. Delete node_modules and package-lock.json
2. Run: npm install
3. Ensure TypeScript version matches package.json
```

**Issue: "Wallet not connecting"**
```
Solution:
1. Install a Cardano wallet browser extension
2. Refresh the page after installation
3. Check browser console for errors
4. Ensure wallet is on correct network (preprod/mainnet)
```

---

## 📚 Additional Documentation

- [Backend Integration Guide](docs/SUPABASE_SETUP.md) - Complete API specifications
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment instructions *(coming soon)*
- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute to the project *(coming soon)*

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is part of the Ethio-Origin platform for agricultural supply chain transparency.

---

## 👥 Team

Built with ❤️ for Ethiopian farmers and global supply chain transparency.

---

## 🔗 Links

- **Repository**: [GitHub](https://github.com/AstralJugs69/Ethio-origin-frontend)
- **Backend Repository**: *(Link to backend repo)*
- **Cardano Docs**: [Cardano Developer Portal](https://developers.cardano.org/)

---

**Questions or Issues?** Open an issue on GitHub or contact the development team.
