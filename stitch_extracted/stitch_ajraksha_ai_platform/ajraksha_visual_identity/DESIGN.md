---
name: Ajraksha Visual Identity
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#4fdbc8'
  on-secondary: '#003731'
  secondary-container: '#04b4a2'
  on-secondary-container: '#003f38'
  tertiary: '#45dfa4'
  on-tertiary: '#003825'
  tertiary-container: '#00b982'
  on-tertiary-container: '#00422c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#71f8e4'
  secondary-fixed-dim: '#4fdbc8'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005048'
  tertiary-fixed: '#68fcbf'
  tertiary-fixed-dim: '#45dfa4'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  label-mono:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  stat-value:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-margin: 2rem
  gutter: 1.5rem
  card-padding: 1.5rem
  section-gap: 4rem
  bento-gap: 1rem
---

## Brand & Style
The design system embodies an "Intelligent Vitality"—merging the precision of high-end enterprise software with the organic growth of agriculture. It is designed to feel like a premium command center for the future of farming.

The aesthetic is rooted in **Modern Enterprise Glassmorphism**. It borrows the rigorous craftsmanship of Linear and the ethereal depth of Stripe’s landing pages. The interface utilizes high-transparency layers, micro-glows, and deep atmospheric gradients to create a sense of vast digital space. It avoids the "flatness" of traditional SaaS by using light as a functional signifier, highlighting AI-driven insights through soft, luminous accents.

**Target Audience:** Enterprise agronomists, large-scale farm operators, and agricultural investors who require data density without cognitive overload.
**Emotional Response:** Confidence, clarity, and a sense of being ahead of the curve.

## Colors
The palette is a sophisticated "Deep Nature" dark mode. The background is not a flat black, but a rich, multi-stop gradient of Slate, Forest, and Teal that provides immense perceived depth.

- **Primary (Emerald #10B981):** Used for primary actions and "active" status.
- **Secondary (Teal #14B8A6):** Used for data visualization and secondary brand elements.
- **Accents (Mint/Green):** Reserved for high-value AI insights and positive growth metrics.
- **Surface Strategy:** Surfaces use a custom "Glass" palette: semi-transparent Slate (#1E293B at 60-80% opacity) with a subtle 1px inner stroke to catch "light" from the top-left.

## Typography
The system uses **Inter** for its neutral, highly legible character, ensuring complex data remains readable. **Geist** is introduced for labels and technical data to provide a "developer-grade" precision feel.

- **Contrast:** High-contrast white (#F8FAFC) is used for headings, while muted Slate (#94A3B8) is used for secondary body text to maintain hierarchy in a dark environment.
- **Tracking:** Tightened tracking on larger displays to create a "locked-in" editorial look.
- **Usage:** Use `label-mono` for category tags and AI metadata. Use `stat-value` for large numeric data in Bento cards.

## Layout & Spacing
This design system utilizes a **Bento-style Grid Architecture**. Information is compartmentalized into discrete, floating modules that vary in size but maintain a strict rhythmic alignment.

- **Grid:** A 12-column fluid grid for desktop, collapsing to a single column for mobile.
- **Bento Logic:** Components should span 3, 6, 9, or 12 columns. Vertical spans should be consistent to create clean horizontal "strips" of data.
- **Negative Space:** Generous 4rem gaps between major sections to prevent the glass surfaces from feeling cluttered. Content within cards should breathe, using a minimum of 1.5rem internal padding.

## Elevation & Depth
Depth is created through "Luminous Layering" rather than traditional heavy shadows.

- **Background Blur:** All interactive surfaces must use a `backdrop-filter: blur(12px)`.
- **The Glow Effect:** High-priority cards (AI insights) feature a subtle outer glow using the Primary Emerald color at 10% opacity.
- **Border Treatment:** Instead of a solid border, use a linear-gradient stroke (Top-Left: White 20% to Bottom-Right: Transparent) to simulate a physical edge catching light.
- **Z-Index Tiers:**
    1. **Floor:** Background Gradient.
    2. **Base:** Bento Cards (Blur 12px, Opacity 60%).
    3. **Hover:** Raised Cards (Blur 20px, Opacity 80%, 1px brighter border).
    4. **Overlay:** Modals/Popovers (Blur 40px, deep ambient shadow #000 40%).

## Shapes
The shape language is characterized by **Generous Radius Geometry**. This softens the technical nature of the AI data and makes the platform feel approachable.

- **Main Containers/Cards:** Use 24px (`rounded-xl` / 1.5rem) to create a soft, modern "floating" aesthetic.
- **Interactive Elements:** Buttons and Input fields use a tighter 8px to 12px radius to maintain a sense of precision.
- **Icons:** Squircle-based enclosures for feature icons to match the card language.

## Components

### Buttons
- **Primary:** Solid Emerald-to-Teal gradient. No border. White text. Subtle outer glow on hover.
- **Secondary:** Glass-fill (20% white) with the 1px light-catching border.
- **Ghost:** Text-only with Emerald color, becoming glass-filled on hover.

### Bento Cards
The core unit of the UI. Must have a 24px corner radius, backdrop-blur, and the 1px "top-light" border. Header areas within cards should use `label-mono` for titles.

### Input Fields
Darker than the card background (#020617 at 40% opacity). Focus state should trigger a 1px Emerald ring and a soft Emerald shadow.

### AI Insight Chips
Small, pill-shaped badges with a vibrant Green-to-Mint gradient fill and black text. Used to flag automated recommendations.

### Data Lists
Zebra-striping is avoided. Instead, use thin 1px Slate separators at 10% opacity. Rows should have a subtle scale-up and brighten effect on hover to indicate interactivity.

### Progress Bars
Track is deep Slate. Indicator is a glowing Emerald-to-Teal gradient to represent "growth" or "completion."