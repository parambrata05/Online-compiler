"use client";
import { useEffect, useState } from "react";

export default function QuestionsBrowser({ onSelect }) {
  const [questions, setQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState("Easy");
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/questions.json");
      const data = await res.json();
      setQuestions(data);
    }
    load();
  }, []);

  const filtered = questions.filter((q) => q.difficulty === difficulty);

  function handleSelect(q) {
    setSelectedQuestion(q);
    onSelect(q);
  }

  return (
    <div>
      <label className="mr-2 font-semibold">Difficulty:</label>
      <select
        value={difficulty}
        onChange={(e) => {
          setDifficulty(e.target.value);
          setSelectedQuestion(null);
          onSelect(null);
        }}
        className="p-1 border rounded mb-2"
      >
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>

      <ul className="mb-4 space-y-1 max-h-80 overflow-y-auto">
        {filtered.map((q) => (
          <li key={q.id}>
            <button
              onClick={() => handleSelect(q)}
              className="text-blue-600 hover:underline"
            >
              {q.id}. {q.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
