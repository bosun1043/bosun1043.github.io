#pragma once
#include <memory>
#include <vector>
#include <string>
#include <map>
#include <chrono>
#include "../market/Stock.hpp"

namespace quant {

struct Position {
    std::shared_ptr<Stock> stock;
    int quantity;
    double averagePrice;
    double currentPrice;
    double profit;
    double profitPercentage;
    
    // 포지션 업데이트
    void update(double newPrice);
    
    // JSON 변환
    nlohmann::json toJson() const;
    static Position fromJson(const nlohmann::json& json);
};

class Portfolio {
public:
    Portfolio(double initialCapital = 1000000.0);
    
    // 포트폴리오 관리
    void addPosition(std::shared_ptr<Stock> stock, int quantity, double price);
    void removePosition(const std::string& symbol);
    void updatePositions();
    
    // 포트폴리오 분석
    double getTotalValue() const;
    double getTotalProfit() const;
    double getTotalProfitPercentage() const;
    std::vector<Position> getPositions() const;
    
    // 리밸런싱
    void rebalance(const std::vector<std::shared_ptr<Stock>>& targetStocks);
    
    // 리스크 관리
    double calculatePortfolioRisk() const;
    double calculatePortfolioBeta() const;
    
    // JSON 변환
    nlohmann::json toJson() const;
    static Portfolio fromJson(const nlohmann::json& json);
    
private:
    double initialCapital_;
    std::map<std::string, Position> positions_;
    std::chrono::system_clock::time_point lastUpdate_;
    
    // 헬퍼 함수들
    double calculatePositionWeight(const Position& pos) const;
    std::vector<double> calculateReturns() const;
};

} // namespace quant 