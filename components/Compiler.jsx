"use client";
import { useState } from "react";

export default function Compiler({ selectedQuestion }) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [results, setResults] = useState([]);

  const questionId = selectedQuestion ? selectedQuestion.id : null;

  async function runCode() {
    if (!questionId) {
      alert("Select a question first!");
      return;
    }

    const res = await fetch("http://localhost:8000/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language, question_id: questionId }),
    });

    const data = await res.json();
    setResults(data.results || []);
  }

  return (
    <div>
      <div className="mb-2">
        <label className="mr-2">Language:</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="python">Python</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="javascript">JavaScript</option>
        </select>
      </div>

      <textarea
        className="w-full h-48 border p-2 rounded mb-2"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your code here..."
      />

      <button
        onClick={runCode}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Run
      </button>

      {results.length > 0 && (
        <div className="mt-4 max-h-96 overflow-y-auto">
          {results.map((r, idx) => (
            <div key={idx} className="mb-2 p-2 border rounded">
              <p>
                <strong>Test Case {r.testcase}:</strong>{" "}
                {r.passed ? "Passed ✅" : "Failed ❌"}
              </p>
              <p>
                <strong>Input:</strong> <pre>{r.input}</pre>
              </p>
              <p>
                <strong>Expected:</strong> <pre>{r.expected}</pre>
              </p>
              <p>
                <strong>Output:</strong> <pre>{r.output}</pre>
              </p>
              {r.stderr && (
                <p>
                  <strong>Errors:</strong> <pre>{r.stderr}</pre>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
