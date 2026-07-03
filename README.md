# AI Mock Interviewer 🎯

## 🔗 Live Demo
https://ai-mock-interviewer-rdt8.vercel.app/

## 🧠 Features
- 🤖 AI generated interview questions (different every time)
- 📊 Answer evaluation with scoring (0-10)
- ✅ Ideal answer shown after each question
- 🎤 Voice input support
- 📄 Resume upload (auto-detect role)
- ⏱️ Timer per question
- 📈 Past attempts history
- 📥 Download report

## ⚙️ Tech Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: FastAPI + Python
- AI: Groq API (Llama 3.3-70b)
- Deploy: Vercel (frontend) + Render (backend)

## 🚀 Run Locally

### Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

### Frontend
cd frontend
npm install
npm run dev
