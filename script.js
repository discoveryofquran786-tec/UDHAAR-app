// --- 1. SPLASH SCREEN LOGIC ---
window.onload = function() {
  setTimeout(function() {
    const splash = document.getElementById('splash-screen');
    const main = document.getElementById('main-content');
    
    splash.style.opacity = '0';
    splash.style.transition = 'opacity 0.5s';
    
    setTimeout(() => {
      splash.style.display = 'none';
      main.style.display = 'block';
    }, 500);
  }, 2500); // 2.5 Seconds wait karega
};

// --- 2. APP LOGIC ---
const micBtn = document.getElementById('mic-btn');
const statusText = document.getElementById('status-text');
const listElement = document.getElementById('khata-list');
const totalElement = document.getElementById('total-amount');
const emptyState = document.getElementById('empty-state');

// Setup Voice API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; // Hinglish friendly

    micBtn.onclick = () => { 
        recognition.start(); 
        micBtn.classList.add("mic-listening"); 
        statusText.innerText = "Sun rahaun... boliye!"; 
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        micBtn.classList.remove("mic-listening");
        statusText.innerText = "Processing: " + transcript;
        processInput(transcript);
    };

    recognition.onerror = () => { 
        micBtn.classList.remove("mic-listening"); 
        statusText.innerText = "Samajh nahi aaya, wapas boliye."; 
    };
} else {
    statusText.innerText = "Mic not supported in this browser.";
}

// Manual Input
document.getElementById('add-btn').onclick = () => { 
    const val = document.getElementById('manual-text').value;
    if(val) { processInput(val); document.getElementById('manual-text').value = ""; }
};

// Process Data (Naam aur Paisa alag karna)
function processInput(text) {
    const numbers = text.match(/\d+/);
    const amount = numbers ? numbers[0] : "0";
    const name = text.replace(amount, "").replace(/rupaye|rs|rupees/gi, "").trim();

    if(name && amount !== "0") {
        addTransaction(name, amount);
        statusText.innerText = "Added: " + name;
    } else {
        statusText.innerText = "Naam aur Amount dono boliye!";
    }
}

// Save & Display
function addTransaction(name, amount) {
    let khata = JSON.parse(localStorage.getItem('myKhata')) || [];
    khata.push({ 
        id: Date.now(), 
        name: name, 
        amount: parseInt(amount), 
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
    });
    localStorage.setItem('myKhata', JSON.stringify(khata));
    renderList();
}

function deleteTransaction(id) {
    let khata = JSON.parse(localStorage.getItem('myKhata')) || [];
    khata = khata.filter(item => item.id !== id);
    localStorage.setItem('myKhata', JSON.stringify(khata));
    renderList();
}

function clearAll() {
    if(confirm("Are you sure you want to delete all data?")) {
        localStorage.removeItem('myKhata');
        renderList();
    }
}

function renderList() {
    let khata = JSON.parse(localStorage.getItem('myKhata')) || [];
    listElement.innerHTML = ""; 
    let total = 0;

    if (khata.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
        khata.forEach(item => {
            total += item.amount;
            const li = document.createElement('li');
            li.innerHTML = `
                <div>
                    <strong style="font-size:16px;">${item.name}</strong>
                    <div style="font-size:12px; color:#888;">${item.time}</div>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-weight:bold; color:#2c3e50;">₹${item.amount}</span>
                    <button class="delete-btn" onclick="deleteTransaction(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            listElement.appendChild(li);
        });
    }
    totalElement.innerText = "₹" + total;
}

// Start App
renderList();
