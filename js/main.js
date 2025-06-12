// 전역 변수
let selectedStocks = [];
let currentStrategy = null;
let charts = {};
let currentPortfolio = {};
let marketData = {};

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    loadTop10Stocks();
});

function initializeApp() {
    setupEventListeners();
}

function setupEventListeners() {
    // 시작하기 버튼
    const startButton = document.getElementById('start-button');
    if (startButton) {
        startButton.addEventListener('click', () => nextStep('stock-selection'));
    }

    // 뒤로 가기 버튼들
    const backToWelcome = document.getElementById('back-to-welcome');
    if (backToWelcome) {
        backToWelcome.addEventListener('click', () => nextStep('welcome'));
    }

    const backToStocks = document.getElementById('back-to-stocks');
    if (backToStocks) {
        backToStocks.addEventListener('click', () => nextStep('stock-selection'));
    }

    const backToStrategy = document.getElementById('back-to-strategy');
    if (backToStrategy) {
        backToStrategy.addEventListener('click', () => nextStep('strategy-selection'));
    }

    const backToParameter = document.getElementById('back-to-parameter');
    if (backToParameter) {
        backToParameter.addEventListener('click', () => nextStep('parameter-setting'));
    }

    // 다음 단계 버튼들
    const toStrategyButton = document.getElementById('to-strategy-button');
    if (toStrategyButton) {
        toStrategyButton.addEventListener('click', () => nextStep('strategy-selection'));
    }

    const toParameterButton = document.getElementById('to-parameter-button');
    if (toParameterButton) {
        toParameterButton.addEventListener('click', () => nextStep('parameter-setting'));
    }

    // 전략 실행 버튼
    const runStrategyButton = document.getElementById('run-strategy-button');
    if (runStrategyButton) {
        runStrategyButton.addEventListener('click', runStrategy);
    }

    // 다시 시작하기 버튼
    const restartButton = document.getElementById('restart-button');
    if (restartButton) {
        restartButton.addEventListener('click', restart);
    }

    // 종목 선택 체크박스
    document.querySelectorAll('.stock-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleStockSelection);
    });

    // 전략 선택 카드
    document.querySelectorAll('.strategy-card').forEach(card => {
        card.addEventListener('click', handleStrategySelection);
    });

    // 파라미터 조정 슬라이더
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        slider.addEventListener('input', handleParameterChange);
    });
}

async function loadMarketData() {
    try {
        // 실제 API 연동 시 여기에 API 호출 코드 추가
        const mockData = {
            kospi: "2,500.00",
            kosdaq: "850.00",
            usdkrw: "1,350.00"
        };

        document.getElementById('kospi-value').textContent = mockData.kospi;
        document.getElementById('kosdaq-value').textContent = mockData.kosdaq;
        document.getElementById('exchange-rate').textContent = mockData.usdkrw;
    } catch (error) {
        console.error('시장 데이터 로딩 실패:', error);
    }
}

function initializeCharts() {
    // 모멘텀 전략 차트
    charts.momentum = new Chart(document.getElementById('momentum-chart'), {
        type: 'line',
        data: {
            labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
            datasets: [{
                label: '수익률',
                data: [0, 5, 8, 12, 15, 18],
                borderColor: '#3498db',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // 밸류 전략 차트
    charts.value = new Chart(document.getElementById('value-chart'), {
        type: 'line',
        data: {
            labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
            datasets: [{
                label: '수익률',
                data: [0, 3, 6, 9, 12, 15],
                borderColor: '#2ecc71',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // 퀄리티 전략 차트
    charts.quality = new Chart(document.getElementById('quality-chart'), {
        type: 'line',
        data: {
            labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
            datasets: [{
                label: '수익률',
                data: [0, 4, 7, 10, 13, 16],
                borderColor: '#e74c3c',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function loadTop10Stocks() {
    const stocks = [
        { symbol: '005930', name: '삼성전자', price: 73800, change: 1.2 },
        { symbol: '000660', name: 'SK하이닉스', price: 142000, change: -0.7 },
        { symbol: '373220', name: 'LG에너지솔루션', price: 425000, change: 2.1 },
        { symbol: '035420', name: 'NAVER', price: 198500, change: 0.5 },
        { symbol: '035720', name: '카카오', price: 48850, change: -1.2 },
        { symbol: '005380', name: '현대차', price: 187000, change: 0.8 },
        { symbol: '000270', name: '기아', price: 108500, change: 1.5 },
        { symbol: '005490', name: 'POSCO홀딩스', price: 478500, change: -0.3 },
        { symbol: '105560', name: 'KB금융', price: 56800, change: 0.9 },
        { symbol: '055550', name: '신한지주', price: 41350, change: 0.4 }
    ];
    
    updateStockList(stocks);
}

function updateStockList(stocks) {
    const stockList = document.querySelector('.stock-list');
    if (!stockList) {
        console.warn('Stock list container not found');
        return;
    }

    stockList.innerHTML = stocks.map(stock => `
        <div class="stock-item">
            <input type="checkbox" 
                   class="stock-checkbox" 
                   id="stock-${stock.symbol}" 
                   value="${stock.symbol}">
            <label for="stock-${stock.symbol}">
                ${stock.name} (${stock.symbol})
                <span class="price">${stock.price.toLocaleString()}원</span>
                <span class="change ${stock.change >= 0 ? 'up' : 'down'}">
                    ${stock.change >= 0 ? '+' : ''}${stock.change}%
                </span>
            </label>
        </div>
    `).join('');

    // 체크박스 이벤트 리스너 다시 설정
    document.querySelectorAll('.stock-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleStockSelection);
    });
}

function handleStockSelection(event) {
    const symbol = event.target.value;
    if (event.target.checked) {
        selectedStocks.push(symbol);
    } else {
        selectedStocks = selectedStocks.filter(s => s !== symbol);
    }
    updateSelectedStocks();
}

function updateSelectedStocks() {
    const selectedStocksList = document.getElementById('selected-stocks-list');
    if (selectedStocksList) {
        selectedStocksList.innerHTML = selectedStocks.length > 0 
            ? selectedStocks.map(symbol => `<div>${symbol}</div>`).join('')
            : '<div>선택된 종목이 없습니다.</div>';
    }
}

function handleStrategySelection(event) {
    const card = event.target.closest('.strategy-card');
    if (!card) return;

    // 이전 선택 제거
    document.querySelectorAll('.strategy-card').forEach(c => {
        c.classList.remove('selected');
    });

    // 새로운 선택 표시
    card.classList.add('selected');
    currentStrategy = card.dataset.strategy;
}

function handleParameterChange(event) {
    const param = event.target.id;
    const value = event.target.value;
    const displayElement = document.getElementById(`${param}-value`);
    if (displayElement) {
        displayElement.textContent = `${value}%`;
    }
}

function runStrategy() {
    if (!currentStrategy || selectedStocks.length === 0) {
        showError('종목과 전략을 선택해주세요.');
        return;
    }

    showLoading('전략 분석 중...');
    
    // 실제 구현에서는 백엔드 API 호출
    // 현재는 더미 데이터로 시뮬레이션
    setTimeout(() => {
        const dummyData = {
            expectedReturn: 15.3,
            volatility: 12.5,
            sharpeRatio: 1.22,
            monthlyReturns: [2.1, 3.2, -1.5, 4.2, 2.8, 3.1, -0.8, 2.5, 3.8, 1.9, 2.3, 3.5],
            stockAnalysis: selectedStocks.map(symbol => ({
                symbol,
                expectedReturn: (Math.random() * 20 - 5).toFixed(1),
                volatility: (Math.random() * 10 + 5).toFixed(1)
            }))
        };
        
        displayResults(dummyData);
        nextStep('results');
        hideLoading();
    }, 1500);
}

function displayResults(data) {
    // 성과 지표 업데이트
    document.getElementById('expected-return').textContent = 
        `${data.expectedReturn.toFixed(1)}%`;
    document.getElementById('volatility').textContent = 
        `${data.volatility.toFixed(1)}%`;
    document.getElementById('sharpe-ratio').textContent = 
        data.sharpeRatio.toFixed(2);

    // 차트 업데이트
    updatePerformanceChart(data.monthlyReturns);
    
    // 종목별 분석 업데이트
    updateStockAnalysis(data.stockAnalysis);
}

function updatePerformanceChart(returns) {
    const ctx = document.getElementById('performance-chart').getContext('2d');
    if (charts.performance) {
        charts.performance.destroy();
    }
    
    charts.performance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: returns.length}, (_, i) => `${i+1}월`),
            datasets: [{
                label: '수익률',
                data: returns,
                borderColor: '#3498db',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function updateStockAnalysis(analysis) {
    const analysisContainer = document.querySelector('.stock-analysis');
    if (!analysisContainer) return;

    analysisContainer.innerHTML = `
        <h3>종목별 분석</h3>
        ${analysis.map(stock => `
            <div class="stock-analysis-item">
                <h4>${stock.symbol}</h4>
                <p>예상 수익률: ${stock.expectedReturn}%</p>
                <p>변동성: ${stock.volatility}%</p>
            </div>
        `).join('')}
    `;
}

function showLoading(message) {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = `
        <div class="loading-content">
            <div class="spinner"></div>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.remove();
    }
}

function showError(message) {
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    document.body.appendChild(error);
    setTimeout(() => error.remove(), 3000);
}

function nextStep(stepId) {
    // 모든 단계 숨기기
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });

    // 선택한 단계 보이기
    const nextStep = document.getElementById(stepId);
    if (nextStep) {
        nextStep.classList.add('active');
    }

    // 스크롤을 페이지 상단으로 이동
    window.scrollTo(0, 0);
}

function restart() {
    // 모든 상태 초기화
    selectedStocks = [];
    currentStrategy = null;
    
    // 체크박스 초기화
    document.querySelectorAll('.stock-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // 전략 선택 초기화
    document.querySelectorAll('.strategy-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // 파라미터 초기화
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        slider.value = slider.defaultValue;
    });
    
    // 첫 단계로 이동
    nextStep('welcome');
} 