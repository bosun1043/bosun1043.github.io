#include "strategy/StrategyResult.hpp"
#include <sstream>
#include <iomanip>

namespace quant {

nlohmann::json StrategyResult::toJson() const {
    nlohmann::json j;
    j["strategy_name"] = strategyName;
    j["execution_time"] = std::chrono::system_clock::to_time_t(executionTime);
    j["total_return"] = totalReturn;
    j["sharpe_ratio"] = sharpeRatio;
    j["max_drawdown"] = maxDrawdown;
    
    // 선택된 종목 정보
    nlohmann::json stocksJson = nlohmann::json::array();
    for (const auto& stock : selectedStocks) {
        nlohmann::json stockJson;
        stockJson["symbol"] = stock->getSymbol();
        stockJson["price"] = stock->getCurrentPrice();
        stockJson["per"] = stock->getPER();
        stockJson["pbr"] = stock->getPBR();
        stockJson["roe"] = stock->getROE();
        stockJson["operating_margin"] = stock->getOperatingMargin();
        stocksJson.push_back(stockJson);
    }
    j["selected_stocks"] = stocksJson;
    
    return j;
}

StrategyResult StrategyResult::fromJson(const nlohmann::json& json) {
    StrategyResult result;
    result.strategyName = json["strategy_name"];
    result.executionTime = std::chrono::system_clock::from_time_t(json["execution_time"]);
    result.totalReturn = json["total_return"];
    result.sharpeRatio = json["sharpe_ratio"];
    result.maxDrawdown = json["max_drawdown"];
    
    // 선택된 종목 정보 복원
    for (const auto& stockJson : json["selected_stocks"]) {
        auto stock = std::make_shared<Stock>(stockJson["symbol"]);
        stock->updatePrice(stockJson["price"]);
        stock->updateFinancials(
            stockJson["per"],
            stockJson["pbr"],
            stockJson["roe"],
            stockJson["operating_margin"]
        );
        result.selectedStocks.push_back(stock);
    }
    
    return result;
}

} // namespace quant 