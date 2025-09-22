# Protein Quality Calculator

A modern web application that calculates quality-adjusted protein amounts using scientific DIAAS and PDCAAS scores. Built with Next.js, TypeScript, and Tailwind CSS.

## Overview

The Protein Quality Calculator helps users understand that not all proteins are created equal. By using scientifically validated protein quality scores (DIAAS and PDCAAS), the app calculates how much "usable" protein you're actually getting from different food sources.

### Key Features

- **Scientific Accuracy**: Uses DIAAS (preferred) and PDCAAS scores from peer-reviewed research
- **Multi-Source Support**: Calculate protein quality for single or multiple protein sources with custom percentages
- **Daily Value Integration**: Optional DV% input for more accurate calculations from nutrition labels
- **Comprehensive Database**: 50+ protein sources across categories (meat, dairy, plant, supplements)
- **Calculation History**: Track and analyze your protein calculations over time
- **Educational Content**: Learn about protein quality, DIAAS vs PDCAAS, and practical nutrition tips
- **Data Export/Import**: Save and share your calculation history
- **Modern UI**: Beautiful, responsive design with smooth animations

## How It Works

1. **Enter Protein Amount**: Input the protein grams from your food label
2. **Add Daily Value %** (optional): More accurate than stated protein amounts
3. **Select Protein Source(s)**: Choose from our database or combine multiple sources
4. **Calculate**: Get your quality-adjusted protein amount and quality percentage
5. **Review Results**: See detailed breakdown of protein quality and calculation method used

## Protein Quality Scores

- **DIAAS (Digestible Indispensable Amino Acid Score)**: Gold standard since 2013, can exceed 1.0
- **PDCAAS (Protein Digestibility Corrected Amino Acid Score)**: Previous standard, capped at 1.0
- **Quality Ratings**: Excellent (≥1.0), High (0.8-0.99), Good (0.6-0.79), Fair (0.4-0.59), Poor (<0.4)

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Headless UI
- **Icons**: Heroicons
- **State Management**: React Context API
- **Data Persistence**: Local Storage
- **Build Tool**: Turbopack

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd protein-checker-web
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Main calculator page
│   ├── history/           # Calculation history page
│   ├── education/         # Educational content page
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (Button, Card, Input)
│   ├── MultiProteinSourcePicker.tsx
│   ├── ProteinSourcePicker.tsx
│   ├── SearchBar.tsx
│   └── CategoryChip.tsx
├── contexts/             # React contexts
│   └── ProteinContext.tsx
├── data/                 # Protein source database
│   └── proteinSources.ts
├── types/                # TypeScript type definitions
│   └── protein.ts
└── utils/                # Utility functions
    ├── proteinCalculations.ts
    ├── dataManager.ts
    └── proteinDefaults.ts
```

## Key Concepts

### Protein Quality
Protein quality is determined by:
- **Amino Acid Profile**: Contains all essential amino acids
- **Digestibility**: How well the body can absorb and use the protein

### DIAAS vs PDCAAS
- **DIAAS**: More accurate, measures individual amino acid digestibility, can exceed 1.0
- **PDCAAS**: Older method, capped at 1.0, uses overall protein digestibility

### Multi-Source Calculations
When combining protein sources, the app:
1. Calculates quality-adjusted protein for each source
2. Applies percentage weights if specified
3. Sums the results for total quality-adjusted protein

## Contributing

This is a personal project, but suggestions and improvements are welcome! The codebase follows TypeScript best practices and uses modern React patterns.

## License

This project is for personal use and educational purposes.
