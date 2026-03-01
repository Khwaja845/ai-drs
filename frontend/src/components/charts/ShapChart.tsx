
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);



export default function ShapChart({ shap, features }: any) {
  // CORRECTED: Red for positive (increases risk - bad), Green for negative (decreases risk - good)
  const backgroundColors = shap.map((v: number) =>
    v > 0 ? "rgba(239, 68, 68, 0.9)" : v < 0 ? "rgba(34, 197, 94, 0.9)" : "rgba(156, 163, 175, 0.7)"
  );
  const borderColors = shap.map((v: number) =>
    v > 0 ? "#dc2626" : v < 0 ? "#16a34a" : "#6b7280"
  );

  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-2 sm:p-6 max-w-full">
      <div className="mb-2 sm:mb-4">
        <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-900">Feature Impact Analysis (SHAP Values)</h3>
        <div className="bg-red-50 p-2 sm:p-3 rounded-md mb-2 sm:mb-3">
          <p className="text-xs sm:text-sm text-red-700 font-semibold mb-1">🔴 <strong>Red bars (Positive Values):</strong> Features that <strong>INCREASE</strong> the diabetes risk prediction rate (RISK FACTORS)</p>
        </div>
        <div className="bg-green-50 p-2 sm:p-3 rounded-md">
          <p className="text-xs sm:text-sm text-green-800 font-semibold">🟢 <strong>Green bars (Negative Values):</strong> Features that <strong>DECREASE</strong> the diabetes risk prediction rate (PROTECTIVE FACTORS)</p>
        </div>
      </div>

      <div className="w-full overflow-x-auto" style={{ maxHeight: 400 }}>
        <Bar
          data={{
            labels: features,
            datasets: [
              {
                label: "SHAP Impact Value",
                data: shap,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 10,
                borderRadius: 6,
                borderSkipped: false,
                barPercentage: 0.85,
                categoryPercentage: 0.9,
                hoverBackgroundColor: backgroundColors,
                hoverBorderColor: borderColors,
              },
            ],
          }}
          options={{
            indexAxis: "y" as const,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.85)",
                padding: 12,
                titleFont: { size: 14, weight: "bold" },
                bodyFont: { size: 12 },
                cornerRadius: 8,
                callbacks: {
                  title: (context: any) => `${context[0].label}`,
                  label: (ctx: any) => {
                    const value = ctx.parsed.x;
                    if (value > 0) {
                      return `📈 Positive: +${value.toFixed(4)} (INCREASES risk prediction)`;
                    } else if (value < 0) {
                      return `📉 Negative: ${value.toFixed(4)} (DECREASES risk prediction)`;
                    } else {
                      return `→ Neutral: ${value.toFixed(4)} (No effect on risk)`;
                    }
                  },
                  afterLabel: () => "💡 Tip: Even 'No' values can increase risk due to\nfeature interactions with other patient data",
                },
              },
            },
            scales: {
              x: {
                grid: { color: "#e5e7eb", lineWidth: 1 },
                title: { 
                  display: true, 
                  text: "SHAP Value (Impact on Risk)", 
                  font: { size: 14, weight: "bold" }, 
                  color: "#333",
                  padding: 8
                },
                ticks: { 
                  font: { size: 11, weight: "bold" }, 
                  color: "#555",
                  callback: (value: any) => value.toFixed(2)
                },
              },
              y: {
                grid: { display: false },
                title: { display: false },
                ticks: { 
                  font: { size: 11, weight: "bold" }, 
                  color: "#444",
                  autoSkip: false,
                  maxRotation: 0,
                  minRotation: 0
                },
              },
            },
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 1200,
              easing: "easeInOutElastic" as const,
              delay: (ctx: any) => (ctx.dataIndex * 40),
            },
          }}
          style={{ width: "100%", height: Math.max(features.length * 22, 220) }}
        />
      </div>

      {/* Legend/Explanation Below Chart */}
      <div className="mt-2 sm:mt-4 p-2 sm:p-4 bg-gray-50 rounded-lg text-xs sm:text-sm text-gray-700">
        <strong>📊 Understanding SHAP Values & Risk Impact</strong>
        <p className="mt-1 sm:mt-2 leading-relaxed">
          <strong>SHAP values show each feature's contribution to the prediction:</strong>
        </p>
        <ul className="mt-1 sm:mt-2 pl-4 list-disc leading-relaxed">
          <li><strong>🔴 Red Bars (Positive):</strong> RISK FACTORS - This feature is <strong>INCREASING</strong> the diabetes risk prediction for this patient</li>
          <li><strong>🟢 Green Bars (Negative):</strong> PROTECTIVE FACTORS - This feature is <strong>DECREASING</strong> the diabetes risk prediction for this patient</li>
          <li><strong>Bar Length:</strong> Longer bars = stronger impact. Shorter bars = weaker impact on the final prediction</li>
        </ul>

        {/* Advanced Explanation */}
        <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-blue-50 rounded-md border-l-4 border-blue-400">
          <strong>💡 Important: How SHAP Actually Works (Context-Dependent)</strong>
          <p className="mt-1 leading-relaxed text-xs sm:text-sm">
            SHAP values are <strong>not just about the feature value alone</strong>. They measure how much each feature <strong>contributes in combination with other patient features</strong>:
          </p>
          <ul className="mt-1 pl-4 list-disc text-xs sm:text-sm leading-relaxed">
            <li><strong>📌 Example:</strong> If you selected "High Blood Pressure = No" but it shows RED (increases risk), it means: In the context of your OTHER health factors, having "No High BP" creates a specific risk pattern the model learned</li>
            <li><strong>🎯 Baseline Comparison:</strong> Each bar is calculated relative to the average patient, not absolute values</li>
            <li><strong>🔗 Feature Interactions:</strong> The model considers how ALL features work together, not individually</li>
            <li><strong>✅ Trust the Overall Score:</strong> Don't focus on one bar - all bars combine to create the final risk percentage. If the prediction seems off, check if you entered the values correctly</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
