#ifndef QUANT_STRATEGY_HPP
#define QUANT_STRATEGY_HPP

#include <vector>
#include <string>
#include <map>
#include <algorithm>

// 주식 데이터 구조체
struct StockData {
    std::string symbol;      // 종목 코드
    std::string name;        // 종목명
    double currentPrice;     // 현재가
    double roe;             // ROE (%)
    double margin;          // 영업이익률 (%)
    double per;             // PER
    double pbr;             // PBR
    double momentum;        // 모멘텀 점수
    double score;           // 종합 점수
};

// 전략 타입 열거형
enum class StrategyType {
    VALUE,      // 밸류 전략
    QUALITY,    // 퀄리티 전략
    MOMENTUM,   // 모멘텀 전략
    HYBRID      // 하이브리드 전략
};

class QuantStrategy {
private:
    // 전략 파라미터
    StrategyType currentStrategy;
    double roeWeight;       // ROE 가중치
    double marginWeight;    // 영업이익률 가중치
    double perWeight;       // PER 가중치
    double pbrWeight;       // PBR 가중치
    double momentumWeight;  // 모멘텀 가중치
    
    // 투자 기간 및 리밸런싱
    int investmentPeriod;   // 투자 기간 (월)
    int rebalancingPeriod;  // 리밸런싱 주기 (일)
    
    // 포트폴리오 상태
    std::map<std::string, StockData> positions;
    double cash;
    
    // 상위 10개 종목 데이터
    std::vector<StockData> top10Stocks;
    
public:
    QuantStrategy();
    
    // 상위 10개 종목 데이터 초기화
    void initializeTop10Stocks();
    
    // 전략 실행
    std::vector<StockData> executeStrategy(
        const std::vector<std::string>& selectedStocks,
        StrategyType strategyType
    );
    
    // 전략 파라미터 설정
    void setStrategyType(StrategyType type);
    void setWeights(double roeW, double marginW, double perW, double pbrW, double momW);
    void setPeriods(int invPeriod, int rebPeriod);
    
    // 포지션 관리
    void enterPosition(const std::string& symbol, double amount);
    void exitPosition(const std::string& symbol);
    
    // 상태 조회
    double getPortfolioValue() const;
    std::map<std::string, StockData> getPositions() const;
    std::vector<StockData> getTop10Stocks() const;
    
    // 백테스트 결과
    struct BacktestResult {
        double expectedReturn;    // 예상 수익률
        double volatility;        // 변동성
        double sharpeRatio;       // 샤프 비율
        std::vector<double> monthlyReturns;  // 월별 수익률
    };
    
    BacktestResult runBacktest(const std::vector<std::string>& selectedStocks);
};

#endif 