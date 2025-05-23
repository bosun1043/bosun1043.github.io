#include "strategy/QualityStrategy.hpp"
#include <algorithm>
#include <cmath>

namespace quant {

QualityStrategy::QualityStrategy(double roeWeight, double operatingMarginWeight)
    : roeWeight_(roeWeight), operatingMarginWeight_(operatingMarginWeight) {}

std::vector<std::shared_ptr<Stock>> QualityStrategy::run(
    const std::vector<std::shared_ptr<Stock>>& stocks) {
    
    std::vector<std::pair<std::shared_ptr<Stock>, double>> scoredStocks;
    
    for (const auto& stock : stocks) {
        double roe = stock->getROE();
        double operatingMargin = stock->getOperatingMargin();
        
        // ROE와 영업이익률이 유효한 값인지 확인
        if (roe <= 0 || operatingMargin <= 0) {
            continue;
        }
        
        double qualityScore = calculateQualityScore(roe, operatingMargin);
        scoredStocks.emplace_back(stock, qualityScore);
    }
    
    // 퀄리티 점수 기준으로 정렬
    std::sort(scoredStocks.begin(), scoredStocks.end(),
        [](const auto& a, const auto& b) {
            return a.second > b.second;
        });
    
    // 상위 10개 종목 선택
    std::vector<std::shared_ptr<Stock>> selectedStocks;
    for (size_t i = 0; i < std::min(size_t(10), scoredStocks.size()); ++i) {
        selectedStocks.push_back(scoredStocks[i].first);
    }
    
    return selectedStocks;
}

double QualityStrategy::calculateQualityScore(double roe, double operatingMargin) const {
    // ROE와 영업이익률을 정규화하여 점수 계산
    double normalizedROE = std::min(roe / 30.0, 1.0); // 30%를 최대값으로 가정
    double normalizedOperatingMargin = std::min(operatingMargin / 20.0, 1.0); // 20%를 최대값으로 가정
    
    // 가중치를 적용하여 최종 점수 계산
    return (normalizedROE * roeWeight_ + normalizedOperatingMargin * operatingMarginWeight_) * 100.0;
}

} // namespace quant 