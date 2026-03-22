// Voice Output and Text-to-Speech Features

class VoiceFeatures {
    constructor() {
        this.speechSynthesis = window.speechSynthesis;
        this.currentUtterance = null;
        this.isSpeaking = false;
        this.isPaused = false;
        this.autoSpeakEnabled = localStorage.getItem('autoSpeakEnabled') === 'true' || false;
        this.voiceSettings = JSON.parse(localStorage.getItem('voiceSettings')) || {
            rate: 1,
            pitch: 1,
            volume: 1,
            voice: null
        };
        
        this.initializeElements();
        this.initEventListeners();
        this.loadVoices();
        this.applyVoiceSettings();
    }
    
    initializeElements() {
        this.voiceToggle = document.getElementById('voiceToggle');
        this.textToSpeechToggle = document.getElementById('textToSpeechToggle');
        this.voiceSettingsBtn = document.getElementById('voiceSettingsBtn');
        this.voiceSettingsPanel = document.getElementById('voiceSettingsPanel');
        this.voiceSelect = document.getElementById('voiceSelect');
        this.rateSlider = document.getElementById('rateSlider');
        this.pitchSlider = document.getElementById('pitchSlider');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.rateValue = document.getElementById('rateValue');
        this.pitchValue = document.getElementById('pitchValue');
        this.volumeValue = document.getElementById('volumeValue');
        this.saveVoiceSettings = document.getElementById('saveVoiceSettings');
        this.speakingIndicator = document.getElementById('speakingIndicator');
        this.chatMessages = document.getElementById('chatMessages');
        
        // Update toggle button state
        this.updateToggleButton();
    }
    
    initEventListeners() {
        // Voice toggle button
        if (this.voiceToggle) {
            this.voiceToggle.addEventListener('click', () => {
                if (this.isSpeaking) {
                    this.stopSpeaking();
                } else {
                    this.speakLastBotMessage();
                }
            });
        }
        
        // Text-to-speech toggle
        if (this.textToSpeechToggle) {
            this.textToSpeechToggle.addEventListener('click', () => {
                this.toggleAutoSpeak();
            });
        }
        
        // Voice settings button
        if (this.voiceSettingsBtn) {
            this.voiceSettingsBtn.addEventListener('click', () => {
                this.toggleVoiceSettings();
            });
        }
        
        // Save voice settings
        if (this.saveVoiceSettings) {
            this.saveVoiceSettings.addEventListener('click', () => {
                this.saveSettings();
            });
        }
        
        // Update slider values display
        if (this.rateSlider) {
            this.rateSlider.addEventListener('input', () => {
                this.rateValue.textContent = this.rateSlider.value;
            });
        }
        
        if (this.pitchSlider) {
            this.pitchSlider.addEventListener('input', () => {
                this.pitchValue.textContent = this.pitchSlider.value;
            });
        }
        
        if (this.volumeSlider) {
            this.volumeSlider.addEventListener('input', () => {
                this.volumeValue.textContent = this.volumeSlider.value;
            });
        }
        
        // Close voice settings when clicking outside
        document.addEventListener('click', (e) => {
            if (this.voiceSettingsPanel && 
                !this.voiceSettingsPanel.contains(e.target) && 
                e.target !== this.voiceSettingsBtn) {
                this.voiceSettingsPanel.classList.remove('show');
            }
        });
        
        // Spacebar to speak/stop last message
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                if (this.isSpeaking) {
                    this.stopSpeaking();
                } else {
                    this.speakLastBotMessage();
                }
            }
            
            // Escape to stop speaking
            if (e.code === 'Escape' && this.isSpeaking) {
                this.stopSpeaking();
            }
        });
        
        // Listen for new messages to auto-speak
        this.observeNewMessages();
    }
    
    loadVoices() {
        // Load available voices
        const populateVoices = () => {
            if (!this.voiceSelect) return;
            
            this.voiceSelect.innerHTML = '<option value="">Default System Voice</option>';
            const voices = this.speechSynthesis.getVoices();
            
            voices.forEach((voice, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${voice.name} (${voice.lang})`;
                this.voiceSelect.appendChild(option);
            });
            
            // Select saved voice if available
            if (this.voiceSettings.voice !== null && voices[this.voiceSettings.voice]) {
                this.voiceSelect.value = this.voiceSettings.voice;
            }
            
            // Update slider values
            if (this.rateSlider) {
                this.rateSlider.value = this.voiceSettings.rate;
                this.rateValue.textContent = this.voiceSettings.rate;
            }
            
            if (this.pitchSlider) {
                this.pitchSlider.value = this.voiceSettings.pitch;
                this.pitchValue.textContent = this.voiceSettings.pitch;
            }
            
            if (this.volumeSlider) {
                this.volumeSlider.value = this.voiceSettings.volume;
                this.volumeValue.textContent = this.volumeSettings.volume;
            }
        };
        
        // Chrome loads voices asynchronously
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = populateVoices;
        }
        
        // Initial population
        populateVoices();
    }
    
    applyVoiceSettings() {
        // Update UI based on settings
        this.updateToggleButton();
    }
    
    updateToggleButton() {
        // Update main voice toggle button
        if (this.voiceToggle) {
            if (this.isSpeaking) {
                this.voiceToggle.innerHTML = '<i class="fas fa-stop btn-icon"></i>';
                this.voiceToggle.title = 'Stop Speaking (Spacebar)';
                this.voiceToggle.classList.add('voice-control-active');
            } else {
                this.voiceToggle.innerHTML = '<i class="fas fa-play btn-icon"></i>';
                this.voiceToggle.title = 'Speak Last Message (Spacebar)';
                this.voiceToggle.classList.remove('voice-control-active');
            }
        }
        
        // Update auto-speak toggle button
        if (this.textToSpeechToggle) {
            if (this.autoSpeakEnabled) {
                this.textToSpeechToggle.classList.add('voice-control-active');
                this.textToSpeechToggle.title = 'Disable Auto Voice Responses';
                this.textToSpeechToggle.innerHTML = '<i class="fas fa-volume-up btn-icon"></i>';
            } else {
                this.textToSpeechToggle.classList.remove('voice-control-active');
                this.textToSpeechToggle.title = 'Enable Auto Voice Responses';
                this.textToSpeechToggle.innerHTML = '<i class="fas fa-volume-mute btn-icon"></i>';
            }
        }
    }
    
    toggleAutoSpeak() {
        this.autoSpeakEnabled = !this.autoSpeakEnabled;
        localStorage.setItem('autoSpeakEnabled', this.autoSpeakEnabled);
        this.updateToggleButton();
        
        const message = this.autoSpeakEnabled 
            ? 'Auto voice responses enabled' 
            : 'Auto voice responses disabled';
        this.showNotification(message, 'info');
    }
    
    toggleVoiceSettings() {
        if (this.voiceSettingsPanel) {
            this.voiceSettingsPanel.classList.toggle('show');
        }
    }
    
    saveSettings() {
        this.voiceSettings = {
            rate: parseFloat(this.rateSlider.value),
            pitch: parseFloat(this.pitchSlider.value),
            volume: parseFloat(this.volumeSlider.value),
            voice: this.voiceSelect.value ? parseInt(this.voiceSelect.value) : null
        };
        
        localStorage.setItem('voiceSettings', JSON.stringify(this.voiceSettings));
        
        this.voiceSettingsPanel.classList.remove('show');
        this.showNotification('Voice settings saved successfully', 'success');
    }
    
    speakText(text, callback) {
        // Stop any ongoing speech
        this.stopSpeaking();
        
        // Clean text (remove HTML tags, emojis, etc.)
        const cleanText = this.cleanTextForSpeech(text);
        
        if (!cleanText.trim()) {
            if (callback) callback();
            return;
        }
        
        // Create speech utterance
        this.currentUtterance = new SpeechSynthesisUtterance(cleanText);
        
        // Apply voice settings
        this.currentUtterance.rate = this.voiceSettings.rate;
        this.currentUtterance.pitch = this.voiceSettings.pitch;
        this.currentUtterance.volume = this.voiceSettings.volume;
        
        // Set voice if selected
        const voices = this.speechSynthesis.getVoices();
        if (this.voiceSettings.voice !== null && voices[this.voiceSettings.voice]) {
            this.currentUtterance.voice = voices[this.voiceSettings.voice];
        }
        
        // Event handlers
        this.currentUtterance.onstart = () => {
            this.isSpeaking = true;
            this.isPaused = false;
            
            // Update UI
            this.updateSpeakingUI(true);
            
            if (callback) callback('start');
        };
        
        this.currentUtterance.onend = () => {
            this.isSpeaking = false;
            this.isPaused = false;
            this.currentUtterance = null;
            
            // Update UI to show completion state
            this.updateSpeakingUI(false, true);
            
            // Disable message speak buttons until clicked again
            this.disableMessageSpeakButtons();
            
            if (callback) callback('end');
        };
        
        this.currentUtterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            this.isSpeaking = false;
            this.isPaused = false;
            this.currentUtterance = null;
            
            // Update UI to show error state
            this.updateSpeakingUI(false, false, true);
            
            if (callback) callback('error');
        };
        
        // Start speaking
        this.speechSynthesis.speak(this.currentUtterance);
    }
    
    stopSpeaking() {
        if (this.isSpeaking && this.currentUtterance) {
            this.speechSynthesis.cancel();
            this.isSpeaking = false;
            this.isPaused = false;
            this.currentUtterance = null;
            
            // Update UI to show stopped state
            this.updateSpeakingUI(false, false, false, true);
            
            // Disable message speak buttons until clicked again
            this.disableMessageSpeakButtons();
            
            this.showNotification('Speech stopped', 'info');
        }
    }
    
    updateSpeakingUI(isSpeaking = false, isCompleted = false, isError = false, isStopped = false) {
        // Update main voice toggle button
        if (this.voiceToggle) {
            if (isSpeaking) {
                this.voiceToggle.innerHTML = '<i class="fas fa-stop btn-icon"></i>';
                this.voiceToggle.title = 'Stop Speaking (Spacebar)';
                this.voiceToggle.classList.add('voice-control-active');
            } else if (isCompleted) {
                this.voiceToggle.innerHTML = '<i class="fas fa-check-circle btn-icon"></i>';
                this.voiceToggle.title = 'Speaking Completed - Click to speak last message again';
                this.voiceToggle.classList.remove('voice-control-active');
                this.voiceToggle.classList.add('speaking-completed');
                
                // Remove completed state after 3 seconds
                setTimeout(() => {
                    if (this.voiceToggle && !this.isSpeaking) {
                        this.voiceToggle.innerHTML = '<i class="fas fa-play btn-icon"></i>';
                        this.voiceToggle.title = 'Speak Last Message (Spacebar)';
                        this.voiceToggle.classList.remove('speaking-completed');
                    }
                }, 3000);
            } else if (isError) {
                this.voiceToggle.innerHTML = '<i class="fas fa-exclamation-circle btn-icon"></i>';
                this.voiceToggle.title = 'Error Speaking - Click to retry';
                this.voiceToggle.classList.remove('voice-control-active');
                this.voiceToggle.classList.add('speaking-error');
                
                // Remove error state after 3 seconds
                setTimeout(() => {
                    if (this.voiceToggle && !this.isSpeaking) {
                        this.voiceToggle.innerHTML = '<i class="fas fa-play btn-icon"></i>';
                        this.voiceToggle.title = 'Speak Last Message (Spacebar)';
                        this.voiceToggle.classList.remove('speaking-error');
                    }
                }, 3000);
            } else if (isStopped) {
                this.voiceToggle.innerHTML = '<i class="fas fa-stop-circle btn-icon"></i>';
                this.voiceToggle.title = 'Speech Stopped - Click to speak last message again';
                this.voiceToggle.classList.remove('voice-control-active');
                this.voiceToggle.classList.add('speaking-stopped');
                
                // Remove stopped state after 2 seconds
                setTimeout(() => {
                    if (this.voiceToggle && !this.isSpeaking) {
                        this.voiceToggle.innerHTML = '<i class="fas fa-play btn-icon"></i>';
                        this.voiceToggle.title = 'Speak Last Message (Spacebar)';
                        this.voiceToggle.classList.remove('speaking-stopped');
                    }
                }, 2000);
            } else {
                this.voiceToggle.innerHTML = '<i class="fas fa-play btn-icon"></i>';
                this.voiceToggle.title = 'Speak Last Message (Spacebar)';
                this.voiceToggle.classList.remove('voice-control-active');
            }
        }
        
        // Update speaking indicator
        if (this.speakingIndicator) {
            if (isSpeaking) {
                this.speakingIndicator.classList.remove('hidden');
                this.speakingIndicator.innerHTML = '<i class="fas fa-volume-up"></i> Speaking...';
            } else {
                this.speakingIndicator.classList.add('hidden');
            }
        }
        
        // Update message speak buttons
        this.updateMessageSpeakButtons(isSpeaking, isCompleted, isStopped);
    }
    
    cleanTextForSpeech(text) {
        // Remove HTML tags
        let clean = text.replace(/<[^>]*>/g, ' ');
        
        // Replace common HTML entities
        clean = clean.replace(/&nbsp;/g, ' ')
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, "'");
        
        // Remove extra whitespace
        clean = clean.replace(/\s+/g, ' ').trim();
        
        // Remove emojis and special characters that might cause issues
        clean = clean.replace(/[^\w\s.,!?;:'"()-]/g, ' ');
        
        return clean;
    }
    
    extractTextFromMessage(messageElement) {
        // Extract text from message bubble
        const bubble = messageElement.querySelector('.message-bubble');
        if (!bubble) return '';
        
        // Clone to avoid modifying original
        const clone = bubble.cloneNode(true);
        
        // Remove speak buttons
        const speakBtns = clone.querySelectorAll('.message-speak-btn');
        speakBtns.forEach(btn => btn.remove());
        
        // Get text content
        return clone.textContent || clone.innerText;
    }
    
    speakLastBotMessage() {
        const botMessages = this.chatMessages.querySelectorAll('.bot-message');
        if (botMessages.length === 0) {
            this.showNotification('No bot messages to speak', 'info');
            return;
        }
        
        const lastBotMessage = botMessages[botMessages.length - 1];
        const text = this.extractTextFromMessage(lastBotMessage);
        
        if (text.trim()) {
            this.speakText(text);
        } else {
            this.showNotification('No text found to speak', 'info');
        }
    }
    
    speakMessage(messageElement) {
        const text = this.extractTextFromMessage(messageElement);
        
        if (text.trim()) {
            this.speakText(text);
        }
    }
    
    observeNewMessages() {
        // Watch for new messages being added to chat
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.classList && node.classList.contains('bot-message')) {
                            // Add speak button to new bot messages
                            this.addSpeakButtonToMessage(node);
                            
                            // Auto-speak if enabled
                            if (this.autoSpeakEnabled && !node.classList.contains('typing-indicator')) {
                                setTimeout(() => {
                                    this.speakMessage(node);
                                }, 500);
                            }
                        }
                    });
                }
            });
        });
        
        if (this.chatMessages) {
            observer.observe(this.chatMessages, { childList: true });
        }
        
        // Add speak buttons to existing messages
        this.addSpeakButtonsToAllMessages();
    }
    
    addSpeakButtonToMessage(messageElement) {
        const bubble = messageElement.querySelector('.message-bubble');
        if (!bubble) return;
        
        // Check if button already exists
        if (bubble.querySelector('.message-speak-btn')) return;
        
        // Create speak button
        const speakBtn = document.createElement('button');
        speakBtn.className = 'message-speak-btn';
        speakBtn.title = 'Speak this message';
        speakBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        speakBtn.setAttribute('data-speaking', 'false');
        
        speakBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Check if button is disabled
            if (speakBtn.classList.contains('disabled')) {
                return;
            }
            
            // If currently speaking this message, stop it
            if (speakBtn.getAttribute('data-speaking') === 'true') {
                this.stopSpeaking();
                speakBtn.setAttribute('data-speaking', 'false');
                speakBtn.classList.remove('speaking');
                speakBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                speakBtn.title = 'Speak this message';
            } else {
                // Enable all buttons before speaking new message
                this.enableMessageSpeakButtons();
                
                // Set this button as active
                speakBtn.setAttribute('data-speaking', 'true');
                speakBtn.classList.add('speaking');
                speakBtn.innerHTML = '<i class="fas fa-stop"></i>';
                speakBtn.title = 'Stop speaking this message';
                
                this.speakMessage(messageElement);
            }
        });
        
        bubble.style.position = 'relative';
        bubble.appendChild(speakBtn);
    }
    
    addSpeakButtonsToAllMessages() {
        const botMessages = this.chatMessages.querySelectorAll('.bot-message');
        botMessages.forEach(message => {
            this.addSpeakButtonToMessage(message);
        });
    }
    
    updateMessageSpeakButtons(isSpeaking, isCompleted, isStopped) {
        const speakButtons = document.querySelectorAll('.message-speak-btn');
        
        if (isCompleted || isStopped) {
            // When speech ends or stops, disable all buttons
            speakButtons.forEach(btn => {
                btn.classList.add('disabled');
                btn.setAttribute('data-speaking', 'false');
                btn.classList.remove('speaking');
                btn.innerHTML = '<i class="fas fa-volume-up"></i>';
                btn.title = 'Click to re-enable speech';
                
                // Add click handler to re-enable
                const reEnableHandler = (e) => {
                    e.stopPropagation();
                    btn.classList.remove('disabled');
                    btn.title = 'Speak this message';
                    btn.removeEventListener('click', reEnableHandler);
                };
                
                btn.addEventListener('click', reEnableHandler, { once: true });
            });
        } else if (!isSpeaking) {
            // When not speaking, enable buttons
            speakButtons.forEach(btn => {
                btn.classList.remove('disabled');
                btn.setAttribute('data-speaking', 'false');
                btn.classList.remove('speaking');
                btn.innerHTML = '<i class="fas fa-volume-up"></i>';
                btn.title = 'Speak this message';
            });
        }
    }
    
    disableMessageSpeakButtons() {
        const speakButtons = document.querySelectorAll('.message-speak-btn');
        
        speakButtons.forEach(btn => {
            btn.classList.add('disabled');
            btn.setAttribute('data-speaking', 'false');
            btn.classList.remove('speaking');
            btn.innerHTML = '<i class="fas fa-volume-up"></i>';
            btn.title = 'Click to re-enable speech';
            
            // Add click handler to re-enable
            const reEnableHandler = (e) => {
                e.stopPropagation();
                btn.classList.remove('disabled');
                btn.title = 'Speak this message';
                
                // Remove this event listener
                btn.removeEventListener('click', reEnableHandler);
            };
            
            btn.addEventListener('click', reEnableHandler, { once: true });
        });
    }
    
    enableMessageSpeakButtons() {
        const speakButtons = document.querySelectorAll('.message-speak-btn');
        
        speakButtons.forEach(btn => {
            btn.classList.remove('disabled');
            btn.setAttribute('data-speaking', 'false');
            btn.classList.remove('speaking');
            btn.innerHTML = '<i class="fas fa-volume-up"></i>';
            btn.title = 'Speak this message';
            
            // Remove any existing re-enable handlers
            // Note: We can't directly remove anonymous handlers, 
            // but setting onclick to null will remove them
            btn.onclick = null;
        });
    }
    
    downloadChatAsText() {
        const messages = this.chatMessages.querySelectorAll('.message');
        let chatText = 'Chat with Heritage Assistant\n';
        chatText += '='.repeat(50) + '\n\n';
        
        messages.forEach(message => {
            const isBot = message.classList.contains('bot-message');
            const time = message.querySelector('.message-time')?.textContent || '';
            const text = this.extractTextFromMessage(message);
            
            chatText += `${isBot ? 'Assistant' : 'You'} (${time}):\n`;
            chatText += text + '\n';
            chatText += '-'.repeat(40) + '\n';
        });
        
        // Create download link
        const blob = new Blob([chatText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `heritage-chat-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Chat downloaded successfully', 'success');
    }
    
    downloadChatAsPDF() {
        this.showNotification('PDF download feature coming soon!', 'info');
        // Note: For PDF generation, you would need a library like jsPDF
        // This is a placeholder for future implementation
    }
    
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelectorAll('.notification');
        existing.forEach(n => n.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'notificationSlideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Add to document
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'notificationSlideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.voiceFeatures = new VoiceFeatures();
        console.log('Voice Features initialized on DOMContentLoaded');
    });
} else {
    window.voiceFeatures = new VoiceFeatures();
    console.log('Voice Features initialized immediately');
}