import React, { useState, useMemo } from "react";
import { aiCalculator } from '../services/aiCalculator';
import RiskMeter from './RiskMeter';
import TradingInsights from './TradingInsights';
import AdvancedMetrics from './AdvancedMetrics';
import { Brain, Settings, History, Download } from 'lucide-react';

const PAIR_PIP_VALUES = {
  "EURUSD": 10, "GBPUSD": 10, "USDJPY": 9.13, "USDCHF": 10,
  "AUDUSD": 10, "USDCAD": 10, "NZDUSD": 10, "EURGBP": 8.6,
};

function toNumber(v) {
  const n = parseFloat(String(v).replace(",", "."));
  return Number.isNaN(n) ? 0 : n;
}

export default function EnhancedCalculator() {
  const [balance, setBalance] = useState(10000);
  const [riskPercent, setRiskPercent] = useState(1);
  const [stopLossPips, setStopLossPips] = useState(30);
  const [takeProfitPips, setTakeProfitPips] = useState(60);
  const [pair, setPair] = useState("EURUSD");
  const [accountCurrency, setAccountCurrency] = useState("USD");
  const [lotsStep, setLotsStep] = useState(0.01);
  const [customPipValue, setCustomPipValue] = useState("");
  const [accountSize, setAccountSize] = useState("standard");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // AI Calculations
  const { riskAssessment, insights, advancedMetrics, lotSize } = useMemo(() => {
    const riskAssessment = aiCalculator.assessRisk(riskPercent, balance, pair, stopLossPips);
    const riskScore = aiCalculator.calculateRiskScore(riskPercent, balance, pair, stopLossPips);
    
    const calculatedLotSize = aiCalculator.calculateAILotSize(
      balance, riskPercent, stopLossPips, pair, accountSize
    );
    
    const insights = aiCalculator.generateInsights(
      balance, riskPercent, pair, stopLossPips, calculatedLotSize
    );

    // Advanced metrics
    const moneyRisked = balance * (riskPercent / 100);
    const riskRewardRatio = takeProfitPips / stopLossPips;
    const positionValue = calculatedLotSize * 100000; // Standard lot value
    const marginRequired = positionValue * 0.01; // 1% margin assumption
    const freeMargin = balance - marginRequired - moneyRisked;
    const dailyLossLimit = balance * 0.02; // 2% daily limit
    const weeklyLossLimit = balance * 0.05; // 5% weekly limit

    const advancedMetrics = {
      riskRewardRatio: Math.round(riskRewardRatio * 10) / 10,
      positionValue: Math.round(positionValue),
      marginRequired: Math.round(marginRequired),
      freeMargin: Math.max(0, Math.round(freeMargin)),
      dailyLossLimit: Math.round(dailyLossLimit),
      weeklyLossLimit: Math.round(weeklyLossLimit)
    };

    return {
      riskAssessment: { ...riskAssessment, score: riskScore },
      insights,
      advancedMetrics,
      lotSize: calculatedLotSize
    };
  }, [balance, riskPercent, stopLossPips, takeProfitPips, pair, accountSize]);

  const pipValueForOneLot = useMemo(() => {
    const key = pair.toUpperCase();
    if (customPipValue && toNumber(customPipValue) > 0) {
      return toNumber(customPipValue);
    }
    return PAIR_PIP_VALUES[key] || 10;
  }, [pair, customPipValue]);

  const moneyRisked = useMemo(() => balance * (riskPercent / 100), [balance, riskPercent]);
  const potentialProfit = useMemo(() => moneyRisked * (takeProfitPips / stopLossPips), [moneyRisked, takeProfitPips, stopLossPips]);
  const pipValueForTakenLot = pipValueForOneLot * lotSize;

  const handleSaveScenario = () => {
    const scenario = {
      balance, riskPercent, stopLossPips, takeProfitPips, pair, lotSize,
      timestamp: new Date().toISOString(),
      riskScore: riskAssessment.score
    };
    // Save to localStorage or send to backend
    console.log('Saving scenario:', scenario);
    alert('Scenario saved! (Check console)');
  };

  const handleExportReport = () => {
    const report = {
      'Account Balance': `$${balance}`,
      'Risk Percentage': `${riskPercent}%`,
      'Stop Loss': `${stopLossPips} pips`,
      'Take Profit': `${takeProfitPips} pips`,
      'Currency Pair': pair,
      'Recommended Lot Size': lotSize.toFixed(4),
      'Money at Risk': `$${moneyRisked.toFixed(2)}`,
      'Potential Profit': `$${potentialProfit.toFixed(2)}`,
      'Risk Assessment': riskAssessment.level,
      'Risk Score': `${riskAssessment.score}/10`
    };
    
    const reportText = Object.entries(report)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    
    navigator.clipboard?.writeText(reportText);
    alert('Trading report copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Header with AI Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI-Powered Calculator</h2>
            <p className="text-slate-400 text-sm">Smart risk management with real-time insights</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-300 transition-colors flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            {showAdvanced ? 'Basic' : 'Advanced'}
          </button>
        </div>
      </div>

      {/* Main Input Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Basic Inputs */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-300">Account Balance</label>
          <div className="relative">
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
              {accountCurrency}
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-300">Risk Percentage</label>
          <div className="relative">
            <input
              type="number"
              value={riskPercent}
              onChange={(e) => setRiskPercent(e.target.value)}
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              step="0.1"
              min="0.1"
              max="10"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">%</div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-300">Account Size</label>
          <select
            value={accountSize}
            onChange={(e) => setAccountSize(e.target.value)}
            className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value="micro">Micro ($100 - $1,000)</option>
            <option value="small">Small ($1,000 - $10,000)</option>
            <option value="standard">Standard ($10,000 - $50,000)</option>
            <option value="professional">Professional ($50,000+)</option>
          </select>
        </div>

        {/* Advanced Inputs */}
        {showAdvanced && (
          <>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">Stop Loss (pips)</label>
              <input
                type="number"
                value={stopLossPips}
                onChange={(e) => setStopLossPips(e.target.value)}
                className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">Take Profit (pips)</label>
              <input
                type="number"
                value={takeProfitPips}
                onChange={(e) => setTakeProfitPips(e.target.value)}
                className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">Currency Pair</label>
              <select
                value={pair}
                onChange={(e) => setPair(e.target.value)}
                className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                {Object.keys(PAIR_PIP_VALUES).map(pair => (
                  <option key={pair} value={pair}>{pair}</option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>

      {/* AI Results Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Risk Assessment */}
        <div className="lg:col-span-1 space-y-6">
          <RiskMeter 
            riskScore={riskAssessment.score} 
            riskLevel={riskAssessment}
          />
          
          <TradingInsights insights={insights} />
        </div>

        {/* Right Column - Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Results */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-2xl p-6 border border-cyan-500/30">
              <div className="text-sm text-cyan-400 font-medium mb-2">Recommended Lot Size</div>
              <div className="text-3xl font-bold text-cyan-400">{lotSize.toFixed(4)}</div>
              <div className="text-xs text-slate-400 mt-2">AI-optimized position size</div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 rounded-2xl p-6 border border-emerald-500/30">
              <div className="text-sm text-emerald-400 font-medium mb-2">Potential Profit</div>
              <div className="text-3xl font-bold text-emerald-400">${potentialProfit.toFixed(2)}</div>
              <div className="text-xs text-slate-400 mt-2">Based on take profit level</div>
            </div>
          </div>

          {/* Advanced Metrics */}
          {showAdvanced && (
            <AdvancedMetrics metrics={advancedMetrics} />
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={handleSaveScenario}
              className="flex-1 px-6 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <History className="w-4 h-4" />
              Save Scenario
            </button>
            <button 
              onClick={handleExportReport}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl text-white transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}