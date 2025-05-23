#include <cpprest/http_listener.h>
#include <cpprest/json.h>
#include <memory>
#include "../strategy/Strategy.hpp"
#include "../portfolio/Portfolio.hpp"
#include "../backtest/Backtest.hpp"

using namespace web;
using namespace web::http;
using namespace web::http::experimental::listener;

class APIServer {
public:
    APIServer(const std::string& url) : listener_(url) {
        listener_.support(methods::GET, "/api/market-data", 
            std::bind(&APIServer::handleGetMarketData, this, std::placeholders::_1));
        listener_.support(methods::POST, "/api/run-strategy", 
            std::bind(&APIServer::handleRunStrategy, this, std::placeholders::_1));
        listener_.support(methods::POST, "/api/run-backtest", 
            std::bind(&APIServer::handleRunBacktest, this, std::placeholders::_1));
        listener_.support(methods::GET, "/api/portfolio", 
            std::bind(&APIServer::handleGetPortfolio, this, std::placeholders::_1));
    }

    void start() { listener_.open().wait(); }
    void stop() { listener_.close().wait(); }

private:
    http_listener listener_;
    std::unique_ptr<Portfolio> portfolio_;

    void handleGetMarketData(http_request request) {
        auto response = json::value::object();
        // 시장 데이터 가져오기
        response["kospi"] = json::value::number(getKospiValue());
        response["kosdaq"] = json::value::number(getKosdaqValue());
        response["exchange_rate"] = json::value::number(getExchangeRate());
        
        request.reply(status_codes::OK, response);
    }

    void handleRunStrategy(http_request request) {
        auto body = request.extract_json().get();
        std::string strategyType = body["strategy"].as_string();
        
        auto response = json::value::object();
        try {
            auto results = runStrategy(strategyType);
            response["success"] = json::value::boolean(true);
            response["results"] = results.toJson();
        } catch (const std::exception& e) {
            response["success"] = json::value::boolean(false);
            response["error"] = json::value::string(e.what());
        }
        
        request.reply(status_codes::OK, response);
    }

    void handleRunBacktest(http_request request) {
        auto body = request.extract_json().get();
        std::string strategyType = body["strategy"].as_string();
        std::string startDate = body["start_date"].as_string();
        std::string endDate = body["end_date"].as_string();
        
        auto response = json::value::object();
        try {
            auto metrics = runBacktest(strategyType, startDate, endDate);
            response["success"] = json::value::boolean(true);
            response["metrics"] = metrics.toJson();
        } catch (const std::exception& e) {
            response["success"] = json::value::boolean(false);
            response["error"] = json::value::string(e.what());
        }
        
        request.reply(status_codes::OK, response);
    }

    void handleGetPortfolio(http_request request) {
        auto response = json::value::object();
        try {
            response["portfolio"] = portfolio_->toJson();
            response["success"] = json::value::boolean(true);
        } catch (const std::exception& e) {
            response["success"] = json::value::boolean(false);
            response["error"] = json::value::string(e.what());
        }
        
        request.reply(status_codes::OK, response);
    }
}; 