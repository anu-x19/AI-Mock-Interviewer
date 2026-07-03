import React, { useState } from "react";
import Home from "./pages/Home";
import Interview from "./pages/Interview";
import Report from "./pages/Report";

export default function App() {
  const [page, setPage] = useState("home");
  const [session, setSession] = useState(null);
  const [result, setResult] = useState(null);

  const handleStart = (data) => {
    setSession(data);
    setPage("interview");
  };

  const handleFinish = (data) => {
    setResult(data);
    setPage("report");
  };

  const handleRestart = () => {
    setSession(null);
    setResult(null);
    setPage("home");
  };

  return (
    <>
      {page === "home" && <Home onStart={handleStart} />}

      {page === "interview" && session && (
        <Interview
          session={session}
          onFinish={handleFinish}
          onBack={() => setPage("home")}
        />
      )}

      {page === "report" && result && (
        <Report result={result} onRestart={handleRestart} />
      )}
    </>
  );
}