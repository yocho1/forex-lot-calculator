import React from "react";
import Calculator from "./components/Calculator";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Forex Calculator
          </h1>
          <p className="text-slate-400 text-lg">Calculate lot size, risk management, and pip values</p>
        </header>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
          <div className="p-8">
            <Calculator />
          </div>
        </div>

        <footer className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Built with <span className="text-rose-500">❤️</span> for traders
          </p>
        </footer>
      </div>
    </div>
  );
}