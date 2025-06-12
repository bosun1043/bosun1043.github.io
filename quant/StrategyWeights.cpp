// StrategyWeights.cpp
#include "StrategyWeights.hpp"

StrategyWeights::StrategyWeights() 
    : roeWeight(0), marginWeight(0), perWeight(0), pbrWeight(0), 
      momentumWeight(0), minRoe(0), minMargin(0) {}

StrategyWeights::StrategyWeights(double roe, double margin, double per, double pbr, 
                                double momentum, int minR, int minM)
    : roeWeight(roe), marginWeight(margin), perWeight(per), pbrWeight(pbr), 
      momentumWeight(momentum), minRoe(minR), minMargin(minM) {}

void StrategyWeights::setWeights(double roe, double margin, double per, double pbr, double momentum) {
    roeWeight = roe;
    marginWeight = margin;
    perWeight = per;
    pbrWeight = pbr;
    momentumWeight = momentum;
}

bool StrategyWeights::validate() const {
    double totalWeight = roeWeight + marginWeight + perWeight + pbrWeight + momentumWeight;
    return totalWeight > 0.99 && totalWeight < 1.01; // 허용 오차 범위 내에서 1.0
}