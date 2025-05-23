#include "utils/PerformanceOptimizer.hpp"
#include <algorithm>
#include <numeric>
#include <immintrin.h> // AVX 명령어 사용

namespace quant {

template<typename T>
std::vector<T> PerformanceOptimizer::parallelProcess(
    const std::vector<T>& data,
    std::function<T(const T&)> processFunc,
    size_t numThreads) {
    
    std::vector<std::future<T>> futures;
    std::vector<T> results(data.size());
    
    // 작업 분할
    size_t chunkSize = data.size() / numThreads;
    if (chunkSize == 0) chunkSize = 1;
    
    for (size_t i = 0; i < data.size(); i += chunkSize) {
        size_t end = std::min(i + chunkSize, data.size());
        futures.push_back(std::async(std::launch::async,
            [&data, &processFunc, i, end]() {
                std::vector<T> chunkResults;
                for (size_t j = i; j < end; ++j) {
                    chunkResults.push_back(processFunc(data[j]));
                }
                return chunkResults;
            }));
    }
    
    // 결과 수집
    size_t resultIndex = 0;
    for (auto& future : futures) {
        auto chunkResults = future.get();
        for (const auto& result : chunkResults) {
            results[resultIndex++] = result;
        }
    }
    
    return results;
}

void PerformanceOptimizer::optimizeMemoryUsage() {
    // 메모리 정렬 최적화
    std::vector<std::shared_ptr<Stock>> stocks;
    stocks.reserve(1000); // 예상 크기로 미리 할당
    
    // 메모리 풀 사용
    static std::vector<double> pricePool;
    pricePool.reserve(10000);
}

void PerformanceOptimizer::optimizeCacheUsage() {
    // 데이터 지역성 최적화
    struct StockData {
        double price;
        double volume;
        double change;
    };
    
    // 연속된 메모리 레이아웃 사용
    std::vector<StockData> stockData;
    stockData.reserve(1000);
}

std::vector<double> PerformanceOptimizer::vectorizedOperation(
    const std::vector<double>& a,
    const std::vector<double>& b,
    std::function<double(double, double)> op) {
    
    std::vector<double> result(a.size());
    
    // AVX 명령어를 사용한 벡터화 연산
    for (size_t i = 0; i < a.size(); i += 4) {
        __m256d va = _mm256_load_pd(&a[i]);
        __m256d vb = _mm256_load_pd(&b[i]);
        __m256d vr = _mm256_add_pd(va, vb); // 예시: 덧셈 연산
        _mm256_store_pd(&result[i], vr);
    }
    
    return result;
}

} // namespace quant 