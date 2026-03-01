
import RiskGauge from "../components/charts/RiskGauge";
import "../components/charts/GraphStyles.css";

// You may need to get prediction from props, context, or state. Here is a functional component wrapper:

export default function Dashboard({ prediction }: { prediction: any }) {
  // Convert SHAP values and features into the format RiskGauge expects
  const shapFactors = (prediction.features || []).map((feature: string, idx: number) => ({
    feature,
    value: prediction.shap_values?.[idx] || 0,
  }));

  return (
    <div className="graph-card mx-auto my-8 px-2 sm:px-4 w-full">
      <div className="graph-4k w-full">
        <RiskGauge percent={Math.round((prediction.probability ?? 0) * 100)} shapFactors={shapFactors} />
      </div>
    </div>
  );
}
