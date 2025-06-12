// QualityStrategy.cpp
#include "QualityStrategy.hpp"
#include <algorithm>

QualityStrategy::QualityStrategy(const StrategyWeights& w, int maxStocks) 
    : weights(w), maxStocks(maxStocks) {}

std::vector<StockData> QualityStrategy::filterByMinimumCriteria(const std::vector<StockData>& stocks) {
    std::vector<StockData> filtered;
    for (const auto& stock : stocks) {
        if (stock.roe >= weights.minRoe && stock.margin >= weights.minMargin) {
            filtered.push_back(stock);
        }
    }
    return filtered;
}

void QualityStrategy::calculateScores(std::vector<StockData>& stocks) {
    for (auto& stock : stocks) {
        stock.calculateScore(weights.roeWeight, weights.marginWeight, weights.perWeight, 
                           weights.pbrWeight, weights.momentumWeight);
    }
}

std::vector<StockData> QualityStrategy::selectTopStocks(std::vector<StockData>& stocks, int count) {
    std::sort(stocks.begin(), stocks.end(), 
              [](const StockData& a, const StockData& b) {
                  return a.score > b.score;
              });
    
    if (stocks.size() > static_cast<size_t>(count)) {
        stocks.resize(count);
    }
    return stocks;
}

std::vector<StockData> QualityStrategy::execute(const std::vector<StockData>& stocks) {
    // 1. 최소 기준 필터링
    std::vector<StockData> qualified = filterByMinimumCriteria(stocks);
    
    // 2. 점수 계산
    calculateScores(qualified);
    
    // 3. 상위 종목 선택
    return selectTopStocks(qualified, maxStocks);
}

std::string QualityStrategy::getName() const {
    return "Quality Strategy";
}

std::string QualityStrategy::getDescription() const {
    return "ROE와 영업이익률 기반 퀄리티 투자 전략";
}