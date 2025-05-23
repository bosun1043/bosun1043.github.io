#pragma once
#include <vector>
#include <memory>
#include <thread>
#include <future>
#include "../market/Stock.hpp"
#include "../strategy/Strategy.hpp"

namespace quant {

class PerformanceOptimizer {
public:
    // 멀티스레딩 최적화
    template<typename T>
    static std::vector<T> parallelProcess(
        const std::vector<T>& data,
        std::function<T(const T&)> processFunc,
        size_t numThreads = std::thread::hardware_concurrency());
    
    // 메모리 최적화
    static void optimizeMemoryUsage();
    
    // 캐시 최적화
    static void optimizeCacheUsage();
    
    // 벡터화 연산
    static std::vector<double> vectorizedOperation(
        const std::vector<double>& a,
        const std::vector<double>& b,
        std::function<double(double, double)> op);
};

} // namespace quant 