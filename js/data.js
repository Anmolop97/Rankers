var SOLVER_MEMORY = {
      epsilon: 0.24,
      radius: 0.31e-2, // meters
      length: 3.12e-2, // meters
      exactSigma: 5.670374419e-8,
      surfaceArea: 2 * Math.PI * 0.31e-2 * 3.12e-2, // 6.077097e-4 m^2
      get epsTimesS() { return this.epsilon * this.surfaceArea; }, // 1.4585e-4
      
      // User's 12 points from notebook photo
      points: [
        { no: 1, vf: 0.20, if: 0.134, rt: 1.492, ratio: 2.486, t: 600, p: 0.0268, logT: 2.77, logP: -1.57 },
        { no: 2, vf: 0.40, if: 0.197, rt: 2.030, ratio: 3.383, t: 760, p: 0.0788, logT: 2.88, logP: -1.10 },
        { no: 3, vf: 0.60, if: 0.237, rt: 2.531, ratio: 4.218, t: 930, p: 0.1422, logT: 2.96, logP: -0.90 },
        { no: 4, vf: 0.80, if: 0.269, rt: 2.973, ratio: 4.956, t: 1070, p: 0.2152, logT: 3.02, logP: -0.67 },
        { no: 5, vf: 1.00, if: 0.296, rt: 3.378, ratio: 5.630, t: 1190, p: 0.2960, logT: 3.07, logP: -0.52 },
        { no: 6, vf: 2.00, if: 0.413, rt: 4.842, ratio: 8.071, t: 1645, p: 0.8260, logT: 3.21, logP: -0.08 },
        { no: 7, vf: 3.00, if: 0.507, rt: 5.917, ratio: 9.861, t: 1990, p: 1.5210, logT: 3.30, logP: 0.18 },
        { no: 8, vf: 3.50, if: 0.549, rt: 6.375, ratio: 10.625, t: 2140, p: 1.9215, logT: 3.33, logP: 0.28 },
        { no: 9, vf: 4.00, if: 0.589, rt: 6.791, ratio: 11.318, t: 2290, p: 2.3560, logT: 3.35, logP: 0.37 },
        { no: 10, vf: 4.52, if: 0.629, rt: 7.186, ratio: 11.976, t: 2380, p: 2.8430, logT: 3.38, logP: 0.45 },
        { no: 11, vf: 5.00, if: 0.664, rt: 7.530, ratio: 12.550, t: 2480, p: 3.3200, logT: 3.39, logP: 0.52 },
        { no: 12, vf: 5.50, if: 0.699, rt: 7.868, ratio: 13.113, t: 2570, p: 3.8445, logT: 3.40, logP: 0.58 },
      ]
    };

    // State Variables

var TABLE_I_STANDARDS = [
      { ratio: 1.0, temp: 300, label: 'Std 1 (300 K)' },
      { ratio: 4.0, temp: 920, label: 'Std 2 (920 K)' },
      { ratio: 6.0, temp: 1300, label: 'Std 3 (1300 K)' },
      { ratio: 8.0, temp: 1645, label: 'Std 4 (1645 K)' },
      { ratio: 10.0, temp: 1990, label: 'Std 5 (1990 K)' }
    ];

    // Monotone Cubic Spline (Fritsch-Carlson) for Graph 1 Calibration Curve
    function buildCalibrationSpline() {
      // Anchors combining Table I standards with high-temperature filament extensions
      const xs = [0.0, 1.0, 4.0, 6.0, 8.0, 10.0, 12.0, 14.0, 16.0];
      const ys = [0.0, 300, 920, 1300, 1645, 1990, 2380, 2740, 3100];
      const n = xs.length;
      const m = [];
      const dxs = [];
      const dys = [];
      for (let i = 0; i < n - 1; i++) {
        const dx = xs[i+1] - xs[i];
        const dy = ys[i+1] - ys[i];
        dxs.push(dx);
        dys.push(dy);
        m.push(dy / dx);
      }
      const c1s = [m[0]];
      for (let i = 0; i < dxs.length - 1; i++) {
        const m0 = m[i], m1 = m[i+1];
        if (m0 * m1 <= 0) {
          c1s.push(0);
        } else {
          const dx_ = dxs[i] + dxs[i+1];
          c1s.push(3 * dx_ / ((dx_ + dxs[i+1]) / m0 + (dx_ + dxs[i]) / m1));
        }
      }
      c1s.push(m[m.length - 1]);
      const c2s = [], c3s = [];
      for (let i = 0; i < c1s.length - 1; i++) {
        const c1 = c1s[i];
        const m_ = m[i];
        const invDx = 1 / dxs[i];
        const common = c1 + c1s[i+1] - 2 * m_;
        c2s.push((m_ - c1 - common) * invDx);
        c3s.push(common * invDx * invDx);
      }
      return function(x) {
        if (x <= xs[0]) return ys[0] + c1s[0] * (x - xs[0]);
        if (x >= xs[xs.length - 1]) {
          const last = xs.length - 1;
          return ys[last] + c1s[last] * (x - xs[last]);
        }
        let i = xs.length - 2;
        for (let j = 0; j < xs.length - 1; j++) {
          if (x >= xs[j] && x <= xs[j+1]) { i = j; break; }
        }
        const diff = x - xs[i];
        return ys[i] + c1s[i] * diff + c2s[i] * diff * diff + c3s[i] * diff * diff * diff;
      };
    }
    var evalCalibrationT = buildCalibrationSpline();

    // Interactive Handles Coordinates for Graph II (in graph units)
