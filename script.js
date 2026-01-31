// Splash Screen Timer
window.onload = function() {
  setTimeout(function() {
    document.getElementById('splash-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
  }, 3000);
};

// WhatsApp Notification
function sendWhatsApp(name, amount) {
    const phone = prompt("Customer ka WhatsApp number dalo (91 ke saath, e.g. 919876543210):");
    if(phone) {
        const msg = `Assalamu Alaikum ${name}, aapka ₹${amount} udhaar balance hai hamare paas. Please jald clear karein. - Khata by Abdul Rahman`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    }
}

// Render List with WhatsApp Button
function renderList() {
    let khata = JSON.parse(localStorage.getItem('myKhata')) || [];
    const listElement = document.getElementById('khata-list');
    const totalElement = document.getElementById('total-amount');
    listElement.innerHTML = "";
    let total = 0;
    
    khata.forEach(item => {
        total += item.amount;
        const li = document.createElement('li');
        li.style = "display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid #eee;";
        li.innerHTML = `
            <span><b>${item.name}</b>: ₹${item.amount}</span>
            <div class="actions">
                <button onclick="sendWhatsApp('${item.name}', ${item.amount})" style="background:#25D366; color:white; border:none; padding:8px; border-radius:5px; margin-right:5px; cursor:pointer;">
                    <i class="fab fa-whatsapp"></i> Notify
                </button>
                <button onclick="deleteTransaction(${item.id})" style="background:#ff4b4b; color:white; border:none; padding:8px; border-radius:5px; cursor:pointer;">❌</button>
            </div>
        `;
        listElement.appendChild(li);
    });
    totalElement.innerText = "₹" + total;
}

// Initialize
renderList();
