---
name: Luminous Precision
colors:
  surface: '#fff8f6'
  surface-dim: '#edd5cb'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1eb'
  surface-container: '#ffeae0'
  surface-container-high: '#fce3d9'
  surface-container-highest: '#f6ded3'
  on-surface: '#251913'
  on-surface-variant: '#584237'
  inverse-surface: '#3c2d26'
  inverse-on-surface: '#ffede6'
  outline: '#8c7164'
  outline-variant: '#e0c0b1'
  surface-tint: '#9d4300'
  primary: '#9d4300'
  on-primary: '#ffffff'
  primary-container: '#f97316'
  on-primary-container: '#582200'
  inverse-primary: '#ffb690'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#006398'
  on-tertiary: '#ffffff'
  tertiary-container: '#00a2f4'
  on-tertiary-container: '#003554'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbca'
  primary-fixed-dim: '#ffb690'
  on-primary-fixed: '#341100'
  on-primary-fixed-variant: '#783200'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#cde5ff'
  tertiary-fixed-dim: '#93ccff'
  on-tertiary-fixed: '#001d32'
  on-tertiary-fixed-variant: '#004b74'
  background: '#fff8f6'
  on-background: '#251913'
  surface-variant: '#f6ded3'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-sm:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin: 32px
  container-max: 1280px
---

## Brand & Style
The design system is engineered for a modern SaaS environment that balances high-energy action with professional stability. The brand personality is authoritative yet accessible, utilizing a high-contrast aesthetic that draws inspiration from industry leaders like Stripe and Linear. 

The visual style is **Modern Corporate** with a heavy emphasis on **Glassmorphism**. It prioritizes clarity, precision, and a sense of premium craftsmanship. By pairing a vibrant, energetic primary color with deep, grounded neutrals and translucent surfaces, the UI evokes a feeling of sophisticated innovation and reliable performance.

## Colors
The palette is dominated by **Pure White (#ffffff)** to ensure maximum breathability and a clean "canvas" feel. 

- **Primary Orange (#f97316):** Used for primary actions, progress indicators, and brand-critical highlights. It represents energy and movement.
- **Deep Slate (#0f172a):** Used for primary typography, icons, and high-contrast accents to provide structural grounding.
- **Surface Gray (#f8fafc):** Applied to subtle background containers, card offsets, and secondary navigation elements to create soft depth without heavy shadows.
- **Translucent White:** Used for glassmorphic overlays with a 70-90% opacity range to maintain legibility while allowing background context to bleed through.

## Typography
The typographic system utilizes **Inter** for all primary reading and layout structures due to its exceptional legibility and neutral, systematic tone. **Geist** is introduced specifically for labels, metadata, and technical UI elements, leveraging its monospaced-adjacent precision to reinforce the SaaS aesthetic.

Headlines should use tight tracking and semi-bold/bold weights to create a strong visual hierarchy. Labels should be used sparingly for status indicators, small captions, and button text to provide a technical "engineered" contrast to the fluid body text.

## Layout & Spacing
This design system employs a **Fixed Grid** philosophy for desktop layouts, centering content within a 1280px container to maintain focus. A 12-column system is used with 24px gutters.

- **Desktop:** 12 columns, 32px side margins.
- **Tablet:** 8 columns, 24px side margins.
- **Mobile:** 4 columns, 16px side margins.

Spacing follows a strict 4px/8px baseline rhythm. Large "hero" sections should use the `xl` (80px) spacing unit to create air and a premium feel, while data-heavy dashboards should revert to `sm` (16px) spacing to maximize information density.

## Elevation & Depth
Depth is created through **Glassmorphism** and **Tonal Layering** rather than traditional heavy shadows.

- **Level 0 (Background):** Pure White (#ffffff).
- **Level 1 (Surfaces):** Light Gray (#f8fafc) with a subtle 1px border (#e2e8f0).
- **Level 2 (Floating/Glass):** White background at 80% opacity with a 16px Backdrop Blur. These elements feature a dual border: a 1px internal "shine" (White @ 40%) and a 1px external stroke (#e2e8f0).
- **Level 3 (Modals/Popovers):** Higher elevation using a soft, diffused ambient shadow (Color: #0f172a, Alpha: 0.05, Blur: 30px) to separate the element from the glass layer below.

## Shapes
A generous corner radius is fundamental to the design system's premium feel. While the standard `rounded` tokens follow the 0.5rem base, primary containers and large cards must use a **24px (Large)** radius.

- **Buttons & Inputs:** 8px (Soft) to 12px (Rounded) for a modern, approachable feel.
- **Cards & Main Containers:** 24px.
- **Chips & Tags:** Fully pill-shaped (999px).
- **Selection States:** Subtle 4px radius for internal list items.

## Components
- **Buttons:** Primary buttons use the Vibrant Orange background with White text. Secondary buttons use a white glassmorphic background with Slate text and a subtle border.
- **Cards:** Defined by a 24px corner radius, a subtle 1px border (#e2e8f0), and a very light surface tint (#f8fafc).
- **Inputs:** Clean white backgrounds with 1px Slate borders at 10% opacity. On focus, the border transitions to Vibrant Orange with a subtle outer glow.
- **Chips:** Small, pill-shaped elements using the Geist font. Use low-saturation background tints of the primary colors for categorization.
- **Navigation:** Top-bar navigation should be a glassmorphic "sticky" element that blurs the content beneath it as the user scrolls, maintaining a sense of place.
- **Lists:** High-density with 1px horizontal dividers in #f1f5f9. Use hovering states with a 4px rounded background in #f8fafc.