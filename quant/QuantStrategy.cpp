#include "QuantStrategy.hpp"
#include <cmath>
#include <algorithm>
#include <numeric>

QuantStrategy::QuantStrategy(double roeW, double marginW, int minR, int minM)
    : roeWeight(roeW)
    , marginWeight(marginW)
    , minRoe(minR)
    , minMargin(minM)
    , cash(100000.0) // 초기 자본금
{
}

std::vector<StockData> QuantStrategy::executeQualityStrategy(const std::vector<StockData>& stocks) {
    std::vector<StockData> qualifiedStocks;
    
    // 1. 기본 필터링 (최소 기준 충족)
    for (const auto& stock : stocks) {
        if (stock.roe >= minRoe && stock.margin >= minMargin) {
            qualifiedStocks.push_back(stock);
        }
    }
    
    // 2. 점수 계산
    for (auto& stock : qualifiedStocks) {
        // ROE 점수 (0-100)
        double roeScore = (stock.roe - minRoe) / (50.0 - minRoe) * 100;
        roeScore = std::min(std::max(roeScore, 0.0), 100.0);
        
        // 영업이익률 점수 (0-100)
        double marginScore = (stock.margin - minMargin) / (20.0 - minMargin) * 100;
        marginScore = std::min(std::max(marginScore, 0.0), 100.0);
        
        // 종합 점수 계산
        stock.score = (roeScore * roeWeight + marginScore * marginWeight);
    }
    
    // 3. 점수 기준 정렬
    std::sort(qualifiedStocks.begin(), qualifiedStocks.end(),
              [](const StockData& a, const StockData& b) {
                  return a.score > b.score;
              });
    
    // 4. 상위 5개 종목만 반환
    if (qualifiedStocks.size() > 5) {
        qualifiedStocks.resize(5);
    }
    
    return qualifiedStocks;
}

void QuantStrategy::enterPosition(const std::string& symbol, double amount) {
    if (amount <= cash) {
        positions[symbol] = amount;
        cash -= amount;
    }
}

void QuantStrategy::exitPosition(const std::string& symbol) {
    if (positions.find(symbol) != positions.end()) {
        cash += positions[symbol];
        positions.erase(symbol);
    }
}

double QuantStrategy::getPortfolioValue() const {
    double total = cash;
    for (const auto& pos : positions) {
        total += pos.second;
    }
    return total;
}

std::map<std::string, double> QuantStrategy::getPositions() const {
    return positions;
}

void QuantStrategy::setParameters(double roeW, double marginW, int minR, int minM) {
    roeWeight = roeW;
    marginWeight = marginW;
    minRoe = minR;
    minMargin = minM;
} 