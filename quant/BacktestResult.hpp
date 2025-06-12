// BacktestResult.hpp
#ifndef BACKTEST_RESULT_HPP
#define BACKTEST_RESULT_HPP

#include <vector>
#include <string>

class BacktestResult {
public:
    double expectedReturn;
    double volatility;
    double sharpeRatio;
    std::vector<double> monthlyReturns;
    std::vector<double> cumulativeReturns;
    double maxDrawdown;

    BacktestResult();
    
    void calculateMetrics();
    double getAnnualizedReturn() const;
    std::string toString() const;
};

#endif