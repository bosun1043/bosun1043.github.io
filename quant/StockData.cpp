// StockData.cpp
#include "StockData.hpp"
#include <sstream>
#include <iomanip>
#include <algorithm>

StockData::StockData() 
    : symbol(""), name(""), currentPrice(0), roe(0), margin(0), 
      per(0), pbr(0), momentum(0), score(0) {}

StockData::StockData(const std::string& sym, const std::string& nm, double price, 
                     double r, double m, double pe, double pb, double mom)
    : symbol(sym), name(nm), currentPrice(price), roe(r), margin(m), 
      per(pe), pbr(pb), momentum(mom), score(0) {}

void StockData::calculateScore(double roeWeight, double marginWeight, double perWeight, 
                              double pbrWeight, double momentumWeight) {
    // ROE 점수 정규화 (0-100)
    double roeScore = std::min(std::max((roe / 30.0) * 100, 0.0), 100.0);
    
    // 영업이익률 점수 정규화 (0-100)
    double marginScore = std::min(std::max((margin / 20.0) * 100, 0.0), 100.0);
    
    // PER 점수 (낮을수록 좋음, 역정규화)
    double perScore = per > 0 ? std::min(std::max((30.0 - per) / 30.0 * 100, 0.0), 100.0) : 0;
    
    // PBR 점수 (낮을수록 좋음, 역정규화)
    double pbrScore = pbr > 0 ? std::min(std::max((3.0 - pbr) / 3.0 * 100, 0.0), 100.0) : 0;
    
    // 모멘텀 점수 정규화 (0-100)
    double momentumScore = std::min(std::max((momentum / 10.0) * 100, 0.0), 100.0);
    
    score = (roeScore * roeWeight + marginScore * marginWeight + 
             perScore * perWeight + pbrScore * pbrWeight + 
             momentumScore * momentumWeight);
}

std::string StockData::toString() const {
    std::ostringstream oss;
    oss << std::fixed << std::setprecision(2);
    oss << "Symbol: " << symbol << ", Name: " << name 
        << ", Price: " << currentPrice << ", ROE: " << roe << "%" 
        << ", Margin: " << margin << "%, Score: " << score;
    return oss.str();
}
