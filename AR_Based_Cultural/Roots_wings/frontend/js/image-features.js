// Image Analysis Feature for Heritage Assistant

class ImageAnalysisFeature {
    constructor() {
        this.initializeElements();
        this.addNotificationStyles();
        this.initEventListeners();
        this.initSuggestionButtons();
    }
    
    initializeElements() {
        this.imageUpload = document.getElementById('imageUpload');
        this.imageUploadBtn = document.getElementById('imageUploadBtn');
        this.imagePreviewContainer = document.getElementById('imagePreviewContainer');
        this.previewImage = document.getElementById('previewImage');
        this.modalPreviewImage = document.getElementById('modalPreviewImage');
        this.removeImageBtn = document.getElementById('removeImage');
        this.clearImageBtn = document.getElementById('clearImage');
        this.analyzeImageBtn = document.getElementById('analyzeImage');
        this.imageAnalysisModal = document.getElementById('imageAnalysisModal');
        this.closeImageModal = document.getElementById('closeImageModal');
        this.closeModalBtn = document.getElementById('closeModal');
        this.askAboutImageBtn = document.getElementById('askAboutImage');
        this.analysisResults = document.getElementById('analysisResults');
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendMessageBtn = document.getElementById('sendMessage');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.uploadImageSuggestion = document.getElementById('uploadImageSuggestion');
        
        this.currentImage = null;
        this.imageAnalysis = null;
        this.uploadedImageType = null;
    }
    
    addNotificationStyles() {
        // Check if styles are already added
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                    z-index: 1001;
                    animation: notificationSlideIn 0.3s ease;
                    max-width: 400px;
                    color: white;
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 0.25rem;
                    opacity: 0.8;
                    transition: opacity 0.3s ease;
                }
                
                .notification-close:hover {
                    opacity: 1;
                }
                
                .notification.info {
                    background: #2196F3;
                }
                
                .notification.success {
                    background: #4CAF50;
                }
                
                .notification.error {
                    background: #f44336;
                }
                
                .notification.warning {
                    background: #ff9800;
                }
                
                .drag-over {
                    border-color: #6C63FF !important;
                    background-color: rgba(108, 99, 255, 0.1) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    initEventListeners() {
        // Open file input when image button is clicked
        if (this.imageUploadBtn) {
            this.imageUploadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Image upload button clicked');
                this.imageUpload.click();
            });
        }
        
        // Handle file selection
        if (this.imageUpload) {
            this.imageUpload.addEventListener('change', (e) => {
                console.log('File selected');
                if (e.target.files && e.target.files[0]) {
                    this.handleImageUpload(e.target.files[0]);
                }
            });
        }
        
        // Remove image
        if (this.removeImageBtn) {
            this.removeImageBtn.addEventListener('click', () => {
                this.clearImage();
            });
        }
        
        if (this.clearImageBtn) {
            this.clearImageBtn.addEventListener('click', () => {
                this.clearImage();
            });
        }
        
        // Analyze image
        if (this.analyzeImageBtn) {
            this.analyzeImageBtn.addEventListener('click', () => {
                this.analyzeImage();
            });
        }
        
        // Close modal
        if (this.closeImageModal) {
            this.closeImageModal.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        if (this.closeModalBtn) {
            this.closeModalBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        // Ask about image
        if (this.askAboutImageBtn) {
            this.askAboutImageBtn.addEventListener('click', () => {
                this.askAboutImage();
            });
        }
        
        // Allow sending messages with image
        if (this.sendMessageBtn) {
            this.sendMessageBtn.addEventListener('click', () => {
                this.sendMessageWithImage();
            });
        }
        
        // Enter key to send message
        if (this.messageInput) {
            this.messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessageWithImage();
                }
            });
        }
        
        // Add drag and drop support
        this.addDragAndDropSupport();
    }
    
    initSuggestionButtons() {
        // Add click handler for image suggestion button
        if (this.uploadImageSuggestion) {
            this.uploadImageSuggestion.addEventListener('click', (e) => {
                e.preventDefault();
                this.imageUpload.click();
            });
        }
        
        // Handle other suggestion buttons
        const suggestionButtons = document.querySelectorAll('.suggestion-btn:not(.image-suggestion)');
        suggestionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const text = e.target.textContent || e.target.innerText;
                this.messageInput.value = text;
                this.messageInput.focus();
            });
        });
    }
    
    addDragAndDropSupport() {
        // Add drag and drop to the chat input area
        const chatInput = document.querySelector('.chat-input');
        if (chatInput) {
            chatInput.addEventListener('dragover', (e) => {
                e.preventDefault();
                chatInput.classList.add('drag-over');
            });
            
            chatInput.addEventListener('dragleave', () => {
                chatInput.classList.remove('drag-over');
            });
            
            chatInput.addEventListener('drop', (e) => {
                e.preventDefault();
                chatInput.classList.remove('drag-over');
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    const file = files[0];
                    if (file.type.match('image.*')) {
                        this.handleImageUpload(file);
                    } else {
                        this.showError('Please drop an image file only');
                    }
                }
            });
        }
    }
    
    handleImageUpload(file) {
        if (!file) return;
        
        console.log('Image upload started:', file.name, 'Type:', file.type, 'Size:', file.size);
        
        // Check file type
        if (!file.type.match('image.*')) {
            this.showError('Please upload an image file (JPEG, PNG, etc.)');
            return;
        }
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showError('Image size should be less than 5MB');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            console.log('Image loaded successfully');
            
            // Detect image type based on filename or content
            this.uploadedImageType = this.detectImageType(file.name);
            
            this.currentImage = {
                data: e.target.result,
                name: file.name,
                type: file.type,
                size: file.size,
                detectedType: this.uploadedImageType
            };
            
            // Show preview
            this.previewImage.src = this.currentImage.data;
            this.imagePreviewContainer.classList.remove('hidden');
            
            // Update modal preview
            this.modalPreviewImage.src = this.currentImage.data;
            
            // Scroll to preview
            setTimeout(() => {
                this.imagePreviewContainer.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }, 100);
            
            // Show notification
            const heritageName = this.getHeritageName(this.uploadedImageType);
            const message = heritageName !== 'Heritage' 
                ? `Detected ${heritageName}! Image uploaded successfully. Click "Analyze Image" for details.`
                : `Image "${file.name}" uploaded successfully! Click "Analyze Image" to get heritage insights.`;
            
            this.showNotification(message, 'success');
            
            // Auto-analyze if it's a known heritage image
            setTimeout(() => {
                this.autoAnalyzeIfKnownHeritage();
            }, 500);
        };
        
        reader.onerror = (error) => {
            console.error('Error reading image:', error);
            this.showError('Error reading image file. Please try again.');
        };
        
        reader.readAsDataURL(file);
    }
    
    detectImageType(filename) {
        const name = filename.toLowerCase();
        
        if (name.includes('taj') && name.includes('mahal')) {
            return 'tajmahal';
        } else if (name.includes('konark') || (name.includes('sun') && name.includes('temple'))) {
            return 'konark';
        } else if (name.includes('jagannath') || name.includes('puri')) {
            return 'jagannath';
        } else if (name.includes('himalaya') || name.includes('mountain')) {
            return 'himalaya';
        } else if (name.includes('qutub') || name.includes('minar')) {
            return 'qutub';
        } else if (name.includes('red fort') || name.includes('lal qila')) {
            return 'redfort';
        } else if (name.includes('hawa mahal')) {
            return 'hawamahal';
        } else if (name.includes('gateway') && name.includes('india')) {
            return 'gateway';
        } else if (name.includes('lotus') && name.includes('temple')) {
            return 'lotustemple';
        } else if (name.includes('ajanta') || name.includes('ellora')) {
            return 'ajanta';
        } else if (name.includes('hampi')) {
            return 'hampi';
        } else if (name.includes('khajuraho')) {
            return 'khajuraho';
        } else if (name.includes('meenakshi')) {
            return 'meenakshi';
        } else if (name.includes('golden') && name.includes('temple')) {
            return 'goldentemple';
        } else if (name.includes('charminar')) {
            return 'charminar';
        }
        
        return 'unknown';
    }
    
    autoAnalyzeIfKnownHeritage() {
        if (this.uploadedImageType && this.uploadedImageType !== 'unknown') {
            this.showNotification(`Analyzing ${this.getHeritageName(this.uploadedImageType)}...`, 'info');
            setTimeout(() => {
                this.analyzeImage();
            }, 1000);
        }
    }
    
    getHeritageName(type) {
        const names = {
            'tajmahal': 'Taj Mahal',
            'konark': 'Konark Sun Temple',
            'jagannath': 'Jagannath Temple, Puri',
            'himalaya': 'Himalayan Mountains',
            'qutub': 'Qutub Minar',
            'redfort': 'Red Fort',
            'hawamahal': 'Hawa Mahal',
            'gateway': 'Gateway of India',
            'lotustemple': 'Lotus Temple',
            'ajanta': 'Ajanta Caves',
            'hampi': 'Hampi Ruins',
            'khajuraho': 'Khajuraho Temples',
            'meenakshi': 'Meenakshi Temple',
            'goldentemple': 'Golden Temple',
            'charminar': 'Charminar'
        };
        return names[type] || 'Heritage';
    }
    
    clearImage() {
        this.currentImage = null;
        this.uploadedImageType = null;
        if (this.imageUpload) this.imageUpload.value = '';
        this.imagePreviewContainer.classList.add('hidden');
        this.previewImage.src = '';
        this.modalPreviewImage.src = '';
    }
    
    analyzeImage() {
        if (!this.currentImage) {
            this.showError('Please upload an image first');
            return;
        }
        
        // Show modal
        this.imageAnalysisModal.classList.remove('hidden');
        
        // Show loading state
        this.analysisResults.innerHTML = `
            <div class="loading-analysis">
                <div class="spinner"></div>
                <p>Analyzing image for heritage elements...</p>
                ${this.uploadedImageType !== 'unknown' ? `<p>Detected: ${this.getHeritageName(this.uploadedImageType)}</p>` : ''}
            </div>
        `;
        
        // Simulate API call with different analysis based on image type
        setTimeout(() => {
            this.performImageAnalysis();
        }, 2000);
    }
    
    performImageAnalysis() {
        // Get analysis based on detected image type
        let analysis;
        
        switch(this.uploadedImageType) {
            case 'tajmahal':
                analysis = this.getTajMahalAnalysis();
                break;
            case 'konark':
                analysis = this.getKonarkAnalysis();
                break;
            case 'jagannath':
                analysis = this.getJagannathAnalysis();
                break;
            case 'himalaya':
                analysis = this.getHimalayaAnalysis();
                break;
            case 'qutub':
                analysis = this.getQutubAnalysis();
                break;
            case 'redfort':
                analysis = this.getRedFortAnalysis();
                break;
            case 'hawamahal':
                analysis = this.getHawaMahalAnalysis();
                break;
            case 'gateway':
                analysis = this.getGatewayAnalysis();
                break;
            case 'lotustemple':
                analysis = this.getLotusTempleAnalysis();
                break;
            case 'ajanta':
                analysis = this.getAjantaAnalysis();
                break;
            case 'hampi':
                analysis = this.getHampiAnalysis();
                break;
            case 'khajuraho':
                analysis = this.getKhajurahoAnalysis();
                break;
            case 'meenakshi':
                analysis = this.getMeenakshiAnalysis();
                break;
            case 'goldentemple':
                analysis = this.getGoldenTempleAnalysis();
                break;
            case 'charminar':
                analysis = this.getCharminarAnalysis();
                break;
            default:
                analysis = this.getGenericAnalysis();
        }
        
        this.imageAnalysis = analysis;
        this.displayAnalysisResults();
    }
    
    getTajMahalAnalysis() {
        return {
            detectedObjects: [
                { name: 'Mughal Architecture', confidence: 0.98, 
                  description: 'White marble mausoleum with Persian and Indian architectural elements' },
                { name: 'Islamic Calligraphy', confidence: 0.92,
                  description: 'Quranic verses in Arabic calligraphy on the main archways' },
                { name: 'Symmetrical Gardens', confidence: 0.95,
                  description: 'Charbagh style Mughal gardens with reflecting pool' },
                { name: 'Minarets', confidence: 0.96,
                  description: 'Four 40-meter tall minarets flanking the main structure' }
            ],
            heritageType: 'Mughal Mausoleum',
            officialName: 'Taj Mahal',
            location: 'Agra, Uttar Pradesh',
            builtIn: '1632-1653 CE',
            builtBy: 'Mughal Emperor Shah Jahan',
            dedicatedTo: 'Mumtaz Mahal (favorite wife of Shah Jahan)',
            architecturalStyle: 'Mughal architecture with Persian, Islamic and Indian influences',
            unescoStatus: 'UNESCO World Heritage Site since 1983',
            culturalSignificance: 'The Taj Mahal is considered the finest example of Mughal architecture and a symbol of eternal love. It combines elements from Islamic, Persian, Ottoman Turkish and Indian architectural styles.',
            interestingFacts: [
                'Built entirely of white marble',
                'Took approximately 22 years to complete',
                'Employed over 20,000 artisans',
                'Changes color throughout the day (pinkish in morning, white in day, golden in moonlight)',
                'The calligraphy appears to be uniform in size from ground level due to optical illusion'
            ],
            similarMonuments: 'Humayun\'s Tomb (Delhi), Itmad-ud-Daulah\'s Tomb (Agra), Bibi Ka Maqbara (Aurangabad)'
        };
    }
    
    getKonarkAnalysis() {
        return {
            detectedObjects: [
                { name: 'Sun Temple Chariot', confidence: 0.97, 
                  description: 'Temple designed as a gigantic chariot with 24 wheels' },
                { name: 'Stone Carvings', confidence: 0.94,
                  description: 'Intricate carvings depicting deities, dancers, musicians' },
                { name: 'Kalinga Architecture', confidence: 0.95,
                  description: 'Typical Odishan temple architecture style' },
                { name: 'Wheel of Life', confidence: 0.88,
                  description: 'Elaborately carved wheels representing the cycle of time' }
            ],
            heritageType: 'Sun Temple',
            officialName: 'Konark Sun Temple',
            location: 'Konark, Odisha',
            builtIn: '13th century CE (approx. 1250 CE)',
            builtBy: 'King Narasimhadeva I of Eastern Ganga Dynasty',
            dedicatedTo: 'Surya (Sun God)',
            architecturalStyle: 'Kalinga architecture',
            unescoStatus: 'UNESCO World Heritage Site since 1984',
            culturalSignificance: 'The temple is designed as a colossal chariot for the Sun God, with 24 elaborately carved wheels (representing hours) and pulled by seven horses (representing days of the week). It\'s a masterpiece of Odishan architecture.',
            interestingFacts: [
                'Also known as Black Pagoda by European sailors',
                'The main temple has fallen, but the assembly hall (Jagamohana) remains',
                'The wheels serve as sundials - time can be calculated from their shadows',
                'Built using iron beams without any mortar',
                'The temple was aligned so the first rays of sunrise would illuminate the main entrance'
            ],
            similarMonuments: 'Jagannath Temple (Puri), Lingaraja Temple (Bhubaneswar), Mukteshwar Temple (Bhubaneswar)'
        };
    }
    
    getJagannathAnalysis() {
        return {
            detectedObjects: [
                { name: 'Temple Shikhara', confidence: 0.93, 
                  description: 'Tall curvilinear tower typical of Kalinga architecture' },
                { name: 'Temple Flag', confidence: 0.85,
                  description: 'Distinctive flag flying atop the temple' },
                { name: 'Temple Complex', confidence: 0.90,
                  description: 'Large temple complex with multiple structures' },
                { name: 'Chakra Sudarshan', confidence: 0.82,
                  description: 'The Sudarshan Chakra emblem on temple top' }
            ],
            heritageType: 'Hindu Temple',
            officialName: 'Shree Jagannath Temple',
            location: 'Puri, Odisha',
            builtIn: '12th century CE',
            builtBy: 'King Anantavarman Chodaganga Deva',
            dedicatedTo: 'Lord Jagannath (form of Krishna), Balabhadra and Subhadra',
            architecturalStyle: 'Kalinga architecture',
            culturalSignificance: 'One of the Char Dham pilgrimage sites for Hindus. Famous for the annual Rath Yatra (chariot festival) where the deities are taken out in procession on huge chariots.',
            interestingFacts: [
                'The deities are made of neem wood and replaced every 12-19 years in the Navakalevara ritual',
                'The temple kitchen is the largest in the world, feeding thousands daily',
                'The flag atop the temple always flaps in the opposite direction of the wind',
                'No bird or airplane flies above the main temple',
                'The temple has four gates facing the four directions'
            ],
            annualFestival: 'Rath Yatra (June-July) - attended by over 1 million devotees',
            similarMonuments: 'Konark Sun Temple, Lingaraja Temple, Rajarani Temple'
        };
    }
    
    getHimalayaAnalysis() {
        return {
            detectedObjects: [
                { name: 'Snow-capped Peaks', confidence: 0.96, 
                  description: 'Majestic mountain peaks covered with snow' },
                { name: 'Mountain Range', confidence: 0.98,
                  description: 'Part of the great Himalayan mountain system' },
                { name: 'Alpine Landscape', confidence: 0.87,
                  description: 'High altitude mountainous terrain' },
                { name: 'Natural Heritage', confidence: 0.94,
                  description: 'Protected natural landscape' }
            ],
            heritageType: 'Natural Mountain Range',
            officialName: 'The Himalayas',
            location: 'Northern India (spanning multiple states)',
            length: '2,400 km (1,500 miles)',
            highestPeak: 'Mount Everest (8,848.86 m) - in Nepal',
            highestInIndia: 'Kangchenjunga (8,586 m) - 3rd highest in world',
            culturalSignificance: 'The Himalayas are considered sacred in Hinduism, Buddhism, and other religions. They are mentioned in ancient scriptures as the abode of gods. Many important pilgrimage sites and monasteries are located here.',
            ecologicalImportance: [
                'Source of major rivers: Ganges, Indus, Brahmaputra',
                'Home to diverse flora and fauna including snow leopard, red panda',
                'Contains numerous national parks and wildlife sanctuaries',
                'Plays crucial role in Indian monsoon system'
            ],
            pilgrimageSites: 'Badrinath, Kedarnath, Gangotri, Yamunotri (Char Dham), Amarnath, Vaishno Devi, Hemkund Sahib',
            similarRegions: 'The Alps (Europe), Andes (South America), Rocky Mountains (North America)'
        };
    }
    
    getGenericAnalysis() {
        return {
            detectedObjects: [
                { name: 'Heritage Architecture', confidence: 0.85, 
                  description: 'Historical architectural style detected' },
                { name: 'Cultural Structure', confidence: 0.82,
                  description: 'Building or monument of cultural significance' },
                { name: 'Historical Elements', confidence: 0.78,
                  description: 'Features suggesting historical importance' },
                { name: 'Traditional Design', confidence: 0.80,
                  description: 'Elements of traditional Indian design' }
            ],
            heritageType: 'Indian Heritage Site',
            culturalSignificance: 'This appears to be a significant Indian heritage site with historical and cultural value. The architecture suggests traditional Indian design elements.',
            recommendation: 'For more specific information, please provide the name of the monument or ask specific questions about it.'
        };
    }
    
    // Simplified analysis functions for other sites
    getQutubAnalysis() {
        return {
            heritageType: 'Victory Tower',
            officialName: 'Qutub Minar',
            location: 'Delhi',
            builtIn: '1192 CE',
            height: '73 meters (239.5 feet)',
            unescoStatus: 'UNESCO World Heritage Site since 1993',
            culturalSignificance: 'Tallest brick minaret in the world, built to celebrate Muslim dominance in Delhi.'
        };
    }
    
    getRedFortAnalysis() {
        return {
            heritageType: 'Mughal Fort',
            officialName: 'Red Fort',
            location: 'Delhi',
            builtIn: '1639-1648 CE',
            builtBy: 'Mughal Emperor Shah Jahan',
            unescoStatus: 'UNESCO World Heritage Site since 2007',
            culturalSignificance: 'Served as the main residence of Mughal Emperors for nearly 200 years.'
        };
    }
    
    getHawaMahalAnalysis() {
        return {
            heritageType: 'Palace',
            officialName: 'Hawa Mahal',
            location: 'Jaipur, Rajasthan',
            builtIn: '1799 CE',
            builtBy: 'Maharaja Sawai Pratap Singh',
            architecturalStyle: 'Rajput architecture',
            culturalSignificance: 'Known as "Palace of Winds" with 953 small windows (jharokhas) for royal women to observe street festivals.'
        };
    }
    
    getGatewayAnalysis() {
        return {
            heritageType: 'Monument',
            officialName: 'Gateway of India',
            location: 'Mumbai, Maharashtra',
            builtIn: '1911-1924 CE',
            architecturalStyle: 'Indo-Saracenic architecture',
            culturalSignificance: 'Built to commemorate the visit of King George V and Queen Mary to India.'
        };
    }
    
    getLotusTempleAnalysis() {
        return {
            heritageType: 'Baháʼí House of Worship',
            officialName: 'Lotus Temple',
            location: 'Delhi',
            builtIn: '1986 CE',
            architecturalStyle: 'Expressionist architecture',
            culturalSignificance: 'Known for its flower-like shape, open to all religions for prayer and meditation.'
        };
    }
    
    getAjantaAnalysis() {
        return {
            heritageType: 'Buddhist Caves',
            officialName: 'Ajanta Caves',
            location: 'Maharashtra',
            builtIn: '2nd century BCE to 480 CE',
            architecturalStyle: 'Buddhist rock-cut architecture',
            unescoStatus: 'UNESCO World Heritage Site since 1983',
            culturalSignificance: '30 rock-cut Buddhist cave monuments with paintings and sculptures.'
        };
    }
    
    getHampiAnalysis() {
        return {
            heritageType: 'Ruins',
            officialName: 'Group of Monuments at Hampi',
            location: 'Karnataka',
            builtIn: '14th-16th century CE',
            architecturalStyle: 'Vijayanagara architecture',
            unescoStatus: 'UNESCO World Heritage Site since 1986',
            culturalSignificance: 'Last capital of the Vijayanagara Empire with numerous temples and monuments.'
        };
    }
    
    getKhajurahoAnalysis() {
        return {
            heritageType: 'Temple Complex',
            officialName: 'Khajuraho Group of Monuments',
            location: 'Madhya Pradesh',
            builtIn: '950-1050 CE',
            architecturalStyle: 'Nagara style Hindu and Jain temple architecture',
            unescoStatus: 'UNESCO World Heritage Site since 1986',
            culturalSignificance: 'Famous for their nagara-style architectural symbolism and erotic sculptures.'
        };
    }
    
    getMeenakshiAnalysis() {
        return {
            heritageType: 'Hindu Temple',
            officialName: 'Meenakshi Amman Temple',
            location: 'Madurai, Tamil Nadu',
            builtIn: 'Originally 6th century CE, rebuilt 16th-17th century',
            architecturalStyle: 'Dravidian architecture',
            culturalSignificance: 'Dedicated to Goddess Meenakshi (Parvati) and Sundareshwarar (Shiva). Famous for its 14 gopurams (gateway towers).'
        };
    }
    
    getGoldenTempleAnalysis() {
        return {
            heritageType: 'Sikh Gurdwara',
            officialName: 'Harmandir Sahib (Golden Temple)',
            location: 'Amritsar, Punjab',
            builtIn: '1581-1604 CE',
            architecturalStyle: 'Sikh architecture with Hindu and Islamic influences',
            culturalSignificance: 'Most important religious site for Sikhs, known for its gold-plated sanctum.'
        };
    }
    
    getCharminarAnalysis() {
        return {
            heritageType: 'Monument and Mosque',
            officialName: 'Charminar',
            location: 'Hyderabad, Telangana',
            builtIn: '1591 CE',
            builtBy: 'Muhammad Quli Qutb Shah',
            architecturalStyle: 'Indo-Islamic architecture',
            culturalSignificance: 'Built to commemorate the end of a plague in Hyderabad. Serves as a mosque and landmark.'
        };
    }
    
    displayAnalysisResults() {
        let html = '';
        
        if (this.imageAnalysis.officialName) {
            html += `
                <div class="analysis-item">
                    <h5>Heritage Site</h5>
                    <p><strong>${this.imageAnalysis.officialName}</strong></p>
                </div>`;
        }
        
        if (this.imageAnalysis.location) {
            html += `
                <div class="analysis-item">
                    <h5>Location</h5>
                    <p>${this.imageAnalysis.location}</p>
                </div>`;
        }
        
        if (this.imageAnalysis.builtIn) {
            html += `
                <div class="analysis-item">
                    <h5>Built In</h5>
                    <p>${this.imageAnalysis.builtIn}</p>
                </div>`;
        }
        
        if (this.imageAnalysis.builtBy) {
            html += `
                <div class="analysis-item">
                    <h5>Built By</h5>
                    <p>${this.imageAnalysis.builtBy}</p>
                </div>`;
        }
        
        if (this.imageAnalysis.dedicatedTo) {
            html += `
                <div class="analysis-item">
                    <h5>Dedicated To</h5>
                    <p>${this.imageAnalysis.dedicatedTo}</p>
                </div>`;
        }
        
        if (this.imageAnalysis.architecturalStyle) {
            html += `
                <div class="analysis-item">
                    <h5>Architectural Style</h5>
                    <p>${this.imageAnalysis.architecturalStyle}</p>
                </div>`;
        }
        
        if (this.imageAnalysis.unescoStatus) {
            html += `
                <div class="analysis-item">
                    <h5>UNESCO Status</h5>
                    <p>${this.imageAnalysis.unescoStatus}</p>
                </div>`;
        }
        
        if (this.imageAnalysis.culturalSignificance) {
            html += `
                <div class="analysis-item">
                    <h5>Cultural Significance</h5>
                    <p>${this.imageAnalysis.culturalSignificance}</p>
                </div>`;
        }
        
        if (this.imageAnalysis.interestingFacts && this.imageAnalysis.interestingFacts.length > 0) {
            html += `
                <div class="analysis-item">
                    <h5>Interesting Facts</h5>
                    <ul style="margin: 0; padding-left: 1.2rem;">`;
            
            this.imageAnalysis.interestingFacts.forEach(fact => {
                html += `<li style="margin-bottom: 0.5rem;">${fact}</li>`;
            });
            
            html += `</ul></div>`;
        }
        
        if (this.imageAnalysis.detectedObjects && this.imageAnalysis.detectedObjects.length > 0) {
            html += `
                <div class="analysis-item">
                    <h5>Detected Features</h5>`;
            
            this.imageAnalysis.detectedObjects.forEach(obj => {
                html += `
                    <div class="feature-detection">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span style="font-weight: 500;">${obj.name}</span>
                            <span class="confidence-value">${Math.round(obj.confidence * 100)}%</span>
                        </div>
                        <div class="confidence-meter">
                            <div class="confidence-bar">
                                <div class="confidence-fill" style="width: ${obj.confidence * 100}%"></div>
                            </div>
                        </div>
                        <p style="margin-top: 8px; font-size: 0.9rem; color: #666;">${obj.description}</p>
                    </div>`;
            });
            
            html += `</div>`;
        }
        
        this.analysisResults.innerHTML = html || '<p>No analysis results available.</p>';
    }
    
    askAboutImage() {
        if (!this.imageAnalysis) {
            this.showError('Please analyze the image first');
            return;
        }
        
        // Auto-generate a question based on analysis
        const siteName = this.imageAnalysis.officialName || this.imageAnalysis.heritageType;
        const question = `Tell me more about ${siteName}`;
        
        // Close modal
        this.closeModal();
        
        // Fill the input with the question
        this.messageInput.value = question;
        
        // Focus on input
        this.messageInput.focus();
        
        // Auto-send the question after 1 second
        setTimeout(() => {
            this.sendMessageWithImage();
        }, 1000);
    }
    
    sendMessageWithImage() {
        const message = this.messageInput.value.trim();
        
        // Add user message to chat
        if (message) {
            this.addUserMessage(message);
        }
        
        // Add image to chat if uploaded
        if (this.currentImage) {
            this.addImageMessage();
        } else if (message) {
            // Just send text message if no image
            this.sendTextMessage(message);
        } else {
            this.showError('Please enter a message or upload an image');
            return;
        }
        
        // Clear input
        this.messageInput.value = '';
        
        // Clear image if attached
        if (this.currentImage) {
            this.clearImage();
        }
    }
    
    sendTextMessage(message) {
        // Show typing indicator
        this.showTypingIndicator();
        
        // Simulate bot response
        setTimeout(() => {
            this.generateBotResponse(message, false);
        }, 1000);
    }
    
    addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-bubble">
                    <p>${this.escapeHtml(text)}</p>
                </div>
                <div class="message-time">${this.getCurrentTime()}</div>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    addImageMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message with-image';
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-bubble">
                    <p>I uploaded an image:</p>
                    <div class="image-message-container">
                        <img src="${this.currentImage.data}" alt="Uploaded image" class="chat-image">
                        <div class="image-caption">${this.currentImage.name}</div>
                    </div>
                </div>
                <div class="message-time">${this.getCurrentTime()}</div>
            </div>
        `;
        
        // Add click handler to enlarge image
        const chatImage = messageDiv.querySelector('.chat-image');
        chatImage.addEventListener('click', () => {
            this.showImageInModal(this.currentImage.data);
        });
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Show typing indicator for bot response
        this.showTypingIndicator();
        
        // Generate bot response based on image
        setTimeout(() => {
            this.generateBotResponse('', true);
        }, 1500);
    }
    
    generateBotResponse(userMessage, hasImage) {
        // Hide typing indicator
        this.hideTypingIndicator();
        
        let response = '';
        
        if (hasImage && this.imageAnalysis) {
            // Generate detailed response about the analyzed image
            const siteName = this.imageAnalysis.officialName || this.imageAnalysis.heritageType;
            
            response = `${siteName}\n\n`;
            
            if (this.imageAnalysis.location) {
                response += `Location: ${this.imageAnalysis.location}\n`;
            }
            if (this.imageAnalysis.builtIn) {
                response += `Built: ${this.imageAnalysis.builtIn}\n`;
            }
            if (this.imageAnalysis.builtBy) {
                response += `Built By: ${this.imageAnalysis.builtBy}\n`;
            }
            if (this.imageAnalysis.dedicatedTo) {
                response += `Dedicated To: ${this.imageAnalysis.dedicatedTo}\n`;
            }
            if (this.imageAnalysis.architecturalStyle) {
                response += `Architectural Style: ${this.imageAnalysis.architecturalStyle}\n`;
            }
            if (this.imageAnalysis.unescoStatus) {
                response += `UNESCO: ${this.imageAnalysis.unescoStatus}\n`;
            }
            
            response += `\nSignificance: ${this.imageAnalysis.culturalSignificance}`;
            
            if (this.imageAnalysis.interestingFacts && this.imageAnalysis.interestingFacts.length > 0) {
                response += `\n\nInteresting Facts:\n`;
                this.imageAnalysis.interestingFacts.slice(0, 3).forEach(fact => {
                    response += `• ${fact}\n`;
                });
            }
            
            response += `\n\nWould you like to know more about any specific aspect of ${siteName}?`;
            
        } else if (userMessage.toLowerCase().includes('taj') || userMessage.toLowerCase().includes('mahal')) {
            response = this.getTajMahalResponse();
        } else if (userMessage.toLowerCase().includes('konark') || userMessage.toLowerCase().includes('sun temple')) {
            response = this.getKonarkResponse();
        } else if (userMessage.toLowerCase().includes('jagannath') || userMessage.toLowerCase().includes('puri')) {
            response = this.getJagannathResponse();
        } else if (userMessage.toLowerCase().includes('himalaya') || userMessage.toLowerCase().includes('mountain')) {
            response = this.getHimalayaResponse();
        } else if (userMessage.toLowerCase().includes('upload') || userMessage.toLowerCase().includes('image')) {
            response = `You can upload images of heritage sites using the image button. I can analyze:\n\n• Historical monuments (Taj Mahal, Konark Temple)\n• Religious sites (Jagannath Temple, Golden Temple)\n• Natural heritage (Himalayas)\n• Any Indian heritage site\n\nTry uploading an image now!`;
        } else {
            response = `Thank you for your question! India has a rich cultural heritage. You can:\n\n1. Ask about monuments (e.g., "Tell me about Taj Mahal")\n2. Upload images using the image button\n3. Ask about festivals, traditions, or culture\n\nWhat would you like to know about?`;
        }
        
        this.addBotMessage(response);
    }
    
    getTajMahalResponse() {
        return `Taj Mahal\n\nLocation: Agra, Uttar Pradesh\nBuilt: 1632-1653 CE (22 years)\nBuilt By: Mughal Emperor Shah Jahan\nDedicated To: Mumtaz Mahal (his favorite wife)\nArchitectural Style: Mughal architecture with Persian, Islamic and Indian influences\nUNESCO: World Heritage Site since 1983\n\nSignificance: Considered the finest example of Mughal architecture and a symbol of eternal love.\n\nInteresting Facts:\n• Built entirely of white marble\n• Changes color throughout the day\n• Over 20,000 artisans worked on it\n\nWould you like to know more about its architecture or history?`;
    }
    
    getKonarkResponse() {
        return `Konark Sun Temple\n\nLocation: Konark, Odisha\nBuilt: 13th century CE\nBuilt By: King Narasimhadeva I\nDedicated To: Surya (Sun God)\nArchitectural Style: Kalinga architecture\nUNESCO: World Heritage Site since 1984\n\nSignificance: Designed as a colossal chariot with 24 wheels (hours) pulled by 7 horses (days of week).\n\nWould you like to know about the temple's intricate carvings?`;
    }
    
    getJagannathResponse() {
        return `Jagannath Temple, Puri\n\nLocation: Puri, Odisha\nBuilt: 12th century CE\nBuilt By: King Anantavarman Chodaganga Deva\nDeities: Lord Jagannath, Balabhadra and Subhadra\nArchitectural Style: Kalinga architecture\n\nSignificance: One of the Char Dham pilgrimage sites. Famous for annual Rath Yatra festival.\n\nMajor Festival: Rath Yatra (June-July) - attended by millions\n\nWould you like to know about the Rath Yatra festival?`;
    }
    
    getHimalayaResponse() {
        return `The Himalayas\n\nLocation: Northern India\nLength: 2,400 km (1,500 miles)\nHighest in India: Kangchenjunga (8,586 m)\nSource of Rivers: Ganges, Indus, Brahmaputra\n\nSignificance: Considered sacred in Hinduism and Buddhism. Home to important pilgrimage sites.\n\nPilgrimage Sites: Badrinath, Kedarnath, Gangotri, Yamunotri (Char Dham)\n\nWould you like to know about specific Himalayan regions?`;
    }
    
    addBotMessage(text) {
        try {
            // Validate input
            if (!text || typeof text !== 'string') {
                console.warn('Invalid text provided to addBotMessage:', text);
                text = 'I encountered an error processing that message.';
            }

            // Create message container
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message bot-message';
            messageDiv.setAttribute('data-message-type', 'bot');
            
            // Create message bubble
            const messageBubble = document.createElement('div');
            messageBubble.className = 'message-bubble';
            
            // Convert newlines to line breaks and escape HTML
            const formattedText = text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\n/g, '<br>');
            
            messageBubble.innerHTML = formattedText;
            
            // Create message structure
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <img src="images/chatbot-avatar.png" alt="Bot" class="avatar-img" 
                         onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiM2QzYzRkYiLz4KPHBhdGggZD0iTTIwIDEyQzIzLjMxMzcgMTIgMjYgMTQuNjg2MyAyNiAxOEMyNiAyMS4zMTM3IDIzLjMxMzcgMjQgMjAgMjRDMTYuNjg2MyAyNCAxNCAyMS4zMTM3IDE0IDE4QzE0IDE0LjY4NjMgMTYuNjg2MyAxMiAyMCAxMloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNi41IDI2LjVDMTYuNSAyNy44ODA3IDE1LjM4MDcgMjkgMTQgMjlDMTIuNjE5MyAyOSAxMS41IDI3Ljg4MDcgMTEuNSAyNi41QzExLjUgMjUuMTE5MyAxMi42MTkzIDI0IDE0IDI0QzE1LjM4MDcgMjQgMTYuNSAyNS4xMTkzIDE2LjUgMjYuNVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yOCAyNi41QzI4IDI3Ljg4MDcgMjYuODgwNyAyOSAyNS41IDI5QzI0LjExOTMgMjkgMjMgMjcuODgwNyAyMyAyNi41QzIzIDI1LjExOTMgMjQuMTE5MyAyNCAyNS41IDI0QzI2Ljg4MDcgMjQgMjggMjUuMTE5MyAyOCAyNi41WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==';">
                </div>
                <div class="message-content">
                    <div class="message-time">${this.getCurrentTime()}</div>
                </div>
            `;
            
            // Insert the message bubble
            const messageContent = messageDiv.querySelector('.message-content');
            messageContent.insertBefore(messageBubble, messageContent.querySelector('.message-time'));
            
            // Add to chat container
            if (this.chatMessages) {
                this.chatMessages.appendChild(messageDiv);
                this.scrollToBottom();
            } else {
                console.error('chatMessages container not found');
                return null;
            }
            
            // Update question counter
            this.updateQuestionCounter();
            
            // Auto-speak if voice features are available and enabled
            setTimeout(() => {
                if (window.voiceFeatures && 
                    window.voiceFeatures.autoSpeakEnabled && 
                    typeof window.voiceFeatures.speakMessage === 'function') {
                    try {
                        window.voiceFeatures.speakMessage(messageDiv);
                    } catch (speakError) {
                        console.warn('Voice speak error:', speakError);
                    }
                }
            }, 300);
            
            return messageDiv;
            
        } catch (error) {
            console.error('Error in addBotMessage:', error);
            // Fallback: create a simple error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'message bot-message error';
            errorDiv.textContent = 'Error displaying message';
            
            if (this.chatMessages) {
                this.chatMessages.appendChild(errorDiv);
                this.scrollToBottom();
            }
            
            return null;
        }
    }
    
    updateQuestionCounter() {
        const counter = document.getElementById('totalQuestions');
        if (counter) {
            let current = parseInt(counter.textContent.replace(/,/g, '')) || 1247;
            current++;
            counter.textContent = current.toLocaleString();
        }
    }
    
    showImageInModal(imageSrc) {
        const modal = document.createElement('div');
        modal.className = 'image-analysis-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div class="image-modal-content" style="max-width: 600px;">
                <div class="image-modal-header">
                    <h3>Image Preview</h3>
                    <button class="close-modal-btn close-preview">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="image-modal-body" style="grid-template-columns: 1fr; padding: 0;">
                    <div class="original-image-container" style="padding: 1.5rem;">
                        <img src="${imageSrc}" alt="Preview" style="max-height: 70vh; width: 100%; object-fit: contain;">
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add close functionality
        const closeBtn = modal.querySelector('.close-preview');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Close on ESC key
        const closeOnEsc = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', closeOnEsc);
            }
        };
        document.addEventListener('keydown', closeOnEsc);
    }
    
    closeModal() {
        if (this.imageAnalysisModal) {
            this.imageAnalysisModal.classList.add('hidden');
        }
    }
    
    showTypingIndicator() {
        if (this.typingIndicator) {
            this.typingIndicator.style.display = 'block';
            this.scrollToBottom();
        }
    }
    
    hideTypingIndicator() {
        if (this.typingIndicator) {
            this.typingIndicator.style.display = 'none';
        }
    }
    
    scrollToBottom() {
        if (this.chatMessages) {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }
    
    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    showError(message) {
        this.showNotification(message, 'error');
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
        window.imageFeatures = new ImageAnalysisFeature();
        console.log('Image Analysis Feature initialized on DOMContentLoaded');
    });
} else {
    window.imageFeatures = new ImageAnalysisFeature();
    console.log('Image Analysis Feature initialized immediately');
}