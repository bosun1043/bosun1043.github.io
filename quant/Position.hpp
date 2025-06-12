// Position.hpp
#ifndef POSITION_HPP
#define POSITION_HPP

#include <string>
#include <chrono>

class Position {
private:
    std::string symbol;
    double shares;
    double avgPrice;
    double currentValue;
    std::chrono::system_clock::time_point entryDate;

public:
    Position();
    Position(const std::string& sym, double sh, double price);
    
    void updateCurrentValue(double price);
    double getPnL() const;
    double getWeight(double totalPortfolioValue) const;
    
    // Getters
    std::string getSymbol() const { return symbol; }
    double getShares() const { return shares; }
    double getAvgPrice() const { return avgPrice; }
    double getCurrentValue() const { return currentValue; }
};

#endif