#pragma once
#include <memory>
#include <vector>
#include <string>
#include <chrono>
#include "../strategy/Strategy.hpp"
#include "../market/Stock.hpp"
#include "PerformanceMetrics.hpp"

namespace quant {

class Backtest {
public:
    Backtest(std::shared_ptr<Strategy> strategy);
    
    // 백테스트 실행
    PerformanceMetrics run(
        const std::vector<std::shared_ptr<Stock>>& stocks,
        const std::string& startDate,
        const std::string& endDate,
        double initialCapital = 1000000.0);
    
    // 백테스트 결과 저장
    void saveResults(const std::string& filepath) const;
    
    // 백테스트 결과 로드
    static Backtest loadResults(const std::string& filepath);

private:
    std::shared_ptr<Strategy> strategy_;
    std::vector<PerformanceMetrics> dailyMetrics_;
    double initialCapital_;
    
    // 헬퍼 함수들
    std::vector<double> calculateReturns(const std::vector<double>& prices) const;
    double calculateSharpeRatio(const std::vector<double>& returns) const;
    double calculateMaxDrawdown(const std::vector<double>& equity) const;
    std::vector<double> calculateEquityCurve(const std::vector<double>& returns) const;
};

} // namespace quant 