/**
 * Explore Page JavaScript - AR Heritage Platform
 * Handles 3D/AR viewer, site selection, audio narration, and interactive features
 */

// ===== GLOBAL VARIABLES =====
let currentSite = 'taj-mahal';
let isARMode = false;
let isNarrationPlaying = false;
let currentViewMode = 'day';

// Heritage site data
const heritageSites = {
    'taj-mahal': {
        name: 'Taj Mahal',
        location: 'Agra, Uttar Pradesh',
        model: 'taj-mahal-model',
        history: `The Taj Mahal was built between 1632 and 1653 by Mughal Emperor Shah Jahan as a mausoleum for his beloved wife Mumtaz Mahal. This ivory-white marble masterpiece is considered one of the finest examples of Mughal architecture, combining elements from Islamic, Persian, Ottoman Turkish, and Indian architectural styles.`,
        architecture: `The Taj Mahal features a central dome surrounded by four smaller domes, four minarets, and intricate inlay work known as pietra dura. The main dome is 73 meters high and is surrounded by four smaller domes. The building stands on a square plinth and consists of a symmetrical building with an iwan (arch-shaped doorway) topped by a large dome and finial.`,
        culture: `The Taj Mahal represents the pinnacle of Mughal art and architecture. It symbolizes eternal love and is considered a jewel of Muslim art in India. The monument attracts millions of visitors annually and has been a UNESCO World Heritage Site since 1983.`,
        facts: [
            'It took 22 years and 20,000 workers to complete',
            'The color appears to change throughout the day due to the marble',
            'It costs about 32 million rupees to build (equivalent to $1 billion today)',
            'The four minarets lean slightly outward to prevent collapse during earthquakes'
        ],
        narration: 'Welcome to the magnificent Taj Mahal, one of the Seven Wonders of the World. Built by Emperor Shah Jahan as a symbol of eternal love for his wife Mumtaz Mahal, this architectural marvel took 22 years to complete and employed over 20,000 skilled craftsmen from across the empire.'
    },
    'konark': {
        name: 'Konark Sun Temple',
        location: 'Konark, Odisha',
        model: 'konark-model',
        history: `The Konark Sun Temple was built in the 13th century CE by King Narasimhadeva I of the Eastern Ganga Dynasty. Dedicated to the Hindu sun god Surya, it was conceived as a gigantic chariot with elaborately carved stone wheels, pillars, and walls.`,
        architecture: `The temple is designed in the shape of a colossal chariot with 24 wheels, each about 10 feet in diameter, pulled by seven spirited horses. The temple is built from Khondalite rocks and features intricate carvings depicting various aspects of life, including erotic sculptures, animals, and mythical creatures.`,
        culture: `The temple represents the pinnacle of Kalinga architecture and is dedicated to Surya, the sun god. It served as a major pilgrimage center and was known as the 'Black Pagoda' by European sailors. The temple's design reflects the ancient Indian understanding of astronomy and time.`,
        facts: [
            'The temple was designed as a 100-foot high chariot with 24 wheels',
            'Each wheel serves as a sundial, accurately measuring time',
            'The seven horses represent the seven days of the week',
            'The temple is aligned to catch the first rays of sunrise'
        ],
        narration: 'Behold the magnificent Konark Sun Temple, a 13th-century architectural marvel dedicated to Surya, the sun god. This UNESCO World Heritage Site is designed as a colossal chariot with 24 intricately carved wheels, each serving as a functional sundial.'
    },
    'khajuraho': {
        name: 'Khajuraho Temples',
        location: 'Khajuraho, Madhya Pradesh',
        model: 'khajuraho-model',
        history: `The Khajuraho temples were built between 950 and 1050 CE by the Chandela dynasty. Originally, there were 85 temples, but only 25 survive today. These temples represent the pinnacle of Indian architectural achievement and artistic expression.`,
        architecture: `The temples are built in the Nagara style of architecture, characterized by their towering spires (shikharas) and intricate sculptural decorations. The temples are famous for their erotic sculptures, which represent only 10% of the total carvings, alongside depictions of gods, goddesses, musicians, and dancers.`,
        culture: `The temples reflect the liberal and sophisticated culture of medieval India. They celebrate human emotions and the divine in equal measure. The erotic sculptures are believed to represent the tantric traditions and the celebration of life in all its forms.`,
        facts: [
            'Only 25 of the original 85 temples survive today',
            'The temples have no foundation and are held together by interlocking stones',
            'Erotic sculptures make up only 10% of all carvings',
            'The temples were lost to the world for centuries, hidden by dense forests'
        ],
        narration: 'Welcome to Khajuraho, home to some of India\'s most exquisite temple architecture. Built by the Chandela dynasty between 950-1050 CE, these temples showcase the pinnacle of medieval Indian art, featuring intricate sculptures that celebrate both the divine and human experience.'
    },
    'ajanta': {
        name: 'Ajanta Caves',
        location: 'Aurangabad, Maharashtra',
        model: 'ajanta-model',
        history: `The Ajanta Caves are a series of 30 rock-cut Buddhist cave monuments dating from the 2nd century BCE to about 480 CE. They were carved into the volcanic lava of the Deccan in the Sahyadri hills and represent the golden age of Indian art.`,
        architecture: `The caves are carved into a horseshoe-shaped cliff and consist of monasteries (viharas) and worship halls (chaityas). The caves feature elaborate facades, intricate sculptures, and world-famous paintings depicting the life of Buddha and Jataka tales.`,
        culture: `The Ajanta Caves represent the zenith of ancient Indian art and Buddhism. The paintings and sculptures provide insights into the religious, social, and cultural life of ancient India. They showcase the synthesis of architecture, sculpture, and painting.`,
        facts: [
            'The caves were abandoned around 650 CE and forgotten for over 1000 years',
            'They were rediscovered in 1819 by a British officer during a hunting expedition',
            'The paintings use natural pigments and have survived for over 1500 years',
            'Cave 26 contains the famous reclining Buddha sculpture'
        ],
        narration: 'Discover the ancient Ajanta Caves, a masterpiece of Buddhist art carved into volcanic rock over 2000 years ago. These 30 caves contain some of the finest examples of ancient Indian painting and sculpture, depicting the life of Buddha and various Jataka tales.'
    },
    'sanchi': {
        name: 'Sanchi Stupa',
        location: 'Sanchi, Madhya Pradesh',
        model: 'sanchi-model',
        history: `The Great Stupa at Sanchi was originally built by Emperor Ashoka in the 3rd century BCE. It was later enlarged and decorated with gateways and railings. The stupa is one of the oldest stone structures in India and a major Buddhist pilgrimage site.`,
        architecture: `The Great Stupa is a hemispherical dome (anda) representing the cosmic mountain. It is surrounded by a stone railing (vedika) with four ornately carved gateways (toranas) depicting scenes from Buddha's life and Jataka tales. The structure is topped with a square platform (harmika) and a triple umbrella (chattra).`,
        culture: `Sanchi represents the birthplace of Buddhist architecture in India. The stupa contains relics of Buddha's disciples and serves as a symbol of Buddha's parinirvana (final liberation). It played a crucial role in the spread of Buddhism across Asia.`,
        facts: [
            'Built by Emperor Ashoka in the 3rd century BCE',
            'The stupa contains relics of Buddha\'s chief disciples',
            'The four gateways were added in the 1st century BCE',
            'It survived because it was located in a remote area'
        ],
        narration: 'Welcome to the ancient Sanchi Stupa, one of the oldest stone structures in India. Built by Emperor Ashoka in the 3rd century BCE, this hemispherical dome represents the cosmic mountain and serves as a sacred Buddhist monument containing relics of the Buddha\'s disciples.'
    }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Explore page loaded');
    initializeExplore();
});

function initializeExplore() {
    // Set up event listeners for left panel buttons
    setupEventListeners();
    
    // Initialize model switcher
    setupModelSwitcher();
    
    // Initialize info panel tabs
    setupInfoTabs();
    
    // Show initial info for Taj Mahal
    updateInfoPanel('taj-mahal');
    
    console.log('Explore app initialized');
}

// ===== SETUP EVENT LISTENERS =====
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // AR Controls
    const toggleAR = document.getElementById('toggleAR');
    const resetView = document.getElementById('resetView');
    const fullscreen = document.getElementById('fullscreen');
    
    if (toggleAR) {
        toggleAR.addEventListener('click', toggleARMode);
        console.log('AR button listener added');
    }
    
    if (resetView) {
        resetView.addEventListener('click', resetSketchfabView);
        console.log('Reset view button listener added');
    }
    
    if (fullscreen) {
        fullscreen.addEventListener('click', toggleFullscreen);
        console.log('Fullscreen button listener added');
    }
    
    // Audio Guide
    const playNarration = document.getElementById('playNarration');
    const pauseNarration = document.getElementById('pauseNarration');
    const volumeSlider = document.getElementById('volumeSlider');
    
    if (playNarration) {
        playNarration.addEventListener('click', playAudioNarration);
        console.log('Play narration button listener added');
    }
    
    if (pauseNarration) {
        pauseNarration.addEventListener('click', pauseAudioNarration);
        console.log('Pause narration button listener added');
    }
    
    if (volumeSlider) {
        volumeSlider.addEventListener('input', adjustVolume);
        console.log('Volume slider listener added');
    }
    
    // View Options
    const dayMode = document.getElementById('dayMode');
    const nightMode = document.getElementById('nightMode');
    const historicalMode = document.getElementById('historicalMode');
    
    if (dayMode) {
        dayMode.addEventListener('click', () => setViewMode('day'));
        console.log('Day mode button listener added');
    }
    
    if (nightMode) {
        nightMode.addEventListener('click', () => setViewMode('night'));
        console.log('Night mode button listener added');
    }
    
    if (historicalMode) {
        historicalMode.addEventListener('click', () => setViewMode('historical'));
        console.log('Historical mode button listener added');
    }
    
    // Info Panel
    const closeInfo = document.getElementById('closeInfo');
    if (closeInfo) {
        closeInfo.addEventListener('click', closeInfoPanel);
        console.log('Close info button listener added');
    }
}

// ===== MODEL SWITCHER =====
function setupModelSwitcher() {
    console.log('Setting up model switcher...');
    const modelButtons = document.querySelectorAll('.model-btn');
    
    console.log('Found model buttons:', modelButtons.length);
    
    modelButtons.forEach(button => {
        const modelId = button.getAttribute('data-model');
        console.log(`Adding listener for model: ${modelId}`);
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`Model button clicked: ${modelId}`);
            
            // Update active button
            modelButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Switch model
            switchModel(modelId);
        });
    });
}

function switchModel(modelId) {
    console.log(`Switching to model: ${modelId}`);
    currentSite = modelId;
    
    // Hide all models
    const allWrappers = document.querySelectorAll('.sketchfab-embed-wrapper');
    allWrappers.forEach(wrapper => {
        wrapper.classList.remove('active');
        wrapper.style.display = 'none';
    });
    
    // Show target model
    const targetWrapper = document.getElementById(`${modelId}-model`);
    if (targetWrapper) {
        targetWrapper.classList.add('active');
        targetWrapper.style.display = 'block';
        console.log(`Successfully switched to: ${modelId}`);
        
        // Update info panel
        updateInfoPanel(modelId);
    } else {
        console.error(`Model wrapper not found: ${modelId}-model`);
    }
}

// ===== LEFT PANEL BUTTON FUNCTIONS =====

// 1. AR Mode Function
function toggleARMode() {
    console.log('AR Mode button clicked');
    
    const button = document.getElementById('toggleAR');
    const modelViewer = document.querySelector('.model-viewer');
    
    if (!isARMode) {
        // Enter AR Mode
        isARMode = true;
        
        // Update button text and icon
        button.innerHTML = '<i class="fas fa-times btn-icon"></i> Exit AR Mode';
        button.classList.add('active');
        
        // For Sketchfab models, we need to use their AR functionality
        // Try to activate AR on the current iframe
        const activeIframe = document.querySelector('.sketchfab-embed-wrapper.active iframe');
        if (activeIframe && activeIframe.contentWindow) {
            try {
                // This is a simplified approach - actual AR would require more complex handling
                activeIframe.style.border = '3px solid #4CAF50';
                
                // Show AR instructions
                showNotification('AR Mode Activated! View the model in AR by clicking the AR button in the 3D viewer.');
            } catch (error) {
                console.log('AR activation error:', error);
                showNotification('To use AR, click the AR button in the 3D viewer toolbar.');
            }
        }
        
        // Add AR mode styling
        if (modelViewer) {
            modelViewer.classList.add('ar-mode-active');
        }
        
    } else {
        // Exit AR Mode
        isARMode = false;
        
        // Update button text and icon
        button.innerHTML = '<i class="fas fa-mobile-alt btn-icon"></i> Enter AR Mode';
        button.classList.remove('active');
        
        // Remove AR styling
        const activeIframe = document.querySelector('.sketchfab-embed-wrapper.active iframe');
        if (activeIframe) {
            activeIframe.style.border = 'none';
        }
        
        if (modelViewer) {
            modelViewer.classList.remove('ar-mode-active');
        }
        
        showNotification('AR Mode Deactivated');
    }
}

// 2. Reset View Function
function resetSketchfabView() {
    console.log('Reset View button clicked');
    
    const activeIframe = document.querySelector('.sketchfab-embed-wrapper.active iframe');
    
    if (activeIframe && activeIframe.contentWindow) {
        try {
            // For Sketchfab iframes, we can try to send a postMessage
            // This assumes the Sketchfab viewer supports certain messages
            activeIframe.contentWindow.postMessage({
                type: 'viewer:reset'
            }, '*');
            
            // Alternative: trigger spacebar key event (which often resets view in Sketchfab)
            const event = new KeyboardEvent('keydown', {
                key: ' ',
                keyCode: 32,
                which: 32,
                code: 'Space',
                bubbles: true
            });
            activeIframe.dispatchEvent(event);
            
            showNotification('View reset to default position');
        } catch (error) {
            console.log('Reset view error:', error);
            showNotification('Click on the 3D model and press SPACE to reset view');
        }
    } else {
        showNotification('Please select a 3D model first');
    }
}

// 3. Fullscreen Function
function toggleFullscreen() {
    console.log('Fullscreen button clicked');
    
    const modelViewer = document.querySelector('.model-viewer');
    const button = document.getElementById('fullscreen');
    
    if (!document.fullscreenElement) {
        // Enter fullscreen
        if (modelViewer.requestFullscreen) {
            modelViewer.requestFullscreen();
        } else if (modelViewer.webkitRequestFullscreen) {
            modelViewer.webkitRequestFullscreen();
        } else if (modelViewer.msRequestFullscreen) {
            modelViewer.msRequestFullscreen();
        }
        
        button.innerHTML = '<i class="fas fa-compress btn-icon"></i> Exit Fullscreen';
        button.classList.add('active');
        
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        
        button.innerHTML = '<i class="fas fa-expand btn-icon"></i> Fullscreen';
        button.classList.remove('active');
    }
}

// 4. Audio Functions
function playAudioNarration() {
    console.log('Play Narration button clicked');
    
    const site = heritageSites[currentSite];
    if (!site || !site.narration) {
        showNotification('No narration available for this monument');
        return;
    }
    
    const playBtn = document.getElementById('playNarration');
    const pauseBtn = document.getElementById('pauseNarration');
    
    // Check if Speech Synthesis is supported
    if ('speechSynthesis' in window) {
        // Stop any current speech
        window.speechSynthesis.cancel();
        
        // Create new speech utterance
        const utterance = new SpeechSynthesisUtterance(site.narration);
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1;
        utterance.volume = document.getElementById('volumeSlider').value / 100;
        
        // Set up event handlers
        utterance.onstart = function() {
            isNarrationPlaying = true;
            playBtn.disabled = true;
            pauseBtn.disabled = false;
            showNotification(`Playing narration: ${site.name}`);
        };
        
        utterance.onend = function() {
            isNarrationPlaying = false;
            playBtn.disabled = false;
            pauseBtn.disabled = true;
        };
        
        utterance.onerror = function() {
            isNarrationPlaying = false;
            playBtn.disabled = false;
            pauseBtn.disabled = true;
            showNotification('Error playing narration');
        };
        
        // Start speech
        window.speechSynthesis.speak(utterance);
        
    } else {
        // Fallback: Show text in notification
        showNotification(`Narration: ${site.narration.substring(0, 100)}...`);
        playBtn.disabled = true;
        pauseBtn.disabled = false;
        setTimeout(() => {
            playBtn.disabled = false;
            pauseBtn.disabled = true;
        }, 3000);
    }
}

function pauseAudioNarration() {
    console.log('Pause Narration button clicked');
    
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        isNarrationPlaying = false;
        
        const playBtn = document.getElementById('playNarration');
        const pauseBtn = document.getElementById('pauseNarration');
        
        playBtn.disabled = false;
        pauseBtn.disabled = true;
        
        showNotification('Narration paused');
    }
}

function adjustVolume(event) {
    const volume = event.target.value / 100;
    console.log('Volume adjusted to:', volume);
    
    // If speech synthesis is active, update volume
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
        // Note: Changing volume mid-speech isn't directly supported
        // We'd need to stop and restart with new volume
    }
    
    showNotification(`Volume: ${event.target.value}%`);
}

// 5. View Mode Functions
function setViewMode(mode) {
    console.log(`Setting view mode to: ${mode}`);
    currentViewMode = mode;
    
    // Update button states
    const dayBtn = document.getElementById('dayMode');
    const nightBtn = document.getElementById('nightMode');
    const historicalBtn = document.getElementById('historicalMode');
    
    [dayBtn, nightBtn, historicalBtn].forEach(btn => btn.classList.remove('active'));
    
    switch(mode) {
        case 'day':
            dayBtn.classList.add('active');
            showNotification('Day view activated');
            break;
        case 'night':
            nightBtn.classList.add('active');
            showNotification('Night view activated');
            break;
        case 'historical':
            historicalBtn.classList.add('active');
            showNotification('Historical view activated');
            break;
    }
    
    // For Sketchfab models, we can't directly change lighting
    // This would require a more complex integration
    // For now, we just show a notification
}

// ===== INFO PANEL FUNCTIONS =====
function setupInfoTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
}

function updateInfoPanel(modelId) {
    const site = heritageSites[modelId];
    if (!site) return;
    
    // Update monument name
    const monumentName = document.getElementById('monumentName');
    if (monumentName) {
        monumentName.textContent = site.name;
    }
    
    // Update tab content
    const historyTab = document.getElementById('history');
    const architectureTab = document.getElementById('architecture');
    const cultureTab = document.getElementById('culture');
    const factsTab = document.getElementById('facts');
    
    if (historyTab) {
        historyTab.innerHTML = `
            <h4>Historical Background</h4>
            <p>${site.history}</p>
        `;
    }
    
    if (architectureTab) {
        architectureTab.innerHTML = `
            <h4>Architectural Features</h4>
            <p>${site.architecture}</p>
        `;
    }
    
    if (cultureTab) {
        cultureTab.innerHTML = `
            <h4>Cultural Significance</h4>
            <p>${site.culture}</p>
        `;
    }
    
    if (factsTab) {
        const factsList = site.facts.map(fact => `<li>${fact}</li>`).join('');
        factsTab.innerHTML = `
            <h4>Interesting Facts</h4>
            <ul>${factsList}</ul>
        `;
    }
    
    // Show info panel if hidden
    const infoPanel = document.getElementById('infoPanel');
    if (infoPanel) {
        infoPanel.style.display = 'block';
    }
}

function switchTab(tabName) {
    console.log(`Switching to tab: ${tabName}`);
    
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update tab content
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach(pane => {
        if (pane.id === tabName) {
            pane.classList.add('active');
            pane.style.display = 'block';
        } else {
            pane.classList.remove('active');
            pane.style.display = 'none';
        }
    });
}

function closeInfoPanel() {
    console.log('Closing info panel');
    const infoPanel = document.getElementById('infoPanel');
    if (infoPanel) {
        infoPanel.style.display = 'none';
    }
}

// ===== UTILITY FUNCTIONS =====
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: fadeInOut 3s forwards;
    `;
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-10px); }
            15% { opacity: 1; transform: translateY(0); }
            85% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); display: none; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after animation
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(event) {
    // Space bar to reset view
    if (event.code === 'Space' && !event.target.matches('input, textarea')) {
        event.preventDefault();
        resetSketchfabView();
    }
    
    // F for fullscreen
    if (event.code === 'KeyF' && !event.target.matches('input, textarea')) {
        event.preventDefault();
        toggleFullscreen();
    }
    
    // Number keys 1-5 for model switching
    if (event.key >= '1' && event.key <= '5') {
        const modelIndex = parseInt(event.key) - 1;
        const modelButtons = document.querySelectorAll('.model-btn');
        if (modelButtons[modelIndex]) {
            event.preventDefault();
            modelButtons[modelIndex].click();
        }
    }
});

// ===== EXPORT FOR GLOBAL ACCESS =====
window.ExploreApp = {
    switchModel: switchModel,
    toggleARMode: toggleARMode,
    playAudioNarration: playAudioNarration,
    pauseAudioNarration: pauseAudioNarration,
    resetSketchfabView: resetSketchfabView,
    toggleFullscreen: toggleFullscreen,
    setViewMode: setViewMode,
    showInfoPanel: function() {
        const infoPanel = document.getElementById('infoPanel');
        if (infoPanel) {
            infoPanel.style.display = 'block';
        }
    },
    closeInfoPanel: closeInfoPanel,
    updateInfoPanel: updateInfoPanel
};