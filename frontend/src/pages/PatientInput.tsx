import { useState } from "react";
import { useNavigate } from "react-router-dom";

type ManualFormData = {
  Age: number;
  Sex: number;
  HighBP: number;
  HighChol: number;
  Smoker: number;
  Stroke: number;
  HeartDiseaseorAttack: number;
  HvyAlcoholConsump: number;
  PhysActivity: number;
};
import ManualInputForm from "../components/forms/ManualInputForm";
import Dashboard from "./Dashboard";
import { predictManual} from "../api/predictApi";
import { downloadReport } from "../api/reportApi";

export default function PatientInput() {
  const [step, setStep] = useState(1); // Start directly at manual input
  const navigate = useNavigate();
  const [inputMode] = useState<'manual'>('manual');
  const [manualData, setManualData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [pred, setPred] = useState<any>(null);
  const [reportMsg, setReportMsg] = useState<string>("");

  // Step 0 removed: always show manual input

  // Step 1: Input form
  if (step === 1) {
    return (
      <div className="flex flex-col items-center gap-8 mt-10">
        <ManualInputForm
          onResult={(_: unknown, form: ManualFormData) => setManualData(form)}
          noButton // disables inner button
        />
        <button
          className="w-full max-w-md py-4 bg-gradient-to-r from-blue-900 to-blue-700 text-white text-xl font-black rounded-2xl shadow-xl mt-4"
          onClick={async () => {
            setLoading(true);
            setReportMsg("");
            let result;
            try {
              if (manualData) {
                const manualRes = await predictManual(manualData);
                result = manualRes.data;
              }
              setPred(result);
              setStep(2);
            } catch (err) {
              setReportMsg('Error generating analysis.');
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading || !manualData}
        >
          {loading ? 'Processing...' : 'Generate Risk Report'}
        </button>
        {reportMsg && <div className="text-red-700 font-bold mt-2">{reportMsg}</div>}
      </div>
    );
  }

  // Step 2: Show result and download option
  if (step === 2) {
    // Retrieve name and mobile from localStorage
    const userName = localStorage.getItem("user_name") || "";
    const userMobile = localStorage.getItem("user_mobile") || "";
    return (
      <div className="flex flex-col items-center gap-8 mt-10">
        <Dashboard prediction={pred} />
        <button
          className="w-full max-w-md py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-xl shadow-lg mt-2"
          onClick={async () => {
            setReportMsg("");
            let reportPayload;
            if (inputMode === 'manual' && manualData && pred) {
              // Convert shap_values to a dictionary for backend PDF
              const shapDict: Record<string, number> = {};
              if (pred.features && pred.shap_values) {
                pred.features.forEach((f: string, i: number) => {
                  shapDict[f] = pred.shap_values[i];
                });
              }
              // Add name and mobile to payload
              reportPayload = { 
                ...manualData, 
                ...pred, 
                risk_score: pred.probability ?? pred.risk_score, 
                shap_values: shapDict,
                name: userName,
                mobile: userMobile
              };
            } 
            if (reportPayload) {
              try {
                const reportRes = await downloadReport(reportPayload);
                // Use name for filename if available
                const filename = userName ? `${userName}_diabetes_report.pdf` : "diabetes_report.pdf";
                const url = window.URL.createObjectURL(new Blob([reportRes.data], { type: 'application/pdf' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link);
                setReportMsg('Report generated and downloaded.');
              } catch (err) {
                setReportMsg('Error generating report.');
              }
            }
          }}
        >
          Download PDF Report
        </button>
        <button
          className="w-full max-w-md py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-base font-bold rounded-xl shadow mt-2"
          onClick={() => { navigate("/"); }}
        >
          Start Over
        </button>
        {reportMsg && <div className="text-green-700 font-bold mt-2">{reportMsg}</div>}
      </div>
    );
  }
}
