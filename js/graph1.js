// GRAPH I ENGINE: Resistance Ratio (RT/R300) vs Filament Temperature T (Kelvin)

function fitGraph1Full() {
      viewBoundsGraph1.xMin = -1.2;
      viewBoundsGraph1.xMax = 15.5;
      viewBoundsGraph1.yMin = -180;
      viewBoundsGraph1.yMax = 2900;
      document.getElementById('zoom-level-text').innerText = '100%';
      renderCanvas();
    }

    function fitGraph1Obs() {
      viewBoundsGraph1.xMin = 1.2;
      viewBoundsGraph1.xMax = 14.5;
      viewBoundsGraph1.yMin = 400;
      viewBoundsGraph1.yMax = 2750;
      const defaultSpan = 15.5 - (-1.2);
      const curZoomPct = Math.round((defaultSpan / (viewBoundsGraph1.xMax - viewBoundsGraph1.xMin)) * 100);
      document.getElementById('zoom-level-text').innerText = `${curZoomPct}%`;
      renderCanvas();
    }

    function fitGraph1Standards() {
      viewBoundsGraph1.xMin = -0.5;
      viewBoundsGraph1.xMax = 11.5;
      viewBoundsGraph1.yMin = -100;
      viewBoundsGraph1.yMax = 2200;
      const defaultSpan = 15.5 - (-1.2);
      const curZoomPct = Math.round((defaultSpan / (viewBoundsGraph1.xMax - viewBoundsGraph1.xMin)) * 100);
      document.getElementById('zoom-level-text').innerText = `${curZoomPct}%`;
      renderCanvas();
    }

function selectGraph1Obs(choice) {
      graph1SelectedObs = choice;
      const btnAll = document.getElementById('btn-obs-all');
      const btnStd = document.getElementById('btn-obs-standards');

      if (btnAll) {
        btnAll.className = choice === 'all'
          ? "px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold text-[11px] transition"
          : "px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium text-[11px] transition";
      }

      if (btnStd) {
        btnStd.className = choice === 'standards'
          ? "px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-[11px] transition"
          : "px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium text-[11px] transition";
      }

      SOLVER_MEMORY.points.forEach(pt => {
        const chip = document.getElementById(`obs-chip-${pt.no}`);
        if (chip) {
          if (choice === pt.no) {
            chip.className = "px-2.5 py-1 text-xs rounded-lg bg-emerald-600 text-white font-bold border border-emerald-400 shadow-md transition flex items-center gap-1.5";
          } else {
            chip.className = "px-2.5 py-1 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-medium transition flex items-center gap-1.5";
          }
        }
      });

      // Update inspection card
      let displayPt = SOLVER_MEMORY.points[0];
      if (typeof choice === 'number') {
        const found = SOLVER_MEMORY.points.find(p => p.no === choice);
        if (found) displayPt = found;
      }
      const obsNum = document.getElementById('inspect-obs-num');
      const obsTitle = document.getElementById('inspect-obs-title');
      const obsRatio = document.getElementById('inspect-obs-ratio');
      const obsTemp = document.getElementById('inspect-obs-temp');
      const obsVf = document.getElementById('inspect-obs-vf');
      const obsIf = document.getElementById('inspect-obs-if');
      const obsRt = document.getElementById('inspect-obs-rt');
      const obsP = document.getElementById('inspect-obs-p');

      if (obsNum) obsNum.innerText = `P${displayPt.no}`;
      if (obsTitle) obsTitle.innerText = `${displayPt.no}`;
      if (obsRatio) obsRatio.innerText = `${displayPt.ratio.toFixed(3)}`;
      if (obsTemp) obsTemp.innerText = `${displayPt.t}`;
      if (obsVf) obsVf.innerText = `${displayPt.vf.toFixed(2)}`;
      if (obsIf) obsIf.innerText = `${displayPt.if.toFixed(3)}`;
      if (obsRt) obsRt.innerText = `${displayPt.rt.toFixed(3)}`;
      if (obsP) obsP.innerText = `${displayPt.p.toFixed(4)}`;

      renderCanvas();
    }

    function populateGraph1Chips() {
      const cont = document.getElementById('graph1-chips-container');
      if (!cont) return;
      cont.innerHTML = '';
      SOLVER_MEMORY.points.forEach(pt => {
        const btn = document.createElement('button');
        btn.id = `obs-chip-${pt.no}`;
        btn.onclick = () => selectGraph1Obs(pt.no);
        btn.className = "px-2.5 py-1 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-medium transition flex items-center gap-1.5";
        btn.innerHTML = `<span class="text-rose-400 font-bold">P${pt.no}</span><span>${pt.ratio.toFixed(2)} &rarr; ${pt.t}K</span>`;
        cont.appendChild(btn);
      });
    }

function renderGraph1() {
      const canvas = document.getElementById('graphCanvas');
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.max(window.devicePixelRatio || 1, 2);

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;
      const p = getPlotDims();

      const spanX = p.xMax - p.xMin;
      const spanY = p.yMax - p.yMin;
      const isFS = (typeof document !== 'undefined' && !!document.fullscreenElement) || (w >= 1150);
      const curZoomPct = Math.round(((15.5 - (-1.2)) / (spanX || 1)) * 100);

      // Graph 1 Major Step (X: Ratio, Y: Temp in K)
      let majorStepX = 1.0;
      if (spanX <= 2.5) majorStepX = 0.2;
      else if (spanX <= 5.5) majorStepX = 0.5;
      else if (spanX <= 12.0) majorStepX = 1.0;
      else majorStepX = 2.0;

      let majorStepY = 200;
      if (spanY <= 400) majorStepY = 50;
      else if (spanY <= 1000) majorStepY = 100;
      else if (spanY <= 2500) majorStepY = 200;
      else majorStepY = 500;

      // Authentic 3-Tier Grid Hierarchy (10 micro divisions per 1cm major block)
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

      // Paper Theme Colors
      let paperBg, marginBg, frameStroke, microGridStroke, midGridStroke, majorGridStroke, axisStroke, textStroke;
      if (currentTheme === 'green') {
        paperBg = '#fbfdf9';
        marginBg = '#f2f6ed';
        frameStroke = '#166534';
        microGridStroke = 'rgba(34, 139, 34, 0.16)';
        midGridStroke = 'rgba(21, 128, 61, 0.42)';
        majorGridStroke = 'rgba(20, 83, 45, 0.85)';
        axisStroke = '#0f172a';
        textStroke = '#14532d';
      } else if (currentTheme === 'blue') {
        paperBg = '#fcfdff';
        marginBg = '#edf4fc';
        frameStroke = '#0369a1';
        microGridStroke = 'rgba(2, 132, 199, 0.16)';
        midGridStroke = 'rgba(3, 105, 161, 0.42)';
        majorGridStroke = 'rgba(7, 89, 133, 0.85)';
        axisStroke = '#0f172a';
        textStroke = '#0369a1';
      } else {
        paperBg = '#0b0f19';
        marginBg = '#050811';
        frameStroke = '#334155';
        microGridStroke = 'rgba(51, 65, 85, 0.35)';
        midGridStroke = 'rgba(71, 85, 105, 0.60)';
        majorGridStroke = 'rgba(148, 163, 184, 0.75)';
        axisStroke = '#cbd5e1';
        textStroke = '#94a3b8';
      }

      // Background & Margin
      ctx.fillStyle = marginBg; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = paperBg; ctx.fillRect(p.padL, p.padT, p.plotW, p.plotH);

      // Clip grid drawing strictly to plot area
      ctx.save();
      ctx.beginPath();
      ctx.rect(p.padL, p.padT, p.plotW, p.plotH);
      ctx.clip();

      // Pass 1: 1mm micro-grid
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

      // Pass 2: 5mm mid-grid
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

      // Pass 3: 10mm major grid
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

      ctx.restore(); // end grid clip

      // Double Border Frame
      ctx.strokeStyle = frameStroke;
      ctx.lineWidth = 2.2;
      ctx.strokeRect(p.padL, p.padT, p.plotW, p.plotH);
      ctx.lineWidth = 0.7;
      ctx.strokeRect(p.padL + 3.5, p.padT + 3.5, p.plotW - 7, p.plotH - 7);

      // Printed Header Stamp
      ctx.font = isFS ? 'bold 13px Inter, sans-serif' : 'bold 11px Inter, sans-serif';
      ctx.fillStyle = textStroke;
      ctx.textAlign = 'left';
      ctx.fillText('PHYSICS PRACTICAL GRAPH SHEET • EXP NO. 05 (GRAPH I: TEMPERATURE CALIBRATION CURVE)', p.padL + 4, p.padT - 13);
      ctx.textAlign = 'right';
      ctx.fillText(`1 cm = ${majorStepX.toFixed(2)} [RT/R300]  •  1 cm = ${majorStepY} K [Temp T]`, w - p.padR - 4, p.padT - 13);

      // Origin
      const originX = toScreenX(0);
      const originY = toScreenY(0);
      const xAxisY = (originY >= p.padT && originY <= h - p.padB) ? originY : (h - p.padB);
      const yAxisX = (originX >= p.padL && originX <= w - p.padR) ? originX : p.padL;

      // Draw Main Axes
      ctx.strokeStyle = axisStroke;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(p.padL, xAxisY); ctx.lineTo(w - p.padR, xAxisY);
      ctx.moveTo(yAxisX, p.padT); ctx.lineTo(yAxisX, h - p.padB);
      ctx.stroke();

      // Axis Arrows
      ctx.fillStyle = axisStroke;
      ctx.beginPath();
      ctx.moveTo(w - p.padR, xAxisY);
      ctx.lineTo(w - p.padR - 10, xAxisY - 4.5);
      ctx.lineTo(w - p.padR - 10, xAxisY + 4.5);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(yAxisX, p.padT);
      ctx.lineTo(yAxisX - 4.5, p.padT + 10);
      ctx.lineTo(yAxisX + 4.5, p.padT + 10);
      ctx.fill();

      // Origin Label O(0,0)
      if (originX >= p.padL && originX <= w - p.padR && originY >= p.padT && originY <= h - p.padB) {
        ctx.font = isFS ? 'bold 13px "Fira Code", monospace' : 'bold 11px "Fira Code", monospace';
        ctx.textAlign = 'right';
        ctx.fillText('O (0,0)', originX - 6, originY + 16);
      }

      // X Numbers
      ctx.font = isFS ? 'bold 15px "Fira Code", monospace' : 'bold 13px "Fira Code", monospace';
      ctx.fillStyle = currentTheme === 'green' ? '#14532d' : '#94a3b8';
      ctx.textAlign = 'center';
      for (let x = startXMajor; x <= p.xMax; x += majorStepX) {
        if (Math.abs(x) < 0.0001 && Math.abs(xAxisY - originY) < 5) continue;
        const sx = toScreenX(x);
        if (sx < p.padL || sx > w - p.padR) continue;
        ctx.beginPath(); ctx.moveTo(sx, xAxisY - 4); ctx.lineTo(sx, xAxisY + 4); ctx.stroke();
        ctx.fillText(Number(x.toFixed(2)).toString(), sx, xAxisY + (isFS ? 22 : 19));
      }

      // Y Numbers
      ctx.textAlign = 'right';
      for (let y = startYMajor; y <= p.yMax; y += majorStepY) {
        if (Math.abs(y) < 0.0001 && Math.abs(yAxisX - originX) < 5) continue;
        const sy = toScreenY(y);
        if (sy < p.padT || sy > h - p.padB) continue;
        ctx.beginPath(); ctx.moveTo(yAxisX - 4, sy); ctx.lineTo(yAxisX + 4, sy); ctx.stroke();
        ctx.fillText(Number(Math.round(y)).toString(), yAxisX - 8, sy + 5);
      }

      // Axis Labels
      ctx.font = isFS ? 'bold 16px Inter, sans-serif' : 'bold 13.5px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('+X: Resistance Ratio (RT / R300)  [Cold Ref R300 = 0.60 Ω]  →', w - p.padR - (isFS ? 210 : 190), xAxisY - (isFS ? 14 : 12));

      ctx.save();
      ctx.translate(yAxisX - (isFS ? 24 : 22), p.padT + (isFS ? 105 : 90));
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('+Y: Filament Temperature T (Kelvin)  →', 0, 0);
      ctx.restore();

      // Clip plot elements strictly to plot bounds
      ctx.save();
      ctx.beginPath();
      ctx.rect(p.padL, p.padT, p.plotW, p.plotH);
      ctx.clip();

      // Draw Smooth Calibration Curve
      ctx.strokeStyle = currentTheme === 'green' ? '#2563eb' : '#38bdf8';
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      const stepX = 0.05;
      let first = true;
      for (let x = 0.0; x <= 16.0; x += stepX) {
        const temp = evalCalibrationT(x);
        const sx = toScreenX(x);
        const sy = toScreenY(temp);
        if (first) { ctx.moveTo(sx, sy); first = false; }
        else { ctx.lineTo(sx, sy); }
      }
      ctx.stroke();

      // Curve Name Label
      const labelRatio = 7.0;
      const labelTemp = evalCalibrationT(labelRatio);
      const lX = toScreenX(labelRatio);
      const lY = toScreenY(labelTemp) - 18;
      ctx.font = 'bold italic 12.5px Inter, sans-serif';
      ctx.fillStyle = currentTheme === 'green' ? '#1d4ed8' : '#38bdf8';
      ctx.textAlign = 'center';
      ctx.fillText('Calibration Curve [T vs RT/R300]', lX, lY);

      const isDeepZoom = (curZoomPct >= 160);

      // Draw Table I Standard Points
      TABLE_I_STANDARDS.forEach(std => {
        const sx = toScreenX(std.ratio);
        const sy = toScreenY(std.temp);

        // Standard point outer ring
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.arc(sx, sy, 7.5, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#10b981';
        ctx.beginPath(); ctx.arc(sx, sy, 3.8, 0, Math.PI * 2); ctx.fill();

        // Standard badge
        const stdTxt = `Std: (${std.ratio.toFixed(1)}, ${std.temp}K)`;
        ctx.font = isFS ? 'bold 13px "Fira Code", monospace' : 'bold 11px "Fira Code", monospace';
        const txtW = ctx.measureText(stdTxt).width + (isFS ? 14 : 10);
        const bX = sx + 12;
        const bY = sy + 6;
        const bH = isFS ? 24 : 20;

        ctx.fillStyle = currentTheme === 'green' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.95)';
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 1.2;
        ctx.fillRect(bX, bY - bH / 2, txtW, bH);
        ctx.strokeRect(bX, bY - bH / 2, txtW, bH);

        ctx.fillStyle = '#065f46';
        ctx.textAlign = 'left';
        ctx.fillText(stdTxt, bX + 6, bY + (isFS ? 4.5 : 3.5));
      });

      // Draw 12 Student Observation Points & Dashed Projection Lines
      if (graph1SelectedObs !== 'standards') {
        SOLVER_MEMORY.points.forEach((pt, idx) => {
          const isSelected = (graph1SelectedObs === 'all' || graph1SelectedObs === pt.no);
          const isFocussed = (graph1SelectedObs === pt.no);
          const sx = toScreenX(pt.ratio);
          const sy = toScreenY(pt.t);
          const axisBottomY = xAxisY;
          const axisLeftX = yAxisX;

          if (isSelected) {
            // Draw Orthogonal Dashed Projection Lines
            ctx.setLineDash([5, 4]);
            ctx.strokeStyle = isFocussed ? '#dc2626' : 'rgba(220, 38, 38, 0.75)';
            ctx.lineWidth = isFocussed ? 2.4 : 1.4;

            // 1. Vertical line from X-axis up to curve: (ratio, 0) -> (ratio, T)
            ctx.beginPath();
            ctx.moveTo(sx, axisBottomY);
            ctx.lineTo(sx, sy);
            ctx.stroke();

            // 2. Horizontal line from curve left to Y-axis: (ratio, T) -> (0, T)
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(axisLeftX, sy);
            ctx.stroke();

            ctx.setLineDash([]); // reset dash

            // Directional Arrow on Vertical Leg
            const midVertY = (axisBottomY + sy) / 2;
            ctx.fillStyle = '#dc2626';
            ctx.beginPath();
            ctx.moveTo(sx, midVertY - 5);
            ctx.lineTo(sx - 3.5, midVertY + 3);
            ctx.lineTo(sx + 3.5, midVertY + 3);
            ctx.fill();

            // Directional Arrow on Horizontal Leg
            const midHorizX = (sx + axisLeftX) / 2;
            ctx.beginPath();
            ctx.moveTo(midHorizX - 5, sy);
            ctx.lineTo(midHorizX + 3, sy - 3.5);
            ctx.lineTo(midHorizX + 3, sy + 3.5);
            ctx.fill();

            // Ticks on Axes for Projection
            ctx.fillStyle = '#dc2626';
            ctx.beginPath(); ctx.arc(sx, axisBottomY, 3, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(axisLeftX, sy, 3, 0, Math.PI * 2); ctx.fill();
          }

          // Physics Dot ⊙ at (ratio, T) on curve
          ctx.strokeStyle = isFocussed ? '#b91c1c' : '#dc2626';
          ctx.lineWidth = isFocussed ? 2.8 : 1.8;
          ctx.beginPath(); ctx.arc(sx, sy, isFocussed ? (isFS ? 8.5 : 7) : (isFS ? 6.5 : 5), 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = isFocussed ? '#ef4444' : '#dc2626';
          ctx.beginPath(); ctx.arc(sx, sy, isFocussed ? (isFS ? 4.5 : 3.5) : (isFS ? 3.0 : 2.2), 0, Math.PI * 2); ctx.fill();

          // Label / Badge
          if (isFocussed || (isSelected && isDeepZoom)) {
            const obsLabel = `P${pt.no}: (${pt.ratio.toFixed(2)}, ${pt.t}K)`;
            ctx.font = isFS ? 'bold 14px "Fira Code", monospace' : 'bold 12px "Fira Code", monospace';
            const oW = ctx.measureText(obsLabel).width + (isFS ? 16 : 12);
            const oH = isFS ? 26 : 22;
            const oX = (idx % 2 === 0) ? (sx + (isFS ? 14 : 10)) : (sx - oW - (isFS ? 14 : 10));
            const oY = sy - 14;

            ctx.fillStyle = currentTheme === 'green' ? 'rgba(255, 255, 255, 0.98)' : 'rgba(15, 23, 42, 0.98)';
            ctx.strokeStyle = '#dc2626';
            ctx.lineWidth = 1.4;
            ctx.fillRect(oX, oY - oH / 2, oW, oH);
            ctx.strokeRect(oX, oY - oH / 2, oW, oH);

            ctx.fillStyle = '#991b1b';
            ctx.textAlign = 'left';
            ctx.fillText(obsLabel, oX + 7, oY + (isFS ? 5 : 4));
          } else if (isSelected) {
            ctx.font = isFS ? 'bold 13.5px "Fira Code", monospace' : 'bold 11px Inter, sans-serif';
            ctx.fillStyle = '#b91c1c';
            ctx.textAlign = 'left';
            ctx.fillText(`P${pt.no}`, sx + (isFS ? 9 : 7), sy - (isFS ? 4 : 3));
          }
        });
      }

      ctx.restore(); // end clip

      // Top-Right Scale Box for Graph 1
      ctx.fillStyle = currentTheme === 'green' ? 'rgba(255, 255, 255, 0.98)' : 'rgba(15, 23, 42, 0.98)';
      ctx.strokeStyle = currentTheme === 'green' ? '#14532d' : '#334155';
      ctx.lineWidth = 1.8;
      const boxW = isFS ? 275 : 245, boxH = isFS ? 110 : 98, boxX = w - p.padR - boxW - 5, boxY = p.padT + 5;
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeRect(boxX, boxY, boxW, boxH);
      
      ctx.font = isFS ? 'bold 14.5px Inter, sans-serif' : 'bold 13px Inter, sans-serif';
      ctx.fillStyle = currentTheme === 'green' ? '#14532d' : '#e2e8f0';
      ctx.textAlign = 'left';
      ctx.fillText('LAB SCALE (GRAPH I):', boxX + 12, boxY + (isFS ? 20 : 18));
      
      ctx.font = isFS ? 'bold 13.5px "Fira Code", monospace' : 'bold 12px "Fira Code", monospace';
      ctx.fillStyle = currentTheme === 'green' ? '#166534' : '#94a3b8';
      ctx.fillText(`X-axis: 1 cm = ${majorStepX.toFixed(2)} [RT/R300]`, boxX + 12, boxY + (isFS ? 40 : 36));
      ctx.fillText(`Y-axis: 1 cm = ${majorStepY} K [Temp T]`, boxX + 12, boxY + (isFS ? 58 : 52));
      
      ctx.strokeStyle = currentTheme === 'green' ? 'rgba(20, 83, 45, 0.25)' : 'rgba(148, 163, 184, 0.25)';
      ctx.beginPath(); ctx.moveTo(boxX + 12, boxY + (isFS ? 67 : 60)); ctx.lineTo(boxX + boxW - 12, boxY + (isFS ? 67 : 60)); ctx.stroke();

      ctx.font = isFS ? 'bold 12.5px "Fira Code", monospace' : 'bold 11px "Fira Code", monospace';
      ctx.fillStyle = '#dc2626';
      const selTxt = (graph1SelectedObs === 'all') ? 'Showing All 12 Projections' : (graph1SelectedObs === 'standards' ? 'Table I Standards (5 Pts)' : `Focus: Reading P${graph1SelectedObs}`);
      ctx.fillText(selTxt, boxX + 12, boxY + (isFS ? 85 : 76));

      ctx.fillStyle = '#047857';
      ctx.fillText(`Cold Ref: R₃₀₀ = 0.60 Ω`, boxX + 12, boxY + (isFS ? 102 : 92));
    }

    // Graph II: Log P vs Log T (Stefan's Law Slope) Renderer
