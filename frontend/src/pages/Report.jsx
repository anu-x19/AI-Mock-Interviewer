// import React from "react";

// export default function Report({ result, onRestart }) {
//   if (!result) {
//     return (
//       <div className="text-white p-10">
//         No report data found. Please restart interview.
//       </div>
//     );
//   }

//   const { role, difficulty, total_score, summary, qa_pairs } = result;

//   const safeScore = total_score || 0;

//   const grade =
//     safeScore >= 8
//       ? { label: "Excellent", color: "text-green-400", bg: "bg-green-500/10 border-green-500/30", emoji: "🏆" }
//       : safeScore >= 6
//       ? { label: "Good", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30", emoji: "👍" }
//       : safeScore >= 4
//       ? { label: "Average", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30", emoji: "💪" }
//       : { label: "Needs Work", color: "text-red-400", bg: "bg-red-500/10 border-red-500/30", emoji: "📚" };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
//       <div className="max-w-2xl mx-auto">

//         {/* HEADER */}
//         <div className="text-center mb-8 pt-6">
//           <div className="text-6xl mb-3">{grade.emoji}</div>
//           <h1 className="text-3xl font-bold text-white mb-1">
//             Interview Complete!
//           </h1>
//           <p className="text-purple-300">
//             {role} · <span className="capitalize">{difficulty}</span>
//           </p>
//         </div>

//         {/* SCORE CARD */}
//         <div className={`rounded-2xl p-6 border ${grade.bg} mb-6 text-center`}>
//           <p className="text-gray-400 text-sm mb-1">Overall Score</p>

//           <p className={`text-7xl font-bold ${grade.color} mb-2`}>
//             {safeScore.toFixed(1)}
//           </p>

//           <p className="text-gray-300 text-sm">out of 10</p>

//           <div className="mt-4 w-full bg-white/10 rounded-full h-3">
//             <div
//               className={`h-3 rounded-full transition-all duration-1000 ${
//                 safeScore >= 8
//                   ? "bg-green-500"
//                   : safeScore >= 6
//                   ? "bg-yellow-500"
//                   : safeScore >= 4
//                   ? "bg-orange-500"
//                   : "bg-red-500"
//               }`}
//               style={{ width: `${safeScore * 10}%` }}
//             />
//           </div>

//           <span
//             className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-semibold ${grade.color} bg-white/10`}
//           >
//             {grade.label}
//           </span>
//         </div>

//         {/* SUMMARY */}
//         <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-6">
//           <h2 className="text-purple-300 font-semibold text-sm uppercase tracking-widest mb-3">
//             🤖 AI Feedback
//           </h2>
//           <p className="text-gray-200 leading-relaxed text-sm">
//             {summary || "No summary available"}
//           </p>
//         </div>

//         {/* QA BREAKDOWN */}
//         <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-6">
//           <h2 className="text-purple-300 font-semibold text-sm uppercase tracking-widest mb-4">
//             📋 Question Breakdown
//           </h2>

//           <div className="space-y-4">
//             {(qa_pairs || []).map((qa, i) => (
//               <div key={i} className="border border-white/10 rounded-xl p-4">
//                 <div className="flex justify-between items-start mb-2">
//                   <p className="text-white text-sm font-medium flex-1 pr-3">
//                     Q{i + 1}. {qa.question}
//                   </p>

//                   <span
//                     className={`text-sm font-bold ${
//                       qa.score >= 8
//                         ? "text-green-400"
//                         : qa.score >= 5
//                         ? "text-yellow-400"
//                         : "text-red-400"
//                     }`}
//                   >
//                     {qa.score}/10
//                   </span>
//                 </div>

//                 <p className="text-gray-400 text-xs mb-2 italic">
//                   "{qa.answer?.slice(0, 100)}
//                   {qa.answer?.length > 100 ? "..." : ""}"
//                 </p>

//                 <p className="text-gray-300 text-xs">{qa.feedback}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* RESTART */}
//         <button
//           onClick={onRestart}
//           className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold text-lg rounded-xl transition-all hover:scale-[1.02] mb-8"
//         >
//           🔄 Practice Again
//         </button>
//       </div>
//     </div>
//   );
// }









import React, { useEffect } from "react";

export default function Report({ result, onRestart }) {
  if (!result) {
    return <div className="text-white p-10">No report data. Please restart.</div>;
  }

  const { role, difficulty, total_score, summary, qa_pairs } = result;
  const safeScore = total_score || 0;

  const grade =
    safeScore >= 8 ? { label: "Excellent", color: "text-green-400", bg: "bg-green-500/10 border-green-500/30", emoji: "🏆" }
    : safeScore >= 6 ? { label: "Good", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30", emoji: "👍" }
    : safeScore >= 4 ? { label: "Average", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30", emoji: "💪" }
    : { label: "Needs Work", color: "text-red-400", bg: "bg-red-500/10 border-red-500/30", emoji: "📚" };

  // Save to history
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("interview_history") || "[]");
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      role,
      difficulty,
      score: safeScore.toFixed(1),
      grade: grade.label,
    };
    history.unshift(newEntry);
    localStorage.setItem("interview_history", JSON.stringify(history.slice(0, 10)));
  }, []);

  // PDF Download
  const handleDownloadPDF = () => {
    const content = `
AI MOCK INTERVIEWER - REPORT
=============================
Date: ${new Date().toLocaleDateString()}
Role: ${role}
Difficulty: ${difficulty}
Overall Score: ${safeScore.toFixed(1)}/10
Grade: ${grade.label}

AI FEEDBACK:
${summary || "No summary available"}

QUESTION BREAKDOWN:
${(qa_pairs || []).map((qa, i) =>
  `Q${i + 1}: ${qa.question}
Your Answer: ${qa.answer}
Score: ${qa.score}/10
Feedback: ${qa.feedback}
`).join("\n")}
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interview_report_${role}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get history
  const history = JSON.parse(localStorage.getItem("interview_history") || "[]");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8 pt-6">
          <div className="text-6xl mb-3">{grade.emoji}</div>
          <h1 className="text-3xl font-bold text-white mb-1">Interview Complete!</h1>
          <p className="text-purple-300">{role} · <span className="capitalize">{difficulty}</span></p>
        </div>

        {/* Score Card */}
        <div className={`rounded-2xl p-6 border ${grade.bg} mb-6 text-center`}>
          <p className="text-gray-400 text-sm mb-1">Overall Score</p>
          <p className={`text-7xl font-bold ${grade.color} mb-2`}>{safeScore.toFixed(1)}</p>
          <p className="text-gray-300 text-sm">out of 10</p>
          <div className="mt-4 w-full bg-white/10 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ${
                safeScore >= 8 ? "bg-green-500"
                : safeScore >= 6 ? "bg-yellow-500"
                : safeScore >= 4 ? "bg-orange-500"
                : "bg-red-500"
              }`}
              style={{ width: `${safeScore * 10}%` }}
            />
          </div>
          <span className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-semibold ${grade.color} bg-white/10`}>
            {grade.label}
          </span>
        </div>

        {/* AI Summary */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-6">
          <h2 className="text-purple-300 font-semibold text-sm uppercase tracking-widest mb-3">🤖 AI Feedback</h2>
          <p className="text-gray-200 leading-relaxed text-sm">{summary || "No summary available"}</p>
        </div>

        {/* Question Breakdown */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-6">
          <h2 className="text-purple-300 font-semibold text-sm uppercase tracking-widest mb-4">📋 Question Breakdown</h2>
          <div className="space-y-4">
            {(qa_pairs || []).map((qa, i) => (
              <div key={i} className="border border-white/10 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-white text-sm font-medium flex-1 pr-3">Q{i + 1}. {qa.question}</p>
                  <span className={`text-sm font-bold shrink-0 ${
                    qa.score >= 8 ? "text-green-400"
                    : qa.score >= 5 ? "text-yellow-400"
                    : "text-red-400"
                  }`}>{qa.score}/10</span>
                </div>
                <p className="text-gray-400 text-xs mb-2 italic">"{qa.answer?.slice(0, 100)}{qa.answer?.length > 100 ? "..." : ""}"</p>
                <p className="text-gray-300 text-xs">{qa.feedback}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Past Attempts History */}
        {history.length > 1 && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-6">
            <h2 className="text-purple-300 font-semibold text-sm uppercase tracking-widest mb-4">📊 Past Attempts</h2>
            <div className="space-y-2">
              {history.map((h, i) => (
                <div key={h.id} className="flex justify-between items-center border border-white/10 rounded-xl p-3">
                  <div>
                    <p className="text-white text-sm font-medium">{h.role}</p>
                    <p className="text-gray-400 text-xs">{h.date} · <span className="capitalize">{h.difficulty}</span></p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      h.score >= 8 ? "text-green-400"
                      : h.score >= 6 ? "text-yellow-400"
                      : "text-red-400"
                    }`}>{h.score}/10</p>
                    <p className="text-gray-400 text-xs">{h.grade}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("interview_history");
                window.location.reload();
              }}
              className="mt-3 text-xs text-red-400 hover:text-red-300 transition"
            >
              🗑️ Clear History
            </button>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={handleDownloadPDF}
            className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-lg rounded-xl transition-all border border-white/20"
          >
            📄 Download Report
          </button>
          <button
            onClick={onRestart}
            className="flex-1 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold text-lg rounded-xl transition-all"
          >
            🔄 Practice Again
          </button>
        </div>

      </div>
    </div>
  );
}