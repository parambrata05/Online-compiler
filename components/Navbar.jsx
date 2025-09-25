"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link href="/">Online Compiler</Link>
      </div>
      <div className="space-x-4">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/questions" className="hover:underline">Questions</Link>
        <Link href="/compiler" className="hover:underline">Compiler</Link>
      </div>
    </nav>
  );
}
