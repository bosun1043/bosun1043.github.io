// IStrategy.hpp
#ifndef I_STRATEGY_HPP
#define I_STRATEGY_HPP

#include "StockData.hpp"
#include <vector>
#include <string>

class IStrategy {
public:
    virtual ~IStrategy() = default;
    virtual std::vector<StockData> execute(const std::vector<StockData>& stocks) = 0;
    virtual std::string getName() const = 0;
    virtual std::string getDescription() const = 0;
};

#endif