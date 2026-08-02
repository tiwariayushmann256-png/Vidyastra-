// GEMINI API KEY PLACEHOLDER
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// System Prompt (Academic Guardrails + Multilingual Support)
const SYSTEM_PROMPT = `You are 'Study War 12th AI', a personal AI tutor created by Ayushman for Class 10th, 11th, 12th and competitive exam students.
RULES & CONSTRAINTS:
1. Strictly answer academic, educational, exam-related, or study planning queries.
2. Refuse non-academic/distracting topics politely and bring focus back to studies.
3. Understand Hindi, English, Hinglish, Bhojpuri, or any regional language, and reply in the same language comfortable for the user.
4. Explain concepts step-by-step from Basic to Advanced with simple real-life examples.`;

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    if(tabName === 'tutor') {
        document.getElementById('tutor-section').classList.add('active');
        event.currentTarget.classList.add('active');
    } else {
        document.getElementById('routine-section').classList.add('active');
        event.currentTarget.classList.add('active');
    }
}

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
                    { role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Prompt: ${userText}` }] }
                ]
            })
        });

        const data = await response.json();
        const reply = data.candidates[0].content.parts[0].text;
        loadingDiv.innerText = reply;
    } catch (error) {
        loadingDiv.innerText = "माफ़ कीजिये, एरर आया या API Key सेट नहीं है। कृपया दोबारा प्रयास करें।";
    }
}

function appendMessage(text, className) {
    const chatBox = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${className}`;
    msgDiv.innerText = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msgDiv;
}

async function generateRoutine() {
    const wake = document.getElementById('wake-time').value;
    const school = document.getElementById('school-time').value;
    const hours = document.getElementById('study-hours').value;
    const outputDiv = document.getElementById('routine-output');

    outputDiv.innerText = "आपका कस्टम टाइम-टेबल तैयार हो रहा है...";

    const prompt = `कस्टम टाइम-टेबल बनाएं:
- उठने का समय: ${wake}
- स्कूल/कोचिंग समय: ${school}
- सेल्फ-स्टडी घंटे: ${hours} घंटे
कृपया क्लास 12th के छात्र के लिए एक प्रैक्टिकल और बैलेंस्ड टाइम-टेबल बनाकर दें।`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\n${prompt}` }] }]
            })
        });

        const data = await response.json();
        outputDiv.innerText = data.candidates[0].content.parts[0].text;
    } catch (error) {
        outputDiv.innerText = "रूटीन जनरेट करने में विफलता हुई।";
    }
}
