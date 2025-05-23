#pragma once
#include <vector>
#include <memory>
#include <string>
#include <chrono>
#include "../market/Stock.hpp"

namespace quant {

struct StrategyResult {
    std::string strategyName;
    std::vector<std::shared_ptr<Stock>> selectedStocks;
    std::chrono::system_clock::time_point executionTime;
    double totalReturn;
    double sharpeRatio;
    double maxDrawdown;
    
    // 결과를 JSON으로 변환
    nlohmann::json toJson() const;
    
    // JSON에서 결과 생성
    static StrategyResult fromJson(const nlohmann::json& json);
};

} // namespace quant 