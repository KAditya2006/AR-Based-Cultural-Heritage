/**
 * Explore Page JavaScript - AR Heritage Platform
 * Handles 3D/AR viewer, site selection, audio narration, and interactive features
 */

// ===== GLOBAL VARIABLES =====
let currentSite = null;
let arScene = null;
let modelContainer = null;
let currentModel = null;
let speechSynthesis = null;
let currentUtterance = null;
let isNarrationPlaying = false;
let isARMode = false;

// Heritage site data
const heritageSites = {
    'taj-mahal': {
        name: 'Taj Mahal',
        location: 'Agra, Uttar Pradesh',
        model: 'taj-mahal-model',
        position: '0 -1 -5',
        scale: '0.5 0.5 0.5',
        rotation: '0 0 0',
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
        position: '0 -1 -5',
        scale: '0.8 0.8 0.8',
        rotation: '0 45 0',
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
        position: '0 -1 -5',
        scale: '0.6 0.6 0.6',
        rotation: '0 30 0',
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
        position: '0 -1 -5',
        scale: '1 1 1',
        rotation: '0 0 0',
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
        position: '0 -1 -5',
        scale: '0.7 0.7 0.7',
        rotation: '0 0 0',
        history: `The Great Stupa at Sanchi was originally built by Emperor Ashoka in the 3rd century BCE. It was later enlarged and decorated with gateways and railings. The stupa is one of the oldest stone structures in India and a major Buddhist pilgrimage site.`,
        architecture: `The Great Stupa is a hemispherical dome (anda) representing the cosmic mountain. It is surrounded by a stone railing (vedika) with four ornately carved gateways (toranas) depicting scenes from Buddha's life and Jataka tales. The structure is topped with a square platform (harmika) and a triple umbrella (chattra).`,
        culture: `Sanchi represents the birthplace of Buddhist architecture in India. The stupa contains relics of Buddha's disciples and serves as a symbol of Buddha's parinirvana (final liberation). It played a crucial role in the spread of Buddhism across Asia.`,
        facts: [
            'Built by Emperor Ashoka in the 3rd century BCE',
            'The stupa contains relics of Buddha\'s chief disciples',
            'The four gateways were added in the 1st century BCE',
            'It survived because it was located in a remote area'
        ],
    }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeExplore();
});

function initializeExplore() {
    // Set up event listeners
    setupEventListeners();
    
    // Set up model switcher
    setupModelSwitcher();
    
    // Initialize A-Frame scene
    initializeAFrameScene();
    
    // Check for URL parameters
    checkUrlParameters();
    
    // Hide loading screen after scene is ready
    setTimeout(() => {
        hideLoadingScreen();
    }, 2000);
}

function setupEventListeners() {
    // Site selector
    const siteSelector = document.getElementById('siteSelector');
    siteSelector.addEventListener('change', handleSiteSelection);
    
    // Control buttons
    document.getElementById('toggleAR').addEventListener('click', toggleARMode);
    document.getElementById('resetView').addEventListener('click', resetView);
    document.getElementById('fullscreen').addEventListener('click', toggleFullscreen);
    
    // Audio controls
    document.getElementById('playNarration').addEventListener('click', playNarration);
    document.getElementById('pauseNarration').addEventListener('click', pauseNarration);
    document.getElementById('volumeSlider').addEventListener('input', adjustVolume);
    
    // View mode buttons
    document.getElementById('dayMode').addEventListener('click', () => setViewMode('day'));
    document.getElementById('nightMode').addEventListener('click', () => setViewMode('night'));
    document.getElementById('historicalMode').addEventListener('click', () => setViewMode('historical'));
    
    // Info panel
    document.getElementById('closeInfo').addEventListener('click', closeInfoPanel);
    
    // Tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // AR overlay
    document.getElementById('exitAR').addEventListener('click', exitARMode);
}

function initializeAFrameScene() {
    if (arScene) {
        arScene.addEventListener('loaded', function() {
            console.log('A-Frame scene loaded');
            // Scene is ready for interaction
        });
        
        // Add click handlers for models
        arScene.addEventListener('click', function(event) {
            if (event.detail.target && event.detail.target.id === 'modelContainer') {
                showInfoPanel();
            }
        });
    }
}

// ===== SITE SELECTION =====
function handleSiteSelection(event) {
    const selectedSite = event.target.value;
    if (selectedSite && heritageSites[selectedSite]) {
        loadHeritageSite(selectedSite);
    } else {
        clearModel();
    }
}

function loadHeritageSite(siteKey) {
    const site = heritageSites[siteKey];
    if (!site) return;
    
    currentSite = siteKey;
    showLoadingScreen();
    
    // Clear existing model
    clearModel();
    
    // Load new model
    setTimeout(() => {
        loadModel(site);
        updateInfoPanel(site);
        hideLoadingScreen();
        showInfoPanel();
    }, 1000);
}

function loadModel(site) {
    if (!modelContainer) return;
    
    // Create new model entity
    const modelEntity = document.createElement('a-gltf-model');
    modelEntity.setAttribute('src', `#${site.model}`);
    modelEntity.setAttribute('position', site.position);
    modelEntity.setAttribute('scale', site.scale);
    modelEntity.setAttribute('rotation', site.rotation);
    modelEntity.setAttribute('animation-mixer', 'clip: *; loop: repeat');
    modelEntity.setAttribute('shadow', 'cast: true; receive: true');
    
    // Add interaction
    modelEntity.setAttribute('cursor-listener', '');
    modelEntity.setAttribute('class', 'clickable');
    
    // Add to container
    modelContainer.appendChild(modelEntity);
    currentModel = modelEntity;
    
    // Add hotspots
    addHotspots(site);
}

function clearModel() {
    if (modelContainer) {
        while (modelContainer.firstChild) {
            modelContainer.removeChild(modelContainer.firstChild);
        }
    }
    currentModel = null;
    clearHotspots();
}

function addHotspots(site) {
    const hotspotsContainer = document.querySelector('#hotspots');
    if (!hotspotsContainer) return;
    
    // Clear existing hotspots
    clearHotspots();
    
    // Add sample hotspots based on site
    const hotspotPositions = getHotspotPositions(site);
    
    hotspotPositions.forEach((pos, index) => {
        const hotspot = document.createElement('a-sphere');
        hotspot.setAttribute('position', pos.position);
        hotspot.setAttribute('radius', '0.1');
        hotspot.setAttribute('color', '#FF9933');
        hotspot.setAttribute('opacity', '0.8');
        hotspot.setAttribute('animation', 'property: scale; to: 1.2 1.2 1.2; dir: alternate; dur: 1000; loop: true');
        hotspot.setAttribute('cursor-listener', '');
        hotspot.setAttribute('class', 'hotspot');
        hotspot.setAttribute('data-info', pos.info);
        
        hotspotsContainer.appendChild(hotspot);
    });
}

function getHotspotPositions(site) {
    // Return different hotspot positions based on the site
    const positions = {
        'taj-mahal': [
            { position: '0 2 -5', info: 'Main Dome - 73 meters high' },
            { position: '-2 0 -5', info: 'Minaret - Leaning outward for earthquake protection' },
            { position: '2 0 -5', info: 'Pietra Dura - Intricate inlay work' }
        ],
        'konark': [
            { position: '1 0 -5', info: 'Chariot Wheel - Functional sundial' },
            { position: '-1 1 -5', info: 'Horse Sculpture - Seven horses for seven days' },
            { position: '0 2 -5', info: 'Main Sanctum - Dedicated to Surya' }
        ],
        'khajuraho': [
            { position: '0 2 -5', info: 'Shikhara - Towering spire' },
            { position: '1 1 -5', info: 'Sculptural Art - Divine and human forms' },
            { position: '-1 0 -5', info: 'Temple Base - Interlocking stone construction' }
        ],
        'ajanta': [
            { position: '0 1 -5', info: 'Cave Paintings - 1500-year-old frescoes' },
            { position: '2 0 -5', info: 'Chaitya Hall - Buddhist worship hall' },
            { position: '-2 0 -5', info: 'Vihara - Monastery for monks' }
        ],
        'sanchi': [
            { position: '0 2 -5', info: 'Stupa Dome - Cosmic mountain symbol' },
            { position: '1 0 -5', info: 'Torana Gateway - Carved with Jataka tales' },
            { position: '0 0 -3', info: 'Harmika - Square platform with relics' }
        ]
    };
    
    return positions[currentSite] || [];
}

function clearHotspots() {
    const hotspotsContainer = document.querySelector('#hotspots');
    if (hotspotsContainer) {
        while (hotspotsContainer.firstChild) {
            hotspotsContainer.removeChild(hotspotsContainer.firstChild);
        }
    }
}

// ===== AR FUNCTIONALITY =====
function toggleARMode() {
    if (!isARMode) {
        enterARMode();
    } else {
        exitARMode();
    }
}

function enterARMode() {
    if (!arScene) return;
    
    // Check for WebXR support
    if (navigator.xr) {
        navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
            if (supported) {
                startARSession();
            } else {
                showARFallback();
            }
        });
    } else {
        showARFallback();
    }
}

function startARSession() {
    isARMode = true;
    document.getElementById('arOverlay').classList.remove('hidden');
    document.getElementById('toggleAR').innerHTML = '<span class="btn-icon">📱</span> Exit AR Mode';
    
    // Enable AR mode in A-Frame
    arScene.setAttribute('vr-mode-ui', 'enabled: true');
    arScene.setAttribute('device-orientation-permission-ui', 'enabled: true');
}

function showARFallback() {
    alert('AR mode is not supported on this device. Please use a mobile device with AR capabilities.');
}

function exitARMode() {
    isARMode = false;
    document.getElementById('arOverlay').classList.add('hidden');
    document.getElementById('toggleAR').innerHTML = '<span class="btn-icon">📱</span> Enter AR Mode';
    
    // Disable AR mode in A-Frame
    arScene.setAttribute('vr-mode-ui', 'enabled: false');
}

// ===== VIEW CONTROLS =====
function resetView() {
    const camera = document.querySelector('#camera');
    if (camera) {
        camera.setAttribute('position', '0 1.6 3');
        camera.setAttribute('rotation', '0 0 0');
    }
    
    if (currentModel) {
        currentModel.setAttribute('rotation', heritageSites[currentSite].rotation);
    }
}

function toggleFullscreen() {
    const viewer = document.querySelector('.ar-viewer');
    
    if (!document.fullscreenElement) {
        viewer.requestFullscreen().catch(err => {
            console.log('Error attempting to enable fullscreen:', err);
        });
        document.getElementById('fullscreen').innerHTML = '<span class="btn-icon">⛶</span> Exit Fullscreen';
    } else {
        document.exitFullscreen();
        document.getElementById('fullscreen').innerHTML = '<span class="btn-icon">⛶</span> Fullscreen';
    }
}

function setViewMode(mode) {
    const sky = document.querySelector('#sceneSky');
    const sunLight = document.querySelector('#sunLight');
    
    // Update button states
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${mode}Mode`).classList.add('active');
    
    switch (mode) {
        case 'day':
            sky.setAttribute('src', '#sky-day');
            sunLight.setAttribute('intensity', '1');
            sunLight.setAttribute('color', '#FFF');
            break;
        case 'night':
            sky.setAttribute('src', '#sky-night');
            sunLight.setAttribute('intensity', '0.3');
            sunLight.setAttribute('color', '#4A90E2');
            break;
        case 'historical':
            sky.setAttribute('color', '#8B4513');
            sunLight.setAttribute('intensity', '0.7');
            sunLight.setAttribute('color', '#FFD700');
            break;
    }
}

// ===== AUDIO NARRATION =====
function playNarration() {
    if (!speechSynthesis || !currentSite) return;
    
    const site = heritageSites[currentSite];
    if (!site.narration) return;
    
    // Stop any existing narration
    if (isNarrationPlaying) {
        speechSynthesis.cancel();
    }
    
    // Create new utterance
    currentUtterance = new SpeechSynthesisUtterance(site.narration);
    currentUtterance.rate = 0.8;
    currentUtterance.pitch = 1;
    currentUtterance.volume = document.getElementById('volumeSlider').value / 100;
    
    // Set up event listeners
    currentUtterance.onstart = function() {
        isNarrationPlaying = true;
        document.getElementById('playNarration').disabled = true;
        document.getElementById('pauseNarration').disabled = false;
    };
    
    currentUtterance.onend = function() {
        isNarrationPlaying = false;
        document.getElementById('playNarration').disabled = false;
        document.getElementById('pauseNarration').disabled = true;
    };
    
    // Start narration
    speechSynthesis.speak(currentUtterance);
}

function pauseNarration() {
    if (speechSynthesis && isNarrationPlaying) {
        speechSynthesis.cancel();
        isNarrationPlaying = false;
        document.getElementById('playNarration').disabled = false;
        document.getElementById('pauseNarration').disabled = true;
    }
}

function adjustVolume(event) {
    const volume = event.target.value / 100;
    if (currentUtterance) {
        currentUtterance.volume = volume;
    }
}

// ===== INFO PANEL =====
function updateInfoPanel(site) {
    document.getElementById('monumentName').textContent = site.name;
    
    // Update tab content
    document.getElementById('history').innerHTML = `
        <h4>Historical Background</h4>
        <p>${site.history}</p>
    `;
    
    document.getElementById('architecture').innerHTML = `
        <h4>Architectural Features</h4>
        <p>${site.architecture}</p>
    `;
    
    document.getElementById('culture').innerHTML = `
        <h4>Cultural Significance</h4>
        <p>${site.culture}</p>
    `;
    
    document.getElementById('facts').innerHTML = `
        <h4>Interesting Facts</h4>
        <ul>
            ${site.facts.map(fact => `<li>${fact}</li>`).join('')}
        </ul>
    `;
}

function showInfoPanel() {
    document.getElementById('infoPanel').classList.add('active');
}

function closeInfoPanel() {
    document.getElementById('infoPanel').classList.remove('active');
}

function switchTab(tabName) {
    // Update button states
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update content
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
}

// ===== UTILITY FUNCTIONS =====
function showLoadingScreen() {
    document.getElementById('loadingScreen').classList.remove('hidden');
}

function hideLoadingScreen() {
    document.getElementById('loadingScreen').classList.add('hidden');
}

function checkUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const site = urlParams.get('site');
    
    if (site && heritageSites[site]) {
        document.getElementById('siteSelector').value = site;
        loadHeritageSite(site);
    }
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('Explore page error:', e.error);
    hideLoadingScreen();
});

// ===== CLEANUP =====
window.addEventListener('beforeunload', function() {
    if (speechSynthesis && isNarrationPlaying) {
        speechSynthesis.cancel();
    }
});

// ===== MODEL SWITCHER =====
function setupModelSwitcher() {
    console.log('Setting up model switcher...');
    const modelButtons = document.querySelectorAll('.model-btn');
    const modelWrappers = document.querySelectorAll('.sketchfab-embed-wrapper');
    
    console.log('Found buttons:', modelButtons.length);
    console.log('Found wrappers:', modelWrappers.length);
    
    modelButtons.forEach((button, index) => {
        console.log(`Button ${index}:`, button.getAttribute('data-model'));
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetModel = this.getAttribute('data-model');
            console.log('Clicked model:', targetModel);
            
            // Remove active class from all buttons
            modelButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all model wrappers
            modelWrappers.forEach(wrapper => {
                wrapper.classList.remove('active');
                console.log('Hiding wrapper:', wrapper.id);
            });
            
            // Show target model wrapper
            const targetWrapper = document.getElementById(`${targetModel}-model`);
            console.log('Target wrapper:', targetWrapper);
            if (targetWrapper) {
                targetWrapper.classList.add('active');
                console.log('Showing wrapper:', targetWrapper.id);
            } else {
                console.error('Target wrapper not found:', `${targetModel}-model`);
            }
            
            // Update monument name in info panel
            const monumentName = document.getElementById('monumentName');
            if (monumentName) {
                let siteName;
                switch(targetModel) {
                    case 'taj-mahal':
                        siteName = 'Taj Mahal';
                        break;
                    case 'konark':
                        siteName = 'Konark Sun Temple';
                        break;
                    case 'khajuraho':
                        siteName = 'Khajuraho Temple';
                        break;
                    case 'ajanta':
                        siteName = 'Ajanta Caves';
                        break;
                    case 'sanchi':
                        siteName = 'Sanchi Stupa';
                        break;
                    default:
                        siteName = 'Select a Monument';
                }
                monumentName.textContent = siteName;
            }
        });
    });
}

// ===== SIMPLE MODEL SWITCHER FOR TESTING =====
function switchModel(modelName) {
    console.log('Switching to model:', modelName);
    
    // Hide all models
    const allWrappers = document.querySelectorAll('.sketchfab-embed-wrapper');
    allWrappers.forEach(wrapper => {
        wrapper.classList.remove('active');
    });
    
    // Show target model
    const targetWrapper = document.getElementById(`${modelName}-model`);
    if (targetWrapper) {
        targetWrapper.classList.add('active');
        console.log('Successfully switched to:', modelName);
    } else {
        console.error('Model not found:', modelName);
    }
    
    // Update buttons
    const allButtons = document.querySelectorAll('.model-btn');
    allButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-model') === modelName) {
            btn.classList.add('active');
        }
    });
}

// ===== EXPORT FOR GLOBAL ACCESS =====
window.ExploreApp = {
    loadHeritageSite,
    toggleARMode,
    playNarration,
    pauseNarration,
    showInfoPanel,
    closeInfoPanel,
    switchModel,
    setupModelSwitcher
};
