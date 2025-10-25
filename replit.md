# Imperial Tape Measure Calculator

## Overview

A mobile-first calculator application designed for construction professionals to perform precise calculations with imperial measurements (feet, inches, and fractions). The application handles tape measure arithmetic with support for 1/8" and 1/16" precision, featuring a utility-first design optimized for use in challenging work environments with glove-friendly touch targets and high-contrast displays.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- React Query (@tanstack/react-query) for server state management

**UI Component System:**
- shadcn/ui component library (New York style variant) with Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- CSS variables for theming support (light/dark modes)
- Monospace fonts (SF Mono, Consolas) for numerical displays to ensure alignment
- System font stack for UI elements

**State Management:**
- Local component state using React hooks
- Calculator state managed through a strongly-typed `CalculatorState` interface
- Shared schema definitions between client and server using Zod validation

**Design System:**
- Mobile-first responsive design (max-width: 768px breakpoint)
- Large touch targets (minimum 64px height) for glove operation
- High-contrast color system for outdoor visibility
- Custom spacing scale using Tailwind units (2, 4, 6, 8)
- Professional tool aesthetic prioritizing function over form

### Backend Architecture

**Server Framework:**
- Express.js running on Node.js
- ESM module system throughout the codebase
- TypeScript for type safety across the stack

**API Design:**
- RESTful API pattern with `/api` prefix for all endpoints
- Session-based request logging with response capture
- JSON request/response format
- Credential-based authentication support

**Development vs Production:**
- Development: Vite middleware integration for HMR
- Production: Static file serving from compiled assets
- Replit-specific plugins for development tooling (cartographer, dev banner, runtime error overlay)

**Storage Layer:**
- In-memory storage implementation (`MemStorage`) as the default
- Interface-based storage design (`IStorage`) for easy swapping to persistent databases
- Drizzle ORM configured for PostgreSQL (schema defined, migrations ready)
- User model with UUID-based identification

### Core Business Logic

**Imperial Measurement System:**
- Custom `ImperialMeasurement` interface representing feet, inches, numerator, and denominator
- Conversion utilities between decimal inches and fractional representations
- Fraction reduction using GCD algorithm for simplified results
- Tape measure precision rounding (1/8" or 1/16")
- Negative number handling across all measurement components

**Calculator Operations:**
- Basic arithmetic: addition, subtraction, division
- Display format toggling between reduced fractions and 16ths
- Input parsing for complex measurement strings
- Two-line display showing calculation history and current result

**Type System:**
- Zod schemas for runtime validation of operation types, precision settings, and display formats
- Shared type definitions between frontend and backend in `shared/schema.ts`
- Strong TypeScript typing throughout the application

### External Dependencies

**UI Libraries:**
- Radix UI components for accessible, unstyled primitives (accordion, dialog, dropdown, tooltip, etc.)
- Embla Carousel for carousel functionality
- cmdk for command palette interfaces
- date-fns for date manipulation
- class-variance-authority and clsx for conditional class composition
- tailwind-merge for Tailwind class merging

**Database & ORM:**
- Drizzle ORM for type-safe database queries
- Drizzle Kit for migrations
- @neondatabase/serverless for PostgreSQL connectivity
- drizzle-zod for schema validation integration
- connect-pg-simple for PostgreSQL session storage

**Form Management:**
- React Hook Form for form state management
- @hookform/resolvers for validation integration

**Development Tools:**
- Replit-specific Vite plugins for development experience
- esbuild for production server bundling
- tsx for TypeScript execution in development

**Build & Styling:**
- Tailwind CSS with PostCSS and Autoprefixer
- Custom color system with HSL values and CSS variables
- Extended border radius configuration (9px, 6px, 3px)