/**
 * Chatbot JavaScript - Heritage Assistant
 * Handles chat interface, AI responses, voice recognition, and interactive features
 */

// ===== GLOBAL VARIABLES =====
let chatHistory = [];
let isVoiceEnabled = true;
let isListening = false;
let recognition = null;
let speechSynthesis = null;
let totalQuestions = 0;

// Knowledge Base - Predefined responses for heritage-related questions
const knowledgeBase = {
    // Taj Mahal
    'taj mahal': {
        response: `🏛️ **The Taj Mahal** is one of the most magnificent monuments in the world!

**Key Facts:**
• Built by Mughal Emperor Shah Jahan (1632-1653)
• Dedicated to his beloved wife Mumtaz Mahal
• Made of white marble with intricate inlay work (pietra dura)
• UNESCO World Heritage Site since 1983
• One of the New Seven Wonders of the World

**Architecture:** The main dome is 73 meters high, surrounded by four smaller domes and four minarets. The building changes color throughout the day - pinkish in morning, white during day, and golden at sunset!

Would you like to explore it in AR? Visit our Explore page! 🚀`,
        keywords: ['taj mahal', 'taj', 'agra', 'shah jahan', 'mumtaz mahal', 'white marble']
    },

    // Konark Sun Temple
    'konark sun temple': {
        response: `☀️ **Konark Sun Temple** - The magnificent chariot of the Sun God!

**Historical Background:**
• Built in 13th century by King Narasimhadeva I
• Dedicated to Hindu sun god Surya
• Located in Konark, Odisha
• UNESCO World Heritage Site

**Unique Features:**
• Designed as a colossal chariot with 24 wheels
• Each wheel is about 10 feet in diameter and serves as a sundial
• Seven horses pull the chariot (representing days of the week)
• Intricate stone carvings depicting life, mythology, and erotica

**Fun Fact:** The temple was known as the "Black Pagoda" by European sailors who used it for navigation! ⛵`,
        keywords: ['konark', 'sun temple', 'odisha', 'surya', 'chariot', 'sundial', 'narasimhadeva']
    },

    // UNESCO World Heritage Sites
    'unesco world heritage': {
        response: `🌍 **India's UNESCO World Heritage Sites** (40 sites total):

**Cultural Sites (32):**
• Taj Mahal, Agra
• Ajanta Caves, Maharashtra
• Ellora Caves, Maharashtra
• Agra Fort
• Konark Sun Temple, Odisha
• Khajuraho Group of Monuments
• Hampi ruins, Karnataka
• Fatehpur Sikri
• Red Fort Complex, Delhi
• Humayun's Tomb, Delhi
• And many more...

**Natural Sites (7):**
• Kaziranga National Park
• Keoladeo National Park
• Sundarbans National Park
• Western Ghats
• Great Himalayan National Park

**Mixed Site (1):**
• Khangchendzonga National Park

Each site represents India's incredible cultural and natural diversity! 🇮🇳`,
        keywords: ['unesco', 'world heritage', 'heritage sites', 'cultural sites', 'natural sites']
    },

    // Festivals of Odisha
    'odisha festivals': {
        response: `🎭 **Major Festivals of Odisha:**

**Jagannath Puri Rath Yatra:**
• World-famous chariot festival
• Lord Jagannath, Balabhadra, and Subhadra are taken in procession
• Millions of devotees participate

**Durga Puja:**
• Celebrated with great fervor
• Beautiful pandals and artistic decorations
• Cultural programs and traditional dances

**Kali Puja:**
• Worship of Goddess Kali
• Celebrated especially in coastal areas

**Poila Boishakh:**
• Bengali New Year celebration
• Traditional foods and cultural events

**Raja Festival:**
• Celebrates womanhood and Mother Earth
• Three-day festival with swings and traditional games

**Diwali, Holi, and Dussehra** are also celebrated with great enthusiasm across the state! ✨`,
        keywords: ['odisha festivals', 'jagannath', 'rath yatra', 'durga puja', 'kali puja', 'raja festival']
    },

    // Classical Dance Forms
    'classical dance': {
        response: `💃 **Indian Classical Dance Forms** - The divine art of storytelling through movement:

**The Eight Classical Forms:**

1. **Bharatanatyam** (Tamil Nadu)
   • Temple dance with precise movements
   • Expressive eyes and hand gestures

2. **Kathak** (North India)
   • Storytelling through dance
   • Fast spins and intricate footwork

3. **Odissi** (Odisha)
   • Inspired by temple sculptures
   • Fluid movements and devotional themes

4. **Kuchipudi** (Andhra Pradesh)
   • Dance-drama tradition
   • Includes both solo and group performances

5. **Mohiniyattam** (Kerala)
   • The dance of the enchantress
   • Graceful and feminine movements

6. **Kathakali** (Kerala)
   • Classical dance-drama
   • Elaborate costumes and makeup

7. **Manipuri** (Manipur)
   • Devotional dance form
   • Depicts stories of Radha-Krishna

8. **Sattriya** (Assam)
   • Monastery dance tradition
   • Spiritual and devotional themes

Each form is a complete art combining dance, music, drama, and spirituality! 🎨`,
        keywords: ['classical dance', 'bharatanatyam', 'kathak', 'odissi', 'kuchipudi', 'mohiniyattam', 'kathakali', 'manipuri', 'sattriya']
    },

    // Indian Architecture
    'indian architecture': {
        response: `🏗️ **Indian Architectural Styles** - A journey through time:

**Ancient Period:**
• **Mauryan Architecture:** Ashoka pillars, stupas
• **Gupta Architecture:** Temple architecture development

**Medieval Period:**
• **Dravidian Style:** South Indian temples with towering gopurams
• **Nagara Style:** North Indian temples with curved towers
• **Vesara Style:** Hybrid of Dravidian and Nagara

**Islamic Architecture:**
• **Delhi Sultanate:** Indo-Islamic fusion
• **Mughal Architecture:** Taj Mahal, Red Fort, Humayun's Tomb
• Features: Domes, arches, minarets, gardens

**Colonial Architecture:**
• **British Colonial:** Victoria Memorial, Gateway of India
• **Indo-Saracenic:** Blend of Indian and European styles

**Modern Architecture:**
• **Contemporary:** Lotus Temple, Akshardham
• **Sustainable:** Green buildings and eco-friendly designs

Each style reflects the cultural, religious, and political influences of its time! 🏛️`,
        keywords: ['architecture', 'dravidian', 'nagara', 'vesara', 'mughal', 'indo-islamic', 'colonial', 'temple architecture']
    },

    // Khajuraho Temples
    'khajuraho': {
        response: `🏛️ **Khajuraho Temples** - Medieval India's architectural masterpiece:

**Historical Background:**
• Built by Chandela dynasty (950-1050 CE)
• Originally 85 temples, only 25 survive today
• UNESCO World Heritage Site

**Architectural Marvel:**
• Built in Nagara style with towering spires (shikharas)
• No foundation - held together by interlocking stones
• Intricate sculptures covering every surface

**Famous Sculptures:**
• Only 10% are erotic sculptures (representing tantric traditions)
• 90% depict gods, goddesses, musicians, dancers, and daily life
• Celebrates both divine and human experiences

**Cultural Significance:**
• Represents medieval India's liberal and sophisticated culture
• Showcases the celebration of life in all its forms
• Hidden by forests for centuries, rediscovered in 1830s

The temples are a testament to India's rich artistic heritage and open-minded cultural traditions! 🎨`,
        keywords: ['khajuraho', 'chandela', 'erotic sculptures', 'nagara style', 'madhya pradesh', 'tantric']
    },

    // Ajanta Caves
    'ajanta caves': {
        response: `🎨 **Ajanta Caves** - Ancient India's artistic treasure:

**Historical Timeline:**
• 30 rock-cut Buddhist cave monuments
• Created between 2nd century BCE to 480 CE
• Carved into volcanic lava of Deccan hills

**Architectural Features:**
• **Chaityas:** Prayer halls with stupas
• **Viharas:** Monasteries for monks
• Horseshoe-shaped cliff formation

**World-Famous Paintings:**
• Depict life of Buddha and Jataka tales
• Natural pigments still vibrant after 1500+ years
• Showcase ancient Indian painting techniques

**Rediscovery:**
• Abandoned around 650 CE
• Forgotten for over 1000 years
• Rediscovered in 1819 by British officer John Smith

**UNESCO Recognition:**
• World Heritage Site since 1983
• Represents zenith of ancient Indian art
• Influences modern Indian art and culture

The caves are a window into ancient India's spiritual and artistic achievements! 🙏`,
        keywords: ['ajanta', 'caves', 'buddhist', 'paintings', 'jataka', 'chaitya', 'vihara', 'maharashtra']
    },

    // Sanchi Stupa
    'sanchi stupa': {
        response: `☸️ **Sanchi Stupa** - Buddhism's architectural symbol:

**Historical Significance:**
• Built by Emperor Ashoka (3rd century BCE)
• One of India's oldest stone structures
• Contains relics of Buddha's disciples

**Architectural Elements:**
• **Anda:** Hemispherical dome (cosmic mountain)
• **Harmika:** Square platform with relics
• **Chattra:** Triple umbrella on top
• **Vedika:** Stone railing around the stupa
• **Toranas:** Four ornately carved gateways

**Gateway Sculptures:**
• Depict scenes from Buddha's life
• Jataka tales (Buddha's previous births)
• Various symbols representing Buddhism

**Cultural Impact:**
• Symbol of Buddha's parinirvana (final liberation)
• Influenced Buddhist architecture across Asia
• Survived because of remote location

**Modern Relevance:**
• Inspired India's national emblem (Lion Capital)
• UNESCO World Heritage Site
• Important pilgrimage destination

The stupa represents the cosmic mountain and the path to enlightenment! 🏔️`,
        keywords: ['sanchi', 'stupa', 'ashoka', 'buddhist', 'madhya pradesh', 'toranas', 'harmika']
    },

    // General greetings and responses
    'hello': {
        response: `🙏 Namaste! Welcome to the Heritage Assistant! I'm here to help you explore India's magnificent cultural heritage. 

I can tell you about:
• 🏛️ Historical monuments and their stories
• 🎭 Festivals and cultural traditions  
• 🏗️ Architectural styles and techniques
• 🌍 UNESCO World Heritage Sites
• 💃 Classical arts and dance forms

What would you like to know about India's rich heritage?`,
        keywords: ['hello', 'hi', 'namaste', 'hey', 'greetings']
    },

    'thank you': {
        response: `🙏 You're most welcome! I'm glad I could help you learn about India's beautiful heritage. 

Feel free to ask me anything else about our monuments, festivals, traditions, or culture. I'm here to help you explore and appreciate India's incredible diversity!

धन्यवाद (Dhanyawad) - Thank you for your interest in our heritage! 🇮🇳`,
        keywords: ['thank you', 'thanks', 'dhanyawad', 'appreciate']
    }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeChatbot();
});

function initializeChatbot() {
    setupEventListeners();
    initializeSpeechRecognition();
    initializeSpeechSynthesis();
    loadChatHistory();
    updateStatistics();
}

function setupEventListeners() {
    // Message input and send
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendMessage');
    
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    sendButton.addEventListener('click', sendMessage);
    
    // Quick action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.dataset.question;
            sendMessage(question);
        });
    });
    
    // Suggestion buttons
    const suggestionButtons = document.querySelectorAll('.suggestion-btn');
    suggestionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sendMessage(btn.textContent);
        });
    });
    
    // Control buttons
    document.getElementById('voiceToggle').addEventListener('click', toggleVoice);
    document.getElementById('clearChat').addEventListener('click', clearChat);
    document.getElementById('downloadChat').addEventListener('click', downloadChat);
    
    // Voice input
    document.getElementById('voiceInput').addEventListener('click', toggleVoiceInput);
    document.getElementById('stopVoice').addEventListener('click', stopVoiceInput);
}

// ===== MESSAGE HANDLING =====
function sendMessage(text = null) {
    const messageInput = document.getElementById('messageInput');
    const message = text || messageInput.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessage(message, 'user');
    
    // Clear input
    if (!text) messageInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process message and get response
    setTimeout(() => {
        const response = getAIResponse(message);
        hideTypingIndicator();
        addMessage(response, 'bot');
        
        // Speak response if voice is enabled
        if (isVoiceEnabled) {
            speakMessage(response);
        }
        
        // Update statistics
        totalQuestions++;
        updateStatistics();
        
        // Save to history
        saveChatHistory();
    }, 1000 + Math.random() * 2000); // Simulate processing time
}

function addMessage(content, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <div class="avatar-img">U</div>
            </div>
            <div class="message-content">
                <div class="message-bubble">
                    <p>${escapeHtml(content)}</p>
                </div>
                <div class="message-time">${currentTime}</div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <img src="images/chatbot-avatar.png" alt="Bot" class="avatar-img">
            </div>
            <div class="message-content">
                <div class="message-bubble">
                    ${formatBotResponse(content)}
                </div>
                <div class="message-time">${currentTime}</div>
            </div>
        `;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Add to chat history
    chatHistory.push({
        content,
        sender,
        timestamp: new Date().toISOString()
    });
}

function formatBotResponse(content) {
    // Convert markdown-like formatting to HTML
    let formatted = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/•/g, '•')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
    
    return `<p>${formatted}</p>`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== AI RESPONSE SYSTEM =====
function getAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Find matching response from knowledge base
    for (const [key, data] of Object.entries(knowledgeBase)) {
        if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
            return data.response;
        }
    }
    
    // Fallback responses for unmatched queries
    const fallbackResponses = [
        `I'd love to help you learn about India's heritage! Could you be more specific about which monument, festival, or cultural aspect you're interested in? 

Try asking about:
• Specific monuments (Taj Mahal, Red Fort, etc.)
• Festivals (Diwali, Holi, regional festivals)
• Art forms (classical dances, music, crafts)
• Architecture styles
• UNESCO World Heritage Sites`,

        `That's an interesting question about Indian heritage! While I may not have detailed information about that specific topic, I can tell you about many aspects of India's rich culture.

Would you like to know about:
🏛️ Famous monuments and their history
🎭 Traditional festivals and celebrations  
💃 Classical dance and music forms
🏗️ Architectural marvels
🌍 UNESCO World Heritage Sites`,

        `I'm here to help you explore India's magnificent cultural heritage! If you have questions about specific monuments, festivals, traditions, or cultural practices, I'd be happy to share what I know.

You can also visit our Explore page to experience these heritage sites in AR! 🚀`
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

// ===== TYPING INDICATOR =====
function showTypingIndicator() {
    document.getElementById('typingIndicator').classList.add('show');
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    document.getElementById('typingIndicator').classList.remove('show');
}

// ===== VOICE FUNCTIONALITY =====
function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN';
        
        recognition.onstart = function() {
            isListening = true;
            document.getElementById('voiceInput').classList.add('recording');
            document.getElementById('voiceModal').classList.remove('hidden');
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('messageInput').value = transcript;
            stopVoiceInput();
            sendMessage(transcript);
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            stopVoiceInput();
        };
        
        recognition.onend = function() {
            stopVoiceInput();
        };
    }
}

function initializeSpeechSynthesis() {
    if ('speechSynthesis' in window) {
        speechSynthesis = window.speechSynthesis;
    }
}

function toggleVoiceInput() {
    if (!recognition) {
        alert('Speech recognition is not supported in your browser.');
        return;
    }
    
    if (isListening) {
        stopVoiceInput();
    } else {
        startVoiceInput();
    }
}

function startVoiceInput() {
    if (recognition && !isListening) {
        recognition.start();
    }
}

function stopVoiceInput() {
    if (recognition && isListening) {
        recognition.stop();
        isListening = false;
        document.getElementById('voiceInput').classList.remove('recording');
        document.getElementById('voiceModal').classList.add('hidden');
    }
}

function toggleVoice() {
    isVoiceEnabled = !isVoiceEnabled;
    const voiceToggle = document.getElementById('voiceToggle');
    
    if (isVoiceEnabled) {
        voiceToggle.classList.add('active');
        voiceToggle.title = 'Voice Enabled - Click to Disable';
    } else {
        voiceToggle.classList.remove('active');
        voiceToggle.title = 'Voice Disabled - Click to Enable';
        // Stop any current speech
        if (speechSynthesis) {
            speechSynthesis.cancel();
        }
    }
}

function speakMessage(text) {
    if (!speechSynthesis || !isVoiceEnabled) return;
    
    // Clean text for speech (remove markdown and emojis)
    const cleanText = text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/[🏛️🎭💃🏗️🌍☀️🎨🙏☸️🏔️🇮🇳✨⛵🚀📚]/g, '')
        .replace(/•/g, '')
        .replace(/\n/g, ' ');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.7;
    
    // Try to use Indian English voice if available
    const voices = speechSynthesis.getVoices();
    const indianVoice = voices.find(voice => 
        voice.lang.includes('en-IN') || voice.name.includes('Indian')
    );
    
    if (indianVoice) {
        utterance.voice = indianVoice;
    }
    
    speechSynthesis.speak(utterance);
}

// ===== CHAT MANAGEMENT =====
function clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
        chatHistory = [];
        const messagesContainer = document.getElementById('chatMessages');
        
        // Keep only the welcome message
        const welcomeMessage = messagesContainer.querySelector('.message');
        messagesContainer.innerHTML = '';
        messagesContainer.appendChild(welcomeMessage);
        
        saveChatHistory();
    }
}

function downloadChat() {
    if (chatHistory.length === 0) {
        alert('No chat history to download.');
        return;
    }
    
    let chatText = 'Heritage Assistant Chat History\n';
    chatText += '=====================================\n\n';
    
    chatHistory.forEach(msg => {
        const time = new Date(msg.timestamp).toLocaleString();
        const sender = msg.sender === 'user' ? 'You' : 'Heritage Assistant';
        chatText += `[${time}] ${sender}: ${msg.content}\n\n`;
    });
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heritage-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function saveChatHistory() {
    try {
        localStorage.setItem('heritage-chat-history', JSON.stringify(chatHistory));
        localStorage.setItem('heritage-total-questions', totalQuestions.toString());
    } catch (e) {
        console.error('Error saving chat history:', e);
    }
}

function loadChatHistory() {
    try {
        const saved = localStorage.getItem('heritage-chat-history');
        if (saved) {
            chatHistory = JSON.parse(saved);
        }
        
        const savedQuestions = localStorage.getItem('heritage-total-questions');
        if (savedQuestions) {
            totalQuestions = parseInt(savedQuestions) || 0;
        }
    } catch (e) {
        console.error('Error loading chat history:', e);
        chatHistory = [];
        totalQuestions = 0;
    }
}

function updateStatistics() {
    document.getElementById('totalQuestions').textContent = totalQuestions.toLocaleString();
}

// ===== UTILITY FUNCTIONS =====
function animateStatsOnLoad() {
    const statsNumbers = document.querySelectorAll('.stats-number');
    statsNumbers.forEach(stat => {
        const finalValue = stat.textContent;
        stat.textContent = '0';
        
        setTimeout(() => {
            stat.textContent = finalValue;
            stat.style.transform = 'scale(1.1)';
            setTimeout(() => {
                stat.style.transform = 'scale(1)';
            }, 200);
        }, Math.random() * 1000);
    });
}

// Initialize stats animation
setTimeout(animateStatsOnLoad, 1000);

// ===== EXPORT FOR GLOBAL ACCESS =====
window.ChatbotApp = {
    sendMessage,
    toggleVoice,
    clearChat,
    downloadChat
};
