import { useState } from "react";
import { predictManual } from "../../api/predictApi";

function BMICalculator({ onCalculate }: { onCalculate: (bmi: number) => void }) {
  const [height, setHeight] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [bmi, setBmi] = useState<number | null>(null);

  const calcBMI = () => {
    if (!height || !weight) return;
    const h = Number(height) / 100;
    const w = Number(weight);
    if (h > 0) {
      const bmiVal = +(w / (h * h)).toFixed(1);
      setBmi(bmiVal);
      onCalculate(bmiVal);
    }
  };

  return (
    <div className="flex items-center space-x-2 mb-2">
      <input
        type="number"
        min={50}
        max={250}
        placeholder="Height (cm)"
        value={height}
        onChange={e => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
        className="w-24 p-1 border border-gray-200 rounded text-xs"
      />
      <input
        type="number"
        min={20}
        max={250}
        placeholder="Weight (kg)"
        value={weight}
        onChange={e => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
        className="w-24 p-1 border border-gray-200 rounded text-xs"
      />
      <button
        type="button"
        onClick={calcBMI}
        className="px-2 py-1 bg-blue-500 text-white rounded text-xs font-bold"
      >
        Calc BMI
      </button>
      {bmi && (
        <span className="text-xs text-blue-700 font-bold ml-2">BMI: {bmi}</span>
      )}
    </div>
  );
}

export default function ManualInputForm({ onResult,  }: any) {
  const [form, setForm] = useState<any>({
    HighBP: 0, HighChol: 0, CholCheck: 1, BMI: 25, Smoker: 0,
    Stroke: 0, HeartDiseaseorAttack: 0, PhysActivity: 1, Fruits: 1,
    Veggies: 1, HvyAlcoholConsump: 0, AnyHealthcare: 1, NoDocbcCost: 0,
    GenHlth: 3, MentHlth: 0, PhysHlth: 0, DiffWalk: 0, Sex: 0,
    Age: 30, Education: 4, Income: 4
  });
  const [loading, setLoading] = useState(false);
  const updateField = (key: string, val: any) => {
    setForm((prev: any) => ({ ...prev, [key]: isNaN(Number(val)) ? val : Number(val) }));
  };

  const fieldDefs = [
    { key: "Sex", label: "Biological Sex", type: "binary", opt1: "Female", opt2: "Male", color: "bg-pink-500" },
    { key: "HighBP", label: "High Blood Pressure", type: "binary", opt1: "No", opt2: "Yes", color: "bg-red-500" },
    { key: "HighChol", label: "High Cholesterol", type: "binary", opt1: "No", opt2: "Yes", color: "bg-orange-500" },
    { key: "CholCheck", label: "Cholesterol Check (5y)", type: "binary", opt1: "No", opt2: "Yes", color: "bg-yellow-500" },
    { key: "BMI", label: "BMI (Body Mass Index)", type: "number", min: 10, max: 60, step: 0.1 },
    { key: "Smoker", label: "Smoker Status", type: "binary", opt1: "No", opt2: "Yes", color: "bg-amber-500" },
    { key: "Stroke", label: "Stroke History", type: "binary", opt1: "No", opt2: "Yes", color: "bg-purple-500" },
    { key: "HeartDiseaseorAttack", label: "Heart History", type: "binary", opt1: "No", opt2: "Yes", color: "bg-rose-500" },
    { key: "PhysActivity", label: "Physically Active", type: "binary", opt1: "No", opt2: "Yes", color: "bg-green-500" },
    { key: "Fruits", label: "Fruits Regularly", type: "binary", opt1: "No", opt2: "Yes", color: "bg-lime-500" },
    { key: "Veggies", label: "Veggies Regularly", type: "binary", opt1: "No", opt2: "Yes", color: "bg-emerald-500" },
    { key: "HvyAlcoholConsump", label: "Heavy Alcohol", type: "binary", opt1: "No", opt2: "Yes", color: "bg-blue-500" },
    { key: "AnyHealthcare", label: "Health Coverage", type: "binary", opt1: "No", opt2: "Yes", color: "bg-cyan-500" },
    { key: "NoDocbcCost", label: "Cost Barrier", type: "binary", opt1: "No", opt2: "Yes", color: "bg-sky-500" },
    { key: "GenHlth", label: "General Health", type: "select", options: [
      { value: 1, label: "Excellent" }, { value: 2, label: "Very Good" }, { value: 3, label: "Good" }, { value: 4, label: "Fair" }, { value: 5, label: "Poor" },
    ] },
    { key: "MentHlth", label: "Ment. Health Days", type: "number", min: 0, max: 30, step: 1 },
    { key: "PhysHlth", label: "Phys. Health Days", type: "number", min: 0, max: 30, step: 1 },
    { key: "DiffWalk", label: "Difficulty Walking", type: "binary", opt1: "No", opt2: "Yes", color: "bg-fuchsia-500" },
    { key: "Age", label: "Age", type: "number", min: 18, max: 100, step: 1 },
    { key: "Education", label: "Education", type: "select", options: [
      { value: 1, label: "No School" },
      { value: 2, label: "Grades 1-8" },
      { value: 3, label: "Grades 9-11" },
      { value: 4, label: "Grade 12/GED" },
      { value: 5, label: "College 1-3y" },
      { value: 6, label: "College 4y+" }
    ] },
    { key: "Income", label: "Income Level", type: "select", options: [
      { value: 1, label: "< $10k" },
      { value: 2, label: "$10k-$15k" },
      { value: 3, label: "$15k-$20k" },
      { value: 4, label: "$20k-$25k" },
      { value: 5, label: "$25k-$35k" },
      { value: 6, label: "$35k-$50k" },
      { value: 7, label: "$50k-$75k" },
      { value: 8, label: ">= $75k" }
    ] },
  ];

  const fieldNotes: Record<string, string> = {
    Sex: "Biological sex is a key risk factor for many health conditions.",
    HighBP: "High blood pressure increases risk for heart disease and stroke.",
    HighChol: "High cholesterol is linked to cardiovascular risk.",
    CholCheck: "Recent cholesterol check helps assess current health status.",
    BMI: "Body Mass Index (BMI) is a measure of body fat based on height and weight.",
    Smoker: "Smoking is a major risk factor for many diseases.",
    Stroke: "History of stroke increases risk for future events.",
    HeartDiseaseorAttack: "Previous heart disease or attack is a strong predictor of risk.",
    PhysActivity: "Physical activity reduces risk for many chronic diseases.",
    Fruits: "Regular fruit intake is associated with better health outcomes.",
    Veggies: "Regular vegetable intake is associated with better health outcomes.",
    HvyAlcoholConsump: "Heavy alcohol use increases risk for several diseases.",
    AnyHealthcare: "Access to healthcare can affect disease management and outcomes.",
    NoDocbcCost: "Not seeing a doctor due to cost may indicate barriers to care.",
    GenHlth: "General health perception summarizes overall well-being.",
    MentHlth: "Poor mental health days can impact physical health and risk.",
    PhysHlth: "Poor physical health days indicate recent health challenges.",
    DiffWalk: "Difficulty walking may reflect underlying health issues.",
    Age: "Age is a primary risk factor for many conditions.",
    Education: "Education level is linked to health literacy and outcomes.",
    Income: "Income level can affect access to care and health behaviors."
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 mt-10 mb-16">
        {/* Header */}
        <div className="text-center border-b border-gray-100 pb-8 mb-8">
          <h2 className="text-4xl font-black text-gray-800 tracking-tight italic">
            Health Profile
          </h2>
          <p className="text-gray-400 font-medium mt-2 uppercase tracking-widest text-xs">
            AI Risk Assessment Module
          </p>
        </div>

        {/* FORM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          {fieldDefs.map((f) => {
            if (f.type === "binary") {
              return (
                <div key={f.key} className="group">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">{f.label}</label>
                  <div className="relative flex bg-gray-100 rounded-2xl p-1 border border-gray-200 h-12 overflow-hidden">
                    <div
                      className={`absolute top-1 bottom-1 w-[calc(50%-4px)] transition-all duration-300 ease-out rounded-xl shadow-md ${f.color} ${form[f.key] === 1 ? 'translate-x-full' : 'translate-x-0'}`}
                    />
                    <button
                      type="button"
                      onClick={() => updateField(f.key, 0)}
                      className={`relative z-10 w-1/2 flex items-center justify-center text-xs font-black transition-colors duration-300 !bg-transparent border-none ${form[f.key] === 0 ? 'text-white' : 'text-gray-500'}`}
                    >
                      {f.opt1}
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField(f.key, 1)}
                      className={`relative z-10 w-1/2 flex items-center justify-center text-xs font-black transition-colors duration-300 !bg-transparent border-none ${form[f.key] === 1 ? 'text-white' : 'text-gray-500'}`}
                    >
                      {f.opt2}
                    </button>
                  </div>
                  {fieldNotes[f.key] && (
                    <p className="text-xs text-gray-400 mt-1">{fieldNotes[f.key]}</p>
                  )}
                </div>
              );
            } else if (f.type === "number") {
              return (
                <div key={f.key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-gray-600">{f.label}</label>
                    <span className="text-blue-600 font-black px-3 py-1 bg-blue-50 rounded-lg border border-blue-100">{form[f.key]}</span>
                  </div>
                  {/* BMI Calculator UI for BMI field */}
                  {f.key === "BMI" && (
                    <BMICalculator onCalculate={(bmi) => updateField("BMI", bmi)} />
                  )}
                  <input 
                    type="range" min={f.min} max={f.max} step={f.step} 
                    value={form[f.key]} 
                    onChange={(e) => updateField(f.key, e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  {fieldNotes[f.key] && (
                    <p className="text-xs text-gray-400 mt-1">{fieldNotes[f.key]}</p>
                  )}
                </div>
              );
            } else {
              return (
                <div key={f.key} className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block">{f.label}</label>
                  <select
                    value={form[f.key]}
                    onChange={(e) => updateField(f.key, e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    {f.options?.map((opt: any) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {fieldNotes[f.key] && (
                    <p className="text-xs text-gray-400 mt-1">{fieldNotes[f.key]}</p>
                  )}
                </div>
              );
            }
          })}
        </div>

        {/* BUTTON SECTION INSIDE CARD */}
<div className="flex justify-center mt-12"> {/* Added mt-12 here */}
  <button
    type="button"
    className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-blue-200 active:scale-98 transition-all duration-300 animate-bounce-in"
        
    disabled={loading}
    onClick={async () => {
      setLoading(true);
      try {
        const result = await predictManual(form);
        if (onResult) onResult(result.data, form);
      } finally {
        setLoading(false);
      }
    }}
  >
    {loading ? "Analyzing..." : "Predict"}
  </button>
</div>
          </div>
        
    </>
  )
};