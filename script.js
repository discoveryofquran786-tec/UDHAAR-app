// ===========================================
// 1. API CONFIGURATION (Groq Cloud)
// Yahan apni 'gsk_...' wali key paste karein
// ===========================================
const GROQ_API_KEY = "YAHAN_GROQ_KEY_PASTE_KAREIN"; 

// ===========================================
// 2. SPLASH SCREEN & LOAD DATA
// ===========================================
window.onload = function() {
    // 3 second baad splash screen hatao
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        const main = document.getElementById('main-content');
        if(splash) splash.style.display = 'none';
        if(main) main.style.display = 'block';
    }, 3000);

    // Purana hisaab load karo
    renderList();
};

// ===========================================
// 3. VOICE RECOGNITION (Mic Logic)
// ===========================================
const micBtn = document.getElementById('mic-btn');
const statusText = document.getElementById('status-text');

// Browser Mic Support Check
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; // Indian English/Hinglish

    micBtn.onclick = () => {
        recognition.start();
        micBtn.classList.add("mic-listening"); // Animation ON
        statusText.innerText = "Sun raha hu... boliye (e.g. Raju 500)";
    };

    recognition.onresult = async (event) => {
        micBtn.classList.remove("mic-listening"); // Animation OFF
        const transcript = event.results[0][0].transcript;
        statusText.innerText = `Suna: "${transcript}". Processing...`;
        
        // Groq AI ko bhejo
        await askGroqAI(transcript);
    };

    recognition.onerror = () => {
        micBtn.classList.remove("mic-listening");
        statusText.innerText = "Samajh nahi aaya. Phir se dabayein.";
    };
} else {
    alert("Sorry, aapka browser mic support nahi karta. Chrome use karein.");
}

// ===========================================
// 4. GROQ AI LOGIC (The Brain)
// ===========================================
async function askGroqAI(userText) {
    if (!GROQ_API_KEY.startsWith("gsk_")) {
        alert("Groq API Key missing hai! Script.js mein key dalein.");
        statusText.innerText = "API Key Error!";
        return;
    }

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192", // Free & Fast Model
                messages: [
                    { 
                        role: "system", 
                        content: "You are a data extractor. Extract 'name' (string) and 'amount' (number) from the user's text. Return ONLY valid JSON format like: {\"name\": \"Raju\", \"amount\": 500}. If no amount found, return amount: 0." 
                    },
                    { role: "user", content: userText }
                ]
            })
        });

        const data = await response.json();
        const aiMessage = data.choices[0].message.content;

        // JSON Cleaning (Agar AI ne kuch extra text bhej diya ho)
        const jsonMatch = aiMessage.match(/\{.*\}/s);
        if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);
            
            if (result.amount > 0) {
                addTransaction(result.name, result.amount);
                statusText.innerText = `Added: ${result.name} - ₹${result.amount}`;
            } else {
                statusText.innerText = "Amount nahi mila. Phir se boliye.";
            }
        } else {
            statusText.innerText = "AI Error. Manual entry karein.";
        }

    } catch (error) {
        console.error("Groq Error:", error);
        statusText.innerText = "Internet ya API Error!";
    }
}

// ===========================================
// 5. TRANSACTION FUNCTIONS (Add, Delete, Render)
// ===========================================
function addTransaction(name, amount) {
    let khata = JSON.parse(localStorage.getItem('myKhata')) || [];
    const newEntry = { id: Date.now(), name: name, amount: amount };
    khata.push(newEntry);
    localStorage.setItem('myKhata', JSON.stringify(khata));
    renderList();
}

function deleteTransaction(id) {
    if(confirm("Kya aap ye entry delete karna chahte hain?")) {
        let khata = JSON.parse(localStorage.getItem('myKhata')) || [];
        khata = khata.filter(item => item.id !== id);
        localStorage.setItem('myKhata', JSON.stringify(khata));
        renderList();
    }
}

function renderList() {
    const khata = JSON.parse(localStorage.getItem('myKhata')) || [];
    const listElement = document.getElementById('khata-list');
    const totalElement = document.getElementById('total-amount');
    
    listElement.innerHTML = "";
    let total = 0;

    khata.forEach(item => {
        total += item.amount;
        const li = document.createElement('li');
        // List Item Styling directly here for safety
        li.style = "display:flex; justify-content:space-between; align-items:center; padding:15px; background:white; margin-bottom:10px; border-radius:10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);";
        
        li.innerHTML = `
            <div>
                <strong style="font-size:1.1rem; display:block;">${item.name}</strong>
                <span style="color:#666;">₹${item.amount}</span>
            </div>
            <div class="actions">
                <button onclick="sendWhatsApp('${item.name}', ${item.amount})" style="background:#25D366; color:white; border:none; padding:8px 12px; border-radius:5px; margin-right:5px; cursor:pointer;">
                    <i class="fab fa-whatsapp"></i>
                </button>
                <button onclick="deleteTransaction(${item.id})" style="background:#ff4b4b; color:white; border:none; padding:8px 12px; border-radius:5px; cursor:pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        listElement.appendChild(li);
    });

    totalElement.innerText = "₹" + total;
}

// ===========================================
// 6. WHATSAPP FEATURE
// ===========================================
function sendWhatsApp(name, amount) {
    const phone = prompt(`Enter WhatsApp Number for ${name} (e.g., 919876543210):`);
    if (phone) {
        const msg = `Assalamu Alaikum ${name}, aapka ₹${amount} udhaar balance hai. Please clear karein. - Udhaar App`;
        // Mobile aur PC dono pe chalne wala link
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
    }
}

// ===========================================
// 7. CHATBOT FEATURE (Extra)
// ===========================================
const sendChatBtn = document.getElementById('send-chat');
const chatInput = document.getElementById('chat-input');
const chatLogs = document.getElementById('chat-logs');

if(sendChatBtn) {
    sendChatBtn.onclick = async () => {
        const query = chatInput.value;
        if(!query) return;

        // User ka sawal dikhao
        chatLogs.innerHTML += `<p style="text-align:right; color:#333; background:#e0e0e0; padding:5px; border-radius:5px; display:inline-block; float:right; clear:both;">${query}</p>`;
        chatInput.value = "";

        // Current Data Context
        const currentData = localStorage.getItem('myKhata') || "No data yet";

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "llama3-8b-8192",
                    messages: [
                        { role: "system", content: `You are a helpful accountant. Here is the ledger data: ${currentData}. Answer the user's question briefly in Hinglish.` },
                        { role: "user", content: query }
                    ]
                })
            });
            const data = await response.json();
            const reply = data.choices[0].message.content;

            // AI ka jawab dikhao
            chatLogs.innerHTML += `<p style="text-align:left; color:white; background:#007bff; padding:5px; border-radius:5px; display:inline-block; float:left; clear:both;">${reply}</p>`;
        } catch(e) {
            chatLogs.innerHTML += `<p style="color:red;">Error connecting to AI</p>`;
        }
    };
}
