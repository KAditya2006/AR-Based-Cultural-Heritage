/**
 * Quiz Page JavaScript - Cultural Heritage Quiz
 * Handles quiz logic, scoring, timer, and interactive features
 */

// ===== GLOBAL VARIABLES =====
let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let score = 0;
let timeRemaining = 30;
let timerInterval = null;
let quizStartTime = null;
let lifelines = {
    fiftyFifty: true,
    skipQuestion: true,
    extraTime: true
};

// Quiz Data
const quizData = {
    monuments: {
        name: "Monuments & Architecture",
        questions: [
            {
                question: "Which Mughal emperor built the Taj Mahal?",
                options: ["Shah Jahan", "Akbar", "Aurangzeb", "Humayun"],
                correct: 0,
                explanation: "Shah Jahan built the Taj Mahal between 1632-1653 as a mausoleum for his beloved wife Mumtaz Mahal.",
                image: "images/quiz/taj-mahal-quiz.jpg"
            },
            {
                question: "The Konark Sun Temple is located in which Indian state?",
                options: ["Rajasthan", "Gujarat", "Odisha", "Karnataka"],
                correct: 2,
                explanation: "The Konark Sun Temple is located in Konark, Odisha, and was built in the 13th century by King Narasimhadeva I.",
                image: "images/quiz/konark-quiz.jpg"
            },
            {
                question: "How many wheels does the Konark Sun Temple chariot have?",
                options: ["12", "18", "24", "36"],
                correct: 2,
                explanation: "The Konark Sun Temple is designed as a colossal chariot with 24 intricately carved wheels, each serving as a sundial."
            },
            {
                question: "Which architectural style is the Red Fort built in?",
                options: ["Dravidian", "Indo-Islamic", "Nagara", "Vesara"],
                correct: 1,
                explanation: "The Red Fort in Delhi is built in the Indo-Islamic architectural style, combining Islamic and Indian elements."
            },
            {
                question: "The Khajuraho temples were built by which dynasty?",
                options: ["Gupta", "Chandela", "Chola", "Pallava"],
                correct: 1,
                explanation: "The Khajuraho temples were built by the Chandela dynasty between 950-1050 CE."
            },
            {
                question: "Which monument is known as the 'Dream in Marble'?",
                options: ["Taj Mahal", "Victoria Memorial", "Hawa Mahal", "Mysore Palace"],
                correct: 0,
                explanation: "The Taj Mahal is often called the 'Dream in Marble' due to its ethereal beauty and white marble construction."
            },
            {
                question: "The Ajanta Caves primarily depict which religion?",
                options: ["Hinduism", "Buddhism", "Jainism", "Sikhism"],
                correct: 1,
                explanation: "The Ajanta Caves are Buddhist cave monuments featuring paintings and sculptures depicting the life of Buddha."
            },
            {
                question: "Which is the largest mosque in India?",
                options: ["Jama Masjid Delhi", "Mecca Masjid", "Taj-ul-Masajid", "Fatehpur Sikri Mosque"],
                correct: 2,
                explanation: "Taj-ul-Masajid in Bhopal is considered one of the largest mosques in India."
            },
            {
                question: "The Sanchi Stupa was built by which emperor?",
                options: ["Chandragupta", "Ashoka", "Harsha", "Kanishka"],
                correct: 1,
                explanation: "The Great Stupa at Sanchi was originally built by Emperor Ashoka in the 3rd century BCE."
            },
            {
                question: "Which fort is known as the 'Gibraltar of the East'?",
                options: ["Golconda Fort", "Gwalior Fort", "Chittorgarh Fort", "Mehrangarh Fort"],
                correct: 1,
                explanation: "Gwalior Fort is known as the 'Gibraltar of the East' due to its strategic location and massive structure."
            }
        ]
    },
    culture: {
        name: "Culture & Traditions",
        questions: [
            {
                question: "Which festival is known as the 'Festival of Lights'?",
                options: ["Holi", "Diwali", "Dussehra", "Karva Chauth"],
                correct: 1,
                explanation: "Diwali, also known as Deepavali, is called the 'Festival of Lights' and celebrates the victory of light over darkness."
            },
            {
                question: "The classical dance form Bharatanatyam originated in which state?",
                options: ["Kerala", "Karnataka", "Tamil Nadu", "Andhra Pradesh"],
                correct: 2,
                explanation: "Bharatanatyam is a classical dance form that originated in Tamil Nadu and is one of the oldest dance forms in India."
            },
            {
                question: "Which Indian festival involves throwing colored powder?",
                options: ["Diwali", "Holi", "Navratri", "Onam"],
                correct: 1,
                explanation: "Holi, the festival of colors, involves throwing colored powder (gulal) and water to celebrate the arrival of spring."
            },
            {
                question: "The traditional Indian greeting 'Namaste' means:",
                options: ["Hello", "Goodbye", "I bow to you", "Welcome"],
                correct: 2,
                explanation: "Namaste comes from Sanskrit meaning 'I bow to you' and is a respectful greeting acknowledging the divine in others."
            },
            {
                question: "Which state is famous for the Kathakali dance form?",
                options: ["Tamil Nadu", "Kerala", "Karnataka", "Odisha"],
                correct: 1,
                explanation: "Kathakali is a classical dance-drama form that originated in Kerala, known for its elaborate costumes and makeup."
            },
            {
                question: "The festival of Onam is primarily celebrated in which state?",
                options: ["Tamil Nadu", "Kerala", "Karnataka", "Goa"],
                correct: 1,
                explanation: "Onam is the harvest festival of Kerala, celebrating the return of the legendary King Mahabali."
            },
            {
                question: "Which musical instrument is Lord Krishna often depicted playing?",
                options: ["Sitar", "Tabla", "Flute", "Veena"],
                correct: 2,
                explanation: "Lord Krishna is traditionally depicted playing the flute (bansuri), symbolizing divine music and love."
            },
            {
                question: "The art of henna decoration is called:",
                options: ["Rangoli", "Mehendi", "Kolam", "Alpana"],
                correct: 1,
                explanation: "Mehendi is the art of decorating hands and feet with henna, especially during festivals and weddings."
            }
        ]
    },
    history: {
        name: "History & Dynasties",
        questions: [
            {
                question: "Who was the founder of the Mauryan Empire?",
                options: ["Ashoka", "Chandragupta Maurya", "Bindusara", "Brihadratha"],
                correct: 1,
                explanation: "Chandragupta Maurya founded the Mauryan Empire in 322 BCE with the help of Chanakya (Kautilya)."
            },
            {
                question: "The Gupta period is known as the:",
                options: ["Dark Age", "Golden Age", "Iron Age", "Medieval Period"],
                correct: 1,
                explanation: "The Gupta period (320-550 CE) is called the Golden Age of India due to achievements in arts, science, and literature."
            },
            {
                question: "Who built the city of Fatehpur Sikri?",
                options: ["Babur", "Akbar", "Shah Jahan", "Aurangzeb"],
                correct: 1,
                explanation: "Emperor Akbar built Fatehpur Sikri in 1571 as his capital, though it was abandoned due to water scarcity."
            },
            {
                question: "The Battle of Panipat (1526) was fought between:",
                options: ["Babur and Ibrahim Lodi", "Akbar and Hemu", "Ahmad Shah Abdali and Marathas", "Prithviraj and Ghori"],
                correct: 0,
                explanation: "The First Battle of Panipat in 1526 was fought between Babur and Ibrahim Lodi, establishing Mughal rule in India."
            },
            {
                question: "Which Chola king built the Brihadeeswarar Temple?",
                options: ["Rajendra Chola I", "Rajaraja Chola I", "Kulottunga Chola I", "Vijayalaya Chola"],
                correct: 1,
                explanation: "Rajaraja Chola I built the magnificent Brihadeeswarar Temple in Thanjavur around 1010 CE."
            },
            {
                question: "The Vijayanagara Empire was founded by:",
                options: ["Harihara and Bukka", "Krishnadevaraya", "Saluva Narasimha", "Aliya Rama Raya"],
                correct: 0,
                explanation: "The Vijayanagara Empire was founded by brothers Harihara and Bukka in 1336 CE."
            }
        ]
    },
    mixed: {
        name: "Mixed Challenge",
        questions: [
            {
                question: "Which UNESCO World Heritage Site is known as the 'Pink City'?",
                options: ["Jodhpur", "Jaipur", "Udaipur", "Bikaner"],
                correct: 1,
                explanation: "Jaipur is known as the 'Pink City' due to the pink-colored buildings in its old city area."
            },
            {
                question: "The ancient university of Nalanda was located in which present-day state?",
                options: ["Uttar Pradesh", "Bihar", "West Bengal", "Odisha"],
                correct: 1,
                explanation: "Nalanda University was located in present-day Bihar and was a renowned center of learning from 5th to 12th century CE."
            },
            {
                question: "Which Indian classical music has two main traditions?",
                options: ["Hindustani and Carnatic", "Dhrupad and Khayal", "Thumri and Ghazal", "Bhajan and Kirtan"],
                correct: 0,
                explanation: "Indian classical music has two main traditions: Hindustani (North Indian) and Carnatic (South Indian)."
            },
            {
                question: "The Ellora Caves represent which three religions?",
                options: ["Hinduism, Buddhism, Christianity", "Hinduism, Buddhism, Jainism", "Buddhism, Jainism, Islam", "Hinduism, Jainism, Sikhism"],
                correct: 1,
                explanation: "The Ellora Caves showcase the religious harmony of ancient India with Hindu, Buddhist, and Jain temples carved side by side."
            }
        ]
    }
};

// Cultural facts for results
const culturalFacts = [
    "The Taj Mahal appears to change colors throughout the day due to the way light reflects off its white marble surface.",
    "The Konark Sun Temple's wheels are not just decorative - each wheel serves as a functional sundial that can tell time accurately.",
    "The Khajuraho temples were lost to the world for centuries, hidden by dense forests until rediscovered in the 1830s.",
    "The Ajanta Caves were carved entirely by hand using only hammers and chisels, taking over 200 years to complete.",
    "The Indian flag's saffron represents courage and sacrifice, white represents truth and peace, and green represents faith and chivalry.",
    "The word 'Yoga' comes from the Sanskrit word 'Yuj' meaning 'to unite' or 'to join'.",
    "India is home to over 1,600 languages and dialects, making it one of the most linguistically diverse countries in the world.",
    "The ancient Indian game of chess was originally called 'Chaturanga', meaning 'four divisions of the military'."
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeQuizApp();
});

function initializeQuizApp() {
    setupEventListeners();
    displayQuizSelection();
}

function setupEventListeners() {
    // Category selection
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => startQuiz(card.dataset.category));
    });

    // Quiz controls
    document.getElementById('prevQuestion').addEventListener('click', previousQuestion);
    document.getElementById('nextQuestion').addEventListener('click', nextQuestion);
    document.getElementById('submitQuiz').addEventListener('click', submitQuiz);

    // Lifelines
    document.getElementById('fiftyFifty').addEventListener('click', useFiftyFifty);
    document.getElementById('skipQuestion').addEventListener('click', useSkipQuestion);
    document.getElementById('extraTime').addEventListener('click', useExtraTime);

    // Results actions
    document.getElementById('retakeQuiz').addEventListener('click', retakeQuiz);
    document.getElementById('shareResults').addEventListener('click', shareResults);
    document.getElementById('exploreMore').addEventListener('click', () => {
        window.location.href = 'explore.html';
    });
}

// ===== QUIZ FLOW =====
function displayQuizSelection() {
    document.getElementById('quizSelection').classList.remove('hidden');
    document.getElementById('quizInterface').classList.add('hidden');
    document.getElementById('quizResults').classList.add('hidden');
}

function startQuiz(category) {
    if (!quizData[category]) return;

    currentQuiz = quizData[category];
    currentQuestionIndex = 0;
    userAnswers = [];
    score = 0;
    timeRemaining = 30;
    quizStartTime = new Date();

    // Reset lifelines
    lifelines = {
        fiftyFifty: true,
        skipQuestion: true,
        extraTime: true
    };

    // Shuffle questions for variety
    currentQuiz.questions = shuffleArray([...currentQuiz.questions]);

    // Show quiz interface
    document.getElementById('quizSelection').classList.add('hidden');
    document.getElementById('quizInterface').classList.remove('hidden');
    document.getElementById('quizResults').classList.add('hidden');

    // Initialize quiz
    displayQuestion();
    startTimer();
    updateProgress();
    updateLifelines();
}

function displayQuestion() {
    const question = currentQuiz.questions[currentQuestionIndex];
    if (!question) return;

    // Update question content
    document.getElementById('questionNumber').textContent = `Question ${currentQuestionIndex + 1}`;
    document.getElementById('questionText').textContent = question.question;

    // Handle question image
    const imageContainer = document.getElementById('questionImage');
    if (question.image) {
        imageContainer.innerHTML = `<img src="${question.image}" alt="Question Image" loading="lazy">`;
        imageContainer.style.display = 'block';
    } else {
        imageContainer.style.display = 'none';
    }

    // Display options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.dataset.option = index;
        button.dataset.optionLetter = String.fromCharCode(65 + index); // A, B, C, D
        button.textContent = option;
        button.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(button);
    });

    // Hide explanation
    document.getElementById('questionExplanation').classList.remove('show');

    // Update controls
    updateQuizControls();
}

function selectOption(optionIndex) {
    const question = currentQuiz.questions[currentQuestionIndex];
    const options = document.querySelectorAll('.option-btn');
    
    // Clear previous selections
    options.forEach(btn => {
        btn.classList.remove('selected', 'correct', 'incorrect');
        btn.disabled = false;
    });

    // Mark selected option
    options[optionIndex].classList.add('selected');
    
    // Store answer
    userAnswers[currentQuestionIndex] = optionIndex;

    // Show correct/incorrect after a brief delay
    setTimeout(() => {
        showAnswerFeedback(optionIndex, question.correct);
    }, 500);

    // Enable next button
    document.getElementById('nextQuestion').disabled = false;
}

function showAnswerFeedback(selectedIndex, correctIndex) {
    const options = document.querySelectorAll('.option-btn');
    const question = currentQuiz.questions[currentQuestionIndex];

    // Disable all options
    options.forEach(btn => btn.disabled = true);

    // Show correct answer
    options[correctIndex].classList.add('correct');

    // Show incorrect if different from correct
    if (selectedIndex !== correctIndex) {
        options[selectedIndex].classList.add('incorrect');
    } else {
        score++;
        document.getElementById('currentScore').textContent = `Score: ${score}`;
    }

    // Show explanation
    const explanationDiv = document.getElementById('questionExplanation');
    explanationDiv.innerHTML = `
        <h4>Explanation</h4>
        <p>${question.explanation}</p>
    `;
    explanationDiv.classList.add('show');

    // Stop timer for this question
    clearInterval(timerInterval);
}

function nextQuestion() {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        currentQuestionIndex++;
        timeRemaining = 30;
        displayQuestion();
        startTimer();
        updateProgress();
    } else {
        // Quiz completed
        submitQuiz();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
        updateProgress();
        
        // If question was already answered, show the answer
        if (userAnswers[currentQuestionIndex] !== undefined) {
            const selectedIndex = userAnswers[currentQuestionIndex];
            const question = currentQuiz.questions[currentQuestionIndex];
            selectOption(selectedIndex);
        }
    }
}

function submitQuiz() {
    clearInterval(timerInterval);
    calculateResults();
    displayResults();
}

// ===== TIMER FUNCTIONALITY =====
function startTimer() {
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 10) {
            document.getElementById('timeRemaining').classList.add('warning');
        }
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            // Auto-select random answer or skip
            if (userAnswers[currentQuestionIndex] === undefined) {
                // Skip question
                userAnswers[currentQuestionIndex] = -1; // -1 indicates skipped
            }
            nextQuestion();
        }
    }, 1000);
}

function updateTimerDisplay() {
    document.getElementById('timeRemaining').textContent = `⏱️ ${timeRemaining}s`;
}

// ===== PROGRESS TRACKING =====
function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressText').textContent = 
        `Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}`;
}

function updateQuizControls() {
    // Previous button
    document.getElementById('prevQuestion').disabled = currentQuestionIndex === 0;
    
    // Next button
    document.getElementById('nextQuestion').disabled = userAnswers[currentQuestionIndex] === undefined;
    
    // Submit button
    const isLastQuestion = currentQuestionIndex === currentQuiz.questions.length - 1;
    document.getElementById('nextQuestion').classList.toggle('hidden', isLastQuestion);
    document.getElementById('submitQuiz').classList.toggle('hidden', !isLastQuestion);
}

// ===== LIFELINES =====
function updateLifelines() {
    document.getElementById('fiftyFifty').disabled = !lifelines.fiftyFifty;
    document.getElementById('skipQuestion').disabled = !lifelines.skipQuestion;
    document.getElementById('extraTime').disabled = !lifelines.extraTime;
}

function useFiftyFifty() {
    if (!lifelines.fiftyFifty) return;
    
    lifelines.fiftyFifty = false;
    updateLifelines();
    
    const question = currentQuiz.questions[currentQuestionIndex];
    const options = document.querySelectorAll('.option-btn');
    const correctIndex = question.correct;
    
    // Hide two incorrect options
    let hiddenCount = 0;
    options.forEach((option, index) => {
        if (index !== correctIndex && hiddenCount < 2) {
            option.style.opacity = '0.3';
            option.disabled = true;
            hiddenCount++;
        }
    });
    
    showSuccess('50:50 lifeline used! Two incorrect options have been removed.', document.querySelector('.lifelines'));
}

function useSkipQuestion() {
    if (!lifelines.skipQuestion) return;
    
    lifelines.skipQuestion = false;
    updateLifelines();
    
    // Mark as skipped and move to next
    userAnswers[currentQuestionIndex] = -1;
    nextQuestion();
    
    showSuccess('Question skipped successfully!', document.querySelector('.lifelines'));
}

function useExtraTime() {
    if (!lifelines.extraTime) return;
    
    lifelines.extraTime = false;
    updateLifelines();
    
    timeRemaining += 15;
    updateTimerDisplay();
    
    showSuccess('15 extra seconds added!', document.querySelector('.lifelines'));
}

// ===== RESULTS CALCULATION =====
function calculateResults() {
    const totalQuestions = currentQuiz.questions.length;
    const correctAnswers = userAnswers.filter((answer, index) => 
        answer === currentQuiz.questions[index].correct
    ).length;
    
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const timeTaken = Math.floor((new Date() - quizStartTime) / 1000);
    
    return {
        totalQuestions,
        correctAnswers,
        percentage,
        timeTaken,
        accuracy: percentage
    };
}

function displayResults() {
    const results = calculateResults();
    
    // Hide quiz interface, show results
    document.getElementById('quizInterface').classList.add('hidden');
    document.getElementById('quizResults').classList.remove('hidden');
    
    // Update results content
    updateResultsDisplay(results);
    
    // Animate results
    setTimeout(() => {
        animateResultsStats();
    }, 500);
}

function updateResultsDisplay(results) {
    // Results header
    const { icon, title, subtitle } = getResultsHeader(results.percentage);
    document.getElementById('resultsIcon').textContent = icon;
    document.getElementById('resultsTitle').textContent = title;
    document.getElementById('resultsSubtitle').textContent = subtitle;
    
    // Results stats
    document.getElementById('finalScore').textContent = `${results.percentage}%`;
    document.getElementById('correctAnswers').textContent = `${results.correctAnswers}/${results.totalQuestions}`;
    document.getElementById('timeTaken').textContent = formatTime(results.timeTaken);
    document.getElementById('accuracy').textContent = `${results.accuracy}%`;
    
    // Random cultural fact
    const randomFact = culturalFacts[Math.floor(Math.random() * culturalFacts.length)];
    document.getElementById('culturalFact').innerHTML = `<p>${randomFact}</p>`;
}

function getResultsHeader(percentage) {
    if (percentage >= 90) {
        return {
            icon: '🏆',
            title: 'Outstanding!',
            subtitle: 'You are a true heritage expert!'
        };
    } else if (percentage >= 70) {
        return {
            icon: '🎉',
            title: 'Well Done!',
            subtitle: 'Great knowledge of Indian heritage!'
        };
    } else if (percentage >= 50) {
        return {
            icon: '👍',
            title: 'Good Effort!',
            subtitle: 'Keep exploring to learn more!'
        };
    } else {
        return {
            icon: '📚',
            title: 'Keep Learning!',
            subtitle: 'There\'s so much more to discover!'
        };
    }
}

function animateResultsStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        stat.style.transform = 'scale(1.1)';
        setTimeout(() => {
            stat.style.transform = 'scale(1)';
        }, 200);
    });
}

// ===== UTILITY FUNCTIONS =====
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function retakeQuiz() {
    displayQuizSelection();
}

function shareResults() {
    const results = calculateResults();
    const shareText = `I scored ${results.percentage}% on the Cultural Heritage Quiz! 🏛️ Test your knowledge of India's magnificent heritage at Roots & Wings AR Platform.`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Cultural Heritage Quiz Results',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            showSuccess('Results copied to clipboard!', document.querySelector('.results-actions'));
        });
    }
}

// Utility functions from main.js
function showSuccess(message, container) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    successDiv.style.position = 'absolute';
    successDiv.style.top = '100%';
    successDiv.style.left = '50%';
    successDiv.style.transform = 'translateX(-50%)';
    successDiv.style.zIndex = '1000';
    
    container.style.position = 'relative';
    container.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// ===== EXPORT FOR GLOBAL ACCESS =====
window.QuizApp = {
    startQuiz,
    retakeQuiz,
    shareResults
};
