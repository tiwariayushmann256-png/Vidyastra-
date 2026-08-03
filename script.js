// API Configuration
const GEMINI_API_KEY =AQ.Ab8RN6L05K8vTuf4a1sQNqWkH_BME3IGYgEwbNPHjeb-1ypcUg;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// System Prompt (Academic Guardrails + Multilingual Support)
const SYSTEM_PROMPT = `You are 'Study War 12th AI', a personal AI tutor created by Ayushman for Class 10th, 11th, 12th and competitive exam students.
RULES & CONSTRAINTS:
1. Strictly answer academic, educational, exam-related, or study planning queries.
2. Refuse non-academic/distracting topics politely and bring focus back to studies.
3. Understand Hindi, English, Hinglish, Bhojpuri, or any regional language, and reply in the same language comfortable for the user.
4. Explain concepts step-by-step from Basic to Advanced with simple real-life examples.`;

// 1. Fixed Tab Switch Logic
function switchTab(tabName, eventObj) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    if(tabName === 'tutor') {
        document.getElementById('tutor-section').classList.add('active');
    } else {
        document.getElementById('routine-section').classList.add('active');
    }
    
    if (eventObj && eventObj.currentTarget) {
        eventObj.currentTarget.classList.add('active');
    }
}

// 2. Optimized Chat System
async function sendMessage() {
    const inputField = document.getElementById('user-input');
    const userText = inputField.value.trim();
    if (!userText) return;

    appendMessage(userText, 'user-message');
    inputField.value = '';

    const loadingDiv = appendMessage('सोच रहा हूँ...', 'bot-message');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { 
                        role: 'user', 
                        parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Prompt: ${userText}` }] 
                    }
                ]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const reply = data.candidates[0].content.parts[0].text;
            // Markdown / Space formatting handling
            loadingDiv.style.whiteSpace = "pre-wrap"; 
            loadingDiv.innerText = reply;
        } else {
            loadingDiv.innerText = "माफ़ कीजिये, कोई उत्तर नहीं मिल सका। कृपया पुनः प्रयास करें।";
        }
    } catch (error) {
        console.error("API Error:", error);
        loadingDiv.innerText = "माफ़ कीजिये, सर्वर से कनेक्ट करने में समस्या आई। कृपया अपनी API Key और इंटरनेट कनेक्शन जाँचें।";
    }
}

// 3. Message Append Helper
function appendMessage(text, className) {
    const chatBox = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${className}`;
    msgDiv.innerText = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msgDiv;
}

// 4. Custom Routine Generator
async function generateRoutine() {
    const wake = document.getElementById('wake-time').value;
    const school = document.getElementById('school-time').value;
    const hours = document.getElementById('study-hours').value;
    const outputDiv = document.getElementById('routine-output');

    if (!wake || !school || !hours) {
        outputDiv.innerText = "कृपया सभी फ़ील्ड (उठने का समय, स्कूल का समय, और पढ़ाई के घंटे) भरें!";
        return;
    }

    outputDiv.style.whiteSpace = "pre-wrap";
    outputDiv.innerText = "आपका कस्टम टाइम-टेबल तैयार हो रहा है...";

    const prompt = `कस्टम टाइम-टेबल बनाएं:
- उठने का समय: ${wake}
- स्कूल/कोचिंग समय: ${school}
- सेल्फ-स्टडी घंटे: ${hours} घंटे
कृपया छात्र के लिए एक व्यावहारिक, व्यवस्थित और संतुलित टाइम-टेबल बनाकर दें।`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\n${prompt}` }] }]
            })
        });

        const data = await response.json();
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            outputDiv.innerText = data.candidates[0].content.parts[0].text;
        } else {
            outputDiv.innerText = "रूटीन जनरेट करने में विफलता हुई।";
        }
    } catch (error) {
        console.error("Routine Error:", error);
        outputDiv.innerText = "नेटवर्क एरर या अमान्य API Key!";
    }
}
