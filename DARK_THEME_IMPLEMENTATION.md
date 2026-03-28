# Dark Theme Implementation Guide

## Overview

This document outlines the comprehensive dark theme implementation for the Jubotara News portal. The dark theme is managed through `next-themes` and Tailwind CSS with a class-based approach.

## Architecture

### Theme Provider Setup

- **File**: `provider/provider.jsx`
- **Provider**: `ThemeProvider` from `next-themes`
- **Configuration**:
  - `attribute="class"` - Theme is applied as a class to the HTML element
  - `defaultTheme="light"` - Default theme is light
  - Supports system preference detection

### Theme Toggle

- **Admin Panel**: `components/admin/AdminNavbar.jsx`
- **Public Site**: `components/common/Header/HeaderActions.jsx`
- **Icon**: Sun/Moon icons from Lucide React

## Global Dark Theme Styles

### Main Stylesheet: `app/globals.css`

#### Base Layer

- **Smooth Transitions**: Set globally to ensure all theme color changes are smooth.

  ```css
  *,
  ::before,
  ::after {
    transition-property:
      color, background-color, border-color, text-decoration-color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
  }
  ```

- Body background: `bg-[#121212]` (dark) / `bg-[#eff3f6]` (light)
- Text color: `text-gray-100` (dark) / `text-gray-900` (light)

#### Dark Mode Color Mappings

The following utilities are automatically converted when dark mode is active:

**Background Colors:**

- `bg-white` → `bg-[#1e1e1e]`
- `bg-gray-50` → `bg-[#121212]`
- `bg-gray-100` → `bg-gray-900`
- `bg-gray-200` → `bg-gray-800`
- `bg-gray-300` → `bg-gray-700`
- `bg-blue-50` → `bg-blue-950`
- `bg-blue-100` → `bg-blue-900`
- `bg-blue-600` → `bg-blue-700`
- `bg-red-50` → `bg-red-950`
- `bg-red-100` → `bg-red-900`
- `bg-red-600` → `bg-red-700`
- `bg-green-50` → `bg-green-950`
- `bg-green-100` → `bg-green-900`
- `bg-green-600` → `bg-green-700`

**Text Colors:**

- `text-black` → `text-white`
- `text-gray-900` → `text-gray-100`
- `text-gray-800` → `text-gray-200`
- `text-gray-700` → `text-gray-300`
- `text-gray-600` → `text-gray-400`
- `text-blue-600` → `text-blue-400`
- `text-red-600` → `text-red-400`
- `text-green-600` → `text-green-400`

**Border Colors:**

- `border-gray-100` → `border-gray-800`
- `border-gray-200` → `border-gray-800`
- `border-gray-300` → `border-gray-800`
- `border-blue-600` → `border-blue-700`

**Form Elements:**

- Inputs/Textareas: `bg-[#1e1e1e] text-gray-100 border-gray-800 placeholder-gray-500`

**Shadows:**

- All shadow classes receive `rgba(0, 0, 0, 0.5)` for dark mode

### Component Utilities

Custom dark-aware component classes in `@layer components`:

```css
.card-light {
  /* Light background cards */
}
.dark .card-light {
  /* Dark: #1e1e1e background */
}
.btn-primary {
  /* Red primary buttons */
}
.btn-secondary {
  /* Gray secondary buttons */
}
.badge-light {
  /* Light badges */
}
.tag-blue,
.tag-green,
.tag-red {
  /* Category tags */
}
```

## Updated Components

### Admin Panel

- **AdminNavbar.jsx**: Theme toggle button, dark background, light icons
- **AdminSidebar.jsx**: Dark background with light text, hover states
- **AdminLayoutClient.jsx**: Main layout adapts to dark mode
- **AdminFooter.jsx**: Dark background, light text
- **MetricCard.jsx**: Cards with proper contrast ratios
- **Settings Pages**: Forms with dark input backgrounds
- **Team Manager**: Tables and form inputs properly styled
- **EPaper Manager**: Cards and grid views with dark mode

### Public Page Components

- **Header/BreakingNews.js**: Dark background support
- **Footer.jsx**: Dark background, light text links
- **MobileBottomNav.js**: Already implemented with dark mode classes
- **EPaperViewer.jsx**: Controls and navigation buttons

### Authentication Pages

- **Login Page**: Dark background, light card, dark input fields
- **Activate Page**: Dark modal styling
- **Layout**: Dark page backgrounds

### Layout Files

- **Public Layout** (`app/(public)/layout.js`): `bg-[#eff3f6] dark:bg-[#121212]`
- **Admin Layout** (`app/(admin)/layout.jsx`): `bg-[#eff3f6] dark:bg-[#121212]`
- **Auth Layout** (`app/(auth)/layout.jsx`): `bg-white dark:bg-[#121212]`

## Color Palette

### Dark Mode

- **Background Primary**: `#121212` (Page background)
- **Background Secondary**: `#1e1e1e` (Cards, panels)
- **Background Tertiary**: `#2a2a2a` (Hover states)
- **Text Primary**: `#ffffff` (Main text)
- **Text Secondary**: `#e0e0e0` to `#a0a0a0` (Supporting text)
- **Primary Accent**: `#ee1d23` (Red, matches light theme)
- **Border**: `#333333` to `#4a4a4a` (Lines, dividers)

### Light Mode (Unchanged)

- **Background Primary**: `#eff3f6` (Page background)
- **Background Secondary**: `#ffffff` (Cards, panels)
- **Text Primary**: `#000000` (Main text)
- **Text Secondary**: `#666666` to `#999999`
- **Primary Accent**: `#ee1d23` (Red)
- **Border**: `#d0d0d0` to `#e0e0e0`

## Implementation Checklist

- [x] Configure `next-themes` provider
- [x] Create comprehensive dark mode utilities in `globals.css`
- [x] Update base layouts (public, admin, auth)
- [x] Update admin navbar with theme toggle
- [x] Update admin sidebar with dark styling
- [x] Update admin footer
- [x] Update admin forms and inputs
- [x] Update admin cards (MetricCard, NewsCardHandling)
- [x] Update modals (HotspotModal, PhotoCardModal)
- [x] Update public header/footer
- [x] Update authentication pages
- [x] Update color mappings for all Tailwind utilities
- [x] Add dark mode hover states for interactive elements
- [x] Test contrast ratios for accessibility
- [x] Test on different pages and components

## Testing

### Visual Testing

- Navigate between light and dark modes
- Verify all text has sufficient contrast
- Check for any hardcoded colors that need updating

### Components to Test

1. Admin Dashboard and all subpages
2. Public home page and category pages
3. News detail pages
4. Login/Register pages
5. E-paper viewer
6. Video section
7. Search functionality
8. Mobile navigation

### Contrast Ratios

Ensure WCAG AA compliance:

- Normal text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum

## Future Enhancements

1. **User Preference Storage**: Save theme preference to localStorage
2. **System Preference**: Respect `prefers-color-scheme` OS setting
3. **Additional Themes**: Consider sepia or high contrast options
4. **Time-based Auto-switching**: Auto switch based on time of day
5. **Component-specific Colors**: Fine-tune specific component colors for better UX

## Common Dark Theme Issues & Solutions

### Issue: Text is not visible

**Solution**: Ensure dark mode text classes are applied (`dark:text-gray-100`, etc.)

### Issue: Borders are invisible

**Solution**: Update border colors to light grays in dark mode (`dark:border-gray-800`)

### Issue: Form inputs look odd

**Solution**: Apply dark input classes: `dark:bg-[#1e1e1e] dark:border-gray-800`

### Issue: Hover states don't work

**Solution**: Add dark mode hover classes: `dark:hover:bg-gray-800`

### Issue: Shadows are invisible

**Solution**: Shadows automatically invert in globals.css dark mode section

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

Tested and working with:

- Next.js 15.5.10
- Tailwind CSS 4.0.0
- next-themes 0.4.4
