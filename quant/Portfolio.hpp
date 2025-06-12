// Portfolio.hpp
#ifndef PORTFOLIO_HPP
#define PORTFOLIO_HPP

#include "Position.hpp"
#include <map>
#include <string>
#include <chrono>

class Portfolio {
private:
    std::map<std::string, Position> positions;
    double cash;
    double initialValue;
    std::chrono::system_clock::time_point creationDate;

public:
    Portfolio(double initialCash);
    
    bool enterPosition(const std::string& symbol, double shares, double price);
    bool exitPosition(const std::string& symbol);
    void updatePositions(const std::map<std::string, double>& marketData);
    
    double getTotalValue() const;
    double getCashRatio() const;
    double getPositionWeight(const std::string& symbol) const;
    std::map<std::string, Position> getPositions() const;
    double getCash() const { return cash; }
    
    void rebalance(const std::map<std::string, double>& targetWeights);
};

#endif