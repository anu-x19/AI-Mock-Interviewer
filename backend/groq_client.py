import os
import json
import httpx
import random
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.3-70b-versatile"


async def call_groq(system_prompt: str, user_message: str, max_tokens: int = 1024) -> str:
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        "temperature": 0.7,
        "max_tokens": max_tokens,
    }
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(GROQ_URL, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]


async def generate_questions(role: str, difficulty: str) -> list:
    seed = random.randint(1000, 99999)
    angles = [
        "fundamentals and core concepts",
        "real-world scenarios and problem solving",
        "best practices and common pitfalls",
        "system design and architecture thinking",
        "behavioral and situational judgment",
    ]
    angle = random.choice(angles)
    system = (
        "You are an expert technical interviewer. "
        "Generate exactly 7 UNIQUE and VARIED interview questions as a JSON array of strings. "
        "No extra text, no markdown, only a valid JSON array of strings."
    )
    user = (
        f"Generate 7 {difficulty} level interview questions for the role: {role}. "
        f"Focus on {angle} mixed with other areas. "
        f"Random seed: {seed}. Make questions fresh and different every time. "
        "Return ONLY a JSON array of 7 strings."
    )
    raw = await call_groq(system, user)
    raw = raw.strip().strip("```json").strip("```").strip()
    questions = json.loads(raw)
    return [q if isinstance(q, str) else q.get("question", str(q)) for q in questions[:7]]


async def score_answer(question: str, answer: str, role: str) -> dict:
    system = """You are a STRICT interview evaluator.

ABSOLUTE RULES - NO EXCEPTIONS:
- If answer is EXACTLY "hi", "hello", "ok", "yes", "no", "bye" or any single word → score MUST be 0
- If answer has less than 5 words and is not technical → score MUST be 0
- If answer is random text with no relevance to question → score MUST be 0 or 1
- Partially correct but incomplete → score 3 to 5
- Good answer with some gaps → score 6 or 7
- Excellent detailed answer → score 8 to 10

YOU MUST FOLLOW THESE RULES STRICTLY. DO NOT give more than 1 to irrelevant answers.

Return ONLY valid JSON, no markdown, no extra text:
{
  "score": <integer 0-10>,
  "feedback": "<2-3 sentences honest feedback>",
  "model_answer": "<complete correct expert answer, 4-5 sentences>"
}"""

    user = f"""Role: {role}
Question: {question}
Candidate Answer: "{answer}"

IMPORTANT: If the answer is just "{answer}" and it's a single word or irrelevant, score MUST be 0."""

    raw = await call_groq(system, user, max_tokens=600)
    raw = raw.strip().strip("```json").strip("```").strip()
    return json.loads(raw)


async def generate_summary(role: str, qa_pairs: list, total_score: float) -> str:
    system = (
        "You are an expert interview coach. "
        "Give a 3-4 sentence performance summary — honest, encouraging, specific. "
        "Plain text only, no bullet points."
    )
    qa_text = "\n".join(
        [f"Q: {item['question']}\nScore: {item['score']}/10" for item in qa_pairs]
    )
    user = (
        f"Role: {role}\n"
        f"Overall Score: {total_score:.1f}/10\n\n"
        f"Performance:\n{qa_text}\n\n"
        "Give final summary with key strengths and top 2 areas to improve."
    )
    return await call_groq(system, user, max_tokens=300)


async def detect_role_from_resume(resume_text: str) -> str:
    system = "You are an expert HR analyst. Read the resume and detect the most suitable job role."
    user = (
        f"Resume:\n{resume_text[:3000]}\n\n"
        "Reply with ONLY the job role title. Example: 'Data Scientist', 'AI/ML Engineer', 'Software Developer'"
    )
    return await call_groq(system, user, max_tokens=20)