// main.cpp
#include "QuantStrategyManager.hpp"
#include "QualityStrategy.hpp"
#include "StrategyWeights.hpp"
#include <iostream>
#include <iomanip>
#include <memory>

int main() {
    std::cout << "=== Quant Strategy System v2.0 ===" << std::endl;
    
    // 1. 전략 매니저 초기화 (초기 자금 1억원)
    QuantStrategyManager manager(100000000.0);
    
    // 2. 퀄리티 전략 설정
    StrategyWeights weights(0.4, 0.3, 0.2, 0.1, 0.0, 10, 5); // ROE 40%, 마진 30%, PER 20%, PBR 10%
    auto qualityStrategy = std::make_unique<QualityStrategy>(weights, 5);
    
    std::cout << "전략: " << qualityStrategy->getName() << std::endl;
    std::cout << "설명: " << qualityStrategy->getDescription() << std::endl << std::endl;
    
    manager.setStrategy(std::move(qualityStrategy));
    
    // 3. 투자 대상 종목 선택 (전체 종목)
    std::vector<std::string> selectedStocks = {
        "005930", "000660", "005935", "035420", "035720",
        "005830", "000270", "000890", "000810", "000240"
    };
    
    // 4. 전략 실행
    std::cout << "전략 실행 중..." << std::endl;
    auto recommendedStocks = manager.executeStrategy(selectedStocks);
    
    // 5. 결과 출력
    std::cout << "\n=== 퀄리티 전략 추천 종목 ===" << std::endl;
    std::cout << std::fixed << std::setprecision(2);
    
    for (size_t i = 0; i < recommendedStocks.size(); ++i) {
        const auto& stock = recommendedStocks[i];
        std::cout << "[" << (i+1) << "] " << stock.toString() << std::endl;
    }
    
    // 6. 포트폴리오 정보
    std::cout << "\n=== 포트폴리오 정보 ===" << std::endl;
    auto portfolio = manager.getPortfolio();
    std::cout << "총 자산: " << portfolio->getTotalValue() << "원" << std::endl;
    std::cout << "현금: " << portfolio->getCash() << "원" << std::endl;
    std::cout << "현금 비율: " << portfolio->getCashRatio() << "%" << std::endl;
    
    // 7. 성과 지표
    auto metrics = manager.getPerformanceMetrics();
    std::cout << "\n=== 성과 지표 ===" << std::endl;
    for (const auto& metric : metrics) {
        std::cout << metric.first << ": " << metric.second << std::endl;
    }
    
    // 8. 백테스트 실행 (예시)
    std::cout << "\n=== 백테스트 결과 ===" << std::endl;
    auto backtestResult = manager.runBacktest(selectedStocks);
    std::cout << "예상 수익률: " << backtestResult.expectedReturn << "%" << std::endl;
    std::cout << "변동성: " << backtestResult.volatility << "%" << std::endl;
    std::cout << "샤프 비율: " << backtestResult.sharpeRatio << std::endl;
    
    // 9. 추천 종목에 투자 시뮬레이션
    std::cout << "\n=== 투자 시뮬레이션 ===" << std::endl;
    double investmentPerStock = 20000000.0; // 종목당 2천만원
    
    for (const auto& stock : recommendedStocks) {
        double shares = investmentPerStock / stock.currentPrice;
        bool success = portfolio->enterPosition(stock.symbol, shares, stock.currentPrice);
        
        if (success) {
            std::cout << stock.name << " (" << stock.symbol << "): " 
                      << shares << "주 매수 (" << investmentPerStock << "원)" << std::endl;
        } else {
            std::cout << stock.name << " (" << stock.symbol << "): 자금 부족으로 매수 실패" << std::endl;
        }
    }
    
    // 10. 최종 포트폴리오 상태
    std::cout << "\n=== 최종 포트폴리오 ===" << std::endl;
    std::cout << "총 자산: " << portfolio->getTotalValue() << "원" << std::endl;
    std::cout << "남은 현금: " << portfolio->getCash() << "원" << std::endl;
    
    auto positions = portfolio->getPositions();
    std::cout << "\n보유 종목:" << std::endl;
    for (const auto& pos : positions) {
        std::cout << "- " << pos.first << ": " 
                  << pos.second.getShares() << "주, "
                  << "가치: " << pos.second.getCurrentValue() << "원" << std::endl;
    }
    
    return 0;
}