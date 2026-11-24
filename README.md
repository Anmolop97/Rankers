# Rankers ⚡
### Determination of Stefan-Boltzmann Constant (&sigma;) — Interactive Physics Lab & Solver
> **Academic Syllabus:** Techno India University / MAKAUT 1st Year B.Tech Engineering Physics Practical (Experiment No. 05).

---

## 📌 Overview
**Rankers** is a high-precision, interactive physics lab simulator and mathematical solver built specifically for **Experiment No. 05: "Determination of Stefan-Boltzmann Constant by Vacuum Diode / Triode Filament Radiation"**.

It faithfully replicates authentic **millimeter graph paper**, provides a **1-click tab switcher** between **Graph I** and **Graph II**, projects real student laboratory observations, and provides an uncompressed, step-by-step mathematical derivation down to the calculated Stefan-Boltzmann constant (&sigma;) and percentage error.

---

## ✨ Key Features

### 1. Dual Interactive Millimeter Graph Engine (1-Click Switcher)
- **📈 Graph I: Resistance Ratio vs Filament Temperature ($R_T / R_{300}$ vs $T$ in Kelvin)**
  - Scale: $1\text{ cm} = 1.0\text{ unit}$ on X-axis ($1\text{ SSD} = 0.1\text{ unit}$).
  - Scale: $1\text{ cm} = 200\text{ K}$ on Y-axis ($1\text{ SSD} = 20\text{ K}$).
  - Monotone cubic spline interpolation through standard Table I points: $(1.0, 300\text{ K})$, $(4.0, 920\text{ K})$, $(6.0, 1300\text{ K})$, $(8.0, 1645\text{ K})$, $(10.0, 1990\text{ K})$.
  - **12 Experimental Projection Lines:** Real-time dashed orthogonal ray traces $(r_i, 0) \to (r_i, T_i) \to (0, T_i)$ demonstrating how student readings are projected to find temperature $T$.
- **📉 Graph II: Logarithmic Power vs Temperature ($\log_{10} P$ vs $\log_{10} T$)**
  - Scale: $1\text{ cm} = 0.1\text{ unit}$ on X-axis ($1\text{ SSD} = 0.01\text{ unit}$).
  - Scale: $1\text{ cm} = 0.2\text{ unit}$ on Y-axis ($1\text{ SSD} = 0.02\text{ unit}$).
  - Interactive draggable slope handles ($A$ and $B$) with live slope angle solver, right-angle drafting triangle, and preset buttons ($3.42$, $3.40$, $4.00$).

### 2. Authentic Physics Graph Paper Drafting
- **3-Tier Millimeter Grid Hierarchy:**
  - $1\text{ mm}$ Hairline division
  - $5\text{ mm}$ Mid-grid accent
  - $10\text{ mm}$ ($1\text{ cm}$) Centimeter blocks
- **3 Color Themes:**
  - 🌿 *Camlin Green* (Classic Indian laboratory graph sheet)
  - 🔷 *Lotus Blue* (Standard engineering drafting sheet)
  - 🖤 *Dark CAD* (Oscilloscope / dark mode workstation)
- **CAD/Figma Invariant Smooth Zoom & Pan:**
  - Smooth trackpad and mouse wheel zooming with zero coordinate drift.
  - Adaptive Level-of-Detail (LOD): Crisp physics dots ($\odot$) when zoomed out; high-magnification badges when zoomed in ($\ge 160\%$).

### 3. Step-by-Step Vertical Academic Derivation
A non-compact, spacious, notebook-style solution flowing from top to bottom:
- **Step 1:** Slope of Graph II ($n = \Delta y / \Delta x = 3.42$)
- **Step 2:** Cathode Surface Area ($S = 2\pi rl = 6.077 \times 10^{-4}\text{ m}^2$) & Effective Emissivity ($\varepsilon S = 1.4585 \times 10^{-4}\text{ m}^2$)
- **Step 3:** Stefan's Law Logarithmic Formula & Intercept ($\log_{10}(\varepsilon S \sigma) = -11.1060$)
- **Step 4:** Stefan-Boltzmann Constant ($\sigma = 5.37 \times 10^{-8}\text{ W}\cdot\text{m}^{-2}\cdot\text{K}^{-4}$)
- **Step 5:** Percentage Error Calculation ($2.8\% \text{ to } 5.3\%$, Grade A+ Optimal)

---

## 🚀 Quick Start
No complex dependencies or build steps required. Simply open the single-file web application in any modern browser:

```bash
# Clone the repository
git clone https://github.com/Anmolop97/Rankers.git

# Navigate into the folder
cd Rankers

# Open index.html in your default browser (Windows)
start index.html
```

Or double-click `index.html` directly.

---

## 📊 Experimental Parameters
- **Cathode Radius ($r$):** $0.31 \times 10^{-2}\text{ m}$
- **Cathode Length ($l$):** $3.12 \times 10^{-2}\text{ m}$
- **Surface Area ($S$):** $6.0771 \times 10^{-4}\text{ m}^2$
- **Nickel Emissivity ($\varepsilon$):** $0.24$
- **Combined Factor ($\varepsilon \cdot S$):** $1.4585 \times 10^{-4}\text{ m}^2$
- **Standard Constant ($\sigma_{\text{exact}}$):** $5.67037 \times 10^{-8}\text{ W}\cdot\text{m}^{-2}\cdot\text{K}^{-4}$

---

## 🛠️ Technology Stack
- Vanilla HTML5 Canvas (High-DPI 2x supersampling)
- Tailwind CSS
- Lucide Icons
- Pure JavaScript (Zero external heavyweight charting libraries)

---

## 📜 License
MIT License &bull; Created for educational & laboratory practical analysis.
