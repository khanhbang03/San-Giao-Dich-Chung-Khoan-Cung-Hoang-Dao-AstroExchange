// Dữ liệu mô phỏng: 12 loại tiền tệ cung hoàng đạo
const ZODIAC_CURRENCIES = {
    ARI: { name: 'Bạch Dương', rateToUSD: 1.05, change: '+1.2%' },
    TAU: { name: 'Kim Ngưu', rateToUSD: 0.98, change: '-0.5%' },
    GEM: { name: 'Song Tử', rateToUSD: 1.12, change: '+2.1%' },
    CAN: { name: 'Cự Giải', rateToUSD: 0.85, change: '-1.8%' },
    LEO: { name: 'Sư Tử', rateToUSD: 1.30, change: '+3.5%' },
    VIR: { name: 'Xử Nữ', rateToUSD: 0.95, change: '-0.2%' },
    LIB: { name: 'Thiên Bình', rateToUSD: 1.01, change: '+0.1%' },
    SCO: { name: 'Thiên Yết', rateToUSD: 1.25, change: '+2.9%' },
    SAG: { name: 'Nhân Mã', rateToUSD: 1.15, change: '+1.5%' },
    CAP: { name: 'Ma Kết', rateToUSD: 0.88, change: '-1.0%' },
    AQU: { name: 'Bảo Bình', rateToUSD: 1.08, change: '+1.0%' },
    PIS: { name: 'Song Ngư', rateToUSD: 0.92, change: '-0.8%' }
};

// Số dư ví mô phỏng (Đây sẽ là dữ liệu từ Server/Backend thực tế)
let userWallet = {
    ARI: 150.00,
    TAU: 25.00,
    GEM: 500.00,
    LEO: 10.00,
    // ... các cung khác
};

// Lấy các phần tử DOM cần thiết
const rateTableBody = document.getElementById('rate-table-body');
const tradeForm = document.getElementById('trade-form');
const fromCurrencySelect = document.getElementById('from-currency');
const toCurrencySelect = document.getElementById('to-currency');
const amountInput = document.getElementById('amount');
const exchangeRateDisplay = document.getElementById('exchange-rate-display');
const walletBalanceARI = document.getElementById('balance-ari');
const walletBalanceTAU = document.getElementById('balance-tau'); // ... và các cung khác

/*
=================================
1. CHỨC NĂNG CẬP NHẬT GIAO DIỆN
=================================
*/

/**
 * Cập nhật Bảng Tỷ Giá (Market Table)
 */
function updateRateTable() {
    rateTableBody.innerHTML = ''; // Xóa dữ liệu cũ

    // Lặp qua dữ liệu tiền tệ để tạo các hàng (row) mới
    for (const symbol in ZODIAC_CURRENCIES) {
        const data = ZODIAC_CURRENCIES[symbol];
        const row = rateTableBody.insertRow();

        // 1. Cung
        row.insertCell().textContent = `${data.name} (${symbol})`;
        // 2. Ký hiệu
        row.insertCell().textContent = symbol;
        // 3. Giá Mua (Giá trị cơ sở)
        row.insertCell().textContent = `$${data.rateToUSD.toFixed(2)}`;
        // 4. Giá Bán (Mô phỏng giá bán thấp hơn 1%)
        row.insertCell().textContent = `$${(data.rateToUSD * 0.99).toFixed(2)}`;
        // 5. Thay Đổi (Thêm class để tô màu)
        const changeCell = row.insertCell();
        changeCell.textContent = data.change;
        changeCell.classList.add(data.change.includes('+') ? 'up' : 'down');
    }
}

/**
 * Cập nhật số dư ví trên giao diện
 */
function updateWalletDisplay() {
    walletBalanceARI.textContent = userWallet.ARI.toFixed(2);
    walletBalanceTAU.textContent = userWallet.TAU.toFixed(2);
    // Thêm các cập nhật cho các cung khác
}


/**
 * Điền các tùy chọn (options) vào dropdown select
 */
function populateCurrencyOptions() {
    // Xóa các option mặc định từ HTML
    fromCurrencySelect.innerHTML = '';
    toCurrencySelect.innerHTML = '';

    for (const symbol in ZODIAC_CURRENCIES) {
        const option = document.createElement('option');
        option.value = symbol;
        option.textContent = `${ZODIAC_CURRENCIES[symbol].name} (${symbol})`;

        // Clone option cho select thứ hai
        fromCurrencySelect.appendChild(option);
        toCurrencySelect.appendChild(option.cloneNode(true));
    }

    // Chọn giá trị mặc định cho form
    fromCurrencySelect.value = 'ARI';
    toCurrencySelect.value = 'TAU';
}


/*
=================================
2. LOGIC TÍNH TỶ GIÁ TRAO ĐỔI
=================================
*/

/**
 * Tính toán và hiển thị tỷ giá hối đoái chéo
 */
function calculateAndDisplayRate() {
    const fromSymbol = fromCurrencySelect.value;
    const toSymbol = toCurrencySelect.value;

    if (fromSymbol === toSymbol) {
        exchangeRateDisplay.textContent = 'Chọn hai loại tiền tệ khác nhau.';
        return;
    }

    const rateFrom = ZODIAC_CURRENCIES[fromSymbol].rateToUSD;
    const rateTo = ZODIAC_CURRENCIES[toSymbol].rateToUSD;

    // Tỷ giá chéo: 1 X = (Giá trị X / Giá trị Y) Y
    const exchangeRate = rateFrom / rateTo;
    
    exchangeRateDisplay.textContent = 
        `Tỷ giá hiện tại: 1 ${fromSymbol} = ${exchangeRate.toFixed(4)} ${toSymbol}`;
}


// Gán sự kiện thay đổi cho các trường chọn
fromCurrencySelect.addEventListener('change', calculateAndDisplayRate);
toCurrencySelect.addEventListener('change', calculateAndDisplayRate);
// Cập nhật tỷ giá khi nhập số lượng
amountInput.addEventListener('input', () => {
    // Bạn có thể thêm logic tính toán số lượng nhận được ở đây
});


/*
=================================
3. XỬ LÝ FORM GIAO DỊCH
=================================
*/

tradeForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Ngăn chặn việc gửi form mặc định

    const fromSymbol = fromCurrencySelect.value;
    const toSymbol = toCurrencySelect.value;
    const amount = parseFloat(amountInput.value);

    // Kiểm tra đầu vào hợp lệ
    if (isNaN(amount) || amount <= 0) {
        alert('Vui lòng nhập số lượng hợp lệ.');
        return;
    }

    if (fromSymbol === toSymbol) {
        alert('Không thể trao đổi cùng một loại tiền tệ.');
        return;
    }

    if (amount > userWallet[fromSymbol]) {
        alert(`Giao dịch thất bại: Số dư ${fromSymbol} không đủ. Bạn chỉ có ${userWallet[fromSymbol].toFixed(2)}.`);
        return;
    }

    // Tính toán giao dịch
    const rateFrom = ZODIAC_CURRENCIES[fromSymbol].rateToUSD;
    const rateTo = ZODIAC_CURRENCIES[toSymbol].rateToUSD;
    const exchangeRate = rateFrom / rateTo;
    const amountReceived = amount * exchangeRate;

    // --- MÔ PHỎNG CẬP NHẬT VÍ (Trong thực tế phải gọi API Server) ---
    userWallet[fromSymbol] -= amount;
    userWallet[toSymbol] += amountReceived;

    // Cập nhật giao diện
    updateWalletDisplay();
    
    // Thông báo thành công
    alert(`
        Giao dịch thành công! 
        Đã đổi ${amount.toFixed(2)} ${fromSymbol} 
        lấy ${amountReceived.toFixed(2)} ${toSymbol}.
    `);

    // Reset form
    tradeForm.reset();
    calculateAndDisplayRate();
});


/*
=================================
4. KHỞI TẠO (INITIALIZATION)
=================================
*/

/**
 * Hàm khởi tạo khi trang được tải
 */
function initApp() {
    populateCurrencyOptions();
    updateRateTable();
    updateWalletDisplay();
    calculateAndDisplayRate(); // Tính toán tỷ giá mặc định khi tải trang

    // Tự động cập nhật tỷ giá sau mỗi 30 giây (mô phỏng)
    // setInterval(updateRateTable, 30000); 
}

// Chạy hàm khởi tạo
window.onload = initApp;

// Hàm xem lịch sử giao dịch (đã được gọi trong HTML)
function viewHistory() {
    alert('Tính năng Lịch Sử Giao Dịch sẽ được phát triển ở Backend!');
}