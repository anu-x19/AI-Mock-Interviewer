from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq_client import generate_questions, score_answer, generate_summary

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StartRequest(BaseModel):
    role: str
    difficulty: str

class AnswerRequest(BaseModel):
    role: str
    question: str
    answer: str

class SummaryRequest(BaseModel):
    role: str
    qa_pairs: list
    total_score: float

@app.get("/")
def root():
    return {"message": "AI Mock Interviewer API 🚀"}

@app.post("/start")
async def start(req: StartRequest):
    try:
        questions = await generate_questions(req.role, req.difficulty)
        return {"role": req.role, "difficulty": req.difficulty, "questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/evaluate")
async def evaluate(req: AnswerRequest):
    try:
        result = await score_answer(req.question, req.answer, req.role)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/summary")
async def summary(req: SummaryRequest):
    try:
        text = await generate_summary(req.role, req.qa_pairs, req.total_score)
        return {"summary": text, "total_score": req.total_score}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload_resume")
async def upload_resume(file: UploadFile = File(...)):
    try:
        import pdfplumber, io
        contents = await file.read()
        text = ""
        with pdfplumber.open(io.BytesIO(contents)) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
        from groq_client import detect_role_from_resume
        role = await detect_role_from_resume(text[:3000])
        return {"role": role}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))