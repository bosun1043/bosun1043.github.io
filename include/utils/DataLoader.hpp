#pragma once
#include <string>
#include <vector>
#include <memory>
#include <map>
#include <curl/curl.h>
#include <nlohmann/json.hpp>
#include "../market/Stock.hpp"

namespace quant {

class DataLoader {
public:
    DataLoader();
    ~DataLoader();

    // CSV 파일에서 데이터 로드
    std::vector<std::shared_ptr<Stock>> loadFromCSV(const std::string& filepath);
    
    // API에서 데이터 로드
    std::vector<std::shared_ptr<Stock>> loadFromAPI(const std::string& symbol);
    
    // 여러 종목의 데이터를 한 번에 로드
    std::vector<std::shared_ptr<Stock>> loadMultipleStocks(
        const std::vector<std::string>& symbols);

private:
    // CURL 콜백 함수를 위한 구조체
    struct CURLResponse {
        std::string data;
        static size_t WriteCallback(void* contents, size_t size, size_t nmemb, std::string* userp);
    };

    // API 요청을 위한 헬퍼 함수들
    std::string makeAPIRequest(const std::string& url);
    nlohmann::json parseAPIResponse(const std::string& response);
    
    // CSV 파싱을 위한 헬퍼 함수들
    std::vector<std::string> splitCSVLine(const std::string& line);
    double parseDouble(const std::string& str);
    
    // CURL 핸들
    CURL* curl_;
    
    // API 설정
    std::string apiKey_;
    std::string baseUrl_;
};

} // namespace quant 