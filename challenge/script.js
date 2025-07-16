// --- LOGIN LOGIC ---
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('toggle-password');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const userEmail = document.getElementById('user-email');
const checkingAmount = document.getElementById('checking-amount');
const savingsAmount = document.getElementById('savings-amount');
const moneyGraph = document.getElementById('money-graph');

// Demo user
const DEMO_USER = { email: 'user@bank.com', password: 'pass123' };

// Show/hide password
let pwVisible = false;
togglePassword.onclick = function(event) {
    event.preventDefault();
    pwVisible = !pwVisible;
    passwordInput.type = pwVisible ? 'text' : 'password';
    togglePassword.textContent = pwVisible ? '🔒' : '👁️';
};

// Login
loginForm.onsubmit = function(e) {
    e.preventDefault();
    if (emailInput.value === DEMO_USER.email && passwordInput.value === DEMO_USER.password) {
        localStorage.setItem('bankLoggedIn', 'true');
        localStorage.setItem('bankUser', emailInput.value);
        showDashboard();
    } else {
        alert('Invalid credentials!');
    }
};

// Sign up (demo: just fill fields)
signupBtn.onclick = function() {
    emailInput.value = 'user@bank.com';
    passwordInput.value = 'pass123';
    alert('Demo: Use user@bank.com / pass123 to log in.');
};

// Logout
logoutBtn.onclick = function() {
    localStorage.removeItem('bankLoggedIn');
    localStorage.removeItem('bankUser');
    showLogin();
};

function showDashboard() {
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'flex';
    userEmail.textContent = localStorage.getItem('bankUser'-'@bank.com') || '';
    // Demo: set random amounts
    checkingAmount.textContent = '$' + (Math.random()*1000).toFixed(2);
    savingsAmount.textContent = '$' + (Math.random()*5000).toFixed(2);
    drawGraph();
}
function showLogin() {
    loginSection.style.display = 'flex';
    dashboardSection.style.display = 'none';
}
// On load
window.onload = function() {
    if (localStorage.getItem('bankLoggedIn') === 'true') {
        showDashboard();
    } else {
        showLogin();
    }
};
// --- Simple Graph Drawing ---
function drawGraph() {
    const ctx = moneyGraph.getContext('2d');
    
    // ===== NEW: Responsive Canvas Setup =====
    const parentWidth = moneyGraph.parentElement.clientWidth;
    const desiredHeight = parentWidth * 0.4; // 40% of width for aspect ratio
    
    // Only resize if dimensions changed (better performance)
    if (moneyGraph.width !== parentWidth || moneyGraph.height !== desiredHeight) {
        moneyGraph.width = parentWidth;
        moneyGraph.height = desiredHeight;
    }
    
    ctx.clearRect(0, 0, moneyGraph.width, moneyGraph.height);
    
    // ===== YOUR EXISTING GRAPH DRAWING CODE =====
    const data = Array.from({length: 10}, () => Math.floor(Math.random()*200));
    const max = Math.max(...data, 1);
    const w = moneyGraph.width, h = moneyGraph.height;
    
    ctx.strokeStyle = '#4f8cff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((v,i) => {
        const x = i * (w/9);
        const y = h - (v/max)*(h-20) - 10;
        if(i===0) ctx.moveTo(x,y);
        else ctx.lineTo(x,y);
    });
    
    ctx.stroke();
    
    // Draw points
    ctx.fillStyle = '#4f8cff';
    data.forEach((v,i) => {
        const x = i * (w/9);
        const y = h - (v/max)*(h-20) - 10;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2*Math.PI);
        ctx.fill();
    });
}

// Initial draw
drawGraph();

// Redraw on resize (with debounce for performance)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(drawGraph, 100);
});
