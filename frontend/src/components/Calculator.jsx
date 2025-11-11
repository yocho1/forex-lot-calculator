import React, { useState, useMemo } from "react";

const PAIR_PIP_VALUES = {
  "EURUSD": 10,
  "GBPUSD": 10,
  "USDJPY": 9.13,
  "USDCHF": 10,
  "AUDUSD": 10,
  "USDCAD": 10,
  "NZDUSD": 10,
  "EURGBP": 8.6,
};

function toNumber(v) {
  const n = parseFloat(String(v).replace(",", "."));
  return Number.isNaN(n) ? 0 : n;
}

export default function Calculator() {
  const [balance, setBalance] = useState(10000);
  const [riskPercent, setRiskPercent] = useState(1);
  const [stopLossPips, setStopLossPips] = useState(30);
  const [pair, setPair] = useState("EURUSD");
  const [accountCurrency, setAccountCurrency] = useState("USD");
  const [lotsStep, setLotsStep] = useState(0.01);
  const [customPipValue, setCustomPipValue] = useState("");

  const pipValueForOneLot = useMemo(() => {
    const key = pair.toUpperCase();
    if (customPipValue && toNumber(customPipValue) > 0) {
      return toNumber(customPipValue);
    }
    if (PAIR_PIP_VALUES[key]) return PAIR_PIP_VALUES[key];
    return 10;
  }, [pair, customPipValue]);

  const moneyRisked = useMemo(() => {
    const bal = toNumber(balance);
    const rp = toNumber(riskPercent);
    return (bal * (rp / 100));
  }, [balance, riskPercent]);

  const lotSizeRounded = useMemo(() => {
    const step = toNumber(lotsStep) || 0.01;
    const risk = moneyRisked;
    const slPips = toNumber(stopLossPips);
    const pipVal = toNumber(pipValueForOneLot);
    
    if (slPips <= 0 || pipVal <= 0) return 0;
    
    const raw = risk / (slPips * pipVal);
    const factor = Math.round(1 / step);
    const floored = Math.floor(raw * factor) / factor;
    return Math.max(0, Math.round(floored * 100000) / 100000);
  }, [moneyRisked, stopLossPips, pipValueForOneLot, lotsStep]);

  const pipValueForTakenLot = useMemo(() => {
    return pipValueForOneLot * lotSizeRounded;
  }, [pipValueForOneLot, lotSizeRounded]);

  const riskPercentage = toNumber(riskPercent);
  const riskColor = riskPercentage > 3 ? 'text-rose-400' : 
                   riskPercentage > 1.5 ? 'text-amber-400' : 'text-emerald-400';

  const handleReset = () => {
    setBalance(10000);
    setRiskPercent(1);
    setStopLossPips(30);
    setPair("EURUSD");
    setCustomPipValue("");
  };

  const handleCopyResult = () => {
    const text = `Lot: ${lotSizeRounded.toFixed(4)}, Risk: ${(moneyRisked||0).toFixed(2)} ${accountCurrency}, Pip Value: ${pipValueForTakenLot.toFixed(2)} ${accountCurrency}`;
    navigator.clipboard?.writeText(text);
    
    // You could add a toast notification here
    alert("Results copied to clipboard!");
  };

  return (
    <div className="space-y-8">
      {/* Input Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
            Account Balance
          </label>
          <div className="relative">
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              step="any"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">
              {accountCurrency}
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
            Risk Percentage
          </label>
          <div className="relative">
            <input
              type="number"
              value={riskPercent}
              onChange={(e) => setRiskPercent(e.target.value)}
              className={`w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${riskColor}`}
              step="0.1"
              min="0"
              max="100"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">
              %
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            Stop Loss
          </label>
          <div className="relative">
            <input
              type="number"
              value={stopLossPips}
              onChange={(e) => setStopLossPips(e.target.value)}
              className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              step="any"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">
              pips
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-300">Currency Pair</label>
          <select
            value={pair}
            onChange={(e) => setPair(e.target.value)}
            className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
          >
            <option>EURUSD</option>
            <option>GBPUSD</option>
            <option>USDJPY</option>
            <option>USDCHF</option>
            <option>AUDUSD</option>
            <option>USDCAD</option>
            <option>NZDUSD</option>
            <option>EURGBP</option>
            <option>Other</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-300">Custom Pip Value</label>
          <input
            type="number"
            value={customPipValue}
            onChange={(e) => setCustomPipValue(e.target.value)}
            className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
            placeholder="Auto-calculated"
            step="any"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-300">Lot Step Size</label>
          <input
            type="number"
            value={lotsStep}
            onChange={(e) => setLotsStep(e.target.value)}
            className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
            step="any"
            min="0.0001"
          />
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 border border-slate-600/50 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
            <p className="text-sm font-medium text-slate-300">Money at Risk</p>
          </div>
          <div className="text-2xl font-bold text-white">
            {(moneyRisked || 0).toFixed(2)} <span className="text-slate-400 text-lg">{accountCurrency}</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            {riskPercent}% of ${balance.toLocaleString()}
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-2xl p-6 border border-cyan-500/30 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
            <p className="text-sm font-medium text-slate-300">Recommended Lot Size</p>
          </div>
          <div className="text-2xl font-bold text-cyan-400">
            {lotSizeRounded.toFixed(4)}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Based on your risk parameters
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 border border-slate-600/50 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <p className="text-sm font-medium text-slate-300">Pip Value (per lot)</p>
          </div>
          <div className="text-2xl font-bold text-white">
            {pipValueForOneLot.toFixed(2)} <span className="text-slate-400 text-lg">{accountCurrency}</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            For 1 standard lot
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 rounded-2xl p-6 border border-emerald-500/30 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
            <p className="text-sm font-medium text-slate-300">Pip Value (position)</p>
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            {pipValueForTakenLot.toFixed(2)} <span className="text-slate-400 text-lg">{accountCurrency}</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            For {lotSizeRounded.toFixed(4)} lots
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button 
          onClick={handleReset}
          className="flex-1 px-6 py-4 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset to Defaults
        </button>
        <button 
          onClick={handleCopyResult}
          className="flex-1 px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy Results
        </button>
      </div>

      {/* Notes */}
      <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
        <p className="text-sm text-slate-400">
          <strong className="text-slate-300">Note:</strong> This calculator provides estimates based on typical pip values. 
          For accounts with different base currencies or exotic pairs, use the custom pip value field for accurate calculations. 
          Always verify with your broker's specifications.
        </p>
      </div>
    </div>
  );
}