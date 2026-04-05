# TrustDegree Component Library

This document describes the custom component library built for TrustDegree. The library consists of three layers:

1. **Magic Wrappers** - Thin wrappers around 21st.dev Magic components that inject TrustDegree design tokens
2. **UI Primitives** - Project-specific reusable components
3. **Layout Components** - Page layout building blocks

---

## Magic Wrappers

These components wrap 21st.dev Magic components to apply TrustDegree's design system (colors, typography, spacing). Import from `@/components/magic`.

### Button

Primary action component with multiple variants and sizes.

```tsx
import { Button } from '@/components/magic';

<Button variant="primary" size="lg" onClick={handleClick}>
  Submit
</Button>

<Button variant="secondary" size="md">
  Cancel
</Button>

<Button variant="outline" size="sm" leftIcon={<Icon />}>
  With Icon
</Button>

<Button variant="ghost" size="icon">
  <Icon />
</Button>

<Button variant="destructive" isLoading>
  Delete
</Button>
```

**Props:**
- `variant`: `'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'`
- `size`: `'sm' | 'md' | 'lg' | 'xl' | 'icon'`
- `leftIcon` / `rightIcon`: React nodes
- `isLoading`: boolean (shows spinner)
- `disabled`: boolean
- `magnetic`: boolean (enable magnetic hover effect - default true for primary variant)
- Plus all standard button props (`onClick`, `type`, `className`, etc.)

---

### Card

Container component with header, content, and footer sections.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/magic';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Optional description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content goes here...</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Subcomponents:**
- `Card` - Root container
- `CardHeader` - Header section
- `CardTitle` - Bold title text
- `CardDescription` - Secondary text
- `CardContent` - Main content area
- `CardFooter` - Footer with actions

---

### Input

Form input with label, error state, helper text, and optional icons.

```tsx
import { Input } from '@/components/magic';

<Input
  label="Email Address"
  placeholder="you@example.com"
  type="email"
  value={email}
  onChange={handleChange}
  error={errors.email?.message}
  helperText="We'll never share your email"
  leftIcon={<Mail className="w-4 h-4" />}
  required
/>

<Input
  label="Password"
  type="password"
  showPasswordToggle
/>
```

**Props:**
- `label`: string
- `error`: string (shows error state styling + message)
- `helperText`: string (below input)
- `leftIcon` / `rightIcon`: React nodes
- `showPasswordToggle`: boolean (password visibility toggle)
- Plus all standard input props

---

### Badge

Small status indicators with dot variant and dismissible option.

```tsx
import { Badge } from '@/components/magic';

<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="success">Valid</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="destructive">Revoked</Badge>
<Badge variant="info">Info</Badge>

// With dot
<Badge variant="success" dot>
  Active
</Badge>

// Dismissible
<Badge
  variant="default"
  onDismiss={() => setShow(false)}
>
  Dismissible
</Badge>
```

**Props:**
- `variant`: `'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'info'`
- `dot`: boolean (show colored dot on left)
- `onDismiss`: () => void (shows close button)

---

### Skeleton

Loading placeholder with shimmer animation.

```tsx
import { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard } from '@/components/magic';

// Basic skeleton
<Skeleton className="h-4 w-full" />
<Skeleton className="h-4 w-3/4" />

// Pre-built patterns
<SkeletonText lines={3} />
<SkeletonAvatar size="md" />
<SkeletonCard />
```

**Components:**
- `Skeleton` - Base skeleton (pass height/width)
- `SkeletonText` - Animated text placeholder (3 lines by default)
- `SkeletonAvatar` - Circular avatar placeholder
- `SkeletonCard` - Full card skeleton (header, content, footer)

---

### Modal

Accessible dialog with backdrop blur and animations.

```tsx
import { Modal, ModalClose } from '@/components/magic';

<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Confirm Action"
  description="Are you sure you want to proceed?"
  size="md"
>
  <p>Modal content...</p>
  <div className="flex justify-end gap-3 mt-6">
    <Button variant="outline" onClick={onClose}>Cancel</Button>
    <Button variant="destructive" onClick={handleConfirm}>Delete</Button>
  </div>
  <ModalClose />
</Modal>
```

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `description`: string (optional)
- `size`: `'sm' | 'md' | 'lg' | 'xl'`
- `closeOnOverlayClick`: boolean (default true)
- `closeOnEscape`: boolean (default true)

---

### Table

Complete table suite with sorting, pagination, and selection.

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '@/components/magic';

<Table>
  <TableCaption>List of issued credentials</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead sortable onSort={handleSort}>Name</TableHead>
      <TableHead>Degree</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((item) => (
      <TableRow key={item.id} selectable>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.degree}</TableCell>
        <TableCell>
          <Badge variant={item.status === 'valid' ? 'success' : 'destructive'}>
            {item.status}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <Button size="sm" variant="outline">View</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell colSpan={3}>Total</TableCell>
      <TableCell className="text-right">{data.length}</TableCell>
    </TableRow>
  </TableFooter>
</Table>
```

---

### Toast

Notification system with auto-dismiss.

```tsx
import { toast } from '@/components/magic';

// Success
toast.success('Credential issued successfully!');

// Error
toast.error('Failed to verify credential');

// Info
toast.info('New update available');

// Warning
toast.warning('Session expiring soon');

// Custom duration
toast.success('Saved!', { duration: 10000 });

// With action (undo)
toast('Credential revoked', {
  action: {
    label: 'Undo',
    onClick: () => revokeCredential(id),
  },
});
```

---

### Select

Dropdown with search, keyboard navigation, and validation.

```tsx
import { Select, SelectItem, SelectGroup, SelectLabel } from '@/components/magic';

<Select
  value={selected}
  onValueChange={setSelected}
  label="Status"
  placeholder="Select status"
  error={errors.status?.message}
>
  <SelectItem value="valid">Valid</SelectItem>
  <SelectItem value="revoked">Revoked</SelectItem>
  <SelectItem value="pending">Pending</SelectItem>
</Select>
```

---

### Tabs

Tabbed interface with controlled state.

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/magic';

<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="profile">Profile</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="profile">
    <p>Profile content...</p>
  </TabsContent>
  <TabsContent value="settings">
    <p>Settings content...</p>
  </TabsContent>
</Tabs>
```

---

### QRCode

Display QR codes with customization.

```tsx
import { QRCode } from '@/components/magic';

<QRCode
  value={`https://trustdegree.verify?token=${credential.tokenId}`}
  size={200}
  level="H"
  bgColor="white"
  fgColor="black"
/>
```

---

## UI Primitives

Project-specific components built on top of Magic.

### StatusBadge

Displays credential verification status with appropriate icon and color.

```tsx
import { StatusBadge } from '@/components/ui/StatusBadge';

<StatusBadge status="valid" />
<StatusBadge status="revoked" />
<StatusBadge status="pending" />
<StatusBadge status="expired" />
```

**Variants:**
- `valid` - Green with CheckCircle icon
- `revoked` - Red with XCircle icon
- `pending` - Yellow/Orange with Clock icon
- `expired` - Gray with AlertCircle icon

Automatically uses i18n for label: `t('status.valid')` etc.

---

### AddressDisplay

Blockchain address with truncation and copy button.

```tsx
import { AddressDisplay } from '@/components/ui/AddressDisplay';

<AddressDisplay address="0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45" />
<AddressDisplay address={address} truncateLength={8} showFullOnHover />
```

**Props:**
- `address`: string (blockchain address)
- `truncateLength`: number (default 12 - shows first N and last N chars)
- `showFullOnHover`: boolean (default true - shows full address in tooltip on hover)
- `copyable`: boolean (default true - shows copy button)
- `className`: string

Displays: `0x742d...Db45` with copy icon. Copy copies full address to clipboard and shows "Copied!" toast.

---

### AnimatedCard

Card with scroll-triggered reveal and hover lift effect.

```tsx
import { AnimatedCard, AnimatedCardHeader, AnimatedCardTitle, AnimatedCardDescription, AnimatedCardContent, AnimatedCardFooter } from '@/components/ui/AnimatedCard';

<AnimatedCard className="p-6">
  <AnimatedCardHeader>
    <AnimatedCardTitle>Card Title</AnimatedCardTitle>
    <AnimatedCardDescription>Optional description</AnimatedCardDescription>
  </AnimatedCardHeader>
  <AnimatedCardContent>
    <p>Card content...</p>
  </AnimatedCardContent>
  <AnimatedCardFooter>
    <Button>Action</Button>
  </AnimatedCardFooter>
</AnimatedCard>
```

**Behavior:**
- Fades in when scrolled into view (whileInView)
- Lifts 4px on hover with shadow increase
- Smooth transitions (200ms)

---

### EmptyState

Shows when no data is available (empty list, no search results, etc.).

```tsx
import { EmptyState } from '@/components/ui/EmptyState';
import { InboxIcon } from 'lucide-react';

<EmptyState
  icon={<InboxIcon className="w-12 h-12" />}
  title="No credentials found"
  description="Create your first credential to get started."
  action={<Button>Create Credential</Button>}
/>
```

**Props:**
- `icon`: React node (large icon/illustration)
- `title`: string
- `description`: string
- `action`: React node (optional CTA button)
- `className`: string

Usage examples:
- Empty credentials list → action links to `/issue`
- No search results → action clears filters
- Error state → action is "Retry" button

---

## Layout Components

Page-level layout building blocks.

### PageHeader

Standardized page header with title, description, and optional action.

```tsx
import { PageHeader } from '@/components/layout/PageHeader';

<PageHeader
  title="Issue Credential"
  description="Create a new digital degree certificate for a student"
  action={<Button>Go to Dashboard</Button>}
  icon={<Award className="w-8 h-8" />}
/>
```

**Layout:**
- Left: Icon + title + description (stacked)
- Right: action button (if provided)
- Responsive: stacks vertically on mobile

---

### ContentContainer

Consistent max-width wrapper with padding.

```tsx
import { ContentContainer } from '@/components/layout/ContentContainer';

<ContentContainer>
  <h1>Page Title</h1>
  <p>Content...</p>
</ContentContainer>
```

Renders: `<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">`

---

### Section

Animated section wrapper for page content.

```tsx
import { Section } from '@/components/layout/Section';

<Section
  spacing="xl"
  title="How It Works"
  description="Four simple steps to trust"
  centered
>
  <div className="grid grid-cols-2 gap-8">
    <StepCard />
    <StepCard />
  </div>
</Section>

<Section spacing="lg" id="features">
  <h2>Features</h2>
  <p>...</p>
</Section>
```

**Props:**
- `spacing`: `'none' | 'sm' | 'md' | 'lg' | 'xl'` (vertical padding)
- `title`: string (optional - adds section header)
- `description`: string (optional, below title)
- `centered`: boolean (center-align title/description)
- `id`: string (for scroll navigation)
- `className`: string

**Subcomponents:**
- `SectionHeader` - title/description wrapper
- `SectionContent` - content wrapper (with animation)

---

## Utility Functions

### `cn()` - Class Name Merge

Utility for merging Tailwind classes with automatic conflict resolution.

```tsx
import { cn } from '@/lib/utils';

// Merges classes, handles Tailwind conflicts
const className = cn(
  "base-class",
  condition && "conditional-class",
  "px-4 py-2",
  variant === 'primary' ? "bg-blue-500" : "bg-gray-500"
);
// Output: "base-class px-4 py-2 bg-blue-500"

// Requires packages:
// - clsx
// - tailwind-merge
```

---

## Design Tokens

All visual styling uses semantic CSS custom properties from `src/index.css`:

```css
/* Colors */
bg-background, text-foreground
bg-primary, text-primary-foreground
bg-secondary, text-secondary-foreground
bg-muted, text-muted-foreground
bg-accent, text-accent-foreground
bg-card, text-card-foreground
border, ring

/* Typography */
font-sans, font-serif, font-mono
font-display (Calistoga)

/* Spacing & Layout */
px-*, py-*, gap-* (Tailwind utilities)

/* Border Radius */
rounded-sm, rounded, rounded-md, rounded-lg, rounded-xl, rounded-2xl, rounded-full

/* Shadows */
shadow-sm, shadow, shadow-md, shadow-lg
```

All Magic wrapper components use these tokens to ensure consistency. When you use `className="bg-card text-foreground"`, the actual colors come from the design system (defined in `src/styles/design-tokens.ts` and applied in `index.css`).

---

## Best Practices

### When to Use Magic vs Custom

**Use Magic wrappers when:**
- Standard UI elements (buttons, cards, inputs, tables, modals, badges, skeletons)
- Need consistent design tokens
- Want built-in accessibility (Magic components are WCAG-compliant)

**Build custom when:**
- Domain-specific (StatusBadge, AddressDisplay, QuickVerifyForm)
- Complex composition (AnimatedCard with multiple subcomponents)
- One-off components unlikely to be reused

### Animation Guidelines

**DO:**
- Use centralized variants from `@/lib/motion-config`
- Respect `prefers-reduced-motion` (already in config)
- Animate only `transform` and `opacity` (GPU-accelerated)
- Use `whileInView` for scroll-triggered reveals
- Set `viewport={{ once: true }}` to avoid re-triggering

**DON'T:**
- Define inline motion variants (copy to `motion-config` instead)
- Animate layout properties (width, height, top, left)
- Use large motion values (> 100px) on mobile
- Forget to test with reduced motion enabled

---

## Component Checklist

When creating new components:

- [ ] Use design tokens (bg-background, text-foreground, etc.) - NO hardcoded colors
- [ ] Add TypeScript types for props (interface or type)
- [ ] Export as named export (default export only for pages)
- [ ] Document props with JSDoc comments
- [ ] Include loading/error/empty states (if data fetching)
- [ ] Ensure keyboard accessibility (tabIndex, onKeyDown if needed)
- [ ] Add ARIA labels where text not visible
- [ ] Use i18n (`t()` function) for all user-facing strings
- [ ] Add motion variants from `motion-config` (if animated)
- [ ] Write unit test (if significant logic)

---

## Example: Creating a New Component

```tsx
// src/components/ui/StatCard.tsx
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/magic';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { fadeInUp } from '@/lib/motion-config';

interface StatCardProps {
  value: number | string;
  label: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

export function StatCard({ value, label, trend = 'neutral', icon }: StatCardProps) {
  const { t } = useTranslation();

  const trendColors = {
    up: 'text-emerald-600',
    down: 'text-rose-600',
    neutral: 'text-muted-foreground',
  };

  return (
    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible">
      <Card className="p-6 text-center">
        <CardContent className="p-0">
          {icon && <div className="mb-4">{icon}</div>}
          <div className="text-4xl font-bold font-display mb-2">{value}</div>
          <div className="text-sm font-medium text-muted-foreground">{label}</div>
          {trend !== 'neutral' && (
            <div className={cn('text-sm mt-2 font-medium', trendColors[trend])}>
              {trend === 'up' ? '↑' : '↓'} 12%
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
```

---

## References

- **Design System:** `src/styles/design-tokens.ts`, `src/index.css`
- **Motion Config:** `src/lib/motion-config.tsx`
- **Icons:** Lucide React (`lucide-react` package)
- **Magic Components:** https://21st.dev/magic/components
- **Framer Motion:** https://motion.dev/docs/react
- **Tailwind CSS:** https://tailwindcss.com/docs

---

**Last Updated:** March 2026
