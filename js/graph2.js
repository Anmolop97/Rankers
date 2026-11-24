// GRAPH II ENGINE: Log P vs Log T Dynamic Slope & Data Visualization

function showAllQuadrants() {
      viewBoundsGraph2.xMin = -4.5;
      viewBoundsGraph2.xMax = 4.5;
      viewBoundsGraph2.yMin = -3.0;
      viewBoundsGraph2.yMax = 3.0;
      document.getElementById('zoom-level-text').innerText = '100%';
      renderCanvas();
    }

    function fitLabData() {
      // Focus on 12 experimental points (2.77 to 3.40) & slope triangle
      viewBoundsGraph2.xMin = 2.45;
      viewBoundsGraph2.xMax = 3.65;
      viewBoundsGraph2.yMin = -1.85;
      viewBoundsGraph2.yMax = 0.85;
      const defaultSpan = 9.0;
      const curZoomPct = Math.round((defaultSpan / (viewBoundsGraph2.xMax - viewBoundsGraph2.xMin)) * 100);
      document.getElementById('zoom-level-text').innerText = `${curZoomPct}%`;
      renderCanvas();
    }

    function deepInspect() {
      // 10x microscopic deep inspect on Point 7 & upper slope
      viewBoundsGraph2.xMin = 3.12;
      viewBoundsGraph2.xMax = 3.48;
      viewBoundsGraph2.yMin = 0.05;
      viewBoundsGraph2.yMax = 0.45;
      const defaultSpan = 9.0;
      const curZoomPct = Math.round((defaultSpan / (viewBoundsGraph2.xMax - viewBoundsGraph2.xMin)) * 100);
      document.getElementById('zoom-level-text').innerText = `${curZoomPct}%`;
      renderCanvas();
    }

    // 1-Click View Presets (Graph I)

function onSliderChange(val) {
      const targetSlope = parseFloat(val);
      document.getElementById('slider-val-badge').innerText = `n = ${targetSlope.toFixed(2)}`;
      
      // Pivot around Point 7 (3.30, 0.18)
      const refX = 3.30, refY = 0.18;
      handleA.x = 2.80;
      handleA.y = parseFloat((refY - targetSlope * (refX - handleA.x)).toFixed(2));
      handleB.x = 3.40;
      handleB.y = parseFloat((refY + targetSlope * (handleB.x - refX)).toFixed(2));

      renderCanvas();
    }

    function applyPreset(n) {
      if (Math.abs(n - 3.42) < 0.01) {
        handleA.x = 2.80;
        handleA.y = -1.51;
        handleB.x = 3.40;
        handleB.y = 0.54;
        const slider = document.getElementById('slope-slider');
        if (slider) slider.value = '3.42';
        const badge = document.getElementById('slider-val-badge');
        if (badge) badge.innerText = 'n = 3.42';
        renderCanvas();
        executeCalculation();
        return;
      }
      const slider = document.getElementById('slope-slider');
      if (slider) slider.value = n;
      onSliderChange(n);
      executeCalculation();
    }

    function resetToOptimalSlope() {
      applyPreset(3.42);
    }

function renderGraph2() {
      const canvas = document.getElementById('graphCanvas');
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.max(window.devicePixelRatio || 1, 2); // 2x supersampling for razor sharp lines

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;
      const p = getPlotDims();

      // Dynamic Grid Calculation
      const spanX = p.xMax - p.xMin;
      const spanY = p.yMax - p.yMin;
      const zoomLevel = 9.0 / (spanX || 1);
      const curZoomPct = Math.round((9.0 / (spanX || 1)) * 100);

      // Determine 1cm Major Step
      let majorStepX = 0.5;
      if (spanX <= 1.5) { majorStepX = 0.1; }
      else if (spanX <= 3.5) { majorStepX = 0.2; }
      else if (spanX <= 7.0) { majorStepX = 0.5; }
      else { majorStepX = 1.0; }

      let majorStepY = 0.5;
      if (spanY <= 1.5) { majorStepY = 0.1; }
      else if (spanY <= 3.5) { majorStepY = 0.2; }
      else if (spanY <= 7.0) { majorStepY = 0.5; }
      else { majorStepY = 1.0; }

      // Authentic 3-Tier Millimeter Grid Hierarchy (10 divisions per 1cm, 5th line is 5mm mid-grid)
      const midStepX = majorStepX / 2;
      const microStepX = majorStepX / 10;

      const midStepY = majorStepY / 2;
      const microStepY = majorStepY / 10;

      const startXMicro = Math.floor(p.xMin / microStepX) * microStepX;
      const startYMicro = Math.floor(p.yMin / microStepY) * microStepY;
      const startXMid = Math.floor(p.xMin / midStepX) * midStepX;
      const startYMid = Math.floor(p.yMin / midStepY) * midStepY;
      const startXMajor = Math.floor(p.xMin / majorStepX) * majorStepX;
      const startYMajor = Math.floor(p.yMin / majorStepY) * majorStepY;

      // Authentic Paper Theme Definitions
      let paperBg, marginBg, frameStroke, microGridStroke, midGridStroke, majorGridStroke, axisStroke, textStroke;
      if (currentTheme === 'green') {
        // Classic Camlin / Classmate Millimeter Green Graph Paper
        paperBg = '#fbfdf9';
        marginBg = '#f2f6ed';
        frameStroke = '#166534';
        microGridStroke = 'rgba(34, 139, 34, 0.16)'; // 1mm hairline
        midGridStroke = 'rgba(21, 128, 61, 0.42)';   // 5mm mid-line
        majorGridStroke = 'rgba(20, 83, 45, 0.85)';  // 10mm centimeter line
        axisStroke = '#0f172a';
        textStroke = '#14532d';
      } else if (currentTheme === 'blue') {
        // Lotus Millimeter Blue Engineering Paper
        paperBg = '#fcfdff';
        marginBg = '#edf4fc';
        frameStroke = '#0369a1';
        microGridStroke = 'rgba(2, 132, 199, 0.16)';
        midGridStroke = 'rgba(3, 105, 161, 0.42)';
        majorGridStroke = 'rgba(7, 89, 133, 0.85)';
        axisStroke = '#0f172a';
        textStroke = '#0369a1';
      } else {
        // Dark CAD Oscilloscope Mode
        paperBg = '#0b0f19';
        marginBg = '#050811';
        frameStroke = '#334155';
        microGridStroke = 'rgba(51, 65, 85, 0.35)';
        midGridStroke = 'rgba(71, 85, 105, 0.60)';
        majorGridStroke = 'rgba(148, 163, 184, 0.75)';
        axisStroke = '#cbd5e1';
        textStroke = '#94a3b8';
      }

      // 1. Draw Paper Sheet Background & Margins
      ctx.fillStyle = marginBg;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = paperBg;
      ctx.fillRect(p.padL, p.padT, p.plotW, p.plotH);

      // Clip grid drawing strictly to plot area
      ctx.save();
      ctx.beginPath();
      ctx.rect(p.padL, p.padT, p.plotW, p.plotH);
      ctx.clip();

      // 2. PASS 1: 1mm Micro-Grid (Hairline)
      ctx.strokeStyle = microGridStroke;
      ctx.lineWidth = 0.45;
      ctx.beginPath();
      for (let x = startXMicro; x <= p.xMax + 0.0001; x += microStepX) {
        const sx = toScreenX(x);
        ctx.moveTo(sx, p.padT); ctx.lineTo(sx, h - p.padB);
      }
      for (let y = startYMicro; y <= p.yMax + 0.0001; y += microStepY) {
        const sy = toScreenY(y);
        ctx.moveTo(p.padL, sy); ctx.lineTo(w - p.padR, sy);
      }
      ctx.stroke();

      // 3. PASS 2: 5mm Mid-Grid (Half-Centimeter lines)
      ctx.strokeStyle = midGridStroke;
      ctx.lineWidth = 0.85;
      ctx.beginPath();
      for (let x = startXMid; x <= p.xMax + 0.0001; x += midStepX) {
        const sx = toScreenX(x);
        ctx.moveTo(sx, p.padT); ctx.lineTo(sx, h - p.padB);
      }
      for (let y = startYMid; y <= p.yMax + 0.0001; y += midStepY) {
        const sy = toScreenY(y);
        ctx.moveTo(p.padL, sy); ctx.lineTo(w - p.padR, sy);
      }
      ctx.stroke();

      // 4. PASS 3: 10mm / 1cm Major Grid (Centimeter Blocks)
      ctx.strokeStyle = majorGridStroke;
      ctx.lineWidth = 1.45;
      ctx.beginPath();
      for (let x = startXMajor; x <= p.xMax + 0.0001; x += majorStepX) {
        const sx = toScreenX(x);
        ctx.moveTo(sx, p.padT); ctx.lineTo(sx, h - p.padB);
      }
      for (let y = startYMajor; y <= p.yMax + 0.0001; y += majorStepY) {
        const sy = toScreenY(y);
        ctx.moveTo(p.padL, sy); ctx.lineTo(w - p.padR, sy);
      }
      ctx.stroke();

      ctx.restore(); // Restore clip

      // 5. Authentic Graph Sheet Double Border Frame
      ctx.strokeStyle = frameStroke;
      ctx.lineWidth = 2.2;
      ctx.strokeRect(p.padL, p.padT, p.plotW, p.plotH);

      ctx.lineWidth = 0.7;
      ctx.strokeRect(p.padL + 3.5, p.padT + 3.5, p.plotW - 7, p.plotH - 7);

      // Printed Header Stamp on Top Margin
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillStyle = textStroke;
      ctx.textAlign = 'left';
      ctx.fillText('PHYSICS PRACTICAL GRAPH SHEET • EXP NO. 05 (STEFAN-BOLTZMANN CONSTANT)', p.padL + 4, p.padT - 13);
      ctx.textAlign = 'right';
      ctx.fillText(`1 cm = ${majorStepX.toFixed(2)} [X-axis]  •  1 cm = ${majorStepY.toFixed(2)} [Y-axis]`, w - p.padR - 4, p.padT - 13);

      // 4-Quadrant Watermark Labels
      if (viewMode === '4quadrant') {
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillStyle = currentTheme === 'green' ? 'rgba(34, 139, 34, 0.35)' : (currentTheme === 'blue' ? 'rgba(3, 105, 161, 0.35)' : 'rgba(148, 163, 184, 0.25)');
        ctx.textAlign = 'right';
        ctx.fillText('QUADRANT I (+X, +Y)', w - p.padR - 12, p.padT + 22);
        ctx.textAlign = 'left';
        ctx.fillText('QUADRANT II (-X, +Y)', p.padL + 12, p.padT + 22);
        ctx.fillText('QUADRANT III (-X, -Y)', p.padL + 12, h - p.padB - 14);
        ctx.textAlign = 'right';
        ctx.fillText('QUADRANT IV (+X, -Y)', w - p.padR - 12, h - p.padB - 14);
      }

      // Draw Main Axes
      ctx.strokeStyle = axisStroke;
      ctx.lineWidth = 2.4;
      ctx.beginPath();

      const originX = toScreenX(0);
      const originY = toScreenY(0);

      // Horizontal Axis (X-axis at y = 0 if visible, otherwise at bottom)
      const xAxisY = (originY >= p.padT && originY <= h - p.padB) ? originY : (h - p.padB);
      ctx.moveTo(p.padL, xAxisY);
      ctx.lineTo(w - p.padR, xAxisY);

      // Vertical Axis (Y-axis at x = 0 if visible, otherwise at left)
      const yAxisX = (originX >= p.padL && originX <= w - p.padR) ? originX : p.padL;
      ctx.moveTo(yAxisX, p.padT);
      ctx.lineTo(yAxisX, h - p.padB);
      ctx.stroke();

      // Axis Arrowheads
      ctx.fillStyle = axisStroke;
      // +X arrow
      ctx.beginPath();
      ctx.moveTo(w - p.padR, xAxisY);
      ctx.lineTo(w - p.padR - 10, xAxisY - 4.5);
      ctx.lineTo(w - p.padR - 10, xAxisY + 4.5);
      ctx.fill();
      // +Y arrow
      ctx.beginPath();
      ctx.moveTo(yAxisX, p.padT);
      ctx.lineTo(yAxisX - 4.5, p.padT + 10);
      ctx.lineTo(yAxisX + 4.5, p.padT + 10);
      ctx.fill();

      // Origin label if in view
      if (originX >= p.padL && originX <= w - p.padR && originY >= p.padT && originY <= h - p.padB) {
        ctx.font = 'bold 11px "Fira Code", monospace';
        ctx.textAlign = 'right';
        ctx.fillText('O (0,0)', originX - 6, originY + 16);
      }

      // Ticks & Labels (High-contrast, Large & Legible)
      ctx.font = 'bold 13px "Fira Code", monospace';
      ctx.fillStyle = currentTheme === 'green' ? '#14532d' : '#94a3b8';
      ctx.textAlign = 'center';

      // X Numbers
      for (let x = startXMajor; x <= p.xMax; x += majorStepX) {
        if (Math.abs(x) < 0.0001 && Math.abs(xAxisY - originY) < 5) continue;
        const sx = toScreenX(x);
        if (sx < p.padL || sx > w - p.padR) continue;
        ctx.beginPath(); ctx.moveTo(sx, xAxisY - 4); ctx.lineTo(sx, xAxisY + 4); ctx.stroke();
        ctx.fillText(Number(x.toFixed(2)).toString(), sx, xAxisY + 19);
      }

      // Y Numbers
      ctx.textAlign = 'right';
      for (let y = startYMajor; y <= p.yMax; y += majorStepY) {
        if (Math.abs(y) < 0.0001 && Math.abs(yAxisX - originX) < 5) continue;
        const sy = toScreenY(y);
        if (sy < p.padT || sy > h - p.padB) continue;
        ctx.beginPath(); ctx.moveTo(yAxisX - 4, sy); ctx.lineTo(yAxisX + 4, sy); ctx.stroke();
        ctx.fillText(Number(y.toFixed(2)).toString(), yAxisX - 8, sy + 5);
      }

      // Axis Labels (Large & Bold)
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('+X: Log₁₀(T)  [Filament Temp (K)]  →', w - p.padR - 120, xAxisY - 12);

      ctx.save();
      ctx.translate(yAxisX - 16, p.padT + 70);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('+Y: Log₁₀(P)  [Radiated Power (W)]  →', 0, 0);
      ctx.restore();

      // Best-Fit Straight Line extending through handles
      const slope = (handleB.y - handleA.y) / (handleB.x - handleA.x);
      const extX1 = p.xMin - 2.0;
      const extY1 = handleA.y - slope * (handleA.x - extX1);
      const extX2 = p.xMax + 2.0;
      const extY2 = handleA.y + slope * (extX2 - handleA.x);

      ctx.save();
      // Clip to plot area
      ctx.beginPath();
      ctx.rect(p.padL, p.padT, p.plotW, p.plotH);
      ctx.clip();

      ctx.strokeStyle = currentTheme === 'green' ? '#2563eb' : '#38bdf8';
      ctx.lineWidth = 3.0;
      ctx.beginPath();
      ctx.moveTo(toScreenX(extX1), toScreenY(extY1));
      ctx.lineTo(toScreenX(extX2), toScreenY(extY2));
      ctx.stroke();

      // Slope Triangle
      const sAx = toScreenX(handleA.x);
      const sAy = toScreenY(handleA.y);
      const sBx = toScreenX(handleB.x);
      const sBy = toScreenY(handleB.y);

      ctx.fillStyle = currentTheme === 'green' ? 'rgba(16, 185, 129, 0.20)' : 'rgba(16, 185, 129, 0.28)';
      ctx.beginPath();
      ctx.moveTo(sAx, sAy);
      ctx.lineTo(sBx, sAy);
      ctx.lineTo(sBx, sBy);
      ctx.closePath();
      ctx.fill();

      // Triangle Borders
      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(sAx, sAy);
      ctx.lineTo(sBx, sAy);
      ctx.lineTo(sBx, sBy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Right-Angle Drafting Symbol at Triangle Corner (sBx, sAy)
      const sqSize = 12;
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(sBx - sqSize, sAy);
      ctx.lineTo(sBx - sqSize, sAy + (sBy < sAy ? -sqSize : sqSize));
      ctx.lineTo(sBx, sAy + (sBy < sAy ? -sqSize : sqSize));
      ctx.stroke();

      // Triangle Annotations (Adaptive Level-of-Detail: >= 160% Zoom vs < 160% Zoom)
      const deltaXVal = (handleB.x - handleA.x).toFixed(2);
      const deltaYVal = (handleB.y - handleA.y).toFixed(2);
      const slopeVal = (deltaXVal !== 0 ? ((handleB.y - handleA.y) / (handleB.x - handleA.x)).toFixed(2) : '3.42');
      const isDeepZoom = (curZoomPct >= 160);

      if (isDeepZoom) {
        // Base Tag: Δx = x2 - x1 (Only in Deep Zoom >= 160%)
        const midX = (sAx + sBx) / 2;
        const baseTagY = sAy + 26;
        ctx.fillStyle = currentTheme === 'green' ? 'rgba(255, 255, 255, 0.98)' : 'rgba(15, 23, 42, 0.98)';
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 1.6;
        const baseTxt = `Δx = x₂ - x₁ = ${handleB.x.toFixed(2)} - ${handleA.x.toFixed(2)} = ${deltaXVal}`;
        ctx.font = 'bold 13px "Fira Code", monospace';
        const baseW = ctx.measureText(baseTxt).width + 18;
        ctx.fillRect(midX - baseW / 2, baseTagY - 14, baseW, 25);
        ctx.strokeRect(midX - baseW / 2, baseTagY - 14, baseW, 25);
        ctx.fillStyle = '#065f46';
        ctx.textAlign = 'center';
        ctx.fillText(baseTxt, midX, baseTagY + 4);

        // Height Tag: Δy = y2 - y1 (Only in Deep Zoom >= 160%)
        const midY = (sAy + sBy) / 2;
        const heightTagX = sBx + 18;
        const heightTxt = `Δy = y₂ - y₁ = ${handleB.y.toFixed(2)} - (${handleA.y.toFixed(2)}) = ${deltaYVal}`;
        ctx.font = 'bold 13px "Fira Code", monospace';
        const heightW = ctx.measureText(heightTxt).width + 18;
        ctx.fillStyle = currentTheme === 'green' ? 'rgba(255, 255, 255, 0.98)' : 'rgba(15, 23, 42, 0.98)';
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 1.6;
        ctx.fillRect(heightTagX, midY - 13, heightW, 25);
        ctx.strokeRect(heightTagX, midY - 13, heightW, 25);
        ctx.fillStyle = '#065f46';
        ctx.textAlign = 'left';
        ctx.fillText(heightTxt, heightTagX + 9, midY + 5);

        // Slope Hypotenuse Tag (Full Large Tag in Deep Zoom)
        const hypX = (sAx + sBx) / 2 - 35;
        const hypY = (sAy + sBy) / 2 - 20;
        const hypTxt = `Slope (n) = Δy/Δx = ${slopeVal}`;
        ctx.font = 'bold 13.5px "Fira Code", monospace';
        const hypW = ctx.measureText(hypTxt).width + 18;
        ctx.fillStyle = '#059669';
        ctx.fillRect(hypX - hypW / 2, hypY - 13, hypW, 25);
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(hypTxt, hypX, hypY + 5);
      } else {
        // Zoom-out Mode (< 160%): Clean, Compact Slope Tag only
        const hypX = (sAx + sBx) / 2;
        const hypY = (sAy + sBy) / 2 - 12;
        const hypTxt = `n = ${slopeVal}`;
        ctx.font = 'bold 11px "Fira Code", monospace';
        const hypW = ctx.measureText(hypTxt).width + 12;
        ctx.fillStyle = '#059669';
        ctx.fillRect(hypX - hypW / 2, hypY - 9, hypW, 18);
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(hypTxt, hypX, hypY + 4);
      }

      // Plot Experimental 12 Data Points (Adaptive Level-of-Detail: >= 160% Zoom vs < 160% Zoom)
      SOLVER_MEMORY.points.forEach((pt, idx) => {
        const sx = toScreenX(pt.logT);
        const sy = toScreenY(pt.logP);

        if (isDeepZoom) {
          // DEEP ZOOM (>= 160%): Large, Bold, Staggered Badges
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 2.4;
          ctx.beginPath(); ctx.arc(sx, sy, 8, 0, Math.PI * 2); ctx.stroke();
          
          ctx.fillStyle = '#dc2626';
          ctx.beginPath(); ctx.arc(sx, sy, 4, 0, Math.PI * 2); ctx.fill();

          const ptLabel = `P${pt.no}(${pt.logT.toFixed(2)}, ${pt.logP.toFixed(2)})`;
          ctx.font = 'bold 12.5px "Fira Code", monospace';
          const ptLabelW = ctx.measureText(ptLabel).width + 12;
          const ptLabelH = 22;

          const isRight = (idx % 2 === 0);
          const ptLabelX = isRight ? (sx + 14) : (sx - ptLabelW - 14);
          const ptLabelY = sy - 2;

          ctx.strokeStyle = 'rgba(220, 38, 38, 0.5)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(isRight ? (sx + 8) : (sx - 8), sy);
          ctx.lineTo(isRight ? ptLabelX : (ptLabelX + ptLabelW), ptLabelY);
          ctx.stroke();

          ctx.fillStyle = currentTheme === 'green' ? 'rgba(255, 255, 255, 0.98)' : 'rgba(15, 23, 42, 0.98)';
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 1.2;
          ctx.fillRect(ptLabelX, ptLabelY - ptLabelH / 2, ptLabelW, ptLabelH);
          ctx.strokeRect(ptLabelX, ptLabelY - ptLabelH / 2, ptLabelW, ptLabelH);

          ctx.fillStyle = '#991b1b';
          ctx.textAlign = 'left';
          ctx.fillText(ptLabel, ptLabelX + 6, ptLabelY + 4.5);
        } else {
          // ZOOM-OUT (< 160%): Crisp, Clean Physics Dot ⊙ with Small Tag (No Giant Clutter!)
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.arc(sx, sy, 5, 0, Math.PI * 2); ctx.stroke();

          ctx.fillStyle = '#dc2626';
          ctx.beginPath(); ctx.arc(sx, sy, 2.2, 0, Math.PI * 2); ctx.fill();

          ctx.font = 'bold 10px Inter, sans-serif';
          ctx.fillStyle = '#b91c1c';
          ctx.textAlign = 'left';
          ctx.fillText(`P${pt.no}`, sx + 7, sy - 3);
        }
      });

      // Draw Interactive Handles A (x1, y1) & B (x2, y2)
      const handleItems = [
        { pt: handleA, name: 'Point A (x₁, y₁)', coordTxt: `x₁ = ${handleA.x.toFixed(2)},  y₁ = ${handleA.y.toFixed(2)}`, miniTxt: `A(${handleA.x.toFixed(2)}, ${handleA.y.toFixed(2)})`, sx: sAx, sy: sAy, isTop: false },
        { pt: handleB, name: 'Point B (x₂, y₂)', coordTxt: `x₂ = ${handleB.x.toFixed(2)},  y₂ = ${handleB.y.toFixed(2)}`, miniTxt: `B(${handleB.x.toFixed(2)}, ${handleB.y.toFixed(2)})`, sx: sBx, sy: sBy, isTop: true }
      ];

      handleItems.forEach(hItem => {
        if (isDeepZoom) {
          // DEEP ZOOM (>= 160%): Full 230x44px Large Pill Cards
          ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
          ctx.beginPath(); ctx.arc(hItem.sx, hItem.sy, 18, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#059669';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.8;
          ctx.beginPath(); ctx.arc(hItem.sx, hItem.sy, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

          const pillW = 230;
          const pillH = 44;
          const pillX = hItem.sx - pillW / 2;
          const pillY = hItem.sy - 52;

          ctx.fillStyle = currentTheme === 'green' ? 'rgba(255, 255, 255, 0.98)' : 'rgba(15, 23, 42, 0.98)';
          ctx.strokeStyle = '#059669';
          ctx.lineWidth = 2.0;
          ctx.fillRect(pillX, pillY, pillW, pillH);
          ctx.strokeRect(pillX, pillY, pillW, pillH);

          ctx.font = 'bold 13.5px "Fira Code", monospace';
          ctx.fillStyle = '#047857';
          ctx.textAlign = 'center';
          ctx.fillText(hItem.name, hItem.sx, pillY + 17);

          ctx.font = 'bold 13px "Fira Code", monospace';
          ctx.fillStyle = '#065f46';
          ctx.fillText(hItem.coordTxt, hItem.sx, pillY + 34);
        } else {
          // ZOOM-OUT (< 160%): Compact, Clean Handle without huge box!
          ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
          ctx.beginPath(); ctx.arc(hItem.sx, hItem.sy, 12, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#059669';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.2;
          ctx.beginPath(); ctx.arc(hItem.sx, hItem.sy, 6.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

          const miniW = 95;
          const miniH = 20;
          const miniX = hItem.sx - miniW / 2;
          const miniY = hItem.sy - 26;

          ctx.fillStyle = currentTheme === 'green' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.95)';
          ctx.strokeStyle = '#059669';
          ctx.lineWidth = 1.4;
          ctx.fillRect(miniX, miniY, miniW, miniH);
          ctx.strokeRect(miniX, miniY, miniW, miniH);

          ctx.font = 'bold 10.5px "Fira Code", monospace';
          ctx.fillStyle = '#047857';
          ctx.textAlign = 'center';
          ctx.fillText(hItem.miniTxt, hItem.sx, miniY + 14);
        }
      });

      ctx.restore(); // Restore clip

      // Top-Right Scale Box (Large & Prominent)
      ctx.fillStyle = currentTheme === 'green' ? 'rgba(255, 255, 255, 0.98)' : 'rgba(15, 23, 42, 0.98)';
      ctx.strokeStyle = currentTheme === 'green' ? '#14532d' : '#334155';
      ctx.lineWidth = 1.8;
      const boxW = 240, boxH = 98, boxX = w - p.padR - boxW - 5, boxY = p.padT + 5;
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeRect(boxX, boxY, boxW, boxH);
      
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillStyle = currentTheme === 'green' ? '#14532d' : '#e2e8f0';
      ctx.textAlign = 'left';
      ctx.fillText('LAB SCALE (GRAPH II):', boxX + 12, boxY + 18);
      
      ctx.font = 'bold 12px "Fira Code", monospace';
      ctx.fillStyle = currentTheme === 'green' ? '#166534' : '#94a3b8';
      ctx.fillText(`X-axis: 1 cm = ${majorStepX.toFixed(2)} unit`, boxX + 12, boxY + 36);
      ctx.fillText(`Y-axis: 1 cm = ${majorStepY.toFixed(2)} unit`, boxX + 12, boxY + 52);
      
      // Divider
      ctx.strokeStyle = currentTheme === 'green' ? 'rgba(20, 83, 45, 0.25)' : 'rgba(148, 163, 184, 0.25)';
      ctx.beginPath(); ctx.moveTo(boxX + 12, boxY + 60); ctx.lineTo(boxX + boxW - 12, boxY + 60); ctx.stroke();

      ctx.font = 'bold 11.5px "Fira Code", monospace';
      ctx.fillStyle = '#047857';
      ctx.fillText(`A(x₁, y₁): (${handleA.x.toFixed(2)}, ${handleA.y.toFixed(2)})`, boxX + 12, boxY + 76);
      ctx.fillText(`B(x₂, y₂): (${handleB.x.toFixed(2)}, ${handleB.y.toFixed(2)})`, boxX + 12, boxY + 92);
    }
