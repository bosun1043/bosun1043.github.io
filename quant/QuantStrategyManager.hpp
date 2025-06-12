// QuantStrategyManager.hpp
#ifndef QUANT_STRATEGY_MANAGER_HPP
#define QUANT_STRATEGY_MANAGER_HPP

#include "Portfolio.hpp"
#include "StockDataProvider.hpp"
#include "IStrategy.hpp"
#include "BacktestResult.hpp"
#include <memory>

class QuantStrategyManager {
private:
    std::unique_ptr<Portfolio> portfolio;
    std::unique_ptr<StockDataProvider> dataProvider;
    std::unique_ptr<IStrategy> currentStrategy;

public:
    QuantStrategyManager(double initialCash);
    ~QuantStrategyManager() = default;
    
    void setStrategy(std::unique_ptr<IStrategy> strategy);
    std::vector<StockData> executeStrategy(const std::vector<std::string>& selectedStocks);
    BacktestResult runBacktest(const std::vector<std::string>& selectedStocks);
    
    Portfolio* getPortfolio() const;
    void rebalancePortfolio();
    std::map<std::string, double> getPerformanceMetrics() const;
};

#endif