// MAIN APPLICATION ENGINE: State, Navigation, Pan/Zoom & Event Listeners

var activeGraph = 'graph2'; // 'graph1' or 'graph2'
    var graph1SelectedObs = 'all'; // 'all', 'standards', or 1..12
    var snapToGrid = true;
    var currentTheme = 'green';
    var viewMode = '4quadrant';
    var draggingTarget = null; // 'A', 'B', or 'PAN'
    var panStartScreen = { x: 0, y: 0 };

    // Standard Calibration Points from Lab Manual (Page 19 Table I)

var handleA = { x: 2.80, y: -1.51 };
    var handleB = { x: 3.40, y: 0.54 };

    // Graph II Viewport Bounds (-4.5 to +4.5, -3.0 to +3.0)
    var viewBoundsGraph2 = {
      xMin: -4.5,
      xMax: 4.5,
      yMin: -3.0,
      yMax: 3.0,
      padL: 50,
      padB: 45,
      padT: 35,
      padR: 35
    };

    // Graph I Viewport Bounds (0 to 15.5 ratio on X, 0 to 2900 K on Y)
    var viewBoundsGraph1 = {
      xMin: -1.2,
      xMax: 15.5,
      yMin: -180,
      yMax: 2900,
      padL: 75,
      padB: 50,
      padT: 35,
      padR: 35
    };

    function getBounds() {
      return activeGraph === 'graph1' ? viewBoundsGraph1 : viewBoundsGraph2;
    }

    // Helper functions for coordinate transformations
    function getPlotDims() {
      const canvas = document.getElementById('graphCanvas');
      const rect = canvas.getBoundingClientRect();
      const b = getBounds();
      const plotW = rect.width - b.padL - b.padR;
      const plotH = rect.height - b.padT - b.padB;
      return { width: rect.width, height: rect.height, plotW, plotH, ...b };
    }

    function toScreenX(val) {
      const p = getPlotDims();
      return p.padL + ((val - p.xMin) / (p.xMax - p.xMin)) * p.plotW;
    }
    function toScreenY(val) {
      const p = getPlotDims();
      return p.padT + p.plotH - ((val - p.yMin) / (p.yMax - p.yMin)) * p.plotH;
    }
    function fromScreenX(px) {
      const p = getPlotDims();
      return p.xMin + ((px - p.padL) / p.plotW) * (p.xMax - p.xMin);
    }
    function fromScreenY(py) {
      const p = getPlotDims();
      return p.yMin + ((p.padT + p.plotH - py) / p.plotH) * (p.yMax - p.yMin);
    }

    // Zero-Drift Mathematically Invariant Zoom Engine (Figma/CAD Invariant)
    function zoomAt(px, py, factor) {
      const p = getPlotDims();
      const b = getBounds();
      const gx = fromScreenX(px);
      const gy = fromScreenY(py);

      const ratioX = (px - p.padL) / p.plotW;
      const ratioY = (p.padT + p.plotH - py) / p.plotH;

      const curSpanX = b.xMax - b.xMin;
      const curSpanY = b.yMax - b.yMin;

      let newSpanX = curSpanX * factor;
      let newSpanY = curSpanY * factor;

      const minSpanX = (activeGraph === 'graph1') ? 0.3 : 0.03;
      const maxSpanX = (activeGraph === 'graph1') ? 50.0 : 40.0;

      if (newSpanX < minSpanX) { newSpanX = minSpanX; newSpanY = minSpanX * (curSpanY / curSpanX); }
      if (newSpanX > maxSpanX) { newSpanX = maxSpanX; newSpanY = maxSpanX * (curSpanY / curSpanX); }

      b.xMin = gx - ratioX * newSpanX;
      b.xMax = b.xMin + newSpanX;
      b.yMin = gy - ratioY * newSpanY;
      b.yMax = b.yMin + newSpanY;

      const defaultSpan = (activeGraph === 'graph1') ? (15.5 - (-1.2)) : 9.0;
      const curZoomPct = Math.round((defaultSpan / newSpanX) * 100);
      document.getElementById('zoom-level-text').innerText = `${curZoomPct}%`;

      renderCanvas();
    }

    function zoomIn() {
      const p = getPlotDims();
      zoomAt(p.padL + p.plotW / 2, p.padT + p.plotH / 2, 0.80);
    }
    function zoomOut() {
      const p = getPlotDims();
      zoomAt(p.padL + p.plotW / 2, p.padT + p.plotH / 2, 1.25);
    }

    // 1-Click View Presets (Graph II)

function resetZoom() {
      if (activeGraph === 'graph1') {
        fitGraph1Full();
      } else {
        showAllQuadrants();
      }
    }

    // Graph Switcher Tabs (Graph I vs Graph II)
    function switchGraph(g) {
      activeGraph = g;
      const btnG1 = document.getElementById('tab-btn-graph1');
      const btnG2 = document.getElementById('tab-btn-graph2');
      const badge = document.getElementById('active-graph-badge');
      const title = document.getElementById('graph-title-text');
      const sub = document.getElementById('graph-scale-subtitle');
      const g1Presets = document.getElementById('graph1-presets');
      const g2Presets = document.getElementById('graph2-presets');
      const g1Bar = document.getElementById('graph1-bottom-bar');
      const g2Bar = document.getElementById('graph2-bottom-bar');
      const hint = document.getElementById('hint-text');

      if (g === 'graph1') {
        btnG1.className = "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400/30";
        btnG2.className = "px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700";
        badge.innerText = "Graph I Active";
        title.innerHTML = `<i data-lucide="spline" class="w-4 h-4 text-emerald-400"></i><span>Graph I: R<sub>T</sub>/R<sub>300</sub> vs T (Temp Calibration Curve)</span>`;
        sub.innerText = "Scale: 1 cm = 1.0 unit on X-axis (RT / R300) • 1 cm = 200 K on Y-axis (Filament Temp T)";
        g1Presets.classList.remove('hidden');
        g1Presets.classList.add('flex');
        g2Presets.classList.remove('flex');
        g2Presets.classList.add('hidden');
        g1Bar.classList.remove('hidden');
        g2Bar.classList.add('hidden');
        hint.innerHTML = "💡 <b>Controls:</b> Scroll to Zoom &bull; Drag to Pan &bull; Click any Reading below to trace projection";

        const defaultSpan = 15.5 - (-1.2);
        const curSpan = viewBoundsGraph1.xMax - viewBoundsGraph1.xMin;
        const curZoomPct = Math.round((defaultSpan / curSpan) * 100);
        document.getElementById('zoom-level-text').innerText = `${curZoomPct}%`;
      } else {
        btnG2.className = "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400/30";
        btnG1.className = "px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700";
        badge.innerText = "Graph II Active";
        title.innerHTML = `<i data-lucide="line-chart" class="w-4 h-4 text-emerald-400"></i><span>Graph II: Log P vs Log T (Drag Points A &amp; B)</span>`;
        sub.innerText = "Scale: 1 cm = 0.1 on X-axis (±Log T) • 1 cm = 0.2 on Y-axis (±Log P)";
        g2Presets.classList.remove('hidden');
        g2Presets.classList.add('flex');
        g1Presets.classList.remove('flex');
        g1Presets.classList.add('hidden');
        g2Bar.classList.remove('hidden');
        g1Bar.classList.add('hidden');
        hint.innerHTML = "💡 <b>Controls:</b> Scroll to Zoom &bull; Drag to Pan &bull; Drag Handles A &amp; B to change slope";

        const defaultSpan = 9.0;
        const curSpan = viewBoundsGraph2.xMax - viewBoundsGraph2.xMin;
        const curZoomPct = Math.round((defaultSpan / curSpan) * 100);
        document.getElementById('zoom-level-text').innerText = `${curZoomPct}%`;
      }

      if (window.lucide) lucide.createIcons();
      renderCanvas();
    }

    // Graph 1 Observation Selection & Inspection

function toggleFullscreenGraph() {
      const cont = document.getElementById('canvas-container');
      if (!document.fullscreenElement) {
        cont.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }

    // Top-Level Canvas Render Dispatcher
    function renderCanvas() {
      if (activeGraph === 'graph1') {
        renderGraph1();
      } else {
        renderGraph2();
      }
    }

    // Graph 1: R_T/R_300 vs T (Kelvin) Calibration Curve Renderer

function toggleSnap() {
      snapToGrid = !snapToGrid;
      document.getElementById('snap-status').innerText = snapToGrid ? 'ON' : 'OFF';
      document.getElementById('snap-toggle-btn').className = snapToGrid 
        ? "px-2.5 py-1 text-xs rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition flex items-center gap-1 font-medium"
        : "px-2.5 py-1 text-xs rounded-lg bg-slate-800 text-slate-400 border border-slate-700 transition flex items-center gap-1 font-medium";
    }

    function toggleTheme() {
      if (currentTheme === 'green') {
        currentTheme = 'blue';
        document.getElementById('theme-text').innerText = 'Lotus Blue';
      } else if (currentTheme === 'blue') {
        currentTheme = 'dark';
        document.getElementById('theme-text').innerText = 'Dark CAD';
      } else {
        currentTheme = 'green';
        document.getElementById('theme-text').innerText = 'Camlin Green';
      }
      renderCanvas();
    }

    // Canvas Reference & Interaction Handlers (Mouse & Touch Dragging, Pan, and Wheel Zoom)
    var canvas = document.getElementById('graphCanvas');

    function getPointerPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function onPointerDown(e) {
      const pos = getPointerPos(e);

      // Graph 1: Click near observation point to select it
      if (activeGraph === 'graph1') {
        let clickedPt = null;
        SOLVER_MEMORY.points.forEach(pt => {
          const sx = toScreenX(pt.ratio);
          const sy = toScreenY(pt.t);
          if (Math.hypot(pos.x - sx, pos.y - sy) < 20) {
            clickedPt = pt;
          }
        });
        if (clickedPt) {
          selectGraph1Obs(clickedPt.no);
          return;
        }
        draggingTarget = 'PAN';
        panStartScreen = { x: pos.x, y: pos.y };
        canvas.classList.add('cursor-grabbing');
        return;
      }

      // Graph 2: Check Handles A and B
      const sAx = toScreenX(handleA.x);
      const sAy = toScreenY(handleA.y);
      const sBx = toScreenX(handleB.x);
      const sBy = toScreenY(handleB.y);

      const distA = Math.hypot(pos.x - sAx, pos.y - sAy);
      const distB = Math.hypot(pos.x - sBx, pos.y - sBy);

      if (distA < 22) {
        draggingTarget = 'A';
      } else if (distB < 22) {
        draggingTarget = 'B';
      } else {
        // Drag canvas background to pan
        draggingTarget = 'PAN';
        panStartScreen = { x: pos.x, y: pos.y };
        canvas.classList.add('cursor-grabbing');
      }
    }

    function onPointerMove(e) {
      if (!draggingTarget) return;
      const pos = getPointerPos(e);

      if (draggingTarget === 'PAN') {
        const dx = pos.x - panStartScreen.x;
        const dy = pos.y - panStartScreen.y;
        panStartScreen = { x: pos.x, y: pos.y };

        const p = getPlotDims();
        const b = getBounds();
        const dGraphX = (dx / p.plotW) * (b.xMax - b.xMin);
        const dGraphY = (dy / p.plotH) * (b.yMax - b.yMin);

        b.xMin -= dGraphX;
        b.xMax -= dGraphX;
        b.yMin += dGraphY;
        b.yMax += dGraphY;
        renderCanvas();
        return;
      }

      let gx = fromScreenX(pos.x);
      let gy = fromScreenY(pos.y);
      const b = getBounds();

      // Clamp within active bounds
      gx = Math.max(b.xMin + 0.05, Math.min(b.xMax - 0.05, gx));
      gy = Math.max(b.yMin + 0.05, Math.min(b.yMax - 0.05, gy));

      // Snap to 0.01 grid if enabled
      if (snapToGrid) {
        gx = Math.round(gx * 100) / 100;
        gy = Math.round(gy * 100) / 100;
      }

      if (draggingTarget === 'A') {
        if (gx < handleB.x - 0.05) {
          handleA.x = gx;
          handleA.y = gy;
        }
      } else if (draggingTarget === 'B') {
        if (gx > handleA.x + 0.05) {
          handleB.x = gx;
          handleB.y = gy;
        }
      }

      // Update Slider Value based on new slope
      const liveSlope = (handleB.y - handleA.y) / (handleB.x - handleA.x);
      document.getElementById('slope-slider').value = liveSlope.toFixed(2);
      document.getElementById('slider-val-badge').innerText = `n = ${liveSlope.toFixed(2)}`;

      renderCanvas();
    }

    function onPointerUp() {
      if (draggingTarget) {
        const wasAorB = draggingTarget === 'A' || draggingTarget === 'B';
        draggingTarget = null;
        canvas.classList.remove('cursor-grabbing');
        if (wasAorB) executeCalculation(); // Auto recalculate on slope handle release
      }
    }

    // Mathematically Invariant Trackpad & Mouse Wheel Zoom (Figma/CAD Precision)
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const pos = getPointerPos(e);
      let dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 20; // Normalize line scrolling
      
      // Smooth exponential scaling factor for trackpads & mice
      const factor = Math.exp(dy * 0.0018);
      zoomAt(pos.x, pos.y, factor);
    }, { passive: false });

    canvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); onPointerDown(e); }, { passive: false });
    window.addEventListener('touchmove', (e) => { onPointerMove(e); });
    window.addEventListener('touchend', onPointerUp);

    // Slider & Preset Controls

window.addEventListener('load', () => {
      lucide.createIcons();
      populateNotebookTable();
      populateGraph1Chips();
      renderCanvas();
      executeCalculation();
    });

    window.addEventListener('resize', () => {
      renderCanvas();
    });
