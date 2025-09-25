"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState("Easy");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [results, setResults] = useState([]);

  // Load questions.json from public/
  useEffect(() => {
    fetch("/questions.json")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        if (data.length > 0) setSelectedQuestion(data[0]); // Default question
      })
      .catch((err) => console.error("Failed to load questions:", err));
  }, []);

  const filtered = questions.filter((q) => q.difficulty === difficulty);

  const runCode = async () => {
    if (!selectedQuestion) {
      alert("Please select a question first!");
      return;
    }

    const res = await fetch("http://localhost:8000/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        code,
        question_id: selectedQuestion.id,
      }),
    });

    const data = await res.json();
    setResults(data.results || []);
  };

  return (
    <div className="bg-white text-black min-h-screen p-6">
      {/* Top bar */}
      <div className="flex justify-between mb-6">
        <div>
          <label className="mr-2 font-semibold">Select Difficulty:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <div>
          <label className="mr-2 font-semibold">Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            <option value="python">Python</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: List of questions */}
        <div>
          <h2 className="font-bold text-lg mb-2">
            Questions ({difficulty})
          </h2>
          <ul className="space-y-1 mb-4">
            {filtered.map((q) => (
              <li
                key={q.id}
                onClick={() => setSelectedQuestion(q)}
                className={`p-2 border rounded cursor-pointer hover:bg-gray-100 ${
                  selectedQuestion?.id === q.id ? "bg-blue-100" : ""
                }`}
              >
                {q.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Question + Code editor + Results */}
        <div>
          {selectedQuestion && (
            <div className="p-4 border rounded-lg bg-gray-50 mb-4">
              <h3 className="text-xl font-semibold">
                {selectedQuestion.title}
              </h3>
              <p className="mt-2">{selectedQuestion.description}</p>

              <h4 className="mt-3 font-bold">Test Cases:</h4>
              <ul className="list-disc pl-6">
                {selectedQuestion.testcases.map((t, idx) => (
                  <li key={idx} className="mb-2">
                    <div>
                      <strong>Input:</strong>
                      <pre>{t.input}</pre>
                    </div>
                    <div>
                      <strong>Expected:</strong>
                      <pre>{t.output}</pre>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Code editor */}
          <textarea
            className="w-full h-64 border p-2 rounded font-mono"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your code here..."
          />

          <button
            onClick={runCode}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Run
          </button>

          {results && results.length > 0 && (
            <div className="mt-4 max-h-96 overflow-y-auto">
              {results.map((r, idx) => (
                <div
                  key={idx}
                  className="mb-2 p-2 border rounded bg-gray-50"
                >
                  <p>
                    <strong>Test Case {r.testcase}:</strong>{" "}
                    {r.passed ? "✅ Passed" : "❌ Failed"}
                  </p>
                  <div>
                    <strong>Input:</strong>
                    <pre>{r.input}</pre>
                  </div>
                  <div>
                    <strong>Expected:</strong>
                    <pre>{r.expected}</pre>
                  </div>
                  <div>
                    <strong>Output:</strong>
                    <pre>{r.output}</pre>
                  </div>
                  {r.stderr && (
                    <div>
                      <strong>Errors:</strong>
                      <pre>{r.stderr}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
