export default function Navbar() {
  return (
    <nav className="h-16 bg-gradient-to-r from-blue-900 to-blue-700 text-white flex items-center justify-between px-8 shadow-lg">
      <div className="flex items-center gap-3 text-xl font-black">
        🧬 <span>AI Diabetes Risk System</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="bg-blue-500 px-4 py-2 rounded-full text-xs font-bold">Medical AI</span>
      </div>
    </nav>
  );
}
