#include <iostream>
#include <memory>
#include <vector>
#include "market/Stock.hpp"
#include "strategy/MomentumStrategy.hpp"
#include "strategy/ValueStrategy.hpp"
#include "strategy/QualityStrategy.hpp"
#include "backtest/Backtest.hpp"
#include "utils/DataLoader.hpp"
#include "utils/Logger.hpp"

using namespace quant;

int main() {
    try {
        // Initialize logger
        Logger::init("quant_trading.log");
        
        // Load market data
        DataLoader dataLoader;
        auto stocks = dataLoader.loadStocks();
        
        // Create strategies
        auto momentumStrategy = std::make_shared<MomentumStrategy>();
        auto valueStrategy = std::make_shared<ValueStrategy>();
        auto qualityStrategy = std::make_shared<QualityStrategy>();
        
        // Run strategies
        Logger::info("Running momentum strategy...");
        auto momentumResults = momentumStrategy->run(stocks);
        
        Logger::info("Running value strategy...");
        auto valueResults = valueStrategy->run(stocks);
        
        Logger::info("Running quality strategy...");
        auto qualityResults = qualityStrategy->run(stocks);
        
        // Run backtest
        Backtest backtest(momentumStrategy);
        auto metrics = backtest.run(stocks, "2023-01-01", "2023-12-31");
        
        // Print results
        std::cout << "Backtest Results:\n";
        std::cout << "Total Return: " << metrics.getTotalReturn() << "%\n";
        std::cout << "Sharpe Ratio: " << metrics.getSharpeRatio() << "\n";
        std::cout << "Max Drawdown: " << metrics.getMaxDrawdown() << "%\n";
        
    } catch (const std::exception& e) {
        Logger::error("Error: " + std::string(e.what()));
        return 1;
    }
    
    return 0;
} 