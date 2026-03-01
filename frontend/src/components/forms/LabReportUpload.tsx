
import { useState, useRef } from "react";
import { predictFile } from "../../api/predictApi";

export default function LabReportUpload({ onResult }: any) {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await predictFile(selectedFile);
      const result = response.data;
      onResult(result, null, selectedFile);
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Error uploading and analyzing file";
      setError(errorMsg);
      console.error("Upload error:", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-8 space-y-8 bg-white rounded-3xl shadow-2xl border border-gray-200 animate-fade-in mt-10">
      <h2 className="text-3xl font-black text-gray-800 mb-4 tracking-tight animate-fade-in-up">Upload Lab Report</h2>
      <label className="block cursor-pointer group">
        <span className="block text-base font-semibold text-gray-600 mb-2 group-hover:text-blue-700 transition-colors">Choose a file</span>
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.xls,.xlsx"
          onChange={handleFileChange}
          className="block w-full text-gray-700 border border-dashed border-2 border-gray-300 rounded-xl p-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-300 animate-fade-in"
        />
      </label>
      {selectedFile && <div className="text-sm text-green-600 font-semibold">Selected: {selectedFile.name}</div>}
      <div className="text-xs text-gray-500 animate-fade-in-up">Accepted formats: PNG, JPEG, PDF, DOCX, Excel</div>
      <button
        type="button"
        onClick={handleUpload}
        className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-blue-200 active:scale-98 transition-all duration-300 animate-bounce-in"
        disabled={loading || !selectedFile}
      >
        {loading ? (
          <span className="flex items-center gap-2 animate-pulse">
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading & Analyzing...
          </span>
        ) : "Upload & Analyze"}
      </button>
      {error && <div className="text-red-600 font-bold text-sm">{error}</div>}
    </div>
  );
}
