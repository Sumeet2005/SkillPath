# SkillPath — Design System Specifications

**Product Identity:** SkillPath — AI Career Skill Intelligence Platform  
**Target User:** Software Developers & Full Stack Engineers  
**Palette Identity:** Dark Purple / Violet + Graphite + Technical Cyan (`#07070C`)  

---

## 1. DESIGN PRINCIPLES

- **Precision & Restraint:** Purposeful design driven by strong hierarchy, deliberate typography, and whitespace. Color is used intentionally to establish identity and highlight data relationships rather than over-saturating the interface.
- **Developer Command Center:** Modeled after high-efficiency software developer tools (Linear, Vercel, Raycast, GitHub). Interfaces prioritize high density of information without visual clutter.
- **Graph-First Semantics:** Data visualizations follow explicit node semantic colors (Cyan = Known Origin, Soft Violet = Prerequisite, Purple = Active Traversal, Bright Violet = Target Career).
- **100% Zero-Emoji Policy:** Clean inline SVG iconography ensures professional consistency across all components, badges, buttons, and alert states.
- **Atomic Primitive Architecture:** Page features are built exclusively from reusable UI primitives residing in `src/components/ui/`.

---

## 2. COLOR TOKENS

```css
/* Color System Tokens */
--bg-canvas: #07070c;         /* Primary Background Canvas */
--bg-deep: #0b0a11;           /* Sidebar & Workspace Backdrop */
--bg-surface: #11101a;        /* Default Card & Input Surface */
--bg-elevated: #171521;       /* Floating Menus & Elevated Cards */

--color-purple-500: #8b5cf6;  /* Primary Brand Purple */
--color-violet-500: #a855f7;  /* Electric Violet Accent */
--color-violet-300: #c4b5fd;  /* Soft Violet Highlight */
--color-cyan-400: #22d3ee;    /* Technical Graph Cyan */
--color-green-400: #34d399;   /* Success / Mastered Green */
--color-amber-400: #f59e0b;   /* Warning / Target Amber */
--color-red-400: #f87171;     /* Error / Missing Red */

--text-primary: #f8fafc;     /* High Contrast Text */
--text-secondary: #a1a1aa;   /* Subtitles & Descriptions */
--text-muted: #71717a;       /* Labels & Captions */
--text-dim: #52525b;         /* Disabled Hints */

--border-subtle: rgba(255, 255, 255, 0.08);
--border-medium: rgba(255, 255, 255, 0.14);
--border-purple-glow: rgba(139, 92, 246, 0.35);
```

---

## 3. TYPOGRAPHY SCALE

| Scale Level | Font Family | Size / Line Height | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | Plus Jakarta Sans | 48–64px / 1.15 | 800 | Hero Headlines |
| **H1 (Page Title)** | Plus Jakarta Sans | 32–40px / 1.2 | 800 | Top Workspace Titles |
| **H2 (Section Title)**| Plus Jakarta Sans | 22–26px / 1.25 | 800 | Section Headers |
| **H3 (Card Title)** | Plus Jakarta Sans | 18–20px / 1.3 | 700 | Component Card Headers |
| **Body** | Inter / System Sans | 15–16px / 1.6 | 500–600 | Descriptions & Body |
| **Small** | Inter / System Sans | 13–14px / 1.5 | 500–600 | Captions & Form Controls |
| **Metadata** | Inter / System Sans | 12–13px / 1.4 | 600–700 | Badges & Telemetry Labels |
| **Technical Mono** | JetBrains Mono | 12–24px / 1.1 | 700–800 | Graph Labels & Metric Numbers |

---

## 4. SPACING SCALE

Enforced strictly across all containers, margins, and component paddings:
`8px (space-1)`, `12px (space-2)`, `16px (space-3)`, `20px (space-4)`, `24px (space-5)`, `32px (space-6)`, `40px (space-7)`, `48px (space-8)`, `64px (space-9)`, `80px (space-10)`.

---

## 5. SURFACE SYSTEM

1. **Canvas (`#07070C`)**: Main document background layer with subtle radial brand glows.
2. **Deep Surface (`#0B0A11`)**: Sticky left sidebar application shell and dark workspace backdrops.
3. **Main Surface (`#11101A`)**: Standard component cards, input wrappers, and telemetry strips (`border: 1px solid rgba(255,255,255,0.08)`).
4. **Elevated Surface (`#171521`)**: Hovered cards, dropdown menus, modals, and inspector sidebars (`border: 1px solid rgba(139,92,246,0.35)`).

---

## 6. BUTTON VARIANTS (`Button.jsx`)

- **Primary (`btn-primary`)**: Purple gradient (`#8B5CF6 → #A855F7`), white text, soft glow shadow (`box-shadow: 0 0 25px rgba(139,92,246,0.25)`). Hover lifts `-1px`.
- **Secondary (`btn-secondary`)**: Dark surface (`#11101A`), subtle border, white text. Hover transitions to elevated surface (`#171521`) with purple border accent.
- **Tertiary (`btn-tertiary`)**: Dark transparent background, subtle border, secondary text.
- **Ghost (`btn-ghost`)**: Transparent background, soft purple background highlight on hover.
- **Danger (`btn-danger`)**: Soft red surface (`rgba(248,113,113,0.12)`), red text and border.

---

## 7. FORM CONTROL SYSTEM (`Input.jsx`, `Select.jsx`, `SearchInput.jsx`)

- **Standard Height**: Fixed 52px height for all text inputs, search fields, and custom select dropdowns.
- **Select Styling**: Custom SVG chevron arrow right-aligned (`pointer-events: none`), `appearance: none`, dark surface (`#11101A`), focus ring (`0 0 0 3px rgba(139,92,246,0.18)`). Zero native browser dropdown arrows.
- **Search Inputs**: Left inline search SVG icon with optional right clear (`✕`) button.

---

## 8. CARD VARIANTS (`Card.jsx`)

- **Main Surface Card (`card-surface-main`)**: Surface `#11101A`, border `rgba(255,255,255,0.08)`, radius 16px.
- **Hoverable Card (`card-hoverable`)**: Smooth 150ms transform lift (`translateY(-2px)`), purple border glow accent (`rgba(139,92,246,0.35)`).
- **Interactive Card (`card-interactive`)**: Pointer cursor, active press depth.

---

## 9. GRAPH SEMANTICS & VISUAL LANGUAGE

- **Known/Mastered Skill**: Technical Cyan (`#22D3EE`).
- **Prerequisite Skill**: Soft Violet (`#C4B5FD`).
- **Active Traversal Path**: Primary Purple (`#8B5CF6`).
- **Target Career Role**: Bright Violet (`#A855F7`) with pulsing dashed halo ring.
- **Connections**: SVG curved Bezier paths (`<path d="M ... C ...">`) with gradient stroke transparency.

---

## 10. MOTION SYSTEM

- **Durations**: `150ms` (Fast buttons/inputs), `250ms` (Normal card hover/tab switches), `300ms` (Modal overlays/drawers).
- **Accessibility**: Full `@media (prefers-reduced-motion: reduce)` support disabling non-essential CSS keyframe animations.

---

## 11. RESPONSIVE BREAKPOINTS

- **Desktop Extra Wide**: `1440px` (Max container width, 248px sticky sidebar, 32–48px main padding).
- **Desktop Standard**: `1280px` (2-column hero grid 48% / 52%).
- **Tablet**: `1024px` & `768px` (Sidebar hides into mobile header drawer).
- **Mobile**: `480px` & `390px` (Single column stacked cards, full width touch controls).

---

## 12. UI PRIMITIVE COMPONENT ARCHITECTURE

All primitives reside in `src/components/ui/`:
- `Button.jsx`
- `Card.jsx`
- `Badge.jsx`
- `Input.jsx`
- `SearchInput.jsx`
- `Select.jsx`
- `Tabs.jsx`
- `Stat.jsx`
- `StatusIndicator.jsx`
- `SectionHeader.jsx`
- `Tooltip.jsx`
- `Modal.jsx`
