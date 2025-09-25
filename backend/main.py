from fastapi import FastAPI
from pydantic import BaseModel
from compiler import run_code
import json, os

# CORS setup for frontend
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load questions.json
QUESTIONS_FILE = os.path.join(os.path.dirname(__file__), "questions.json")
with open(QUESTIONS_FILE, "r", encoding="utf-8") as f:
    QUESTIONS = json.load(f)

class RunRequest(BaseModel):
    language: str
    code: str
    question_id: int = None

@app.get("/questions")
def get_questions(difficulty: str = None):
    if difficulty:
        return [q for q in QUESTIONS if q["difficulty"] == difficulty]
    return QUESTIONS

@app.get("/question/{qid}")
def get_question(qid: int):
    for q in QUESTIONS:
        if q["id"] == qid:
            return q
    return {"error": "Question not found"}

@app.post("/run")
def run_submission(req: RunRequest):
    question = None
    if req.question_id:
        for q in QUESTIONS:
            if q["id"] == req.question_id:
                question = q
                break
        if not question:
            return {"error": "Question not found"}

    results = []

    if question:
        # Run code against each test case using stdin
        for idx, tc in enumerate(question["testcases"]):
            output = run_code(req.language, req.code, input_str=tc["input"])
            passed = (output.get("stdout", "").strip() == tc["output"].strip())
            results.append({
                "testcase": idx + 1,
                "input": tc["input"],
                "expected": tc["output"],
                "output": output.get("stdout", ""),
                "stderr": output.get("stderr", ""),
                "passed": passed
            })
        return {"results": results}

    # If no question_id provided, just run code normally
    output = run_code(req.language, req.code)
    results.append({
        "testcase": 1,
        "input": "",
        "expected": "",
        "output": output.get("stdout", ""),
        "stderr": output.get("stderr", ""),
        "passed": output.get("stderr", "") == ""
    })
    return {"results": results}
