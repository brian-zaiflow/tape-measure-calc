# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An imperial tape measure calculator designed for construction professionals. Mobile-first React application with TypeScript that handles precise fractional arithmetic with 1/16" precision. Includes two main tools:
1. **Calculator** - Add, subtract, multiply, and divide imperial measurements
2. **Intervals** - Divide lengths into equal parts or generate evenly spaced marks with custom intervals

## Development Commands

**Start development server:**
```bash
npm run dev
```
Runs Vite dev server on port 5173 with HMR.

**Type checking:**
```bash
npm run check
```
Runs TypeScript compiler in check mode without emitting files.

**Production build:**
```bash
npm run build
```
Builds static files to `dist/` directory.

**Preview production build:**
```bash
npm run preview
```
Serves the built static files locally for testing.

## Architecture

### Core Business Logic

**Imperial measurement system** (`client/src/lib/fraction-math.ts`):
- `ImperialMeasurement` interface: `{inches, numerator, denominator}` (inches and fractions only)
- All arithmetic converts to decimal inches, performs operation, then converts back
- All values are positive (no negative numbers - use subtract operation instead)
- Fraction reduction uses GCD algorithm - fractions always displayed in reduced form
- Fixed 1/16" precision - always rounds to nearest 1/16" mark
- Tape measure rounding: ties (halfway points) round up per construction practice
- `toDecimalInches()`: converts measurement to decimal for calculations
- `toImperialMeasurement()`: converts decimal back, rounding to 1/16" and reducing fractions
- `performOperation()`: handles add, subtract, multiply, divide operations
- `formatImperialMeasurement()`: converts to display string (always shows inches only, e.g., "63 1/2"")
- `parseInput()`: parses multiple formats including feet notation (e.g., "5' 3 1/2"", "8'", "3 1/2"") - feet are converted to inches internally for storage/display

**Calculator state** (`client/src/types/index.ts`):
- `CalculatorState` tracks: currentInput, displayValue, previousValue, operation, shouldResetInput
- `OperationType`: 'add' | 'subtract' | 'multiply' | 'divide' | 'none'
- `ImperialMeasurement` type definition
- No precision or display format settings - always uses 1/16" with reduced fractions

### Frontend Structure

**Tech stack:**
- React 18 + TypeScript with Vite build system
- Wouter for routing (lightweight alternative to React Router)
- React Query (@tanstack/react-query) for server state
- shadcn/ui components (New York variant) built on Radix UI primitives
- Tailwind CSS v4 with CSS variables for theming

**Key directories:**
- `client/src/pages/`: Page components (calculator.tsx and intervals.tsx)
- `client/src/components/ui/`: shadcn/ui components
- `client/src/lib/`: Utilities and business logic
- `client/src/hooks/`: Custom React hooks

**Routing** (`client/src/App.tsx`):
- Route "/" shows Calculator component
- Route "/intervals" shows Intervals component
- 404 handled by NotFound component
- Wrapped in QueryClientProvider and TooltipProvider

**Pages:**
- `calculator.tsx`: Main arithmetic calculator with operation buttons and quick fraction shortcuts
- `intervals.tsx`: Tape measure interval generator with two modes:
  - Divide mode: Divide a total length into N equal parts with optional offset
  - Custom mode: Generate marks at custom intervals starting from a custom point

### Pure Static Site

This is a 100% client-side application:
- No backend server required
- No database or API calls
- All calculation logic runs in the browser
- Perfect for hosting on GitHub Pages or any static hosting service

### Design System

**Per design_guidelines.md:**
- Mobile-first with max-width: 768px
- Large touch targets (minimum 64px height) for glove operation
- Monospace fonts (SF Mono, Consolas) for numerical displays
- High contrast for outdoor visibility
- Professional tool aesthetic (not consumer app)
- Tailwind spacing units: 2, 4, 6, 8
- Two-line calculator display: history + current result

**Typography:**
- Display results: text-5xl to text-6xl, font-bold (48-60px)
- Input display: text-3xl to text-4xl
- Button labels: text-xl
- Helper text: text-sm

**Components:**
- Result display: monospace, right-aligned, min-height h-32
- Calculator grid: 4-column layout with large buttons
- Quick fraction buttons: 1/2", 1/4", 3/4", 1/8" for common measurements
- Operations: vertical alignment on right (traditional calculator layout)

## Type System

**Types** (`client/src/types/index.ts`):
- Use Zod for runtime validation of enums (OperationType)
- TypeScript interfaces for complex types (ImperialMeasurement, CalculatorState)
- All types are client-side only

**Type checking:**
- Run `npm run check` before committing
- No TypeScript errors should exist in the codebase
- Use strict TypeScript configuration

## Testing

No test framework currently configured. Tests would need to be set up if required.

## Key Implementation Notes

1. **Fraction arithmetic is the core complexity**: all calculations flow through decimal conversion, operation, then back to imperial with 1/16" rounding
2. **Simplified architecture**: Display shows inches only (no feet in output), no negative numbers, fixed 1/16" precision, always reduced fractions
3. **Input parsing accepts feet notation**: Users can input "5' 3 1/2"" which is converted to "63 1/2"" internally and for display
4. **Pure static site**: 100% client-side, no backend, perfect for GitHub Pages
5. **Two-page application**: Calculator (/) and Intervals (/intervals) with client-side routing

## Deployment

See `DEPLOY.md` for GitHub Pages deployment instructions. The app is configured with:
- GitHub Actions workflow for automatic deployment
- Hash-based routing (wouter with `useHashLocation`) for GitHub Pages compatibility
- Static build outputs to `dist/` directory
- Base path set to `/tape-measure-calc/` in `vite.config.ts`
