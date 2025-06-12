
// StockData.hpp
#ifndef STOCK_DATA_HPP
#define STOCK_DATA_HPP

#include <string>

struct StockData {
    std::string symbol;
    std::string name;
    double currentPrice;
    double roe;
    double margin;
    double per;
    double pbr;
    double momentum;
    double score;

    StockData();
    StockData(const std::string& sym, const std::string& nm, double price, 
              double r, double m, double pe, double pb, double mom);
    
    void calculateScore(double roeWeight, double marginWeight, double perWeight, 
                       double pbrWeight, double momentumWeight);
    std::string toString() const;
};

#endif