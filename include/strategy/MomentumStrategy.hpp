#pragma once
#include "Strategy.hpp"

namespace quant {

class MomentumStrategy : public Strategy {
public:
    MomentumStrategy(int lookbackPeriod = 12);
    
    std::vector<std::shared_ptr<Stock>> run(
        const std::vector<std::shared_ptr<Stock>>& stocks) override;
    
    std::string getName() const override { return "Momentum Strategy"; }
    
private:
    int lookbackPeriod_;
    
    double calculateMomentum(const std::vector<double>& prices) const;
};

} // namespace quant 