// // import React, { useState } from "react";
// // import { evaluateAnswer, getSummary } from "../api";

// // export default function Interview({ session, onFinish }) {
// //   const questions = session?.questions || [];

// //   const [index, setIndex] = useState(0);
// //   const [answer, setAnswer] = useState("");
// //   const [qaPairs, setQaPairs] = useState([]);
// //   const [loading, setLoading] = useState(false);

// //   const currentQuestion = questions[index];

// //   if (!questions.length) {
// //     return (
// //       <div className="text-white p-6">
// //         ❌ No questions received from backend
// //       </div>
// //     );
// //   }

// //   const handleNext = async () => {
// //     if (!answer.trim()) return;

// //     setLoading(true);

// //     try {
// //       // 1. Evaluate answer
// //       const res = await evaluateAnswer(
// //         session.role,
// //         currentQuestion,
// //         answer
// //       );

// //       const updated = [
// //         ...qaPairs,
// //         {
// //           question: currentQuestion,
// //           answer,
// //           score: res.score,
// //           feedback: res.feedback,
// //         },
// //       ];

// //       setQaPairs(updated);
// //       setAnswer("");

// //       // 2. Move next OR finish
// //       if (index + 1 < questions.length) {
// //         setIndex(index + 1);
// //       } else {
// //         const total =
// //           updated.reduce((acc, cur) => acc + cur.score, 0) /
// //           updated.length;

// //         const summaryRes = await getSummary(
// //           session.role,
// //           updated,
// //           total
// //         );

// //         onFinish({
// //           role: session.role,
// //           difficulty: session.difficulty,
// //           total_score: total,
// //           summary: summaryRes.summary,
// //           qa_pairs: updated,
// //         });
// //       }
// //     } catch (err) {
// //       console.log(err);
// //     }

// //     setLoading(false);
// //   };

// //   return (
// //     <div className="min-h-screen p-6 bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 text-white">
      
// //       {/* HEADER */}
// //       <div className="text-center mb-6">
// //         <h1 className="text-2xl font-bold">AI Interview</h1>
// //         <p className="text-sm opacity-80">
// //           {session.role} • {session.difficulty}
// //         </p>
// //       </div>

// //       {/* QUESTION CARD */}
// //       <div className="bg-white/10 p-6 rounded-2xl shadow-lg mb-6 animate-fade-in">
// //         <h2 className="text-lg font-semibold">
// //           Q{index + 1}. {currentQuestion}
// //         </h2>
// //       </div>

// //       {/* ANSWER BOX */}
// //       <textarea
// //         className="w-full p-4 rounded-xl text-black outline-none"
// //         rows="5"
// //         placeholder="Type your answer..."
// //         value={answer}
// //         onChange={(e) => setAnswer(e.target.value)}
// //       />

// //       {/* BUTTON */}
// //       <button
// //         onClick={handleNext}
// //         disabled={loading}
// //         className="mt-4 w-full bg-black/30 hover:bg-black/50 py-3 rounded-xl font-bold transition"
// //       >
// //         {loading
// //           ? "Checking..."
// //           : index + 1 === questions.length
// //           ? "Finish Interview"
// //           : "Next Question"}
// //       </button>

// //       {/* PROGRESS */}
// //       <div className="mt-4 text-center text-sm opacity-80">
// //         Question {index + 1} / {questions.length}
// //       </div>
// //     </div>
// //   );
// // }






// import React, { useState } from "react";
// import { evaluateAnswer, getSummary } from "../api";

// export default function Interview({ session, onFinish, onBack }) {
//   const questions = session?.questions || [];
//   const [index, setIndex] = useState(0);
//   const [answer, setAnswer] = useState("");
//   const [qaPairs, setQaPairs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [feedback, setFeedback] = useState(null);

//   const currentQuestion = questions[index];

//   if (!questions.length) {
//     return <div className="text-white p-6">❌ No questions received</div>;
//   }

//   const handleSubmit = async () => {
//     if (!answer.trim()) return;
//     setLoading(true);
//     try {
//       const res = await evaluateAnswer(session.role, currentQuestion, answer);
//       setFeedback(res);
//     } catch (err) {
//       console.error(err);
//     }
//     setLoading(false);
//   };

//   const handleNext = async () => {
//     const updated = [
//       ...qaPairs,
//       {
//         question: currentQuestion,
//         answer,
//         score: feedback.score,
//         feedback: feedback.feedback,
//       },
//     ];
//     setQaPairs(updated);
//     setAnswer("");
//     setFeedback(null);

//     if (index + 1 < questions.length) {
//       setIndex(index + 1);
//     } else {
//       const total = updated.reduce((a, c) => a + c.score, 0) / updated.length;
//       try {
//         const summaryRes = await getSummary(session.role, updated, total);
//         onFinish({
//           role: session.role,
//           difficulty: session.difficulty,
//           total_score: total,
//           summary: summaryRes.summary,
//           qa_pairs: updated,
//         });
//       } catch {
//         onFinish({
//           role: session.role,
//           difficulty: session.difficulty,
//           total_score: total,
//           summary: "Summary unavailable.",
//           qa_pairs: updated,
//         });
//       }
//     }
//   };

//   const progress = ((index + (feedback ? 1 : 0)) / questions.length) * 100;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
//       <div className="max-w-2xl mx-auto">

//         {/* Header */}
//         <div className="flex items-center justify-between mb-6 pt-4">
//           <button
//             onClick={onBack}
//             className="text-purple-300 hover:text-white text-sm font-medium transition"
//           >
//             ← Back to Home
//           </button>
//           <div className="text-right">
//             <p className="text-purple-300 text-sm">{session.role}</p>
//             <p className="text-gray-400 text-xs capitalize">{session.difficulty}</p>
//           </div>
//         </div>

//         {/* Progress */}
//         <div className="mb-6">
//           <div className="flex justify-between text-xs text-gray-400 mb-1">
//             <span>Question {index + 1} of {questions.length}</span>
//             <span>{Math.round(progress)}%</span>
//           </div>
//           <div className="w-full bg-white/10 rounded-full h-2">
//             <div className="h-2 bg-purple-500 rounded-full transition-all duration-500"
//               style={{ width: `${progress}%` }} />
//           </div>
//         </div>

//         {/* Question */}
//         <div className="bg-white/10 rounded-2xl p-6 border border-white/20 mb-6">
//           <p className="text-purple-300 text-xs uppercase tracking-widest mb-2">Question {index + 1}</p>
//           <p className="text-white text-lg leading-relaxed">{currentQuestion}</p>
//         </div>

//         {/* Answer or Feedback */}
//         {!feedback ? (
//           <div>
//             <textarea
//               value={answer}
//               onChange={(e) => setAnswer(e.target.value)}
//               rows={5}
//               placeholder="Type your answer here..."
//               className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 resize-none text-sm"
//             />
//             <button
//               onClick={handleSubmit}
//               disabled={loading || !answer.trim()}
//               className="mt-3 w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-semibold rounded-xl transition"
//             >
//               {loading ? "Evaluating..." : "Submit Answer →"}
//             </button>
//           </div>
//         ) : (
//           <div className="space-y-4">

//             {/* Your Answer */}
//             <div className="bg-white/5 rounded-xl p-4 border border-white/10">
//               <p className="text-gray-400 text-xs uppercase mb-2">Your Answer</p>
//               <p className="text-gray-300 text-sm italic">"{answer}"</p>
//             </div>

//             {/* Score */}
//             <div className={`rounded-xl p-4 border flex justify-between items-center ${
//               feedback.score >= 8 ? "bg-green-500/10 border-green-500/30"
//               : feedback.score >= 5 ? "bg-yellow-500/10 border-yellow-500/30"
//               : "bg-red-500/10 border-red-500/30"
//             }`}>
//               <p className="text-white font-semibold">Score</p>
//               <p className={`text-3xl font-bold ${
//                 feedback.score >= 8 ? "text-green-400"
//                 : feedback.score >= 5 ? "text-yellow-400"
//                 : "text-red-400"
//               }`}>{feedback.score}/10</p>
//             </div>

//             {/* AI Feedback */}
//             <div className="bg-white/10 rounded-xl p-4 border border-white/20">
//               <p className="text-purple-300 text-xs uppercase mb-2">💬 AI Feedback</p>
//               <p className="text-gray-200 text-sm leading-relaxed">{feedback.feedback}</p>
//             </div>

//             {/* ✅ Ideal Answer */}
//             {feedback.model_answer && (
//               <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-400/30">
//                 <p className="text-purple-300 text-xs uppercase mb-2">✅ Ideal Answer</p>
//                 <p className="text-gray-200 text-sm leading-relaxed">{feedback.model_answer}</p>
//               </div>
//             )}

//             <button
//               onClick={handleNext}
//               className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition"
//             >
//               {index + 1 >= questions.length ? "See Final Report 🏆" : "Next Question →"}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }









// import React, { useState, useRef } from "react";
// import { evaluateAnswer, getSummary } from "../api";

// export default function Interview({ session, onFinish, onBack }) {
//   const questions = session?.questions || [];
//   const [index, setIndex] = useState(0);
//   const [answer, setAnswer] = useState("");
//   const [qaPairs, setQaPairs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [feedback, setFeedback] = useState(null);
//   const [listening, setListening] = useState(false);
//   const recognitionRef = useRef(null);

//   const currentQuestion = questions[index];

//   if (!questions.length) {
//     return <div className="text-white p-6">❌ No questions received</div>;
//   }

//   const startVoice = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert("Voice not supported in this browser. Use Chrome!");
//       return;
//     }
//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.continuous = false;
//     recognition.interimResults = false;

//     recognition.onstart = () => setListening(true);
//     recognition.onend = () => setListening(false);
//     recognition.onresult = (e) => {
//       const transcript = e.results[0][0].transcript;
//       setAnswer((prev) => prev ? prev + " " + transcript : transcript);
//     };
//     recognition.onerror = () => setListening(false);

//     recognitionRef.current = recognition;
//     recognition.start();
//   };

//   const stopVoice = () => {
//     recognitionRef.current?.stop();
//     setListening(false);
//   };

//   const handleSubmit = async () => {
//     if (!answer.trim()) return;
//     setLoading(true);
//     try {
//       const res = await evaluateAnswer(session.role, currentQuestion, answer);
//       setFeedback(res);
//     } catch (err) {
//       console.error(err);
//       setFeedback({ score: 0, feedback: "Error evaluating.", model_answer: "N/A" });
//     }
//     setLoading(false);
//   };

//   const handleNext = async () => {
//     const updated = [
//       ...qaPairs,
//       {
//         question: currentQuestion,
//         answer,
//         score: feedback.score,
//         feedback: feedback.feedback,
//       },
//     ];
//     setQaPairs(updated);
//     setAnswer("");
//     setFeedback(null);

//     if (index + 1 < questions.length) {
//       setIndex(index + 1);
//     } else {
//       const total = updated.reduce((a, c) => a + c.score, 0) / updated.length;
//       try {
//         const summaryRes = await getSummary(session.role, updated, total);
//         onFinish({
//           role: session.role,
//           difficulty: session.difficulty,
//           total_score: total,
//           summary: summaryRes.summary,
//           qa_pairs: updated,
//         });
//       } catch {
//         onFinish({
//           role: session.role,
//           difficulty: session.difficulty,
//           total_score: total,
//           summary: "Summary unavailable.",
//           qa_pairs: updated,
//         });
//       }
//     }
//   };

//   const progress = ((index + (feedback ? 1 : 0)) / questions.length) * 100;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
//       <div className="max-w-2xl mx-auto">

//         {/* Header */}
//         <div className="flex items-center justify-between mb-6 pt-4">
//           <button
//             onClick={onBack}
//             className="text-purple-300 hover:text-white text-sm font-medium transition"
//           >
//             ← Back to Home
//           </button>
//           <div className="text-right">
//             <p className="text-purple-300 text-sm">{session.role}</p>
//             <p className="text-gray-400 text-xs capitalize">{session.difficulty}</p>
//           </div>
//         </div>

//         {/* Progress */}
//         <div className="mb-6">
//           <div className="flex justify-between text-xs text-gray-400 mb-1">
//             <span>Question {index + 1} of {questions.length}</span>
//             <span>{Math.round(progress)}%</span>
//           </div>
//           <div className="w-full bg-white/10 rounded-full h-2">
//             <div className="h-2 bg-purple-500 rounded-full transition-all duration-500"
//               style={{ width: `${progress}%` }} />
//           </div>
//         </div>

//         {/* Question */}
//         <div className="bg-white/10 rounded-2xl p-6 border border-white/20 mb-6">
//           <p className="text-purple-300 text-xs uppercase tracking-widest mb-2">Question {index + 1}</p>
//           <p className="text-white text-lg leading-relaxed">{currentQuestion}</p>
//         </div>

//         {/* Answer or Feedback */}
//         {!feedback ? (
//           <div>
//             {/* Textarea + Mic */}
//             <div className="relative">
//               <textarea
//                 value={answer}
//                 onChange={(e) => setAnswer(e.target.value)}
//                 rows={5}
//                 placeholder="Type your answer or use 🎤 mic..."
//                 className="w-full bg-white/10 border border-white/20 rounded-xl p-4 pr-14 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 resize-none text-sm"
//               />
//               {/* Mic Button */}
//               <button
//                 onClick={listening ? stopVoice : startVoice}
//                 className={`absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
//                   listening
//                     ? "bg-red-500 animate-pulse"
//                     : "bg-purple-600 hover:bg-purple-500"
//                 }`}
//                 title={listening ? "Stop listening" : "Start voice input"}
//               >
//                 {listening ? "⏹" : "🎤"}
//               </button>
//             </div>

//             {listening && (
//               <p className="text-red-400 text-xs mt-1 text-center animate-pulse">
//                 🔴 Listening... speak now
//               </p>
//             )}

//             <button
//               onClick={handleSubmit}
//               disabled={loading || !answer.trim()}
//               className="mt-3 w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-semibold rounded-xl transition"
//             >
//               {loading ? "Evaluating..." : "Submit Answer →"}
//             </button>
//           </div>
//         ) : (
//           <div className="space-y-4">

//             {/* Your Answer */}
//             <div className="bg-white/5 rounded-xl p-4 border border-white/10">
//               <p className="text-gray-400 text-xs uppercase mb-2">Your Answer</p>
//               <p className="text-gray-300 text-sm italic">"{answer}"</p>
//             </div>

//             {/* Score */}
//             <div className={`rounded-xl p-4 border flex justify-between items-center ${
//               feedback.score >= 8 ? "bg-green-500/10 border-green-500/30"
//               : feedback.score >= 5 ? "bg-yellow-500/10 border-yellow-500/30"
//               : "bg-red-500/10 border-red-500/30"
//             }`}>
//               <p className="text-white font-semibold">Score</p>
//               <p className={`text-3xl font-bold ${
//                 feedback.score >= 8 ? "text-green-400"
//                 : feedback.score >= 5 ? "text-yellow-400"
//                 : "text-red-400"
//               }`}>{feedback.score}/10</p>
//             </div>

//             {/* AI Feedback */}
//             <div className="bg-white/10 rounded-xl p-4 border border-white/20">
//               <p className="text-purple-300 text-xs uppercase mb-2">💬 AI Feedback</p>
//               <p className="text-gray-200 text-sm leading-relaxed">{feedback.feedback}</p>
//             </div>

//             {/* Ideal Answer */}
//             {feedback.model_answer && (
//               <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-400/30">
//                 <p className="text-purple-300 text-xs uppercase mb-2">✅ Ideal Answer</p>
//                 <p className="text-gray-200 text-sm leading-relaxed">{feedback.model_answer}</p>
//               </div>
//             )}

//             <button
//               onClick={handleNext}
//               className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition"
//             >
//               {index + 1 >= questions.length ? "See Final Report 🏆" : "Next Question →"}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }










import React, { useState, useRef, useEffect } from "react";
import { evaluateAnswer, getSummary } from "../api";

export default function Interview({ session, onFinish, onBack }) {
  const questions = session?.questions || [];
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [qaPairs, setQaPairs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [listening, setListening] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  const currentQuestion = questions[index];

  // Timer
  useEffect(() => {
    if (feedback) return;
    setTimeLeft(120);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [index, feedback]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (!questions.length) {
    return <div className="text-white p-6">❌ No questions received</div>;
  }

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice not supported! Use Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setAnswer((prev) => prev ? prev + " " + transcript : transcript);
    };
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const handleSubmit = async () => {
    clearInterval(timerRef.current);
    if (!answer.trim()) return;
    setLoading(true);
    try {
      const res = await evaluateAnswer(session.role, currentQuestion, answer);
      setFeedback(res);
    } catch {
      setFeedback({ score: 0, feedback: "Error evaluating.", model_answer: "N/A" });
    }
    setLoading(false);
  };

  const handleNext = async () => {
    const updated = [
      ...qaPairs,
      {
        question: currentQuestion,
        answer,
        score: feedback.score,
        feedback: feedback.feedback,
      },
    ];
    setQaPairs(updated);
    setAnswer("");
    setFeedback(null);

    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      const total = updated.reduce((a, c) => a + c.score, 0) / updated.length;
      try {
        const summaryRes = await getSummary(session.role, updated, total);
        onFinish({
          role: session.role,
          difficulty: session.difficulty,
          total_score: total,
          summary: summaryRes.summary,
          qa_pairs: updated,
        });
      } catch {
        onFinish({
          role: session.role,
          difficulty: session.difficulty,
          total_score: total,
          summary: "Summary unavailable.",
          qa_pairs: updated,
        });
      }
    }
  };

  const progress = ((index + (feedback ? 1 : 0)) / questions.length) * 100;
  const timerColor = timeLeft <= 30 ? "text-red-400" : timeLeft <= 60 ? "text-yellow-400" : "text-green-400";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <button onClick={onBack} className="text-purple-300 hover:text-white text-sm font-medium transition">
            ← Back to Home
          </button>
          <div className="text-right">
            <p className="text-purple-300 text-sm">{session.role}</p>
            <p className="text-gray-400 text-xs capitalize">{session.difficulty}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Question {index + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div className="h-2 bg-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Timer */}
        {!feedback && (
          <div className="flex justify-center mb-4">
            <div className={`text-2xl font-bold ${timerColor} bg-white/10 px-6 py-2 rounded-full border border-white/20`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          </div>
        )}

        {/* Question */}
        <div className="bg-white/10 rounded-2xl p-6 border border-white/20 mb-6">
          <p className="text-purple-300 text-xs uppercase tracking-widest mb-2">Question {index + 1}</p>
          <p className="text-white text-lg leading-relaxed">{currentQuestion}</p>
        </div>

        {/* Answer or Feedback */}
        {!feedback ? (
          <div>
            <div className="relative">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={5}
                placeholder="Type your answer or use 🎤 mic..."
                className="w-full bg-white/10 border border-white/20 rounded-xl p-4 pr-14 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 resize-none text-sm"
              />
              <button
                onClick={listening ? stopVoice : startVoice}
                className={`absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  listening ? "bg-red-500 animate-pulse" : "bg-purple-600 hover:bg-purple-500"
                }`}
              >
                {listening ? "⏹" : "🎤"}
              </button>
            </div>
            {listening && (
              <p className="text-red-400 text-xs mt-1 text-center animate-pulse">🔴 Listening... speak now</p>
            )}
            <button
              onClick={handleSubmit}
              disabled={loading || !answer.trim()}
              className="mt-3 w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-semibold rounded-xl transition"
            >
              {loading ? "Evaluating..." : "Submit Answer →"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-gray-400 text-xs uppercase mb-2">Your Answer</p>
              <p className="text-gray-300 text-sm italic">"{answer}"</p>
            </div>

            <div className={`rounded-xl p-4 border flex justify-between items-center ${
              feedback.score >= 8 ? "bg-green-500/10 border-green-500/30"
              : feedback.score >= 5 ? "bg-yellow-500/10 border-yellow-500/30"
              : "bg-red-500/10 border-red-500/30"
            }`}>
              <p className="text-white font-semibold">Score</p>
              <p className={`text-3xl font-bold ${
                feedback.score >= 8 ? "text-green-400"
                : feedback.score >= 5 ? "text-yellow-400"
                : "text-red-400"
              }`}>{feedback.score}/10</p>
            </div>

            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <p className="text-purple-300 text-xs uppercase mb-2">💬 AI Feedback</p>
              <p className="text-gray-200 text-sm leading-relaxed">{feedback.feedback}</p>
            </div>

            {feedback.model_answer && (
              <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-400/30">
                <p className="text-purple-300 text-xs uppercase mb-2">✅ Ideal Answer</p>
                <p className="text-gray-200 text-sm leading-relaxed">{feedback.model_answer}</p>
              </div>
            )}

            <button
              onClick={handleNext}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition"
            >
              {index + 1 >= questions.length ? "See Final Report 🏆" : "Next Question →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}