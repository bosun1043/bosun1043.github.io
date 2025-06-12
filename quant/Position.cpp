// Position.cpp
#include "Position.hpp"

Position::Position() : symbol(""), shares(0), avgPrice(0), currentValue(0) {
    entryDate = std::chrono::system_clock::now();
}

Position::Position(const std::string& sym, double sh, double price) 
    : symbol(sym), shares(sh), avgPrice(price), currentValue(sh * price) {
    entryDate = std::chrono::system_clock::now();
}

void Position::updateCurrentValue(double price) {
    currentValue = shares * price;
}

double Position::getPnL() const {
    return currentValue - (shares * avgPrice);
}

double Position::getWeight(double totalPortfolioValue) const {
    return totalPortfolioValue > 0 ? (currentValue / totalPortfolioValue) * 100 : 0;
}