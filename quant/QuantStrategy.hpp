#ifndef QUANT_STRATEGY_HPP
#define QUANT_STRATEGY_HPP

#include <vector>
#include <string>
#include <map>
#include <algorithm>

struct StockData {
    std::string symbol;
    double roe;           // ROE (%)
    double margin;        // 영업이익률 (%)
    double score;         // 종합 점수
};

class QuantStrategy {
private:
    // 전략 파라미터
    double roeWeight;     // ROE 가중치
    double marginWeight;  // 영업이익률 가중치
    int minRoe;          // 최소 ROE 기준
    int minMargin;       // 최소 영업이익률 기준
    
    // 포트폴리오 상태
    std::map<std::string, double> positions;
    double cash;
    
public:
    QuantStrategy(double roeW = 0.6, double marginW = 0.4, 
                 int minR = 10, int minM = 5);
    
    // 퀄리티 전략 실행
    std::vector<StockData> executeQualityStrategy(const std::vector<StockData>& stocks);
    
    // 포지션 관리
    void enterPosition(const std::string& symbol, double amount);
    void exitPosition(const std::string& symbol);
    
    // 상태 조회
    double getPortfolioValue() const;
    std::map<std::string, double> getPositions() const;
    
    // 파라미터 설정
    void setParameters(double roeW, double marginW, int minR, int minM);
};

#endif 