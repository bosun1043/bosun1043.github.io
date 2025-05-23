#pragma once
#include <string>
#include <vector>
#include <nlohmann/json.hpp>

namespace quant {

struct PerformanceMetrics {
    double totalReturn;
    double annualizedReturn;
    double sharpeRatio;
    double maxDrawdown;
    double winRate;
    double profitFactor;
    std::vector<double> dailyReturns;
    std::vector<double> equityCurve;
    
    // JSON 변환
    nlohmann::json toJson() const;
    static PerformanceMetrics fromJson(const nlohmann::json& json);
    
    // 지표 계산
    void
} 