# Technical Architecture & System Design

This document outlines the technical architecture, file structure, and development patterns for the Protein Checker web application - a comprehensive conversion from the ProteinCheckerSwift iOS app.

## 🎯 Project Overview

### **Conversion Goals**
- **Exact functional parity** with ProteinCheckerSwift iOS app
- **Web-first optimizations** for better UX and scalability  
- **Mobile-first responsive design** with desktop enhancements
- **Production-ready** standalone web application

### **Core Functionality**
- **Protein Quality Calculator** - DIAAS/PDCAAS score-based calculations
- **Calculation History Management** - Search, filter, export/import capabilities
- **Educational Content** - Interactive learning about protein science
- **Data Persistence** - Local storage with import/export features

## 🗺️ Site Map (Next.js App Router)

### **Core Routes**
- **`/`** — **Calculator Page**
  - Protein amount input with validation
  - Daily Value % input (optional)
  - Protein source picker with 35+ options
  - Real-time calculation results
  - Quality metrics and discrepancy warnings

- **`/history`** — **Calculation History**
  - Complete calculation history with timestamps
  - Advanced search and category filtering
  - Statistics dashboard (totals, averages, trends)
  - Export to JSON / Import from JSON
  - Individual and bulk deletion

- **`/education`** — **Educational Content**
  - Interactive topic selector (5 topics)
  - DIAAS vs PDCAAS explanations
  - Protein source quality rankings
  - Practical nutrition guidance
  - Web-adapted content with visual enhancements

## 📁 File Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with Navigation & Context
│   ├── page.tsx                 # Calculator page (landing)
│   ├── globals.css              # Global styles & design system
│   ├── history/
│   │   └── page.tsx            # History management page
│   └── education/
│       └── page.tsx            # Educational content page
├── components/
│   ├── Navigation.tsx           # Responsive nav (mobile tabs + desktop bar)
│   ├── SearchBar.tsx           # Reusable search component
│   ├── CategoryChip.tsx        # Filter chips for protein categories
│   ├── ProteinSourcePicker.tsx # Modal protein source selector
│   └── ui/
│       ├── Button.tsx          # Consistent button component
│       ├── Input.tsx           # Form input with validation
│       └── Card.tsx            # Content card variations
├── contexts/
│   └── ProteinContext.tsx      # Global state management via React Context
├── types/
│   └── protein.ts              # TypeScript types matching Swift models
├── data/
│   └── proteinSources.ts       # Protein database (35+ sources with scores)
├── utils/
│   ├── proteinCalculations.ts  # Core calculation algorithms
│   ├── dataManager.ts          # Local storage management
│   └── formatters.ts           # Display formatting utilities
├── lib/
│   └── utils.ts                # Common utilities (cn, debounce, dates)
public/
├── icons/                      # App icons and assets
└── [Next.js static assets]
promptFiles/                    # Project documentation
└── [architecture, design, etc.]
```

## 🏗️ Data Architecture

### **Core TypeScript Models** (Matching Swift)
```typescript
// Exact replica of Swift ProteinSource model
export interface ProteinSource {
  id: string;                   // Stable ID based on name
  name: string;                 // Display name
  category: ProteinCategory;    // Enum: MEAT, DAIRY, PLANT, etc.
  diaasScore?: number;          // DIAAS score (preferred)
  pdcaasScore?: number;         // PDCAAS score (fallback)
  aminoAcidProfile?: AminoAcidProfile;  // Optional amino acid data
  description?: string;         // User-friendly description
}

// Calculation input/output matching Swift logic
export interface CalculationInput {
  statedProtein: number;        // User-entered protein amount
  dvPercentage?: number;        // Optional Daily Value %
  proteinSource: ProteinSource; // Selected protein source
}

export interface CalculationResult {
  qualityAdjustedProtein: number;     // Core result
  proteinQualityPercentage: number;   // Quality as percentage
  calculationMethod: CalculationMethod; // DIAAS or PDCAAS
  adjustedProtein?: number;           // DV-adjusted amount
  scoreUsed: number;                  // Score applied
  dvDiscrepancy?: number;             // Warning threshold
}

// History persistence model
export interface ProteinCalculation {
  id: string;                   // Unique calculation ID
  statedProtein: number;        // Input values
  dvPercentage?: number;
  proteinSource: ProteinSource; // Complete source data
  digestibleProtein: number;    // Backwards compatibility
  digestibilityPercentage: number;
  calculationMethod: CalculationMethod;
  timestamp: Date;              // When calculated
}
```

### **State Management Architecture**
- **React Context** for global state (calculations, history, filters)
- **useReducer** for complex state transitions
- **LocalStorage** for data persistence
- **Optimistic updates** for better UX

## ⚡ Performance Architecture

### **Code Splitting Strategy**
- **Route-level splitting**: Next.js App Router (automatic)
- **Component lazy loading**: Heavy modals and pickers
- **Dynamic imports**: Non-critical functionality

### **Data Optimization**
- **Stable IDs**: Name-based IDs for protein sources (no random UUIDs)
- **Debounced search**: 150ms delay for search input
- **Memoized filtering**: useMemo for expensive operations
- **Efficient serialization**: JSON.stringify/parse for localStorage

### **Bundle Optimization**
- **Tree shaking**: Only import used utilities (clsx, tailwind-merge)
- **Minimal dependencies**: Core libraries only
- **Icon optimization**: Hero Icons with selective imports

## 🔧 State Management Flow

### **Context Architecture**
```typescript
// Centralized state in ProteinContext
interface ProteinState {
  // Calculator state
  statedProtein: string;
  dvPercentage: string;
  selectedProteinSource: ProteinSource | null;
  calculationResult: CalculationResult | null;
  
  // History state
  calculationHistory: ProteinCalculation[];
  searchText: string;
  selectedCategory: ProteinCategory;
  statistics: CalculationStatistics | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
}
```

### **Data Flow Pattern**
1. **User Input** → Context Action Dispatch
2. **Validation** → Error handling or processing
3. **Calculation** → Core algorithm execution
4. **Storage** → LocalStorage persistence
5. **UI Update** → Context state change
6. **Statistics Update** → Aggregate calculations

## 🎨 Component Architecture

### **Design Pattern: Mobile-First + Desktop Enhancement**
- **Navigation**: Bottom tabs (mobile) + top bar (desktop)
- **Layouts**: Single column (mobile) + multi-column (desktop)
- **Modals**: Full screen (mobile) + centered (desktop)
- **Typography**: Optimized scales for different screen sizes

### **Component Hierarchy**
```
App Layout
├── Navigation (responsive)
├── Main Content Area
│   ├── Page-specific components
│   ├── Shared UI components (Button, Input, Card)
│   └── Feature-specific components (ProteinSourcePicker)
└── Context Providers (ProteinProvider)
```

### **Reusable Component Library**
- **Button**: Multiple variants, loading states, accessibility
- **Input**: Validation, helper text, error states
- **Card**: Elevation variants, content organization
- **SearchBar**: Debounced input, clear functionality
- **CategoryChip**: Selection states, responsive layout

## 🔐 Data Security & Privacy

### **Local Storage Strategy**
- **No sensitive data**: Only calculation history and preferences
- **User-controlled**: Clear import/export functionality
- **Recoverable**: JSON export for backup/migration
- **Validation**: Data integrity checks on import

### **Privacy Considerations**
- **No analytics**: No user tracking or external data collection
- **Offline-first**: Works without internet connection
- **Local-only**: All data stays on user's device
- **Transparent**: Clear data management UI

## 🧪 Testing Strategy

### **Quality Assurance**
- **TypeScript**: Full type safety and compile-time checks
- **ESLint**: Code quality and consistency
- **Manual testing**: Cross-browser and device testing
- **Accessibility**: Keyboard navigation and screen reader support

### **Error Handling**
- **Graceful degradation**: Fallbacks for missing data
- **User-friendly errors**: Clear error messages
- **Recovery mechanisms**: Reset/retry functionality
- **Input validation**: Client-side validation with feedback

## 🚀 Deployment Architecture

### **Build Process**
1. **TypeScript compilation**: Full type checking
2. **Next.js optimization**: Bundle splitting and tree shaking
3. **CSS processing**: Tailwind compilation and purging
4. **Static generation**: Pre-built pages where possible

### **Performance Targets**
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms
- **Lighthouse Score**: 90+ (Performance, Accessibility, SEO)

### **Browser Support**
- **Modern browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile browsers**: iOS Safari 14+, Chrome Mobile 90+
- **Progressive enhancement**: Core functionality works on older browsers
- **Graceful degradation**: Advanced features degrade smoothly

## 📊 Analytics & Monitoring

### **Performance Monitoring**
- **Core Web Vitals**: Real user metrics via Vercel Analytics
- **Bundle analysis**: Size monitoring and optimization alerts
- **Error tracking**: Client-side error capture and logging
- **Usage patterns**: Feature adoption and user flow analysis

### **Health Checks**
- **Build validation**: Successful compilation and deployment
- **Functional testing**: Core calculation accuracy
- **Accessibility validation**: WCAG compliance checks
- **Cross-platform testing**: Mobile and desktop compatibility
