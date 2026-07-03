import React, { useState } from "react";
import { startInterview } from "../api";

const ROLES = [
  { label: "Software Developer", icon: "💻" },
  { label: "Data Scientist", icon: "📊" },
  { label: "AI/ML Engineer", icon: "🤖" },
  { label: "Business Analyst", icon: "📈" },
  { label: "Full Stack Developer", icon: "🌐" },
  { label: "DevOps Engineer", icon: "⚙️" },
];

const DIFFICULTIES = ["easy", "medium", "hard"];

export default function Home({ onStart }) {
  const [selectedRole, setSelectedRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [error, setError] = useState("");
  const [resumeSuccess, setResumeSuccess] = useState("");

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Only PDF files supported!");
      return;
    }
    setResumeLoading(true);
    setError("");
    setResumeSuccess("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("http://127.0.0.1:8000/upload_resume", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setCustomRole(data.role);
      setSelectedRole("");
      setResumeSuccess(`✅ Detected: ${data.role}`);
    } catch {
      setError("Could not detect role. Please select manually.");
    }
    setResumeLoading(false);
  };

  const handleStart = async () => {
    const role = customRole.trim() || selectedRole;
    if (!role) {
      setError("Please select or enter a role!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await startInterview(role, difficulty);
      console.log("API response:", res);

      const raw = res.questions || res;
      const questions = raw.map(q =>
        typeof q === "string" ? q : q.question || q.text || String(q)
      );

      if (questions && questions.length > 0) {
        onStart({ role, difficulty, questions });
      } else {
        setError("No questions received. Check backend.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to generate questions. Check your API key & backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: "linear-gradient(135deg, #e9d5ff 0%, #c4b5fd 40%, #a78bfa 100%)",
      }}
    >
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-4xl font-bold text-purple-900 mb-2">AI Mock Interviewer</h1>
          <p className="text-purple-700 text-lg">Practice. Get feedback. Ace your interviews.</p>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-purple-200 shadow-2xl">

          {/* Resume Upload */}
          <div className="mb-6">
            <h2 className="text-purple-900 font-semibold text-lg mb-3">📄 Upload Resume (Auto-detect Role)</h2>
            <label className="flex items-center justify-center gap-3 w-full p-4 border-2 border-dashed border-purple-400/60 rounded-xl cursor-pointer hover:border-purple-600 hover:bg-purple-100/50 transition-all">
              <span className="text-2xl">📎</span>
              <span className="text-purple-700 text-sm font-medium">
                {resumeLoading ? "Detecting role..." : "Click to upload PDF resume"}
              </span>
              <input
                type="file"
                accept=".pdf"
                onChange={handleResumeUpload}
                className="hidden"
              />
            </label>
            {resumeSuccess && (
              <p className="text-green-600 text-sm mt-2 text-center font-semibold">{resumeSuccess}</p>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-purple-200" />
            <span className="text-purple-400 text-xs font-medium">OR SELECT MANUALLY</span>
            <div className="flex-1 h-px bg-purple-200" />
          </div>

          {/* Role Grid */}
          <h2 className="text-purple-900 font-semibold text-lg mb-4">Select Your Role</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {ROLES.map((r) => (
              <button
                key={r.label}
                onClick={() => { setSelectedRole(r.label); setCustomRole(""); setResumeSuccess(""); }}
                className={`p-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                  selectedRole === r.label && !customRole
                    ? "bg-purple-600 border-purple-400 text-white scale-105 shadow-lg"
                    : "bg-white/80 border-purple-200 text-purple-800 hover:bg-purple-100 hover:border-purple-400"
                }`}
              >
                <span className="text-xl block mb-1">{r.icon}</span>
                {r.label}
              </button>
            ))}
          </div>

          {/* Custom Role */}
          <div className="mb-6">
            <label className="text-purple-800 text-sm mb-2 block font-medium">Or type a custom role</label>
            <input
              type="text"
              placeholder="e.g. Product Manager, Cloud Architect..."
              value={customRole}
              onChange={(e) => { setCustomRole(e.target.value); setSelectedRole(""); }}
              className="w-full bg-white/80 border border-purple-200 rounded-xl px-4 py-3 text-purple-900 placeholder-purple-400 focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          {/* Difficulty */}
          <div className="mb-8">
            <label className="text-purple-800 text-sm mb-3 block font-medium">Difficulty Level</label>
            <div className="flex gap-3">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2 rounded-xl border text-sm font-medium capitalize transition-all ${
                    difficulty === d
                      ? d === "easy" ? "bg-green-500 border-green-400 text-white shadow"
                      : d === "medium" ? "bg-yellow-500 border-yellow-400 text-white shadow"
                      : "bg-red-500 border-red-400 text-white shadow"
                      : "bg-white/80 border-purple-200 text-purple-700 hover:bg-purple-100"
                  }`}
                >
                  {d === "easy" ? "🟢" : d === "medium" ? "🟡" : "🔴"} {d}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          {/* Start Button */}
          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-bold text-lg rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Generating Questions...
              </span>
            ) : "Start Interview →"}
          </button>

        </div>
      </div>
    </div>
  );
}