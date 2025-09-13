// 전역 변수
let selectedStocks = [];
let currentStrategy = null;
let charts = {};
let currentPortfolio = {};
let marketData = {};

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    initializeNavigation();
    loadTop10Stocks();
});

function initializeApp() {
    setupEventListeners();
}

// 네비게이션 시스템 초기화
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // 모든 섹션 숨기기
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // 모든 네비게이션 링크 비활성화
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            
            // 선택된 섹션 보이기
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                link.classList.add('active');
                
                // For Jun 섹션으로 이동할 때 퀀트 시스템 초기화
                if (targetId === 'for-jun') {
                    initializeQuantSystem();
                }
            }
        });
    });
}

// 퀀트 시스템 초기화
function initializeQuantSystem() {
    // 퀀트 시스템의 첫 번째 단계로 이동
    nextStep('welcome');
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

        const kospiElement = document.getElementById('kospi-value');
        const kosdaqElement = document.getElementById('kosdaq-value');
        const exchangeElement = document.getElementById('exchange-rate');
        
        if (kospiElement) kospiElement.textContent = mockData.kospi;
        if (kosdaqElement) kosdaqElement.textContent = mockData.kosdaq;
        if (exchangeElement) exchangeElement.textContent = mockData.usdkrw;
    } catch (error) {
        console.error('시장 데이터 로딩 실패:', error);
    }
}

function initializeCharts() {
    // 모멘텀 전략 차트
    const momentumChart = document.getElementById('momentum-chart');
    if (momentumChart) {
        charts.momentum = new Chart(momentumChart, {
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
    }

    // 밸류 전략 차트
    const valueChart = document.getElementById('value-chart');
    if (valueChart) {
        charts.value = new Chart(valueChart, {
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
    }

    // 퀄리티 전략 차트
    const qualityChart = document.getElementById('quality-chart');
    if (qualityChart) {
        charts.quality = new Chart(qualityChart, {
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
}

function loadTop10Stocks() {
    // C++ 코드와 동일한 주식 데이터 사용
    const stocks = [
        { symbol: '005930', name: '삼성전자', price: 73800, change: 1.2, roe: 10.2, margin: 15.3 },
        { symbol: '000660', name: 'SK하이닉스', price: 142000, change: -0.7, roe: 12.1, margin: 13.2 },
        { symbol: '005935', name: 'LG에너지솔루션', price: 128000, change: 2.1, roe: 8.9, margin: 10.1 },
        { symbol: '035420', name: 'NAVER', price: 205000, change: 0.5, roe: 16.7, margin: 18.0 },
        { symbol: '035720', name: '카카오', price: 85000, change: -1.2, roe: 6.2, margin: 7.5 },
        { symbol: '005830', name: '현대차', price: 142000, change: 0.8, roe: 10.8, margin: 12.0 },
        { symbol: '000270', name: '기아', price: 168000, change: 1.5, roe: 11.5, margin: 12.5 },
        { symbol: '000890', name: 'POSCO홀딩스', price: 98000, change: -0.3, roe: 7.4, margin: 8.0 },
        { symbol: '000810', name: 'KB금융', price: 112000, change: 0.9, roe: 8.1, margin: 9.0 },
        { symbol: '000240', name: '신한지주', price: 105000, change: 0.4, roe: 7.8, margin: 8.5 }
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
                   value="${stock.symbol}"
                   data-name="${stock.name}"
                   data-price="${stock.price}"
                   data-roe="${stock.roe}"
                   data-margin="${stock.margin}">
            <label for="stock-${stock.symbol}">
                <div class="stock-info">
                    <div class="stock-name">${stock.name} (${stock.symbol})</div>
                    <div class="stock-details">
                        <span class="price">${stock.price.toLocaleString()}원</span>
                        <span class="change ${stock.change >= 0 ? 'up' : 'down'}">
                            ${stock.change >= 0 ? '+' : ''}${stock.change}%
                        </span>
                        <span class="financial-info">ROE: ${stock.roe}%, 마진: ${stock.margin}%</span>
                    </div>
                </div>
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
    const stockInfo = {
        symbol: symbol,
        name: event.target.dataset.name,
        price: parseFloat(event.target.dataset.price),
        roe: parseFloat(event.target.dataset.roe),
        margin: parseFloat(event.target.dataset.margin)
    };

    if (event.target.checked) {
        selectedStocks.push(stockInfo);
    } else {
        selectedStocks = selectedStocks.filter(s => s.symbol !== symbol);
    }
    updateSelectedStocks();
}

function updateSelectedStocks() {
    const selectedStocksList = document.getElementById('selected-stocks-list');
    if (selectedStocksList) {
        if (selectedStocks.length > 0) {
            selectedStocksList.innerHTML = selectedStocks.map(stock => `
                <div class="selected-stock-item">
                    <strong>${stock.name}</strong> (${stock.symbol})
                    <br>
                    <small>ROE: ${stock.roe}%, 마진: ${stock.margin}%</small>
                </div>
            `).join('');
        } else {
            selectedStocksList.innerHTML = '<div class="no-selection">선택된 종목이 없습니다.</div>';
        }
    }
    
    // 선택된 종목 수 업데이트
    const countElement = document.getElementById('selected-count');
    if (countElement) {
        countElement.textContent = selectedStocks.length;
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
    
    // 전략에 따른 파라미터 표시/숨김
    updateParameterVisibility(currentStrategy);
}

function updateParameterVisibility(strategy) {
    const qualityParams = document.getElementById('quality-parameters');
    const valueParams = document.getElementById('value-parameters');
    const momentumParams = document.getElementById('momentum-parameters');
    
    // 모든 파라미터 숨기기
    if (qualityParams) qualityParams.style.display = 'none';
    if (valueParams) valueParams.style.display = 'none';
    if (momentumParams) momentumParams.style.display = 'none';
    
    // 선택된 전략의 파라미터만 표시
    switch(strategy) {
        case 'quality':
            if (qualityParams) qualityParams.style.display = 'block';
            break;
        case 'value':
            if (valueParams) valueParams.style.display = 'block';
            break;
        case 'momentum':
            if (momentumParams) momentumParams.style.display = 'block';
            break;
    }
}

function handleParameterChange(event) {
    const param = event.target.id;
    const value = event.target.value;
    const displayElement = document.getElementById(`${param}-value`);
    if (displayElement) {
        if (param.includes('weight')) {
            displayElement.textContent = `${value}%`;
        } else {
            displayElement.textContent = value;
        }
    }
    
    // 가중치 합계 검증 (퀄리티 전략의 경우)
    if (currentStrategy === 'quality' && param.includes('weight')) {
        validateWeightSum();
    }
}

function validateWeightSum() {
    const roeWeight = parseInt(document.getElementById('roe-weight')?.value || 0);
    const marginWeight = parseInt(document.getElementById('margin-weight')?.value || 0);
    const perWeight = parseInt(document.getElementById('per-weight')?.value || 0);
    const pbrWeight = parseInt(document.getElementById('pbr-weight')?.value || 0);
    
    const total = roeWeight + marginWeight + perWeight + pbrWeight;
    const warningElement = document.getElementById('weight-warning');
    
    if (warningElement) {
        if (total !== 100) {
            warningElement.textContent = `가중치 합계: ${total}% (100%가 되도록 조정해주세요)`;
            warningElement.style.display = 'block';
            warningElement.style.color = total > 100 ? '#e74c3c' : '#f39c12';
        } else {
            warningElement.style.display = 'none';
        }
    }
}

function runStrategy() {
    if (!currentStrategy || selectedStocks.length === 0) {
        showError('종목과 전략을 선택해주세요.');
        return;
    }

    // 파라미터 유효성 검사
    if (currentStrategy === 'quality') {
        const roeWeight = parseInt(document.getElementById('roe-weight')?.value || 0);
        const marginWeight = parseInt(document.getElementById('margin-weight')?.value || 0);
        const perWeight = parseInt(document.getElementById('per-weight')?.value || 0);
        const pbrWeight = parseInt(document.getElementById('pbr-weight')?.value || 0);
        
        if (roeWeight + marginWeight + perWeight + pbrWeight !== 100) {
            showError('가중치 합계가 100%가 되도록 조정해주세요.');
            return;
        }
    }

    showLoading('전략 분석 중...');
    
    // 실제 구현에서는 C++ 백엔드 API 호출
    // 현재는 더미 데이터로 시뮬레이션
    setTimeout(() => {
        const dummyData = generateMockResults();
        displayResults(dummyData);
        nextStep('results');
        hideLoading();
    }, 1500);
}

function generateMockResults() {
    // 선택된 종목과 전략에 따른 가상의 결과 생성
    const baseReturn = currentStrategy === 'quality' ? 15 : 
                      currentStrategy === 'value' ? 12 : 18;
    
    return {
        strategy: currentStrategy,
        selectedStocks: selectedStocks.length,
        expectedReturn: baseReturn + (Math.random() * 6 - 3),
        volatility: 10 + (Math.random() * 8),
        sharpeRatio: 0.8 + (Math.random() * 0.6),
        monthlyReturns: Array.from({length: 12}, () => (Math.random() * 8 - 2)),
        stockAnalysis: selectedStocks.map(stock => ({
            symbol: stock.symbol,
            name: stock.name,
            expectedReturn: (Math.random() * 25 - 5).toFixed(1),
            volatility: (Math.random() * 15 + 8).toFixed(1),
            score: (Math.random() * 100).toFixed(1)
        }))
    };
}

function displayResults(data) {
    // 전략 정보 업데이트
    const strategyNameElement = document.getElementById('strategy-name');
    if (strategyNameElement) {
        const strategyNames = {
            'quality': '퀄리티 전략',
            'value': '밸류 전략',
            'momentum': '모멘텀 전략'
        };
        strategyNameElement.textContent = strategyNames[data.strategy] || data.strategy;
    }

    // 성과 지표 업데이트
    const expectedReturnElement = document.getElementById('expected-return');
    const volatilityElement = document.getElementById('volatility');
    const sharpeRatioElement = document.getElementById('sharpe-ratio');
    
    if (expectedReturnElement) expectedReturnElement.textContent = `${data.expectedReturn.toFixed(1)}%`;
    if (volatilityElement) volatilityElement.textContent = `${data.volatility.toFixed(1)}%`;
    if (sharpeRatioElement) sharpeRatioElement.textContent = data.sharpeRatio.toFixed(2);

    // 차트 업데이트
    updatePerformanceChart(data.monthlyReturns);
    
    // 종목별 분석 업데이트
    updateStockAnalysis(data.stockAnalysis);
}

function updatePerformanceChart(returns) {
    const chartElement = document.getElementById('performance-chart');
    if (!chartElement) return;
    
    const ctx = chartElement.getContext('2d');
    if (charts.performance) {
        charts.performance.destroy();
    }
    
    // 누적 수익률 계산
    let cumulativeReturns = [];
    let cumulative = 0;
    returns.forEach(ret => {
        cumulative += ret;
        cumulativeReturns.push(cumulative);
    });
    
    charts.performance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: returns.length}, (_, i) => `${i+1}월`),
            datasets: [{
                label: '누적 수익률 (%)',
                data: cumulativeReturns,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '수익률 (%)'
                    }
                }
            }
        }
    });
}

function updateStockAnalysis(analysis) {
    const analysisContainer = document.querySelector('.stock-analysis');
    if (!analysisContainer) return;

    analysisContainer.innerHTML = `
        <h3>종목별 분석 결과</h3>
        <div class="analysis-grid">
            ${analysis.map(stock => `
                <div class="stock-analysis-item">
                    <h4>${stock.name} (${stock.symbol})</h4>
                    <div class="analysis-metrics">
                        <div class="metric">
                            <span class="metric-label">예상 수익률:</span>
                            <span class="metric-value ${parseFloat(stock.expectedReturn) >= 0 ? 'positive' : 'negative'}">
                                ${stock.expectedReturn}%
                            </span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">변동성:</span>
                            <span class="metric-value">${stock.volatility}%</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">전략 점수:</span>
                            <span class="metric-value">${stock.score}점</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function showLoading(message) {
    // 기존 로딩 제거
    hideLoading();
    
    const loading = document.createElement('div');
    loading.className = 'loading-overlay';
    loading.innerHTML = `
        <div class="loading-content">
            <div class="spinner"></div>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.querySelector('.loading-overlay');
    if (loading) {
        loading.remove();
    }
}

function showError(message) {
    const error = document.createElement('div');
    error.className = 'error-message';
    error.innerHTML = `
        <div class="error-content">
            <span class="error-icon">⚠️</span>
            <span class="error-text">${message}</span>
            <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    document.body.appendChild(error);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        if (error.parentElement) {
            error.remove();
        }
    }, 3000);
}

function showSuccess(message) {
    const success = document.createElement('div');
    success.className = 'success-message';
    success.innerHTML = `
        <div class="success-content">
            <span class="success-icon">✅</span>
            <span class="success-text">${message}</span>
        </div>
    `;
    document.body.appendChild(success);
    
    setTimeout(() => {
        if (success.parentElement) {
            success.remove();
        }
    }, 2000);
}

function nextStep(stepId) {
    // 모든 단계 숨기기
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });

    // 선택한 단계 보이기
    const nextStepElement = document.getElementById(stepId);
    if (nextStepElement) {
        nextStepElement.classList.add('active');
        
        // 특정 단계에서 초기화 작업
        if (stepId === 'strategy-selection') {
            initializeCharts();
        } else if (stepId === 'results') {
            // 결과 페이지에서 추가 처리
            updateResultsSummary();
        }
    }

    // 스크롤을 페이지 상단으로 이동
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateResultsSummary() {
    const summaryElement = document.getElementById('results-summary');
    if (summaryElement && selectedStocks.length > 0) {
        summaryElement.innerHTML = `
            <div class="summary-item">
                <strong>선택된 종목:</strong> ${selectedStocks.length}개
            </div>
            <div class="summary-item">
                <strong>전략:</strong> ${currentStrategy || '없음'}
            </div>
            <div class="summary-item">
                <strong>분석 완료 시간:</strong> ${new Date().toLocaleString()}
            </div>
        `;
    }
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
        slider.value = slider.defaultValue || slider.getAttribute('value') || 50;
        // 파라미터 변경 이벤트 트리거
        slider.dispatchEvent(new Event('input'));
    });
    
    // 차트 제거
    Object.values(charts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
    charts = {};
    
    // 경고 메시지 숨기기
    const warningElement = document.getElementById('weight-warning');
    if (warningElement) {
        warningElement.style.display = 'none';
    }
    
    // 첫 단계로 이동
    nextStep('welcome');
    
    showSuccess('시스템이 초기화되었습니다.');
}

// 유틸리티 함수들
function formatNumber(num) {
    return num.toLocaleString();
}

function formatPercentage(num, decimals = 1) {
    return `${num.toFixed(decimals)}%`;
}

function formatCurrency(num) {
    return `${num.toLocaleString()}원`;
}

// 키보드 단축키 지원
document.addEventListener('keydown', (event) => {
    // Ctrl + R: 다시 시작
    if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        restart();
    }
    
    // ESC: 에러/성공 메시지 닫기
    if (event.key === 'Escape') {
        document.querySelectorAll('.error-message, .success-message').forEach(msg => {
            msg.remove();
        });
    }
    
    // 화살표 키로 단계 이동 (개발 편의용)
    if (event.ctrlKey) {
        const steps = ['welcome', 'stock-selection', 'strategy-selection', 'parameter-setting', 'results'];
        const currentStep = document.querySelector('.step.active')?.id;
        const currentIndex = steps.indexOf(currentStep);
        
        if (event.key === 'ArrowRight' && currentIndex < steps.length - 1) {
            event.preventDefault();
            nextStep(steps[currentIndex + 1]);
        } else if (event.key === 'ArrowLeft' && currentIndex > 0) {
            event.preventDefault();
            nextStep(steps[currentIndex - 1]);
        }
    }
});

// 페이지 가시성 변경 감지 (탭 전환 시)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // 페이지가 다시 보일 때 시장 데이터 업데이트
        loadMarketData();
    }
});

// 윈도우 크기 변경 시 차트 리사이즈
window.addEventListener('resize', () => {
    Object.values(charts).forEach(chart => {
        if (chart && typeof chart.resize === 'function') {
            chart.resize();
        }
    });
});

// 개발용 디버그 함수들
if (typeof window !== 'undefined') {
    window.debugQuant = {
        getSelectedStocks: () => selectedStocks,
        getCurrentStrategy: () => currentStrategy,
        getCharts: () => charts,
        forceStep: (stepId) => nextStep(stepId),
        mockData: () => generateMockResults(),
        clearStorage: () => {
            localStorage.clear();
            sessionStorage.clear();
            console.log('Storage cleared');
        }
    };
}

// 데이터 유효성 검사 함수들
function validateStockData(stock) {
    return stock && 
           typeof stock.symbol === 'string' && 
           typeof stock.name === 'string' && 
           typeof stock.price === 'number' && 
           stock.price > 0;
}

function validateStrategyParameters(strategy, params) {
    switch(strategy) {
        case 'quality':
            const totalWeight = (params.roeWeight || 0) + 
                              (params.marginWeight || 0) + 
                              (params.perWeight || 0) + 
                              (params.pbrWeight || 0);
            return Math.abs(totalWeight - 100) < 0.01;
        
        case 'value':
            return params.minPER > 0 && params.maxPBR > 0;
        
        case 'momentum':
            return params.lookbackPeriod > 0 && params.momentumThreshold >= 0;
        
        default:
            return false;
    }
}

// 로컬 스토리지 관리 (선택사항)
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.warn('로컬 스토리지 저장 실패:', error);
    }
}

function loadFromLocalStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.warn('로컬 스토리지 로드 실패:', error);
        return defaultValue;
    }
}

// 세션 관리
function saveSession() {
    const sessionData = {
        selectedStocks,
        currentStrategy,
        timestamp: Date.now()
    };
    saveToLocalStorage('quantSession', sessionData);
}

function loadSession() {
    const sessionData = loadFromLocalStorage('quantSession');
    if (sessionData && sessionData.timestamp) {
        const hoursSinceLastSession = (Date.now() - sessionData.timestamp) / (1000 * 60 * 60);
        
        // 24시간 이내의 세션만 복구
        if (hoursSinceLastSession < 24) {
            selectedStocks = sessionData.selectedStocks || [];
            currentStrategy = sessionData.currentStrategy || null;
            
            // UI 상태 복구
            restoreUIState();
            return true;
        }
    }
    return false;
}

function restoreUIState() {
    // 선택된 종목 체크박스 복구
    selectedStocks.forEach(stock => {
        const checkbox = document.getElementById(`stock-${stock.symbol}`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
    updateSelectedStocks();
    
    // 전략 선택 상태 복구
    if (currentStrategy) {
        const strategyCard = document.querySelector(`[data-strategy="${currentStrategy}"]`);
        if (strategyCard) {
            strategyCard.classList.add('selected');
        }
    }
}

// 애플리케이션 생명주기 이벤트
window.addEventListener('beforeunload', () => {
    saveSession();
});

// 페이지 로드 완료 후 세션 복구 시도
window.addEventListener('load', () => {
    const sessionRestored = loadSession();
    if (sessionRestored) {
        console.log('이전 세션을 복구했습니다.');
    }
});

// 에러 핸들링
window.addEventListener('error', (event) => {
    console.error('애플리케이션 에러:', event.error);
    showError('예상치 못한 오류가 발생했습니다. 페이지를 새로고침해주세요.');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('처리되지 않은 Promise 거부:', event.reason);
    showError('데이터 처리 중 오류가 발생했습니다.');
});

// 성능 모니터링 (개발용)
if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark('quant-app-loaded');
    
    window.addEventListener('load', () => {
        performance.mark('quant-app-ready');
        performance.measure('quant-app-init', 'quant-app-loaded', 'quant-app-ready');
        
        const measure = performance.getEntriesByName('quant-app-init')[0];
        console.log(`앱 초기화 시간: ${measure.duration.toFixed(2)}ms`);
    });
}