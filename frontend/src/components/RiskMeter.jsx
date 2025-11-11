import React from 'react';

const RiskMeter = ({ riskScore, riskLevel }) => {
  const getRiskColor = (score) => {
    if (score >= 8) return 'bg-rose-500';
    if (score >= 5) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getRiskLabel = (score) => {
    if (score >= 8) return 'High Risk';
    if (score >= 5) return 'Medium Risk';
    return 'Low Risk';
  };

  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">AI Risk Assessment</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${riskLevel.bg} ${riskLevel.color}`}>
          {riskLevel.level} RISK
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-slate-300">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
        
        <div className="w-full bg-slate-700 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${getRiskColor(riskScore)}`}
            style={{ width: `${(riskScore / 10) * 100}%` }}
          ></div>
        </div>
        
        <div className="text-center">
          <span className="text-2xl font-bold text-white">{riskScore}/10</span>
          <p className="text-slate-400 text-sm mt-1">{getRiskLabel(riskScore)}</p>
        </div>
      </div>
    </div>
  );
};

export default RiskMeter;