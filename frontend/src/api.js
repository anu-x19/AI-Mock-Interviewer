// const API_URL = "http://127.0.0.1:8000";  
 const API_URL = "https://ai-mock-interviewer-backend-86mv.onrender.com";

export async function startInterview(role, difficulty) {
  const res = await fetch(`${API_URL}/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, difficulty }),
  });
  return res.json();
}

export async function evaluateAnswer(role, question, answer) {
  const res = await fetch(`${API_URL}/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, question, answer }),
  });
  return res.json();
}

export async function getSummary(role, qa_pairs, total_score) {
  const res = await fetch(`${API_URL}/summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, qa_pairs, total_score }),
  });
  return res.json();
}

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/upload_resume`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}