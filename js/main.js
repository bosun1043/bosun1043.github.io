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
    initializeCharts();
});

function initializeApp() {
    setupEventListeners();
    setupDateInputs();
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

function initializeCharts() {
    // 모멘텀 전략 차트
    charts.momentum = new Chart(document.getElementById('momentum-chart'), {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: '모멘텀 점수',
                data: [],
                backgroundColor: '#3498db'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // 밸류 전략 차트
    charts.value = new Chart(document.getElementById('value-chart'), {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: '밸류 점수',
                data: [],
                backgroundColor: '#2ecc71'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // 퀄리티 전략 차트
    charts.quality = new Chart(document.getElementById('quality-chart'), {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: '퀄리티 점수',
                data: [],
                backgroundColor: '#e74c3c'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function runStrategy(strategyType) {
    showLoading(`${strategyType} 전략을 실행 중입니다...`);
    
    // 임시 데이터 생성
    setTimeout(() => {
        const mockData = generateMockData(strategyType);
        updateStrategyChart(strategyType, mockData);
        showStrategyResults(strategyType, mockData);
        hideLoading();
    }, 1000);
}

function generateMockData(strategyType) {
    const symbols = ['삼성전자', 'SK하이닉스', 'LG에너지솔루션', 'NAVER', '카카오', 
                    '현대차', '기아', 'POSCO홀딩스', 'KB금융', '신한지주'];
    
    return {
        selected_stocks: symbols.map(symbol => ({
            symbol: symbol,
            score: Math.random() * 100
        })).sort((a, b) => b.score - a.score).slice(0, 5)
    };
}

function showStrategyResults(strategyType, results) {
    // 기존 결과 제거
    const existingResults = document.querySelector(`#${strategyType}-chart`).parentNode.querySelector('.strategy-results');
    if (existingResults) {
        existingResults.remove();
    }

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
    chart.data.labels = results.selected_stocks.map(s => s.symbol);
    chart.data.datasets[0].data = results.selected_stocks.map(s => s.score);
    chart.update();
}

function showLoading(message) {
    const loadingEl = document.getElementById('loading-indicator');
    loadingEl.style.display = 'block';
    loadingEl.querySelector('p').textContent = message;
}

function hideLoading() {
    const loadingEl = document.getElementById('loading-indicator');
    loadingEl.style.display = 'none';
}

function showError(message) {
    const errorEl = document.getElementById('error-message');
    errorEl.style.display = 'block';
    errorEl.querySelector('p').textContent = message;
    
    setTimeout(() => {
        errorEl.style.display = 'none';
    }, 3000);
}

function handleNavigation(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    targetSection.scrollIntoView({ behavior: 'smooth' });
}

function updateBacktestChart() {
    // 백테스트 차트 업데이트 로직
    console.log('백테스트 차트 업데이트');
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