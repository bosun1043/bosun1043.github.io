#pragma once
#include <vector>
#include <memory>
#include "../market/Stock.hpp"

namespace quant {

class Strategy {
public:
    virtual ~Strategy() = default;
    
    // Run strategy and return selected stocks
    virtual std::vector<std::shared_ptr<Stock>> run(
        const std::vector<std::shared_ptr<Stock>>& stocks) = 0;
    
    // Get strategy name
    virtual std::string getName() const = 0;
    
protected:
    // Common utility functions for all strategies
    double calculateReturn(const std::vector<double>& prices) const;
    double calculateVolatility(const std::vector<double>& returns) const;
};

} // namespace quant 