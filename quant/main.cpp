#include "QuantStrategy.hpp"
#include <iostream>
#include <vector>
#include <iomanip>

int main() {
    // 전략 인스턴스 생성
    QuantStrategy strategy(0.6, 0.4, 10, 5); // ROE 가중치 60%, 영업이익률 가중치 40%
    
    // 샘플 주식 데이터
    std::vector<StockData> stocks = {
        {"삼성전자", 15.5, 12.3, 0.0},
        {"SK하이닉스", 18.2, 14.5, 0.0},
        {"LG에너지솔루션", 12.8, 8.9, 0.0},
        {"NAVER", 20.5, 16.7, 0.0},
        {"카카오", 8.5, 6.2, 0.0},
        {"현대차", 14.2, 10.8, 0.0},
        {"기아", 16.8, 11.5, 0.0},
        {"POSCO홀딩스", 9.8, 7.4, 0.0},
        {"KB금융", 11.2, 8.1, 0.0},
        {"신한지주", 10.5, 7.8, 0.0}
    };
    
    // 퀄리티 전략 실행
    auto results = strategy.executeQualityStrategy(stocks);
    
    // 결과 출력
    std::cout << "퀄리티 전략 선정 종목:\n";
    std::cout << std::fixed << std::setprecision(2);
    
    for (const auto& stock : results) {
        std::cout << "종목: " << stock.symbol << "\n"
                  << "ROE: " << stock.roe << "%\n"
                  << "영업이익률: " << stock.margin << "%\n"
                  << "종합점수: " << stock.score << "\n\n";
    }
    
    // 평균값 계산
    double avgScore = 0.0;
    double avgRoe = 0.0;
    double avgMargin = 0.0;
    
    for (const auto& stock : results) {
        avgScore += stock.score;
        avgRoe += stock.roe;
        avgMargin += stock.margin;
    }
    
    if (!results.empty()) {
        avgScore /= results.size();
        avgRoe /= results.size();
        avgMargin /= results.size();
        
        std::cout << "평균 퀄리티 점수: " << avgScore << "\n"
                  << "평균 ROE: " << avgRoe << "%\n"
                  << "평균 영업이익률: " << avgMargin << "%\n";
    }
    
    return 0;
} 