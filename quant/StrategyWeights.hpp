// StrategyWeights.hpp
#ifndef STRATEGY_WEIGHTS_HPP
#define STRATEGY_WEIGHTS_HPP

class StrategyWeights {
public:
    double roeWeight;
    double marginWeight;
    double perWeight;
    double pbrWeight;
    double momentumWeight;
    int minRoe;
    int minMargin;

    StrategyWeights();
    StrategyWeights(double roe, double margin, double per, double pbr, double momentum,
                   int minR = 0, int minM = 0);
    
    void setWeights(double roe, double margin, double per, double pbr, double momentum);
    bool validate() const;
};

#endif