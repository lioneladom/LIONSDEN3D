# Lion’s Den 3D — Online 3D-Printing Marketplace & Instant Quotation Platform

> **“Bring Your Designs to Life.”**  
> Precision Additive Manufacturing, Real-Time STL Slicing Quotation, and E-Commerce Platform.

---

## 🦁 Overview

**Lion’s Den 3D** is a web application combining a customer 3D printing studio and an administrative shop-owner control center.

Customers can upload raw `.STL` 3D CAD files, inspect geometry on a virtual 300 × 300 × 400 mm print bed, scale dimensions with aspect-ratio locking, configure engineering thermopolymers (PLA, PETG, ABS, TPU, Carbon-Fiber PLA), view interactive layer slicing clipping planes, receive automated authoritative pricing breakdowns, and track production timelines in real-time.

---

## 🚀 Key Features

### 👤 Customer Application
1. **Interactive 3D STL Studio (Three.js)**
   - OrbitControls: 360° smooth rotation, pan, zoom, camera presets (Top, Front, Side, ISO, Reset).
   - View Modes: Phong Solid Shaded, Polygon Wireframe, Interactive Slicer Clipping Plane Slider.
   - Bounding Box Dimensions Overlay: Live $X, Y, Z$ mm millimeter bounds and polygon polycount.
2. **Real-Time Slicer Quotation Engine**
   - Signed tetrahedron integration for volume ($cm^3$) and surface area ($mm^2$).
   - Shell perimeter thickness ($1.2$ mm) + Infill density percentage + Support overhang volume calculation.
   - Authoritative cost breakdown: Thermopolymer mass + Machine runtime + Setup fee + Support fee + Rush fee, clamped to Admin minimum order threshold.
3. **Curated Procedural Model Presets**
   - Instant 1-click loading for demo models: *Lion’s Den Geometric Crest*, *Helical Planetary Dual-Gear*, *Low-Poly Guardian Dragon*, *Industrial Drone Arm*, *Articulated Robot Gripper*.
4. **Dimension Scaling Controls**
   - Proportional aspect ratio lock, custom mm inputs, preset scales (50%, 75%, 100%, 125%, 150%, 200%).
5. **Print Marketplace & Catalog**
   - Filterable catalog by category (Figures, Gaming, Desk, Functional, Accessories).
   - 3D Slicer / Photo switcher on product detail pages, ratings, customer reviews, direct Add to Cart.
6. **Cart & Multi-Step Checkout**
   - Mixed carts supporting custom configured STL prints and store catalog products.
   - 4-Step checkout (Contact, Delivery / Spintex Rd Studio Pickup, Mobile Money [MTN MoMo, Telecel Cash], Card, Crypto USDT, Final review).
7. **Live Order Timeline Tracker**
   - Visual stage progression: `PENDING -> CONFIRMED -> PREPARING -> PRINTING -> QUALITY_CHECK -> READY -> SHIPPED -> COMPLETED`.
   - Real-time printer node telemetry: Nozzle temperature, bed temperature, and completion percentage.
8. **Customer Model Vault & Dashboard**
   - Personal STL model repository with instant re-configuration and quote generation.
9. **Materials & Technical Specs**
   - Deep-dive comparison matrix for PLA, PETG, ABS, TPU, Carbon Fiber PLA with strength, flex, heat deflection, and application guides.

---

### 🛡️ Shop-Owner Admin Control Center
1. **Executive Overview Dashboard**
   - Key metrics: Revenue, Active Print Jobs, Pending Queue, Completed Orders, Filament Stock in kg.
   - Revenue & order volume charts.
   - Live 6-Printer Fleet Monitor (Bambu X1-Carbon, Prusa MK4, Voron 2.4, Prusa XL, Elegoo Saturn, Bambu P1S) with live temperature gauges and job progress.
2. **Dynamic Live Pricing Engine**
   - Edit material prices per gram ($GHS/g$), setup fees, hourly machine cost, delivery fees, rush multipliers, minimum order clamps, and global markups.
   - Includes an interactive **Quotation Sandbox Simulator** to immediately test pricing formulas before publishing.
3. **Materials & Color Swatches Manager**
   - Create and edit thermopolymers, customize densities ($g/cm^3$), and manage color swatches.
4. **Print Settings Manager**
   - Add, edit, disable, or toggle customer-visible infill options, layer heights, and quality tiers.
5. **Order Lifecycle Fulfillment**
   - Detailed orders table with status badges, custom item inspection modal, and 1-click stage advancement.
6. **3D Model Mesh Inspector**
   - Inspect customer-uploaded STL geometry in full 3D, measure bounding dimensions, check manifold status, and approve or flag for revision.
7. **Filament Inventory Tracker**
   - Track spools in grams/kg, monitor low-stock thresholds, and trigger restock modals.
8. **Store Products Catalog**
   - Add new marketplace products, set prices, assign categories, and update stock.

---

## 🛠️ Technology Stack

- **Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (Dark industrial theme with `#080808` base, `#171717` cards, `#E10600` crimson red accents)
- **3D Graphics & CAD**: Three.js, OrbitControls, custom Binary & ASCII STL Parser, procedural geometry generators
- **Icons & Effects**: Lucide React, Canvas Confetti
- **Typography**: Outfit, Plus Jakarta Sans, JetBrains Mono

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js 18+ and npm

### Installation
```bash
# Clone or navigate to the project directory
cd "Lions Den 3D"

# Install dependencies
npm install

# Launch Vite development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
```

---

## 👥 Demo Quick Switcher
Use the top header banner to toggle between:
- **Customer Mode**: Kwame Mensah (Kwame's active orders, model vault, custom quotation studio).
- **Admin Mode**: Chief Engineer Kofi (Executive overview, live printer fleet monitor, dynamic pricing engine, order fulfillment workflow).
