import React from 'react';
import { BarChart3, Target, Zap, Calculator } from 'lucide-react';

const AdvancedMetrics = ({ metrics }) => {
  const {
    riskRewardRatio,
    positionValue,
    marginRequired,
    freeMargin,
    dailyLossLimit,
    weeklyLossLimit
  } = metrics;

  const cards = [
    {
      icon: Target,
      label: 'Risk/Reward',
      value: riskRewardRatio,
      suffix: ':1',
      color: 'text-cyan-400'
    },
    {
      icon: BarChart3,
      label: 'Position Value',
      value: positionValue,
      prefix: '$',
      color: 'text-emerald-400'
    },
    {
      icon: Calculator,
      label: 'Margin Required',
      value: marginRequired,
      prefix: '$',
      color: 'text-amber-400'
    },
    {
      icon: Zap,
      label: 'Free Margin',
      value: freeMargin,
      prefix: '$',
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
      <h3 className="text-lg font-semibold text-white mb-6">Advanced Metrics</h3>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-slate-700/30 rounded-xl p-4 text-center">
            <card.icon className={`w-6 h-6 mx-auto mb-2 ${card.color}`} />
            <div className={`text-xl font-bold ${card.color} mb-1`}>
              {card.prefix}{card.value.toLocaleString()}{card.suffix}
            </div>
            <div className="text-xs text-slate-400">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
          <div className="text-sm text-rose-400 font-medium mb-1">Daily Loss Limit</div>
          <div className="text-lg text-white">${dailyLossLimit.toLocaleString()}</div>
          <div className="text-xs text-rose-400/70">Max daily loss based on 2% rule</div>
        </div>
        
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <div className="text-sm text-amber-400 font-medium mb-1">Weekly Loss Limit</div>
          <div className="text-lg text-white">${weeklyLossLimit.toLocaleString()}</div>
          <div className="text-xs text-amber-400/70">Max weekly loss based on 5% rule</div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedMetrics;