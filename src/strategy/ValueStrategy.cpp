#include "strategy/ValueStrategy.hpp"
#include <algorithm>
#include <cmath>

namespace quant {

ValueStrategy::ValueStrategy(double perWeight, double pbrWeight)
    : perWeight_(perWeight), pbrWeight_(pbrWeight) {}

std::vector<std::shared_ptr<Stock>> ValueStrategy::run(
    const std::vector<std::shared_ptr<Stock>>& stocks) {
    
    std::vector<std::pair<std::shared_ptr<Stock>, double>> scoredStocks;
    
    for (const auto& stock : stocks) 
}

} // namespace quant 