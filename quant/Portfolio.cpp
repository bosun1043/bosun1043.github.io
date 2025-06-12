// Portfolio.cpp
#include "Portfolio.hpp"
#include <algorithm>

Portfolio::Portfolio(double initialCash) 
    : cash(initialCash), initialValue(initialCash) {
    creationDate = std::chrono::system_clock::now();
}

bool Portfolio::enterPosition(const std::string& symbol, double shares, double price) {
    double cost = shares * price;
    if (cost > cash) {
        return false; // 자금 부족
    }
    
    cash -= cost;
    positions[symbol] = Position(symbol, shares, price);
    return true;
}

bool Portfolio::exitPosition(const std::string& symbol) {
    auto it = positions.find(symbol);
    if (it != positions.end()) {
        cash += it->second.getCurrentValue();
        positions.erase(it);
        return true;
    }
    return false;
}

void Portfolio::updatePositions(const std::map<std::string, double>& marketData) {
    for (auto& pos : positions) {
        auto it = marketData.find(pos.first);
        if (it != marketData.end()) {
            pos.second.updateCurrentValue(it->second);
        }
    }
}

double Portfolio::getTotalValue() const {
    double total = cash;
    for (const auto& pos : positions) {
        total += pos.second.getCurrentValue();
    }
    return total;
}

double Portfolio::getCashRatio() const {
    double totalValue = getTotalValue();
    return totalValue > 0 ? (cash / totalValue) * 100 : 100;
}

double Portfolio::getPositionWeight(const std::string& symbol) const {
    auto it = positions.find(symbol);
    if (it != positions.end()) {
        return it->second.getWeight(getTotalValue());
    }
    return 0;
}

std::map<std::string, Position> Portfolio::getPositions() const {
    return positions;
}

void Portfolio::rebalance(const std::map<std::string, double>& targetWeights) {
    // 리밸런싱 로직 구현 (복잡하므로 기본 구조만)
    double totalValue = getTotalValue();
    
    // 모든 포지션 청산
    for (auto& pos : positions) {
        cash += pos.second.getCurrentValue();
    }
    positions.clear();
    
    // 새로운 가중치로 재투자
    for (const auto& target : targetWeights) {
        double targetAmount = totalValue * target.second;
        // 실제 구현시에는 현재 가격 정보가 필요
        // enterPosition(target.first, shares, currentPrice);
    }
}