
import { useState } from "react";

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
import LabReportUpload from "../components/forms/LabReportUpload";
import Dashboard from "./Dashboard";
import { predictManual, predictFile } from "../api/predictApi";
import { downloadReport } from "../api/reportApi";


export default function PatientInput() {
  const [step, setStep] = useState(1); // Start directly at manual input
  const [inputMode] = useState<'manual'>('manual');
  const [manualData, setManualData] = useState<any>(null);
  const [labFile, setLabFile] = useState<File | null>(null);
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
              let shapDict = {};
              if (pred.features && pred.shap_values) {
                pred.features.forEach((f: string, i: number) => {
                  shapDict[f] = pred.shap_values[i];
                });
              }
              reportPayload = { ...manualData, ...pred, risk_score: pred.probability ?? pred.risk_score, shap_values: shapDict };
            } else if (inputMode === 'file' && pred) {
              reportPayload = { ...pred };
            }
            if (reportPayload) {
              try {
                const reportRes = await downloadReport(reportPayload);
                const url = window.URL.createObjectURL(new Blob([reportRes.data], { type: 'application/pdf' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'diabetes_report.pdf');
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
          onClick={() => { setStep(1); setManualData(null); setLabFile(null); setPred(null); setReportMsg(""); }}
        >
          Start Over
        </button>
        {reportMsg && <div className="text-green-700 font-bold mt-2">{reportMsg}</div>}
      </div>
    );
  }
}
