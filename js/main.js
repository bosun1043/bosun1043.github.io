import { marketAPI, strategyAPI, backtestAPI, portfolioAPI } from './services/api.js';
import { StrategyRunner } from './services/strategies.js';
import { ChartComponent } from './components/charts.js';

// 전역 변수
let charts = {};
let currentPortfolio = {};
let marketData = {};
let strategyRunner = null;

// API 엔드포인트
const API_BASE_URL = 'http://localhost:8080/api';

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupTradingViewWidget();
    fetchMarketData();
    initializeCharts();
    updatePortfolio();
    
    // 주기적으로 데이터 업데이트
    setInterval(fetchMarketData, 60000); // 1분마다 시장 데이터 업데이트
    setInterval(updatePortfolio, 300000); // 5분마다 포트폴리오 업데이트
});

async function initializeApp() {
    setupEventListeners();
    setupDateInputs();
    await loadPortfolioData();
    strategyRunner = new StrategyRunner(marketData);
}

function setupEventListeners() {
    // 네비게이션 이벤트
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // 전략 선택 이벤트
    document.getElementById('strategy-select').addEventListener('change', updateBacktestChart);
}

function setupDateInputs() {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    document.getElementById('start-date').value = oneYearAgo.toISOString().split('T')[0];
    document.getElementById('end-date').value = today.toISOString().split('T')[0];
}

function setupTradingViewWidget() {
    new TradingView.widget({
        "width": "100%",
        "height": 500,
        "symbol": "KRX:KOSPI",
        "interval": "D",
        "timezone": "Asia/Seoul",
        "theme": "light",
        "style": "1",
        "locale": "kr",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "container_id": "tradingview-widget"
    });
}

async function fetchMarketData() {
    try {
        const response = await fetch(`${API_BASE_URL}/market-data`);
        const data = await response.json();
        
        document.getElementById('kospi-value').textContent = data.kospi.toFixed(2);
        document.getElementById('kosdaq-value').textContent = data.kosdaq.toFixed(2);
        document.getElementById('exchange-rate').textContent = data.exchange_rate.toFixed(2);
    } catch (error) {
        console.error('시장 데이터 로딩 실패:', error);
        showError('시장 데이터를 불러오는데 실패했습니다.');
    }
}

function initializeCharts() {
    // 모멘텀 전략 차트
    charts.momentum = new ChartComponent('momentum-chart', {
        data: {
            datasets: [{
                borderColor: '#3498db',
            }]
        }
    });

    // 밸류 전략 차트
    charts.value = new ChartComponent('value-chart', {
        data: {
            datasets: [{
                borderColor: '#2ecc71',
            }]
        }
    });

    // 퀄리티 전략 차트
    charts.quality = new ChartComponent('quality-chart', {
        data: {
            datasets: [{
                borderColor: '#e74c3c',
            }]
        }
    });

    // 모든 차트 초기화
    Object.values(charts).forEach(chart => chart.initialize());
}

async function runStrategy(strategyType) {
    try {
        showLoading(`${strategyType} 전략을 실행 중입니다...`);
        
        const response = await fetch(`${API_BASE_URL}/run-strategy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ strategy: strategyType })
        });
        
        const data = await response.json();
        if (data.success) {
            updateStrategyChart(strategyType, data.results);
            showStrategyResults(strategyType, data.results);
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('전략 실행 실패:', error);
        showError('전략 실행 중 오류가 발생했습니다.');
    } finally {
        hideLoading();
    }
}

async function runBacktest() {
    try {
        const strategy = document.getElementById('strategy-select').value;
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        
        showLoading('백테스트를 실행 중입니다...');
        
        const response = await fetch(`${API_BASE_URL}/run-backtest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                strategy: strategy,
                start_date: startDate,
                end_date: endDate
            })
        });
        
        const data = await response.json();
        if (data.success) {
            updateBacktestResults(data.metrics);
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('백테스트 실행 실패:', error);
        showError('백테스트 실행 중 오류가 발생했습니다.');
    } finally {
        hideLoading();
    }
}

async function updatePortfolio() {
    try {
        const response = await fetch(`${API_BASE_URL}/portfolio`);
        const data = await response.json();
        
        if (data.success) {
            updatePortfolioDisplay(data.portfolio);
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('포트폴리오 업데이트 실패:', error);
        showError('포트폴리오 정보를 불러오는데 실패했습니다.');
    }
}

// UI 헬퍼 함수들
function showLoading(message) {
    // 로딩 인디케이터 표시
    const loadingEl = document.createElement('div');
    loadingEl.id = 'loading-indicator';
    loadingEl.innerHTML = `
        <div class="loading-spinner"></div>
        <p>${message}</p>
    `;
    document.body.appendChild(loadingEl);
}

function hideLoading() {
    const loadingEl = document.getElementById('loading-indicator');
    if (loadingEl) {
        loadingEl.remove();
    }
}

function showError(message) {
    // 에러 메시지 표시
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    document.body.appendChild(errorEl);
    
    setTimeout(() => {
        errorEl.remove();
    }, 3000);
}

function showStrategyResults(strategyType, results) {
    const resultContainer = document.createElement('div');
    resultContainer.className = 'strategy-results';
    resultContainer.innerHTML = `
        <h3>${strategyType} 전략 결과</h3>
        <div class="results-list">
            ${results.selected_stocks.map(stock => `
                <div class="stock-item">
                    <span class="symbol">${stock.symbol}</span>
                    <span class="score">${stock.score.toFixed(2)}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    document.querySelector(`#${strategyType}-chart`).parentNode.appendChild(resultContainer);
}

function updateStrategyChart(strategyType, results) {
    const chart = charts[strategyType];
    const labels = results.selected_stocks.map(s => s.symbol);
    const data = results.selected_stocks.map(s => s.score);
    
    chart.updateData(labels, data);
}

function updateBacktestResults(metrics) {
    document.getElementById('return-rate').textContent = `${metrics.total_return.toFixed(2)}%`;
    document.getElementById('sharpe-ratio').textContent = metrics.sharpe_ratio.toFixed(2);
    document.getElementById('max-drawdown').textContent = `${metrics.max_drawdown.toFixed(2)}%`;
    
    // 백테스트 차트 업데이트
    const backtestChart = new ChartComponent('backtest-chart');
    backtestChart.initialize();
    backtestChart.updateData(metrics.dates, metrics.equity_curve);
}

function updateBacktestChart() {
    const strategy = document.getElementById('strategy-select').value;
    // 차트 업데이트 로직
    console.log(`백테스트 차트 업데이트: ${strategy}`);
}

function loadPortfolioData() {
    // 포트폴리오 데이터 로딩
    const mockPortfolio = {
        totalAssets: '100,000,000',
        dailyReturn: '+1.2%',
        annualReturn: '+15.5%',
        holdings: [
            { name: '삼성전자', quantity: 100, avgPrice: '70,000', currentPrice: '72,000', profit: '+200,000' },
            { name: 'SK하이닉스', quantity: 50, avgPrice: '120,000', currentPrice: '125,000', profit: '+250,000' }
        ]
    };

    // 포트폴리오 데이터 표시
    document.getElementById('total-assets').textContent = mockPortfolio.totalAssets;
    document.getElementById('daily-return').textContent = mockPortfolio.dailyReturn;
    document.getElementById('annual-return').textContent = mockPortfolio.annualReturn;

    // 보유 종목 테이블 업데이트
    const tbody = document.querySelector('#holdings-table tbody');
    tbody.innerHTML = '';
    mockPortfolio.holdings.forEach(holding => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${holding.name}</td>
            <td>${holding.quantity}</td>
            <td>${holding.avgPrice}</td>
            <td>${holding.currentPrice}</td>
            <td>${holding.profit}</td>
        `;
        tbody.appendChild(row);
    });
}

function handleNavigation(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    targetSection.scrollIntoView({ behavior: 'smooth' });
}

function updatePortfolioDisplay(portfolio) {
    document.getElementById('total-assets').textContent = 
        formatCurrency(portfolio.total_value);
    document.getElementById('daily-return').textContent = 
        `${portfolio.daily_return.toFixed(2)}%`;
    document.getElementById('annual-return').textContent = 
        `${portfolio.annual_return.toFixed(2)}%`;
    
    // 보유 종목 테이블 업데이트
    const tbody = document.querySelector('#holdings-table tbody');
    tbody.innerHTML = '';
    
    for (const [symbol, position] of Object.entries(portfolio.positions)) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${symbol}</td>
            <td>${position.quantity}</td>
            <td>${formatCurrency(position.average_price)}</td>
            <td>${formatCurrency(position.current_price)}</td>
            <td>${formatCurrency(position.profit)}</td>
        `;
        tbody.appendChild(row);
    }
}

// 유틸리티 함수들
function formatCurrency(value) {
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW'
    }).format(value);
} 