// Groq API Configuration
const GROQ_API_KEY = "YAHAN_GROQ_KEY_PASTE_KARO"; 

async function askAI(userInput) {
    statusText.innerText = "AI soch raha hai...";
    
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [
                    { role: "system", content: "You are a helpful khata assistant. Extract name and amount. Return ONLY JSON: {\"name\": \"string\", \"amount\": number}" },
                    { role: "user", content: userInput }
                ]
            })
        });

        const data = await response.json();
        const aiText = data.choices[0].message.content;
        
        // JSON nikaalne ke liye
        const result = JSON.parse(aiText.match(/\{.*\}/s)[0]);
        
        if (result.amount > 0) {
            addTransaction(result.name, result.amount);
            statusText.innerText = `Added: ${result.name} - ₹${result.amount}`;
        }
    } catch (error) {
        console.error(error);
        statusText.innerText = "Groq API Error!";
    }
}
