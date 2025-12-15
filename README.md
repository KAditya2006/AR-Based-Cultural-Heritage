# AR-Based Cultural Heritage Preservation Platform
## Roots & Wings | Smart India Hackathon 2025

A comprehensive web-based platform that preserves and showcases India's magnificent cultural heritage through cutting-edge Augmented Reality (AR) and Virtual Reality (VR) technologies.

![Platform Preview](images/platform-preview.jpg)

## 🌟 Features

### 🏛️ AR Heritage Explorer
- **Immersive 3D Models**: Explore detailed 3D reconstructions of iconic Indian monuments
- **AR Visualization**: Experience heritage sites in your real environment using AR technology
- **Interactive Hotspots**: Learn about specific architectural features and historical details
- **Multiple View Modes**: Day, night, and historical reconstruction views
- **Voice Narration**: Audio guides with cultural context and historical stories

### 🎯 Interactive Cultural Quiz
- **Multiple Categories**: Monuments, Culture, History, and Mixed challenges
- **Smart Scoring System**: Real-time scoring with detailed performance analysis
- **Lifelines**: 50:50, Skip Question, and Extra Time features
- **Cultural Facts**: Learn interesting facts after each quiz completion
- **Progress Tracking**: Monitor your knowledge growth over time

### 🤖 AI Heritage Assistant
- **Intelligent Chatbot**: AI-powered assistant with extensive heritage knowledge
- **Voice Interaction**: Speech recognition and text-to-speech capabilities
- **Quick Actions**: Pre-defined questions for common heritage topics
- **Multi-language Support**: Accessible in multiple Indian languages
- **24/7 Availability**: Always ready to answer your heritage questions

### 📞 Contact & Support
- **Smart Contact Form**: Validated form with real-time feedback
- **Team Information**: Meet the developers and heritage experts
- **FAQ Section**: Comprehensive answers to common questions
- **Social Integration**: Connect with us on various platforms

## 🚀 Technology Stack

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **JavaScript (ES6+)**: Interactive functionality and API integration
- **A-Frame**: WebXR framework for AR/VR experiences
- **Web APIs**: Speech Recognition, Speech Synthesis, Geolocation

### Design & UX
- **Responsive Design**: Mobile-first approach with cross-device compatibility
- **Indian Color Palette**: Saffron (#FF9933), White (#FFFFFF), Green (#138808), Royal Blue (#0D47A1)
- **Google Fonts**: Poppins font family for modern typography
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation and screen reader support

### Performance & PWA
- **Service Worker**: Offline functionality and caching strategies
- **Progressive Web App**: Installable with app-like experience
- **Lazy Loading**: Optimized resource loading for better performance
- **Local Storage**: Client-side data persistence

## 📱 Supported Heritage Sites

### UNESCO World Heritage Sites
1. **Taj Mahal, Agra** - Symbol of eternal love and Mughal architecture
2. **Konark Sun Temple, Odisha** - 13th-century architectural marvel
3. **Khajuraho Temples, Madhya Pradesh** - Medieval Indian art and sculpture
4. **Ajanta Caves, Maharashtra** - Ancient Buddhist rock-cut monuments
5. **Sanchi Stupa, Madhya Pradesh** - Buddhist architectural heritage

### Additional Features
- Detailed historical backgrounds and architectural analysis
- Cultural significance and religious importance
- Interactive 3D models with accurate reconstructions
- Audio narrations in multiple languages
- Virtual tours with guided experiences

## 🛠️ Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- HTTPS connection (required for AR features)
- Camera access (for AR functionality)
- Microphone access (for voice features)

### Quick Start
1. **Clone the repository**
   ```bash
   git clone https://github.com/roots-wings/heritage-platform.git
   cd heritage-platform
   ```

2. **Serve the files**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Access the platform**
   Open your browser and navigate to `http://localhost:8000`

### Development Setup
1. **Install dependencies** (if using build tools)
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
final-root&wings/
├── index.html              # Home page
├── explore.html             # AR exploration page
├── quiz.html               # Interactive quiz page
├── chatbot.html            # AI assistant page
├── contact.html            # Contact form page
├── sw.js                   # Service worker for PWA
├── css/
│   ├── style.css           # Main stylesheet
│   ├── explore.css         # AR explorer styles
│   ├── quiz.css           # Quiz page styles
│   ├── chatbot.css        # Chatbot styles
│   └── contact.css        # Contact page styles
├── js/
│   ├── main.js            # Core functionality
│   ├── explore.js         # AR and 3D features
│   ├── quiz.js           # Quiz logic and scoring
│   ├── chatbot.js        # AI assistant functionality
│   └── contact.js        # Form handling and validation
├── images/                # Image assets and placeholders
├── models/               # 3D models (.glb files)
└── README.md            # Project documentation
```

## 🎨 Design System

### Color Palette
- **Primary Saffron**: #FF9933 (Courage and sacrifice)
- **Pure White**: #FFFFFF (Truth and peace)
- **Heritage Green**: #138808 (Faith and chivalry)
- **Royal Blue**: #0D47A1 (Vigilance and justice)

### Typography
- **Primary Font**: Poppins (Google Fonts)
- **Font Weights**: 300, 400, 500, 600, 700
- **Responsive Scaling**: clamp() functions for fluid typography

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Gradient backgrounds with hover effects
- **Forms**: Clean inputs with validation states
- **Navigation**: Fixed header with smooth scrolling

## 🌐 Browser Support

### Minimum Requirements
- **Chrome**: 80+
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+

### AR/VR Features
- **WebXR Support**: Chrome 79+, Edge 80+
- **Camera Access**: HTTPS required
- **Device Orientation**: Mobile devices with gyroscope

## 📊 Performance Metrics

### Core Web Vitals
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Optimization Features
- **Image Optimization**: WebP format with fallbacks
- **Code Splitting**: Lazy loading of non-critical resources
- **Caching Strategy**: Service worker with cache-first approach
- **Minification**: CSS and JavaScript compression

## 🔒 Security & Privacy

### Data Protection
- **No Personal Data Collection**: Privacy-first approach
- **Local Storage Only**: Client-side data persistence
- **HTTPS Enforcement**: Secure connections required
- **Content Security Policy**: XSS protection

### Accessibility
- **WCAG 2.1 AA Compliance**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast Mode**: Support for visual impairments
- **Reduced Motion**: Respects user preferences

## 🤝 Contributing

We welcome contributions from developers, historians, and cultural enthusiasts!

### How to Contribute
1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/new-heritage-site
   ```
3. **Make your changes**
4. **Add tests** (if applicable)
5. **Submit a pull request**

### Content Contributions
- **Heritage Sites**: Suggest new monuments and sites
- **Historical Content**: Provide accurate historical information
- **3D Models**: Contribute high-quality 3D reconstructions
- **Translations**: Help with multi-language support

## 📞 Support & Contact

### Team Roots & Wings
- **Email**: info@rootsandwings.in
- **Support**: support@rootsandwings.in
- **Phone**: +91 98765 43210

### Social Media
- **Facebook**: [@RootsAndWingsIndia](https://facebook.com/rootsandwingsindia)
- **Twitter**: [@RootsWingsIN](https://twitter.com/rootswingsin)
- **Instagram**: [@roots_wings_india](https://instagram.com/roots_wings_india)
- **YouTube**: [Roots & Wings Channel](https://youtube.com/rootsandwings)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Awards & Recognition

- **Smart India Hackathon 2025**: Finalist
- **Digital India Initiative**: Recognized contribution
- **UNESCO Partnership**: Collaboration for heritage preservation

## 🔮 Future Roadmap

### Phase 1 (Current)
- ✅ Core AR functionality
- ✅ Interactive quiz system
- ✅ AI chatbot assistant
- ✅ Progressive Web App

### Phase 2 (Upcoming)
- 🔄 Virtual Reality support
- 🔄 Multi-language interface
- 🔄 Advanced 3D interactions
- 🔄 Social sharing features

### Phase 3 (Future)
- 📅 Machine Learning recommendations
- 📅 Collaborative heritage mapping
- 📅 Educational institution partnerships
- 📅 Mobile app development

## 🙏 Acknowledgments

- **Archaeological Survey of India**: Historical data and guidance
- **Indian Heritage Foundation**: Cultural expertise and validation
- **Open Source Community**: Libraries and frameworks used
- **Beta Testers**: Valuable feedback and testing

---

**Made with ❤️ for preserving India's magnificent cultural heritage**

*Roots & Wings - Connecting our past with the future through technology*# AR-Based-Cultural-Heritage
