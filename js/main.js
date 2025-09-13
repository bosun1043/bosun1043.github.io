// 전역 변수
let selectedStocks = [];
let currentStrategy = null;
let charts = {};
let currentPortfolio = {};
let marketData = {};

// 페이지가 완전히 로드된 후 실행
window.addEventListener('load', function() {
    console.log('페이지 로드 완료 - 초기화 시작');
    init();
});

// 초기화 함수
function init() {
    console.log('초기화 시작');
    
    // 네비게이션 설정
    setupNavigation();
    
    // 퀀트 시스템 이벤트 설정
    setupQuantEvents();
    
    // 종목 데이터 로드
    loadTop10Stocks();
    
    console.log('초기화 완료');
}

// 네비게이션 설정
function setupNavigation() {
    console.log('네비게이션 설정 시작');
    
    const navLinks = document.querySelectorAll('.nav-link');
    console.log('네비게이션 링크 개수:', navLinks.length);
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            console.log('네비게이션 클릭:', targetId);
            
            // 모든 섹션 숨기기
            const sections = document.querySelectorAll('.section');
            sections.forEach(function(section) {
                section.classList.remove('active');
            });
            
            // 모든 네비게이션 링크 비활성화
            navLinks.forEach(function(navLink) {
                navLink.classList.remove('active');
            });
            
            // 선택된 섹션 보이기
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                this.classList.add('active');
                console.log('섹션 활성화 완료:', targetId);
                
                // For Jun 섹션으로 이동할 때 퀀트 시스템 초기화
                if (targetId === 'for-jun') {
                    console.log('For Jun 섹션 활성화 - 퀀트 시스템 초기화');
                    initQuantSystem();
                }
            } else {
                console.error('섹션을 찾을 수 없음:', targetId);
            }
        });
    });
}

// 퀀트 시스템 이벤트 설정
function setupQuantEvents() {
    console.log('퀀트 시스템 이벤트 설정 시작');
    
    // 모든 버튼에 이벤트 리스너 추가
    document.addEventListener('click', function(e) {
        console.log('클릭 이벤트:', e.target.id);
        
        switch(e.target.id) {
            case 'start-button':
                console.log('시작하기 버튼 클릭');
                e.preventDefault();
                showStep('stock-selection');
                break;
                
            case 'back-to-welcome':
                console.log('welcome으로 돌아가기');
                e.preventDefault();
                showStep('welcome');
                break;
                
            case 'back-to-stocks':
                console.log('stocks로 돌아가기');
                e.preventDefault();
                showStep('stock-selection');
                break;
                
            case 'back-to-strategy':
                console.log('strategy로 돌아가기');
                e.preventDefault();
                showStep('strategy-selection');
                break;
                
            case 'back-to-parameter':
                console.log('parameter로 돌아가기');
                e.preventDefault();
                showStep('parameter-setting');
                break;
                
            case 'to-strategy-button':
                console.log('strategy로 가기');
                e.preventDefault();
                showStep('strategy-selection');
                break;
                
            case 'to-parameter-button':
                console.log('parameter로 가기');
                e.preventDefault();
                showStep('parameter-setting');
                break;
                
            case 'run-strategy-button':
                console.log('전략 실행');
                e.preventDefault();
                runStrategy();
                break;
                
            case 'restart-button':
                console.log('다시 시작하기');
                e.preventDefault();
                restart();
                break;
        }
    });
    
    // 종목 선택 체크박스 이벤트
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('stock-checkbox')) {
            handleStockSelection(e);
        }
    });
    
    // 전략 선택 카드 이벤트
    document.addEventListener('click', function(e) {
        if (e.target.closest('.strategy-card')) {
            handleStrategySelection(e);
            }
        });
    }

// 퀀트 시스템 초기화
function initQuantSystem() {
    console.log('퀀트 시스템 초기화');
    showStep('welcome');
}

// 단계 표시 함수
function showStep(stepId) {
    console.log('단계 표시:', stepId);
    
    // 모든 step 숨기기
    const steps = document.querySelectorAll('.step');
    console.log('찾은 step 개수:', steps.length);
    
    steps.forEach(function(step) {
        step.classList.remove('active');
    });
    
    // 선택한 step 보이기
    const targetStep = document.getElementById(stepId);
    if (targetStep) {
        targetStep.classList.add('active');
        console.log('단계 활성화 완료:', stepId);
    } else {
        console.error('단계를 찾을 수 없음:', stepId);
    }
    
    // 스크롤을 상단으로
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 종목 데이터 로드
function loadTop10Stocks() {
    console.log('종목 데이터 로드 시작');
    
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

// 종목 목록 업데이트
function updateStockList(stocks) {
    const stockList = document.querySelector('.stock-list');
    if (!stockList) {
        console.warn('종목 목록 컨테이너를 찾을 수 없음');
        return;
    }

    stockList.innerHTML = stocks.map(function(stock) {
        return `
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
        `;
    }).join('');

    console.log('종목 목록 업데이트 완료');
}

// 종목 선택 처리
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
        selectedStocks = selectedStocks.filter(function(s) {
            return s.symbol !== symbol;
        });
    }
    
    updateSelectedStocks();
    console.log('선택된 종목:', selectedStocks.length);
}

// 선택된 종목 업데이트
function updateSelectedStocks() {
    const selectedStocksList = document.getElementById('selected-stocks-list');
    if (selectedStocksList) {
        if (selectedStocks.length > 0) {
            selectedStocksList.innerHTML = selectedStocks.map(function(stock) {
                return `
                <div class="selected-stock-item">
                    <strong>${stock.name}</strong> (${stock.symbol})
                    <br>
                    <small>ROE: ${stock.roe}%, 마진: ${stock.margin}%</small>
                </div>
                `;
            }).join('');
        } else {
            selectedStocksList.innerHTML = '<div class="no-selection">선택된 종목이 없습니다.</div>';
        }
    }
}

// 전략 선택 처리
function handleStrategySelection(event) {
    const card = event.target.closest('.strategy-card');
    if (!card) return;

    // 이전 선택 제거
    document.querySelectorAll('.strategy-card').forEach(function(c) {
        c.classList.remove('selected');
    });

    // 새로운 선택 표시
    card.classList.add('selected');
    currentStrategy = card.dataset.strategy;
    
    console.log('선택된 전략:', currentStrategy);
}

// 전략 실행
function runStrategy() {
    console.log('전략 실행 시작');
    
    if (!currentStrategy || selectedStocks.length === 0) {
        alert('종목과 전략을 선택해주세요.');
        return;
    }

    // 로딩 표시
    showLoading('전략 분석 중...');
    
    // 시뮬레이션 (실제로는 API 호출)
    setTimeout(function() {
        const dummyData = generateMockResults();
        displayResults(dummyData);
        showStep('results');
        hideLoading();
    }, 1500);
}

// 가상 결과 생성
function generateMockResults() {
    const baseReturn = currentStrategy === 'quality' ? 15 : 
                      currentStrategy === 'value' ? 12 : 18;
    
    return {
        strategy: currentStrategy,
        selectedStocks: selectedStocks.length,
        expectedReturn: baseReturn + (Math.random() * 6 - 3),
        volatility: 10 + (Math.random() * 8),
        sharpeRatio: 0.8 + (Math.random() * 0.6),
        monthlyReturns: Array.from({length: 12}, function() { 
            return Math.random() * 8 - 2; 
        }),
        stockAnalysis: selectedStocks.map(function(stock) {
            return {
            symbol: stock.symbol,
            name: stock.name,
            expectedReturn: (Math.random() * 25 - 5).toFixed(1),
            volatility: (Math.random() * 15 + 8).toFixed(1),
            score: (Math.random() * 100).toFixed(1)
            };
        })
    };
}

// 결과 표시
function displayResults(data) {
    // 성과 지표 업데이트
    const expectedReturnElement = document.getElementById('expected-return');
    const volatilityElement = document.getElementById('volatility');
    const sharpeRatioElement = document.getElementById('sharpe-ratio');
    
    if (expectedReturnElement) expectedReturnElement.textContent = data.expectedReturn.toFixed(1) + '%';
    if (volatilityElement) volatilityElement.textContent = data.volatility.toFixed(1) + '%';
    if (sharpeRatioElement) sharpeRatioElement.textContent = data.sharpeRatio.toFixed(2);

    // 차트 업데이트
    updatePerformanceChart(data.monthlyReturns);
    
    // 종목별 분석 업데이트
    updateStockAnalysis(data.stockAnalysis);
    
    console.log('결과 표시 완료');
}

// 성과 차트 업데이트
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
    returns.forEach(function(ret) {
        cumulative += ret;
        cumulativeReturns.push(cumulative);
    });
    
    charts.performance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: returns.length}, function(_, i) { 
                return (i+1) + '월'; 
            }),
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

// 종목별 분석 업데이트
function updateStockAnalysis(analysis) {
    const analysisContainer = document.querySelector('.stock-analysis');
    if (!analysisContainer) return;

    analysisContainer.innerHTML = `
        <h3>종목별 분석 결과</h3>
        <div class="analysis-grid">
            ${analysis.map(function(stock) {
                return `
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
                `;
            }).join('')}
        </div>
    `;
}

// 로딩 표시
function showLoading(message) {
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

// 로딩 숨기기
function hideLoading() {
    const loading = document.querySelector('.loading-overlay');
    if (loading) {
        loading.remove();
    }
}

// 다시 시작
function restart() {
    console.log('시스템 재시작');
    
    // 모든 상태 초기화
    selectedStocks = [];
    currentStrategy = null;
    
    // 체크박스 초기화
    document.querySelectorAll('.stock-checkbox').forEach(function(checkbox) {
        checkbox.checked = false;
    });
    
    // 전략 선택 초기화
    document.querySelectorAll('.strategy-card').forEach(function(card) {
        card.classList.remove('selected');
    });
    
    // 차트 제거
    Object.values(charts).forEach(function(chart) {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
    charts = {};
    
    // 첫 단계로 이동
    showStep('welcome');
    
    console.log('재시작 완료');
}

// 유틸리티 함수들
function formatNumber(num) {
    return num.toLocaleString();
}

function formatPercentage(num, decimals) {
    decimals = decimals || 1;
    return num.toFixed(decimals) + '%';
}

function formatCurrency(num) {
    return num.toLocaleString() + '원';
}

console.log('main.js 로드 완료');
}