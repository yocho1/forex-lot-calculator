import React from 'react';
import { Lightbulb, TrendingUp, AlertTriangle, Shield } from 'lucide-react';

const TradingInsights = ({ insights }) => {
  const getIcon = (insight) => {
    if (insight.includes('reducing risk') || insight.includes('too tight')) 
      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    if (insight.includes('conservative') || insight.includes('increasing')) 
      return <TrendingUp className="w-4 h-4 text-blue-500" />;
    if (insight.includes('micro lots')) 
      return <Shield className="w-4 h-4 text-rose-500" />;
    return <Lightbulb className="w-4 h-4 text-emerald-500" />;
  };

  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">AI Trading Insights</h3>
      </div>
      
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
            {getIcon(insight)}
            <p className="text-sm text-slate-300 flex-1">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradingInsights;