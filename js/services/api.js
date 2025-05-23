// API 기본 설정
const API_BASE_URL = 'https://api.example.com'; // 실제 API 엔드포인트로 변경 필요

// API 요청 헬퍼 함수
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
        
        if (!response.ok) {
            throw new Error(`API 요청 실패: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API 요청 중 오류 발생:', error);
        throw error;
    }
}

// 시장 데이터 API
export const marketAPI = {
    getMarketIndicators: () => fetchAPI('/market/indicators'),
    getStockPrice: (symbol) => fetchAPI(`/market/price/${symbol}`),
    getExchangeRate: () => fetchAPI('/market/exchange-rate'),
};

// 전략 API
export const strategyAPI = {
    runMomentumStrategy: (params) => fetchAPI('/strategy/momentum', {
        method: 'POST',
        body: JSON.stringify(params),
    }),
    runValueStrategy: (params) => fetchAPI('/strategy/value', {
        method: 'POST',
        body: JSON.stringify(params),
    }),
    runQualityStrategy: (params) => fetchAPI('/strategy/quality', {
        method: 'POST',
        body: JSON.stringify(params),
    }),
};

// 백테스트 API
export const backtestAPI = {
    runBacktest: (params) => fetchAPI('/backtest/run', {
        method: 'POST',
        body: JSON.stringify(params),
    }),
    getBacktestResults: (id) => fetchAPI(`/backtest/results/${id}`),
};

// 포트폴리오 API
export const portfolioAPI = {
    getPortfolio: () => fetchAPI('/portfolio'),
    updatePortfolio: (data) => fetchAPI('/portfolio', {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
}; 