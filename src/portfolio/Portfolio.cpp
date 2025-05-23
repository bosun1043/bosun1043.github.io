#include "portfolio/Portfolio.hpp"
#include <algorithm>
#include <numeric>
#include <cmath>

namespace quant {

Portfolio::Portfolio(double initialCapital)
    : initialCapital_(initialCapital) {
    lastUpdate_ = std::chrono::system_clock::now();
}

void Portfolio::addPosition(std::shared_ptr<Stock> stock, int quantity, double price) {
    Position pos;
    pos.stock = stock;
    pos.quantity = quantity;
    pos.averagePrice = price;
    pos.currentPrice = price;
    pos.profit = 0.0;
    pos.profitPercentage = 0.0;
    
    positions_[stock->getSymbol()] = pos;
}

void Portfolio::removePosition(const std::string& symbol) {
    positions_.erase(symbol);
}

void Portfolio::updatePositions() {
    for (auto& [symbol, position] : positions_) {
        position.update(position.stock->getCurrentPrice());
    }
    lastUpdate_ = std::chrono::system_clock::now();
}

double Portfolio::getTotalValue() const {
    return std::accumulate(positions_.begin(), positions_.end(), 0.0,
        [](double sum, const auto& pair) {
            return sum + pair.second.quantity * pair.second.currentPrice;
        });
}

double Portfolio::getTotalProfit() const {
    return std::accumulate(positions_.begin(), positions_.end(), 0.0,
        [](double sum, const auto& pair) {
            return sum + pair.second.profit;
        });
}

double Portfolio::getTotalProfitPercentage() const {
    double totalCost = std::accumulate(positions_.begin(), positions_.end(), 0.0,
        [](double sum, const auto& pair) {
            return sum + pair.second.quantity * pair.second.averagePrice;
        });
    
    return totalCost == 0.0 ? 0.0 : (getTotalProfit() / totalCost) * 100.0;
}

void Portfolio::rebalance(const std::vector<std::shared_ptr<Stock>>& targetStocks) {
    double totalValue = getTotalValue();
    std::map<std::string, double> targetWeights;
    
    // 목표 비중 계산
    for (const auto& stock : targetStocks) {
        targetWeights[stock->getSymbol()] = 1.0 / targetStocks.size();
    }
    
    // 현재 포지션 조정
    for (const auto& [symbol, weight] : targetWeights) {
        double targetValue = totalValue * weight;
        auto it = positions_.find(symbol);
        
        if (it != positions_.end()) {
            // 기존 포지션 조정
            int targetQuantity = static_cast<int>(targetValue / it->second.currentPrice);
            it->second.quantity = targetQuantity;
        } else {
            // 새로운 포지션 추가
            auto stock = std::find_if(targetStocks.begin(), targetStocks.end(),
                [&symbol](const auto& s) { return s->getSymbol() == symbol; });
            
            if (stock != targetStocks.end()) {
                int quantity = static_cast<int>(targetValue / (*stock)->getCurrentPrice());
                addPosition(*stock, quantity, (*stock)->getCurrentPrice());
            }
        }
    }
}

double Portfolio::calculatePortfolioRisk() const {
    auto returns = calculateReturns();
    if (returns.empty()) return 0.0;
    
    double mean = std::accumulate(returns.begin(), returns.end(), 0.0) / returns.size();
    double variance = 0.0;
    
    for (double r : returns) {
        variance += std::pow(r - mean, 2);
    }
    variance /= returns.size();
    
    return std::sqrt(variance) * std::sqrt(252); // 연간화된 변동성
}

double Portfolio::calculatePortfolioBeta() const {
    // 시장 수익률과의 공분산 / 시장 수익률의 분산
    // 실제 구현에서는 시장 지수 데이터가 필요
    return 1.0; // 임시 값
}

std::vector<double> Portfolio::calculateReturns() const {
    std::vector<double> returns;
    for (const auto& [symbol, position] : positions_) {
        const auto& prices = position.stock->getHistoricalPrices();
        if (prices.size() > 1) {
            double return_ = (prices.back() - prices.front()) / prices.front();
            returns.push_back(return_);
        }
    }
    return returns;
}

void Position::update(double newPrice) {
    currentPrice = newPrice;
    profit = (currentPrice - averagePrice) * quantity;
    profitPercentage = ((currentPrice - averagePrice) / averagePrice) * 100.0;
}

nlohmann::json Position::toJson() const {
    nlohmann::json j;
    j["symbol"] = stock->getSymbol();
    j["quantity"] = quantity;
    j["average_price"] = averagePrice;
    j["current_price"] = currentPrice;
    j["profit"] = profit;
    j["profit_percentage"] = profitPercentage;
    return j;
}

Position Position::fromJson(const nlohmann::json& json) {
    Position pos;
    pos.quantity = json["quantity"];
    pos.averagePrice = json["average_price"];
    pos.currentPrice = json["current_price"];
    pos.profit = json["profit"];
    pos.profitPercentage = json["profit_percentage"];
    return pos;
}

nlohmann::json Portfolio::toJson() const {
    nlohmann::json j;
    j["initial_capital"] = initialCapital_;
    j["last_update"] = std::chrono::system_clock::to_time_t(lastUpdate_);
    
    nlohmann::json positionsJson = nlohmann::json::object();
    for (const auto& [symbol, position] : positions_) {
        positionsJson[symbol] = position.toJson();
    }
    j["positions"] = positionsJson;
    
    return j;
}

Portfolio Portfolio::fromJson(const nlohmann::json& json) {
    Portfolio portfolio(json["initial_capital"]);
    
    for (const auto& [symbol, posJson] : json["positions"].items()) {
        portfolio.positions_[symbol] = Position::fromJson(posJson);
    }
    
    return portfolio;
}

} // namespace quant 