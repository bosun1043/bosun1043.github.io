#ifndef STOCK_DATA_PROVIDER_HPP
#define STOCK_DATA_PROVIDER_HPP

#include "StockData.hpp"
#include <vector>
#include <string>

class StockDataProvider {
private:
    std::vector<StockData> stockDatabase;
    bool validateData(const StockData& data) const;

public:
    StockDataProvider();
    
    bool loadData(const std::string& source);
    void initializeDefaultData();
    std::vector<StockData> getAllStocks() const;
    StockData getStockBySymbol(const std::string& symbol) const;
    void updateMarketData();
    std::vector<StockData> getTop10Stocks() const;
};

#endif