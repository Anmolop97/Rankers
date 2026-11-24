// CALCULATIONS & FORMAL LAB SOLVER ENGINE

function executeCalculation() {
      const deltaX = handleB.x - handleA.x;
      const deltaY = handleB.y - handleA.y;
      const slope = deltaX !== 0 ? (deltaY / deltaX) : 3.4166667;

      // Reference point chosen on graph line (log10 T = 3.30, log10 P = 0.18)
      const refLogT = 3.30;
      const refLogP = 0.18;

      // Stefan-Boltzmann Solver
      // log10(P) = log10(eps * S * sigma) + n * log10(T)
      // log10(eps * S * sigma) = log10(P) - n * log10(T)
      const slopeProduct = slope * refLogT;
      const logVal = refLogP - slopeProduct;
      const epsTimesS_sigma = Math.pow(10, logVal);
      const calculatedSigma = epsTimesS_sigma / SOLVER_MEMORY.epsTimesS;
      const percentageError = Math.abs(calculatedSigma - SOLVER_MEMORY.exactSigma) / SOLVER_MEMORY.exactSigma * 100;

      // Update Result Dashboard
      const elSlope = document.getElementById('res-slope');
      const elSigma = document.getElementById('res-sigma');
      const elError = document.getElementById('res-error');
      
      const sigmaExpVal = (calculatedSigma * 1e8).toFixed(2);
      if (elSlope) elSlope.innerText = slope.toFixed(2);
      if (elSigma) elSigma.innerHTML = `${sigmaExpVal}&times;10<sup>-8</sup>`;
      if (elError) elError.innerText = `${percentageError.toFixed(1)}%`;

      // Grade badge logic
      const badge = document.getElementById('quality-badge');
      if (badge) {
        if (percentageError < 10) {
          badge.innerText = 'Grade A+ (Optimal)';
          badge.className = 'text-sm px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-extrabold uppercase border border-emerald-500/30';
        } else if (percentageError < 25) {
          badge.innerText = 'Grade A (Good Lab Standard)';
          badge.className = 'text-sm px-4 py-2 rounded-xl bg-blue-500/20 text-blue-300 font-extrabold uppercase border border-blue-500/30';
        } else {
          badge.innerText = 'Warning: High Error';
          badge.className = 'text-sm px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 font-extrabold uppercase border border-amber-500/30';
        }
      }

      // Update Formal Handwritten Lab Format Elements
      const elPoints = document.getElementById('step1-points');
      const elSub1 = document.getElementById('step1-sub');
      const elCalc1 = document.getElementById('step1-calc');
      const elAns1 = document.getElementById('step1-ans');
      if (elPoints) elPoints.innerText = `Point A: (x₁, y₁) = (${handleA.x.toFixed(2)}, ${handleA.y.toFixed(2)}) • Point B: (x₂, y₂) = (${handleB.x.toFixed(2)}, ${handleB.y.toFixed(2)})`;
      if (elSub1) elSub1.innerText = `n = [${handleB.y.toFixed(2)} - (${handleA.y.toFixed(2)})] / [${handleB.x.toFixed(2)} - ${handleA.x.toFixed(2)}]`;
      if (elCalc1) elCalc1.innerText = `n = ${deltaY.toFixed(2)} / ${deltaX.toFixed(2)}`;
      if (elAns1) elAns1.innerText = `${slope.toFixed(2)}`;

      const elSub3 = document.getElementById('step3-sub');
      const elCalc3 = document.getElementById('step3-calc');
      const elAns3 = document.getElementById('step3-ans');
      if (elSub3) elSub3.innerText = `log₁₀(εSσ) = 0.18 - (${slope.toFixed(4)} × 3.30)`;
      if (elCalc3) elCalc3.innerText = `log₁₀(εSσ) = 0.18 - ${slopeProduct.toFixed(3)} = ${logVal.toFixed(3)}`;
      const epsSsigmaExp = (epsTimesS_sigma * 1e12).toFixed(2);
      if (elAns3) elAns3.innerText = `ε S σ = 10^(${logVal.toFixed(3)}) = ${epsSsigmaExp} × 10⁻¹² W`;

      const elSub4 = document.getElementById('step4-sub');
      const elAns4 = document.getElementById('step4-ans');
      if (elSub4) elSub4.innerText = `σ = (${epsSsigmaExp} × 10⁻¹²) / (1.46 × 10⁻⁴)`;
      if (elAns4) elAns4.innerText = `${sigmaExpVal} × 10⁻⁸`;

      const elSub5 = document.getElementById('step5-sub');
      const elCalc5 = document.getElementById('step5-calc');
      const elAns5 = document.getElementById('step5-ans');
      const diffSigma = Math.abs(calculatedSigma * 1e8 - 5.67).toFixed(2);
      if (elSub5) elSub5.innerText = `= [ |${sigmaExpVal} × 10⁻⁸ - 5.67 × 10⁻⁸| / (5.67 × 10⁻⁸) ] × 100%`;
      if (elCalc5) elCalc5.innerText = `= [ ${diffSigma} / 5.67 ] × 100%`;
      if (elAns5) elAns5.innerText = `${percentageError.toFixed(1)}%`;

      renderCanvas();
    }

    function copyToClipboard() {
      const deltaX = handleB.x - handleA.x;
      const deltaY = handleB.y - handleA.y;
      const slope = deltaX !== 0 ? (deltaY / deltaX) : 3.4166667;
      const slopeVal = slope.toFixed(2);
      const slopeProd = (slope * 3.30).toFixed(3);
      const logVal = (0.18 - slope * 3.30).toFixed(3);
      const epsTimesS_sigma = Math.pow(10, parseFloat(logVal));
      const epsExp = (epsTimesS_sigma * 1e12).toFixed(2);
      const calcSigma = epsTimesS_sigma / SOLVER_MEMORY.epsTimesS;
      const sigmaExpVal = (calcSigma * 1e8).toFixed(2);
      const diffSigma = Math.abs(parseFloat(sigmaExpVal) - 5.67).toFixed(2);
      const err = (Math.abs(calcSigma - SOLVER_MEMORY.exactSigma) / SOLVER_MEMORY.exactSigma * 100).toFixed(1);

      const txt = `CALCULATIONS

1. Cathode Surface Area (S):
Radius, r = 0.31 × 10⁻² m
Length, l = 3.12 × 10⁻² m
Emissivity, ε = 0.24

Surface Area, S = 2πrl
S = 2 × 3.1416 × (0.31 × 10⁻²) × (3.12 × 10⁻²)
S = 6.08 × 10⁻⁴ m²

Effective Radiation Factor:
ε · S = 0.24 × 6.08 × 10⁻⁴ = 1.46 × 10⁻⁴ m²

2. Slope of Graph II (n):
From the straight-line graph of log₁₀(P) vs log₁₀(T), taking two points on the line:
Point A: (x₁, y₁) = (${handleA.x.toFixed(2)}, ${handleA.y.toFixed(2)})
Point B: (x₂, y₂) = (${handleB.x.toFixed(2)}, ${handleB.y.toFixed(2)})

Slope, n = (y₂ - y₁) / (x₂ - x₁)
n = [${handleB.y.toFixed(2)} - (${handleA.y.toFixed(2)})] / [${handleB.x.toFixed(2)} - ${handleA.x.toFixed(2)}]
n = ${deltaY.toFixed(2)} / ${deltaX.toFixed(2)}
n = ${slopeVal}

3. Determination of Stefan-Boltzmann Constant (σ):
According to Stefan's Law:
P = ε S σ Tⁿ
Taking log on both sides:
log₁₀(P) = log₁₀(ε S σ) + n · log₁₀(T)
log₁₀(ε S σ) = log₁₀(P) - n · log₁₀(T)

Choosing reference point from graph line: (log₁₀ T = 3.30, log₁₀ P = 0.18)
log₁₀(ε S σ) = 0.18 - (${slope.toFixed(4)} × 3.30)
log₁₀(ε S σ) = 0.18 - ${slopeProd} = ${logVal}

Taking Antilog:
ε S σ = 10^(${logVal}) = ${epsExp} × 10⁻¹² W

Now,
σ = (ε S σ) / (ε S)
σ = (${epsExp} × 10⁻¹²) / (1.46 × 10⁻⁴)
σ = ${sigmaExpVal} × 10⁻⁸ W·m⁻²·K⁻⁴

4. Percentage Error:
Standard value of σ = 5.67 × 10⁻⁸ W·m⁻²·K⁻⁴

Percentage Error = (|Calculated σ - Standard σ| / Standard σ) × 100%
= (|${sigmaExpVal} × 10⁻⁸ - 5.67 × 10⁻⁸| / 5.67 × 10⁻⁸) × 100%
= (${diffSigma} / 5.67) × 100%
= ${err}%

RESULTS:
1. Slope of Graph II (n) = ${slopeVal}
2. Stefan-Boltzmann Constant (σ) = ${sigmaExpVal} × 10⁻⁸ W·m⁻²·K⁻⁴
3. Percentage Error = ${err}%`;

      navigator.clipboard.writeText(txt).then(() => {
        const btn = document.getElementById('copy-btn-text');
        btn.innerText = 'Copied Formal Lab Calculations to Clipboard!';
        setTimeout(() => { btn.innerText = 'Copy Formal Lab Notebook Calculations'; }, 2000);
      });
    }

    // Populate notebook table
    function populateNotebookTable() {
      const tbody = document.getElementById('notebook-table-body');
      tbody.innerHTML = '';
      SOLVER_MEMORY.points.forEach(pt => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-800/40 transition";
        tr.innerHTML = `
          <td class="py-2 px-2 text-slate-400 font-bold">${pt.no}</td>
          <td class="py-2 px-2">${pt.vf.toFixed(2)}</td>
          <td class="py-2 px-2">${pt.if.toFixed(3)}</td>
          <td class="py-2 px-2">${pt.rt.toFixed(3)}</td>
          <td class="py-2 px-2">${pt.ratio.toFixed(3)}</td>
          <td class="py-2 px-2 text-amber-300 font-bold">${pt.t}</td>
          <td class="py-2 px-2">${pt.p.toFixed(4)}</td>
          <td class="py-2 px-2 bg-emerald-950/20 text-emerald-300 font-semibold">${pt.logT.toFixed(2)}</td>
          <td class="py-2 px-2 bg-emerald-950/20 text-emerald-300 font-semibold">${pt.logP.toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    // Initializer
