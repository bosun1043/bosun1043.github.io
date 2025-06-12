#include "StockDataProvider.hpp"
#include <algorithm>

StockDataProvider::StockDataProvider() {
    initializeDefaultData();
}

bool StockDataProvider::validateData(const StockData& data) const {
    return !data.symbol.empty() && !data.name.empty() && data.currentPrice > 0;
}

bool StockDataProvider::loadData(const std::string& source) {
    // 파일이나 API에서 데이터 로드 (실제 구현시)
    // 현재는 기본 데이터 사용
    return true;
}

void StockDataProvider::initializeDefaultData() {
    stockDatabase.clear();
    stockDatabase.push_back(StockData("005930", "삼성전자", 73800, 10.2, 15.3, 8.1, 1.2, 5.0));
    stockDatabase.push_back(StockData("000660", "SK하이닉스", 142000, 12.1, 13.2, 9.5, 1.5, 4.2));
    stockDatabase.push_back(StockData("005935", "LG에너지솔루션", 128000, 8.9, 10.1, 7.5, 1.0, 3.5));
    stockDatabase.push_back(StockData("035420", "NAVER", 205000, 16.7, 18.0, 15.0, 2.0, 6.0));
    stockDatabase.push_back(StockData("035720", "카카오", 85000, 6.2, 7.5, 5.5, 0.8, 2.5));
    stockDatabase.push_back(StockData("005830", "현대차", 142000, 10.8, 12.0, 9.0, 1.2, 4.0));
    stockDatabase.push_back(StockData("000270", "기아", 168000, 11.5, 12.5, 10.0, 1.5, 5.0));
    stockDatabase.push_back(StockData("000890", "POSCO홀딩스", 98000, 7.4, 8.0, 6.0, 0.8, 2.0));
    stockDatabase.push_back(StockData("000810", "KB금융", 112000, 8.1, 9.0, 7.0, 1.0, 3.0));
    stockDatabase.push_back(StockData("000240", "신한지주", 105000, 7.8, 8.5, 6.5, 0.9, 2.5));
}


std::vector<StockData> StockDataProvider::getAllStocks() const {
    return stockDatabase;
}

StockData StockDataProvider::getStockBySymbol(const std::string& symbol) const {
    auto it = std::find_if(stockDatabase.begin(), stockDatabase.end(),
                          [&symbol](const StockData& stock) {
                              return stock.symbol == symbol;
                          });
    return it != stockDatabase.end() ? *it : StockData();
}

void StockDataProvider::updateMarketData() {
    // 실시간 데이터 업데이트 로직
}

std::vector<StockData> StockDataProvider::getTop10Stocks() const {
    return stockDatabase; // 현재는 전체 데이터가 10개
}
