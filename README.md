# Store Rating Platform

## Overview

This is a full-stack store rating platform that allows users to discover and rate stores. The system supports three user roles (System Administrator, Normal User, and Store Owner) with role-based dashboards and functionalities. Built with React, Express.js, PostgreSQL, and Drizzle ORM, the application enables administrators to manage users and stores, normal users to browse and rate stores, and store owners to view their ratings and customer feedback.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tools**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and caching

**UI Component System**
- Shadcn/ui component library with Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for component variant management
- Dark/light theme support with CSS custom properties
- Design system based on modern dashboard aesthetics (Linear/Notion/Stripe inspired)

**State Management Pattern**
- Server state managed via TanStack Query with persistent caching
- Local state stored in localStorage for user session persistence
- Form state handled by React Hook Form with Zod validation
- No global client state management library (relies on React Query cache)

**Key Design Decisions**
- Component-first architecture with reusable UI primitives (StatsCard, DataTable, StarRating)
- Form validation schemas mirror backend schemas for consistency
- Toast notifications for user feedback on mutations
- Responsive grid layouts with mobile-first approach

### Backend Architecture

**Framework & Runtime**
- Express.js server with TypeScript
- Node.js runtime with ESM module support
- Session-based authentication using express-session with PostgreSQL store

**API Design Pattern**
- RESTful API endpoints organized by resource type
- Role-based access control middleware (requireAuth, requireRole)
- Centralized error handling and response formatting
- Session cookies for stateful authentication (not JWT)

**Authentication & Authorization**
- bcrypt for password hashing (10 salt rounds)
- Session-based auth with connect-pg-simple for session storage
- Role-based middleware protecting admin-only endpoints
- Separate login flows for users vs stores (users only via /api/login)

**Database Layer**
- Drizzle ORM for type-safe database queries
- Repository pattern via DbStorage class abstracting database operations
- Neon serverless PostgreSQL with WebSocket connection pooling
- Auto-migration system that runs on server startup

**Key Architectural Decisions**
- Sessions stored in PostgreSQL (not in-memory) for horizontal scaling capability
- Password validation enforced at both schema and API level (8-16 chars, uppercase, special character)
- Cascade deletes configured at database level for referential integrity
- Storage abstraction allows potential database swap without changing business logic

### Database Schema

**Users Table**
- Primary key: UUID (auto-generated)
- Fields: name, email (unique), password (hashed), address, role (admin/user/store)
- Constraints: Name 20-60 chars, address max 400 chars
- Timestamps: createdAt

**Stores Table**
- Primary key: UUID (auto-generated)
- Fields: name, email (unique), password (hashed), address
- Constraints: Same validation as users for consistency
- Timestamps: createdAt

**Ratings Table**
- Primary key: UUID (auto-generated)
- Foreign keys: userId → users(id), storeId → stores(id)
- Fields: rating (integer 1-5)
- Timestamps: createdAt, updatedAt
- Cascade deletes: Both user and store deletion removes associated ratings

**Schema Validation Strategy**
- Drizzle Zod schemas auto-generated from table definitions
- Frontend uses identical validation schemas for instant feedback
- Backend validates again before database operations for security
- Email uniqueness enforced at database level

### External Dependencies

**Database Service**
- Neon Serverless PostgreSQL for managed database hosting
- WebSocket connections via @neondatabase/serverless driver
- Connection pooling handled by Neon's infrastructure
- SSL/TLS required for all connections (sslmode=require)

**Session Management**
- connect-pg-simple for PostgreSQL-backed session storage
- Auto-creates session table if missing
- 30-day session expiration
- Secure cookies in production, lax in development

**Development Tools**
- Replit-specific plugins for runtime error overlay and development banner
- ESBuild for server bundling in production
- TypeScript compiler for type checking (noEmit mode)
- Drizzle Kit for database migrations and schema management

**UI Libraries**
- Radix UI for accessible component primitives (20+ components)
- Lucide React for icon system
- date-fns for date formatting and manipulation
- cmdk for command palette/search functionality

**Key Integration Points**
- No external API integrations currently implemented
- No email service configured (password resets not functional)
- No file upload service (all data is text-based)
- No analytics or monitoring services integrated
