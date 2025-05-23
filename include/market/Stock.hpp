#pragma once
#include <string>
#include <vector>
#include <map>

namespace quant {

class Stock {
public:
    Stock(const std::string& symbol);
    
    // Getters
    std::string getSymbol() const { return symbol_; }
    double getCurrentPrice() const { return currentPrice_; }
    const std::vector<double>& getHistoricalPrices() const { return historicalPrices_; }
    
    // Financial metrics
    double getPER() const { return per_; }
    double getPBR() const { return pbr_; }
    double getROE() const { return roe_; }
    double getOperatingMargin() const { return operatingMargin_; }
    
    // Update methods
    void updatePrice(double price);
    void updateFinancials(double per, double pbr, double roe, double operatingMargin);
    
private:
    std::string symbol_;
    double currentPrice_;
    std::vector<double> historicalPrices_;
    
    // Financial metrics
    double per_;
    double pbr_;
    double roe_;
    double operatingMargin_;
};

} // namespace quant 