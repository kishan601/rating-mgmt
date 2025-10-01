# Design Guidelines: Store Rating Platform

## Design Approach
**Selected System:** Modern Dashboard Design inspired by Linear, Notion, and Stripe
- **Justification:** This is a data-intensive admin platform requiring clarity, efficiency, and professional aesthetics. The design prioritizes information hierarchy, quick scanning, and task completion over visual flair.

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary):**
- Background: 222 15% 10% (deep charcoal)
- Surface: 222 15% 14% (elevated cards)
- Border: 222 15% 20% (subtle dividers)
- Primary: 210 100% 60% (vibrant blue for CTAs)
- Text Primary: 210 20% 98%
- Text Secondary: 210 15% 70%
- Success: 142 76% 45% (rating/positive states)
- Warning: 38 92% 50% (alerts)
- Destructive: 0 84% 60% (delete actions)

**Light Mode:**
- Background: 0 0% 100%
- Surface: 0 0% 98%
- Border: 220 13% 91%
- Primary: 210 100% 50%
- Text Primary: 222 47% 11%
- Text Secondary: 215 16% 47%

### B. Typography
- **Primary Font:** Inter (via Google Fonts CDN)
- **Headings:** 
  - H1: text-3xl font-semibold (Dashboard titles)
  - H2: text-2xl font-semibold (Section headers)
  - H3: text-lg font-medium (Card titles)
- **Body:** text-base font-normal
- **Labels:** text-sm font-medium uppercase tracking-wide
- **Data Tables:** text-sm font-mono (for IDs/codes), text-sm font-normal (for text)

### C. Layout System
**Spacing Units:** Consistent use of 4, 6, 8, 12, 16, 24 (e.g., p-4, gap-6, mb-8, py-12)
- **Dashboard Grid:** Fixed sidebar (w-64) + main content (flex-1)
- **Card Spacing:** p-6 for content, gap-4 between elements
- **Section Margins:** mb-8 between major sections, mb-4 between related elements
- **Container:** max-w-7xl mx-auto for content areas

### D. Component Library

**Navigation:**
- Sidebar: Fixed left navigation with role-based menu items, user profile at bottom
- Header: Breadcrumb navigation + search bar + user menu (top-right)
- Active states: Primary color background with white text

**Data Tables:**
- Striped rows (even rows with subtle background: bg-surface)
- Hover states: Slight border-left accent in primary color
- Column headers: Sticky with sort indicators (↑↓ icons from Heroicons)
- Pagination: Bottom-right with page numbers + prev/next
- Row actions: Kebab menu (⋮) on hover revealing Edit/Delete/View options

**Forms:**
- Input fields: border-2 with focus:ring-2 focus:ring-primary
- Labels: Above inputs, font-medium text-sm
- Validation: Inline error messages in destructive color below fields
- Form groups: Space with gap-6, max-w-2xl for better readability
- Submit buttons: Primary color, full-width on mobile, auto width on desktop

**Cards:**
- Background: Surface color with rounded-lg border
- Shadow: subtle on hover (hover:shadow-lg transition)
- Padding: p-6 consistent
- Stats cards: Grid layout (grid-cols-1 md:grid-cols-3) with large numbers (text-4xl font-bold) and labels

**Ratings:**
- Star display: Filled stars (★) in warning color, empty in border color
- Interactive rating: Clickable stars with hover state showing preview
- Average rating: Large display (text-3xl) with star visualization
- User's rating: Highlighted with subtle background indicator

**Dashboard Components:**
- Stats overview: 3-column grid showing total users/stores/ratings with icons
- Recent activity: Timeline-style list with timestamps
- Quick actions: Button grid for common tasks
- Charts: Use Chart.js via CDN for rating trends (line chart) and distribution (bar chart)

**Search & Filters:**
- Search bar: Top of listings with icon (Heroicons magnifying glass)
- Filter chips: Removable tags showing active filters
- Filter panel: Slide-over drawer from right with checkbox groups

**Authentication Pages:**
- Centered layout with max-w-md
- Card-based forms with logo/branding at top
- Social proof text below ("Trusted by 500+ stores")
- Link to switch between login/signup

### E. Interactions
- Button states: Subtle scale transform (hover:scale-[1.02]) and opacity changes
- Loading states: Skeleton screens for tables, spinner for buttons
- Toast notifications: Top-right position for success/error messages (use Sonner library via CDN)
- Modal overlays: Backdrop blur with centered dialog (max-w-lg)

## Images
**No large hero images** - This is a utility application focused on data and functionality. Images used sparingly:
- User avatars: Circular, 40x40px in tables/lists
- Store placeholders: 60x60px rounded squares in store listings
- Empty states: Simple illustrations (use unDraw via CDN) for empty tables (300x200px)
- Login page: Small decorative element or pattern (200x200px) above form, not a hero

## Role-Specific Layouts

**System Admin Dashboard:**
- Top: 3-stat cards (users, stores, ratings) with trend indicators
- Middle: Recent activity list + quick action buttons
- Bottom: Data table with advanced filtering

**Normal User Store Listing:**
- Grid layout (grid-cols-1 md:grid-cols-2 lg:grid-cols-3) of store cards
- Each card: Store image, name, address, rating stars, user's rating badge, rate/edit button
- Search bar sticky at top

**Store Owner Dashboard:**
- Large average rating display (hero section replacement)
- Ratings timeline showing all user ratings with names and timestamps
- Simple bar chart showing rating distribution (1-5 stars)