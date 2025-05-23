#include "strategy/MomentumStrategy.hpp"
#include <algorithm>
#include <numeric>
#include <cmath>

namespace quant {

MomentumStrategy::MomentumStrategy(int lookbackPeriod)
    : lookbackPeriod_(lookbackPeriod) {}

std::vector<std::shared_ptr<Stock>> MomentumStrategy::run(
    const std::vector<std::shared_ptr<Stock>>& stocks) {
    
    std::vector<std::pair<std::shared_ptr<Stock>, double>> scoredStocks;
    
    for (const auto& stock : stocks) {
        const auto& prices = stock->getHistoricalPrices();
        if (prices.size() < lookbackPeriod_) {
            continue;
        }
        
        double momentum = calculateMomentum(prices);
        scoredStocks.emplace_back(stock, momentum);
    }
    
    // 모멘텀 점수 기준으로 정렬
    std::sort(scoredStocks.begin(), scoredStocks.end(),
        [](const auto& a, const auto& b) {
            return a.second > b.second;
        });
    
    // 상위 20개 종목 선택
    std::vector<std::shared_ptr<Stock>> selectedStocks;
    for (size_t i = 0; i < std::min(size_t(20), scoredStocks.size()); ++i) {
        selectedStocks.push_back(scoredStocks[i].first);
    }
    
    return selectedStocks;
}

double MomentumStrategy::calculateMomentum(const std::vector<double>& prices) const {
    if (prices.size() < lookbackPeriod_) {
        return 0.0;
    }
    
    // 과거 가격과 현재 가격의 차이를 백분율로 계산
    double pastPrice = prices[prices.size() - lookbackPeriod_];
    double currentPrice = prices.back();
    
    return ((currentPrice - pastPrice) / pastPrice) * 100.0;
}

} // namespace quant 