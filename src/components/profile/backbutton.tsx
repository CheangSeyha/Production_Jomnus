"use client"; // This is the key!

export default function BackButton() {
  return (
    <button 
      onClick={() => window.history.back()} 
      className="mt-4 text-blue-600 font-bold hover:underline"
    >
      ← Go Back
    </button>
  );
}