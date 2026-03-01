import { Line } from "react-chartjs-2";
import { Chart, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler} from "chart.js";
import React, { useRef, useEffect } from "react";

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler);

interface RiskGaugeProps {
  percent: number;
  shapFactors?: { feature: string; value: number }[];
}

interface RiskLevelConfig {
  emoji: string;
  comment: string;
  color: string;
  rgbColor: string;
}

function getRiskConfig(percent: number): RiskLevelConfig {
  if (percent < 13) {
    return { emoji: "✅", comment: "Low risk - Maintain health", color: "#22c55e", rgbColor: "rgb(34, 197, 94)" };
  } else if (percent < 30) {
    return { emoji: "🟢", comment: "Low-Medium risk - Monitor", color: "#84cc16", rgbColor: "rgb(132, 204, 22)" };
  } else if (percent < 50) {
    return { emoji: "🟡", comment: "Medium risk - Take action", color: "#facc15", rgbColor: "rgb(250, 204, 21)" };
  } else if (percent < 85) {
    return { emoji: "🟠", comment: "High risk - Caution", color: "#f97316", rgbColor: "rgb(249, 115, 22)" };
  } else {
    return { emoji: "🚨", comment: "Critical risk - Immediate action", color: "#ef4444", rgbColor: "rgb(239, 68, 68)" };
  }
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ percent, shapFactors = [] }) => {
  const riskConfig = getRiskConfig(percent);
  const chartRef = useRef<any>(null);

  // Plugin for background zones
  const riskZonePlugin = {
    id: 'riskZoneBackground',
    beforeDraw: (chart: any) => {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;
      const { left, top, width, height } = chartArea;
      ctx.save();
      ctx.fillStyle = 'rgba(34,197,94,0.08)';
      ctx.fillRect(left, top, width * 0.3, height);
      ctx.fillStyle = 'rgba(250,204,21,0.08)';
      ctx.fillRect(left + width * 0.3, top, width * 0.4, height);
      ctx.fillStyle = 'rgba(239,68,68,0.08)';
      ctx.fillRect(left + width * 0.7, top, width * 0.3, height);
      ctx.restore();
    }
  };

  // Pulse & Gradient Animation Loop
  useEffect(() => {
    if (!chartRef.current) return;
    const chart = chartRef.current;
    let frame: number;
    let t = 0;

    function animate() {
      t += 0.05; // speed of animation
      if (chart && chart.data && chart.data.datasets) {
        // 1. Animate the Gradient Border
        const riskLine = chart.data.datasets[0];
        riskLine.borderColor = (ctx: any) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, ctx.chart.width, 0);
          gradient.addColorStop(0, '#22c55e');
          gradient.addColorStop(0.3 + 0.05 * Math.sin(t * 0.5), '#facc15');
          gradient.addColorStop(0.7 + 0.05 * Math.cos(t * 0.5), '#ef4444');
          return gradient;
        };

        // 2. Pulse Animation for the Point
        const currentRiskPoint = chart.data.datasets[1];
        // Calculate a "breathing" radius between 18 and 24
        const pulseSize = 21 + Math.sin(t) * 3;
        currentRiskPoint.pointRadius = pulseSize;

        chart.render(); // Redraw with new values without resetting hover states
      }
      frame = requestAnimationFrame(animate);
    }

    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  const data = {
    datasets: [
      {
        label: 'Risk Line',
        data: [{ x: 0, y: 0 }, { x: percent, y: percent }],
        borderWidth: 8,
        pointRadius: 0,
        fill: false,
        showLine: true,
        order: 2,
      },
      {
        label: 'Current Risk',
        data: [{ x: percent, y: percent }],
        backgroundColor: riskConfig.color,
        borderColor: "#ffffff",
        borderWidth: 4,
        pointRadius: 18, // Initial, will be overridden by pulse
        pointHoverRadius: 32, // Large expansion on hover
        pointHoverBorderWidth: 6,
        pointHoverBackgroundColor: riskConfig.color,
        pointHoverBorderColor: "#fff",
        order: 1,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 40 },
    animation: {
        duration: 800, // Smooth initial entry
        easing: 'easeOutQuart'
    },
    hover: {
        mode: 'nearest',
        intersect: true,
        animationDuration: 300 // Smooth hover expansion
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.9)",
        padding: 16,
        displayColors: false,
        callbacks: {
          label: (ctx: any) => ` ${riskConfig.emoji} ${ctx.parsed.y}% - ${riskConfig.comment}`,
        },
      },
    },
    scales: {
      y: {
        min: 0, max: 100,
        title: { display: true, text: "Risk Level (%)", font: { size: 24, weight: "bold" } },
        ticks: { font: { size: 20 }, stepSize: 20, callback: (v: any) => `${v}%` }
      },
      x: {
        type: "linear", min: 0, max: 100,
        title: { display: true, text: "Risk Progression", font: { size: 24, weight: "bold" } },
        ticks: {
          font: { size: 18, weight: "bold" },
          stepSize: 10,
          callback: (value: any) => value % 20 === 0 ? `${getRiskConfig(value).emoji} ${value}` : ""
        }
      },
    },
  };

  const topFactors = shapFactors.slice(0, 6);

  return (
    <div className="graph-card" style={{ width: '100%', maxWidth: 1800, background: '#fff', borderRadius: 20, padding: 30, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 30, borderBottom: "2px solid #f3f4f6", paddingBottom: 20 }}>
        <div style={{ display: "flex", gap: 30 }}>
            <div>
                <div style={{ fontSize: 64, fontWeight: 900, color: riskConfig.color, lineHeight: 1 }}>{percent}%</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#94a3b8", textTransform: 'uppercase', letterSpacing: 1 }}>Current Risk</div>
            </div>
            <div style={{ borderLeft: "2px solid #e2e8f0", paddingLeft: 30 }}>
                <div style={{ fontSize: 40 }}>{riskConfig.emoji}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: riskConfig.color }}>{riskConfig.comment}</div>
            </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div style={{ width: "100%", height: 500 }}>
        <Line
          ref={chartRef}
          data={data}
          options={options}
          plugins={[riskZonePlugin]}
        />
      </div>

      {/* SHAP Factors */}
      {topFactors.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20, color: "#1e293b" }}>🔍 Contribution Factors</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {topFactors.map((factor, idx) => (
              <div key={idx} style={{
                padding: "10px 20px", borderRadius: 12, fontSize: 16, fontWeight: 600,
                backgroundColor: factor.value > 0 ? "#fff1f2" : "#f0fdf4",
                border: `1px solid ${factor.value > 0 ? "#fecdd3" : "#dcfce7"}`,
                display: "flex", alignItems: "center", gap: 10
              }}>
                <span>{factor.value > 0 ? "⚠️" : "✨"}</span>
                <span style={{ color: "#334155" }}>{factor.feature}</span>
                <span style={{ color: factor.value > 0 ? "#e11d48" : "#16a34a", fontWeight: 800 }}>
                    {factor.value > 0 ? "+" : ""}{factor.value.toFixed(3)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskGauge;