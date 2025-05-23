// 전략 계산 유틸리티 함수들
export const strategyUtils = {
    // 모멘텀 계산
    calculateMomentum: (prices, period = 12) => {
        const returns = [];
        for (let i = period; i < prices.length; i++) {
            const return_ = (prices[i] - prices[i - period]) / prices[i - period];
            returns.push(return_);
        }
        return returns;
    },

    // 밸류 계산 (PER, PBR 기반)
    calculateValue: (financials) => {
        const { per, pbr } = financials;
        const valueScore = (1 / per) * 0.6 + (1 / pbr) * 0.4;
        return valueScore;
    },

    // 퀄리티 계산 (ROE, 영업이익률 기반)
    calculateQuality: (financials) => {
        const { roe, operatingMargin } = financials;
        const qualityScore = roe * 0.5 + operatingMargin * 0.5;
        return qualityScore;
    },
};

// 전략 실행 클래스
export class StrategyRunner {
    constructor(data) {
        this.data = data;
    }

    async runMomentumStrategy() {
        const stocks = await this.data.getStockPrices();
        const momentumScores = stocks.map(stock => ({
            symbol: stock.symbol,
            score: strategyUtils.calculateMomentum(stock.prices),
        }));
        
        return this.rankAndSelect(momentumScores, 20);
    }

    async runValueStrategy() {
        const stocks = await this.data.getFinancials();
        const valueScores = stocks.map(stock => ({
            symbol: stock.symbol,
            score: strategyUtils.calculateValue(stock),
        }));
        
        return this.rankAndSelect(valueScores, 15);
    }

    async runQualityStrategy() {
        const stocks = await this.data.getFinancials();
        const qualityScores = stocks.map(stock => ({
            symbol: stock.symbol,
            score: strategyUtils.calculateQuality(stock),
        }));
        
        return this.rankAndSelect(qualityScores, 10);
    }

    rankAndSelect(scores, count) {
        return scores
            .sort((a, b) => b.score - a.score)
            .slice(0, count);
    }
} 