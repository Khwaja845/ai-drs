import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function WelcomePage() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleStart = () => {
    if (!name.trim() || !mobile.trim()) {
      setError("Please fill the input details");
      return;
    }
    // Mobile validation: must be exactly 10 digits
    if (!/^\d{10}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setError("");
    // Store name/mobile in localStorage
    localStorage.setItem("user_name", name);
    localStorage.setItem("user_mobile", mobile);
    navigate("/manual-input");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border border-blue-100">
        <p className="text-4xl md:text-5xl font-bold text-center text-blue-800">Welcome to AI-based Diabetes Risk Prediction System</p>
        <div className="mt-8 space-y-6">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 font-bold text-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          <input
            type="tel"
            placeholder="Enter mobile number"
            value={mobile}
            maxLength={10}
            pattern="\d{10}"
            onChange={e => {
              // Only allow digits
              const val = e.target.value.replace(/[^\d]/g, "");
              setMobile(val);
            }}
            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 font-bold text-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          {error && <div className="text-red-500 text-sm font-bold text-center">{error}</div>}
          <button
            className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-blue-200 active:scale-98 transition-all duration-300"
            onClick={handleStart}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
