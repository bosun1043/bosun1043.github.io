// QualityStrategy.hpp
#ifndef QUALITY_STRATEGY_HPP
#define QUALITY_STRATEGY_HPP

#include "IStrategy.hpp"
#include "StrategyWeights.hpp"

class QualityStrategy : public IStrategy {
private:
    StrategyWeights weights;
    int maxStocks;

    std::vector<StockData> filterByMinimumCriteria(const std::vector<StockData>& stocks);
    void calculateScores(std::vector<StockData>& stocks);
    std::vector<StockData> selectTopStocks(std::vector<StockData>& stocks, int count);

public:
    QualityStrategy(const StrategyWeights& w, int maxStocks = 5);
    
    std::vector<StockData> execute(const std::vector<StockData>& stocks) override;
    std::string getName() const override;
    std::string getDescription() const override;
};

#endif