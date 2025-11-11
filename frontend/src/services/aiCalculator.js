// AI-powered calculation service with enhanced logic
class AICalculatorService {
  constructor() {
    this.marketVolatility = {
      EURUSD: { low: 70, high: 120, current: 95 },
      GBPUSD: { low: 80, high: 150, current: 110 },
      USDJPY: { low: 50, high: 100, current: 75 },
      USDCHF: { low: 60, high: 110, current: 85 },
      AUDUSD: { low: 65, high: 120, current: 90 },
      USDCAD: { low: 70, high: 130, current: 100 },
      NZDUSD: { low: 60, high: 115, current: 88 },
      EURGBP: { low: 45, high: 90, current: 68 },
    }
  }

  // AI-powered risk assessment
  assessRisk(riskPercent, balance, pair, stopLossPips) {
    const riskScore = this.calculateRiskScore(
      riskPercent,
      balance,
      pair,
      stopLossPips
    )

    if (riskScore >= 8)
      return { level: 'HIGH', color: 'text-rose-500', bg: 'bg-rose-500/10' }
    if (riskScore >= 5)
      return { level: 'MEDIUM', color: 'text-amber-500', bg: 'bg-amber-500/10' }
    return { level: 'LOW', color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
  }

  calculateRiskScore(riskPercent, balance, pair, stopLossPips) {
    let score = 0

    // Risk percentage scoring
    if (riskPercent > 5) score += 4
    else if (riskPercent > 3) score += 2
    else if (riskPercent > 1) score += 1

    // Balance-based risk (smaller accounts = higher relative risk)
    if (balance < 1000) score += 3
    else if (balance < 5000) score += 2
    else if (balance < 10000) score += 1

    // Pair volatility
    const pairVol = this.marketVolatility[pair]?.current || 100
    if (pairVol > 100) score += 2
    else if (pairVol > 80) score += 1

    // Stop loss adequacy
    const typicalVol = this.marketVolatility[pair]?.current || 100
    if (stopLossPips < typicalVol * 0.5) score += 2
    else if (stopLossPips < typicalVol * 0.8) score += 1

    return Math.min(10, score)
  }

  // AI position sizing with market conditions
  calculateAILotSize(balance, riskPercent, stopLossPips, pair, accountSize) {
    const baseLotSize =
      (balance * (riskPercent / 100)) / (stopLossPips * this.getPipValue(pair))

    // AI adjustments based on account size and market conditions
    let aiMultiplier = 1

    // Account size adjustment
    if (accountSize === 'micro') aiMultiplier *= 0.5
    else if (accountSize === 'small') aiMultiplier *= 0.8
    else if (accountSize === 'standard') aiMultiplier *= 1
    else if (accountSize === 'professional') aiMultiplier *= 1.2

    // Market volatility adjustment
    const currentVol = this.marketVolatility[pair]?.current || 100
    const typicalVol = 100
    const volAdjustment = typicalVol / currentVol
    aiMultiplier *= volAdjustment

    return Math.max(0.01, baseLotSize * aiMultiplier)
  }

  getPipValue(pair) {
    const values = {
      EURUSD: 10,
      GBPUSD: 10,
      USDJPY: 9.13,
      USDCHF: 10,
      AUDUSD: 10,
      USDCAD: 10,
      NZDUSD: 10,
      EURGBP: 8.6,
    }
    return values[pair] || 10
  }

  // Generate trading insights
  generateInsights(balance, riskPercent, pair, stopLossPips, lotSize) {
    const insights = []
    const riskScore = this.calculateRiskScore(
      riskPercent,
      balance,
      pair,
      stopLossPips
    )

    if (riskScore >= 7) {
      insights.push(
        'Consider reducing risk percentage for better capital preservation'
      )
    }

    if (balance < 1000 && lotSize > 0.1) {
      insights.push(
        'High position size relative to account balance - consider micro lots'
      )
    }

    const typicalStopLoss = this.marketVolatility[pair]?.current || 100
    if (stopLossPips < typicalStopLoss * 0.7) {
      insights.push('Stop loss may be too tight for current market volatility')
    }

    if (riskPercent < 0.5) {
      insights.push(
        'Very conservative risk level - consider increasing slightly for better returns'
      )
    }

    return insights.length > 0
      ? insights
      : ['Your risk parameters look well balanced!']
  }
}

export const aiCalculator = new AICalculatorService()
