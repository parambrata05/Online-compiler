# Online-compiler
Description:
A web-based online code compiler and code runner built with Next.js (React) for the frontend and FastAPI (Python) for the backend. Users can select programming questions, write code in multiple languages (Python, C, C++, Java, JavaScript), and run their solutions against predefined test cases. The platform provides instant feedback with pass/fail results, input/output display, and error messages, making it perfect for learning, practicing coding, or preparing for programming interviews.

Features:

Supports Python, C, C++, Java, JavaScript.

Fetches questions dynamically from questions.json.

Shows question description and test cases above the code editor.

Executes code safely using temporary files and captures stdout/stderr.

Highlights pass/fail for each test case.

Built with Next.js 15 (Turbopack) for a fast frontend experience.

FastAPI backend with CORS support for API communication.

Designed for learning, testing, and practicing coding in a browser.

Usage:

Clone the repository.

Run the backend: python -m uvicorn backend.main:app --reload --port 8000.

Run the frontend: npm run dev.

Open http://localhost:3000 in your browser.

Select a question, choose a programming language, write code, and click Run.
