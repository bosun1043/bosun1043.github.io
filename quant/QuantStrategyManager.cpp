// QuantStrategyManager.cpp
#include "QuantStrategyManager.hpp"
#include <algorithm>

QuantStrategyManager::QuantStrategyManager(double initialCash) 
    : portfolio(std::make_unique<Portfolio>(initialCash)),
      dataProvider(std::make_unique<StockDataProvider>()) {}

void QuantStrategyManager::setStrategy(std::unique_ptr<IStrategy> strategy) {
    currentStrategy = std::move(strategy);
}

std::vector<StockData> QuantStrategyManager::executeStrategy(const std::vector<std::string>& selectedStocks) {
    if (!currentStrategy) {
        return {};
    }
    
    // 선택된 종목들의 데이터 가져오기
    std::vector<StockData> stocks;
    for (const auto& symbol : selectedStocks) {
        StockData stock = dataProvider->getStockBySymbol(symbol);
        if (!stock.symbol.empty()) {
            stocks.push_back(stock);
        }
    }
    
    // 전략 실행
    return currentStrategy->execute(stocks);
}

BacktestResult QuantStrategyManager::runBacktest(const std::vector<std::string>& selectedStocks) {
    BacktestResult result;
    // 백테스트 로직 구현 (복잡하므로 기본 구조만)
    result.expectedReturn = 12.5; // 예시값
    result.volatility = 18.2;
    result.sharpeRatio = 0.65;
    return result;
}

Portfolio* QuantStrategyManager::getPortfolio() const {
    return portfolio.get();
}

void QuantStrategyManager::rebalancePortfolio() {
    // 리밸런싱 로직
}

std::map<std::string, double> QuantStrategyManager::getPerformanceMetrics() const {
    std::map<std::string, double> metrics;
    metrics["총자산"] = portfolio->getTotalValue();
    metrics["현금비율"] = portfolio->getCashRatio();
    return metrics;
}