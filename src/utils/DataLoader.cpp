#include "utils/DataLoader.hpp"
#include <fstream>
#include <sstream>
#include <iostream>
#include <stdexcept>
#include <chrono>
#include <thread>

namespace quant {

DataLoader::DataLoader() {
    // CURL 초기화
    curl_ = curl_easy_init();
    if (!curl_) {
        throw std::runtime_error("Failed to initialize CURL");
    }

    // API 설정 (실제 API 키와 URL로 변경 필요)
    apiKey_ = "YOUR_API_KEY";
    baseUrl_ = "https://api.example.com/v1";
}

DataLoader::~DataLoader() {
    if (curl_) {
        curl_easy_cleanup(curl_);
    }
}

std::vector<std::shared_ptr<Stock>> DataLoader::loadFromCSV(const std::string& filepath) {
    std::vector<std::shared_ptr<Stock>> stocks;
    std::ifstream file(filepath);
    
    if (!file.is_open()) {
        throw std::runtime_error("Failed to open file: " + filepath);
    }

    std::string line;
    bool isFirstLine = true;
    
    while (std::getline(file, line)) {
        if (isFirstLine) {
            isFirstLine = false;
            continue; // Skip header
        }

        auto values = splitCSVLine(line);
        if (values.size() < 6) {
            continue; // Skip invalid lines
        }

        try {
            auto stock = std::make_shared<Stock>(values[0]); // Symbol
            
            // Parse historical prices
            std::vector<double> prices;
            for (size_t i = 1; i < values.size() - 4; ++i) {
                prices.push_back(parseDouble(values[i]));
            }
            
            // Update stock data
            stock->updatePrice(prices.back());
            stock->updateFinancials(
                parseDouble(values[values.size() - 4]), // PER
                parseDouble(values[values.size() - 3]), // PBR
                parseDouble(values[values.size() - 2]), // ROE
                parseDouble(values[values.size() - 1])  // Operating Margin
            );
            
            stocks.push_back(stock);
        } catch (const std::exception& e) {
            std::cerr << "Error parsing line: " << line << "\nError: " << e.what() << std::endl;
            continue;
        }
    }

    return stocks;
}

std::vector<std::shared_ptr<Stock>> DataLoader::loadFromAPI(const std::string& symbol) {
    std::string url = baseUrl_ + "/stocks/" + symbol;
    std::string response = makeAPIRequest(url);
    auto json = parseAPIResponse(response);
    
    auto stock = std::make_shared<Stock>(symbol);
    
    try {
        // Parse price data
        std::vector<double> prices;
        for (const auto& price : json["historical_prices"]) {
            prices.push_back(price["close"].get<double>());
        }
        stock->updatePrice(prices.back());
        
        // Parse financial data
        stock->updateFinancials(
            json["per"].get<double>(),
            json["pbr"].get<double>(),
            json["roe"].get<double>(),
            json["operating_margin"].get<double>()
        );
        
        return {stock};
    } catch (const std::exception& e) {
        throw std::runtime_error("Failed to parse API response for " + symbol + ": " + e.what());
    }
}

std::vector<std::shared_ptr<Stock>> DataLoader::loadMultipleStocks(
    const std::vector<std::string>& symbols) {
    std::vector<std::shared_ptr<Stock>> stocks;
    
    for (const auto& symbol : symbols) {
        try {
            auto stockData = loadFromAPI(symbol);
            stocks.insert(stocks.end(), stockData.begin(), stockData.end());
            
            // API rate limiting을 위한 딜레이
            std::this_thread::sleep_for(std::chrono::milliseconds(100));
        } catch (const std::exception& e) {
            std::cerr << "Error loading data for " << symbol << ": " << e.what() << std::endl;
            continue;
        }
    }
    
    return stocks;
}

std::string DataLoader::makeAPIRequest(const std::string& url) {
    CURLResponse response;
    
    curl_easy_setopt(curl_, CURLOPT_URL, url.c_str());
    curl_easy_setopt(curl_, CURLOPT_WRITEFUNCTION, CURLResponse::WriteCallback);
    curl_easy_setopt(curl_, CURLOPT_WRITEDATA, &response.data);
    
    // API 키 추가
    struct curl_slist* headers = nullptr;
    headers = curl_slist_append(headers, ("Authorization: Bearer " + apiKey_).c_str());
    curl_easy_setopt(curl_, CURLOPT_HTTPHEADER, headers);
    
    CURLcode res = curl_easy_perform(curl_);
    curl_slist_free_all(headers);
    
    if (res != CURLE_OK) {
        throw std::runtime_error("API request failed: " + std::string(curl_easy_strerror(res)));
    }
    
    return response.data;
}

nlohmann::json DataLoader::parseAPIResponse(const std::string& response) {
    try {
        return nlohmann::json::parse(response);
    } catch (const std::exception& e) {
        throw std::runtime_error("Failed to parse API response: " + std::string(e.what()));
    }
}

std::vector<std::string> DataLoader::splitCSVLine(const std::string& line) {
    std::vector<std::string> result;
    std::stringstream ss(line);
    std::string item;
    
    while (std::getline(ss, item, ',')) {
        result.push_back(item);
    }
    
    return result;
}

double DataLoader::parseDouble(const std::string& str) {
    try {
        return std::stod(str);
    } catch (const std::exception& e) {
        throw std::runtime_error("Failed to parse double: " + str);
    }
}

// CURL 콜백 함수 구현
size_t DataLoader::CURLResponse::WriteCallback(void* contents, size_t size, size_t nmemb, std::string* userp) {
    size_t realsize = size * nmemb;
    userp->append((char*)contents, realsize);
    return realsize;
}

} // namespace quant 