# AP FraudShield - Document Validation & Fraud Detection Platform

![Government of Andhra Pradesh](https://img.shields.io/badge/Government%20of-Andhra%20Pradesh-gold)
![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4+-cyan)

A comprehensive document validation and fraud detection platform for the Finance Department, Government of Andhra Pradesh. This system simulates AI-powered analysis of financial documents against a 70TB database to detect duplicate invoices, forged signatures, and other anomalies.

## 🚀 Features

### Dashboard
- **Real-time Statistics**: View total scanned documents, fraud detected, and savings
- **Interactive Charts**: Visualize uploads vs fraud detection over the last 7 days
- **Live Activity Feed**: Monitor recent document scans with status badges
- **Critical Alerts**: Immediate visibility into high-risk document detections

### Smart Upload
- **Drag & Drop Interface**: Intuitive file upload with visual feedback
- **Scanning Modal**: Animated progress tracking with step-by-step analysis
- **Multi-format Support**: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG

### Analysis Results
- **Split-Screen Layout**: PDF preview alongside analysis panel
- **Fraud Score Gauge**: Visual representation of risk level
- **Anomaly Detection**: Detailed breakdown of detected issues
- **Duplicate Warning**: Alerts for duplicate documents with reference links
- **Action Buttons**: Approve or reject documents with audit trail

### Toast Notifications
- **Demo Alert Trigger**: Test the notification system
- **Multi-type Toasts**: Info, warning, error, and success notifications
- **Auto-dismiss**: Configurable duration for notifications

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Context (for Toasts)

## 🎨 Design System

### Colors
- **Primary Navy**: `#0f172a` - Main background and text
- **Gold/Yellow**: `#fbbf24` - Accents and CTAs
- **Danger Red**: `#ef4444` - Critical alerts and warnings
- **Success Green**: `#22c55e` - Safe status indicators

### Theme
- Professional, authoritative "High-Tech Governance" aesthetic
- Glass-morphism effects with backdrop blur
- Subtle grid patterns and glow effects
- Responsive design with mobile support

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with sidebar and header
│   ├── page.tsx           # Dashboard page
│   ├── upload/            # Upload page
│   ├── results/[id]/      # Dynamic results page
│   ├── settings/          # Settings page
│   └── help/              # Help & support page
├── components/
│   ├── layout/            # Sidebar, Header components
│   ├── providers/         # Context providers (Toast)
│   └── ui/                # Reusable UI components
├── features/
│   ├── dashboard/         # Dashboard-specific components
│   ├── upload/            # Upload feature components
│   └── results/           # Results feature components
└── lib/
    ├── mock-api.ts        # Simulated API calls
    ├── types.ts           # TypeScript type definitions
    └── utils.ts           # Utility functions
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/ap-fraud-detection.git
cd ap-fraud-detection
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Mock API

The `lib/mock-api.ts` file provides simulated backend responses:

### `simulateScan(file: File)`
Returns a scan result after 3 seconds with:
```json
{
  "file_id": "uuid-1234",
  "filename": "invoice_demo.pdf",
  "status": "completed",
  "fraud_score": 88,
  "severity": "CRITICAL",
  "is_duplicate": true,
  "duplicate_source_id": "doc-5510",
  "anomalies": [
    {
      "type": "Metadata Mismatch",
      "description": "Creation date is in the future",
      "confidence": 0.98
    }
  ]
}
```

## 🔌 Backend Integration

To connect to a real FastAPI backend, update the `lib/mock-api.ts`:

```typescript
export async function simulateScan(file: File): Promise<ScanResult> {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch('/api/scan', {
    method: 'POST',
    body: formData,
  })
  
  return response.json()
}
```

## 🧪 Demo Features

1. **Alert Demo**: Click "Trigger Alert Demo" in the sidebar to test the toast notification system
2. **Upload Simulation**: Upload any file to see the scanning animation and receive a mock result
3. **Results View**: Navigate to `/results/demo` to see a pre-populated analysis

## 📄 License

This project is proprietary software developed for the Government of Andhra Pradesh, Finance Department.

## 👥 Contributors

- Finance Department, Government of Andhra Pradesh
- AP IT Services

---

**Note**: This is a demo/prototype version. For production deployment, ensure proper security measures, authentication, and backend integration are implemented.

