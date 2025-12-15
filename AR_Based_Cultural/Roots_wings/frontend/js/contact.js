/**
 * Contact Page JavaScript - Heritage Platform
 * Handles form validation, submission, FAQ interactions, and contact features
 * Integrated with EmailJS for email sending
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create an account at https://www.emailjs.com/
 * 2. Create an email service (Gmail, Outlook, etc.)
 * 3. Create an email template with the following variables:
 *    - {{from_name}} - Sender's full name
 *    - {{from_email}} - Sender's email
 *    - {{phone}} - Sender's phone number
 *    - {{subject}} - Email subject
 *    - {{message}} - Message content
 *    - {{newsletter}} - Newsletter subscription
 *    - {{timestamp}} - Submission timestamp
 * 4. Replace the EMAILJS_CONFIG values below with your actual IDs
 */

// ===== GLOBAL VARIABLES =====
let formData = {};
let isSubmitting = false;

// EmailJS Configuration
const EMAILJS_CONFIG = {
    serviceID: 'service_2hml1vj', // Your Gmail service ID
    templateID: 'template_uduf597', // Your template ID
    publicKey: 'gy2vaZWQSm5PWKOQ1H8FP' // Your public key
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
});

function initializeContactPage() {
    initializeEmailJS();
    setupEventListeners();
    initializeFormValidation();
    initializeFAQ();
    loadSavedFormData();
}

// Initialize EmailJS
function initializeEmailJS() {
    try {
        if (typeof emailjs !== 'undefined') {
            emailjs.init(EMAILJS_CONFIG.publicKey);
            console.log('✅ EmailJS initialized successfully with service:', EMAILJS_CONFIG.serviceID);
            console.log('📧 Template ID:', EMAILJS_CONFIG.templateID);
        } else {
            console.warn('⚠️ EmailJS library not loaded. Form will use fallback method.');
        }
    } catch (error) {
        console.error('❌ EmailJS initialization failed:', error);
    }
}

function setupEventListeners() {
    // Form submission
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', handleFormSubmit);

    // Real-time validation
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });

    // Character counter for message
    const messageInput = document.getElementById('message');
    messageInput.addEventListener('input', updateCharacterCount);

    // FAQ interactions
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => toggleFAQ(item));
    });

    // Modal controls
    document.getElementById('closeModal').addEventListener('click', closeSuccessModal);
    
    // Close modal on outside click
    document.getElementById('successModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeSuccessModal();
        }
    });

    // Auto-save form data
    const autoSaveInputs = contactForm.querySelectorAll('input:not([type="checkbox"]), select, textarea');
    autoSaveInputs.forEach(input => {
        input.addEventListener('input', debounce(saveFormData, 1000));
    });
}

// ===== FORM VALIDATION =====
function initializeFormValidation() {
    // Set up validation rules
    const validationRules = {
        firstName: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'First name must be at least 2 characters and contain only letters'
        },
        lastName: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Last name must be at least 2 characters and contain only letters'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        phone: {
            required: false,
            pattern: /^[\+]?[0-9\s\-\(\)]{10,15}$/,
            message: 'Please enter a valid phone number'
        },
        subject: {
            required: true,
            message: 'Please select a subject'
        },
        message: {
            required: true,
            minLength: 10,
            maxLength: 500,
            message: 'Message must be between 10 and 500 characters'
        },
        privacy: {
            required: true,
            message: 'You must agree to the privacy policy'
        }
    };

    window.validationRules = validationRules;
}

function validateField(field) {
    const fieldName = field.name;
    const rules = window.validationRules[fieldName];
    
    if (!rules) return true;

    const value = field.value.trim();
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');

    // Clear previous states
    formGroup.classList.remove('error', 'success');
    errorElement.textContent = '';

    // Required validation
    if (rules.required && !value) {
        if (field.type === 'checkbox' && !field.checked) {
            showFieldError(formGroup, errorElement, rules.message);
            return false;
        } else if (field.type !== 'checkbox' && !value) {
            showFieldError(formGroup, errorElement, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`);
            return false;
        }
    }

    // Skip other validations if field is empty and not required
    if (!value && !rules.required) {
        return true;
    }

    // Length validation
    if (rules.minLength && value.length < rules.minLength) {
        showFieldError(formGroup, errorElement, rules.message);
        return false;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
        showFieldError(formGroup, errorElement, rules.message);
        return false;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
        showFieldError(formGroup, errorElement, rules.message);
        return false;
    }

    // Show success state
    formGroup.classList.add('success');
    return true;
}

function showFieldError(formGroup, errorElement, message) {
    formGroup.classList.add('error');
    errorElement.textContent = message;
}

function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    formGroup.classList.remove('error');
    errorElement.textContent = '';
}

function validateForm() {
    const form = document.getElementById('contactForm');
    const formInputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    formInputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    // Special validation for privacy checkbox
    const privacyCheckbox = document.getElementById('privacy');
    if (!privacyCheckbox.checked) {
        const formGroup = privacyCheckbox.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        showFieldError(formGroup, errorElement, 'You must agree to the privacy policy');
        isValid = false;
    }

    return isValid;
}

// ===== FORM SUBMISSION =====
function handleFormSubmit(event) {
    event.preventDefault();
    
    if (isSubmitting) return;
    
    // Validate form
    if (!validateForm()) {
        showFormError('Please correct the errors above before submitting.');
        return;
    }

    // Start submission process
    isSubmitting = true;
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin btn-icon"></i> Sending...';
    submitBtn.disabled = true;

    // Collect form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Add timestamp and additional info
    data.timestamp = new Date().toLocaleString();
    data.userAgent = navigator.userAgent;
    data.pageUrl = window.location.href;

    // Send email using EmailJS
    sendEmailViaEmailJS(data)
        .then(response => {
            // Success
            console.log('Email sent successfully:', response);
            showSuccessModal();
            resetForm();
            clearSavedFormData();
        })
        .catch(error => {
            // Error
            console.error('Email sending error:', error);
            showFormError('Sorry, there was an error sending your message. Please try again or contact us directly.');
        })
        .finally(() => {
            // Reset button state
            isSubmitting = false;
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
}

// Send email using EmailJS
function sendEmailViaEmailJS(data) {
    return new Promise((resolve, reject) => {
        // Check if EmailJS is available
        if (typeof emailjs === 'undefined') {
            console.warn('EmailJS not available, using fallback method');
            // Use fallback method (localStorage simulation)
            return submitForm(data).then(resolve).catch(reject);
        }

        // Prepare template parameters
        const templateParams = {
            from_name: `${data.firstName} ${data.lastName}`,
            from_email: data.email,
            phone: data.phone || 'Not provided',
            subject: data.subject,
            message: data.message,
            newsletter: data.newsletter ? 'Yes' : 'No',
            timestamp: data.timestamp,
            user_agent: data.userAgent,
            page_url: data.pageUrl
        };

        // Validate configuration
        if (!EMAILJS_CONFIG.serviceID || !EMAILJS_CONFIG.templateID || 
            EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
            console.warn('EmailJS not properly configured, using fallback method');
            return submitForm(data).then(resolve).catch(reject);
        }

        // Send email using EmailJS
        emailjs.send(
            EMAILJS_CONFIG.serviceID,
            EMAILJS_CONFIG.templateID,
            templateParams
        ).then((response) => {
            console.log('EmailJS Success:', response.status, response.text);
            resolve(response);
        }).catch((error) => {
            console.error('EmailJS Error:', error);
            // Try fallback method if EmailJS fails
            console.log('Attempting fallback method...');
            submitForm(data).then(resolve).catch(reject);
        });
    });
}

// Legacy function for backward compatibility
function submitForm(data) {
    return new Promise((resolve, reject) => {
        // Store in localStorage for demo purposes
        const submissions = JSON.parse(localStorage.getItem('contact-submissions') || '[]');
        submissions.push(data);
        localStorage.setItem('contact-submissions', JSON.stringify(submissions));
        
        // Simulate success/failure
        if (Math.random() > 0.1) { // 90% success rate
            resolve({ success: true, message: 'Form submitted successfully' });
        } else {
            reject(new Error('Network error'));
        }
    });
}

function showFormError(message) {
    // Remove existing error messages
    const existingError = document.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }

    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error error';
    errorDiv.textContent = message;
    
    // Insert before submit button
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.parentNode.insertBefore(errorDiv, submitBtn);
    
    // Remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function resetForm() {
    const form = document.getElementById('contactForm');
    form.reset();
    
    // Clear validation states
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.classList.remove('error', 'success');
        const errorElement = group.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
        }
    });
    
    // Reset character count
    updateCharacterCount();
}

// ===== CHARACTER COUNTER =====
function updateCharacterCount() {
    const messageInput = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    const currentLength = messageInput.value.length;
    const maxLength = 500;
    
    charCount.textContent = currentLength;
    
    // Change color based on usage
    if (currentLength > maxLength * 0.9) {
        charCount.style.color = '#e74c3c';
    } else if (currentLength > maxLength * 0.7) {
        charCount.style.color = '#f39c12';
    } else {
        charCount.style.color = '#666666';
    }
    
    // Prevent exceeding max length
    if (currentLength > maxLength) {
        messageInput.value = messageInput.value.substring(0, maxLength);
        charCount.textContent = maxLength;
    }
}

// ===== FAQ FUNCTIONALITY =====
function initializeFAQ() {
    // Close all FAQ items initially
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.classList.remove('active');
    });
}

function toggleFAQ(faqItem) {
    const isActive = faqItem.classList.contains('active');
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Toggle current item
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// ===== SUCCESS MODAL =====
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('hidden');
    
    // Focus management for accessibility
    const closeButton = document.getElementById('closeModal');
    closeButton.focus();
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('hidden');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Return focus to form
    document.getElementById('firstName').focus();
}

// ===== FORM DATA PERSISTENCE =====
function saveFormData() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    const data = {};
    
    // Save only non-sensitive data
    const fieldsToSave = ['firstName', 'lastName', 'subject'];
    fieldsToSave.forEach(field => {
        if (formData.has(field)) {
            data[field] = formData.get(field);
        }
    });
    
    try {
        localStorage.setItem('contact-form-draft', JSON.stringify(data));
    } catch (e) {
        console.warn('Could not save form data:', e);
    }
}

function loadSavedFormData() {
    try {
        const savedData = localStorage.getItem('contact-form-draft');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            Object.keys(data).forEach(key => {
                const field = document.getElementById(key);
                if (field && data[key]) {
                    field.value = data[key];
                }
            });
        }
    } catch (e) {
        console.warn('Could not load saved form data:', e);
    }
}

function clearSavedFormData() {
    try {
        localStorage.removeItem('contact-form-draft');
    } catch (e) {
        console.warn('Could not clear saved form data:', e);
    }
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
document.addEventListener('keydown', function(e) {
    // Close modal with Escape key
    if (e.key === 'Escape') {
        const modal = document.getElementById('successModal');
        if (!modal.classList.contains('hidden')) {
            closeSuccessModal();
        }
    }
    
    // FAQ navigation with keyboard
    if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.classList.contains('faq-question')) {
            e.preventDefault();
            const faqItem = e.target.closest('.faq-item');
            toggleFAQ(faqItem);
        }
    }
});

// ===== ANALYTICS & TRACKING =====
function trackFormInteraction(action, field = null) {
    // In a real application, you would send this to your analytics service
    console.log('Form interaction:', { action, field, timestamp: new Date().toISOString() });
}

// Track form start
document.getElementById('firstName').addEventListener('focus', function() {
    trackFormInteraction('form_started');
}, { once: true });

// Track field interactions
document.querySelectorAll('#contactForm input, #contactForm select, #contactForm textarea').forEach(field => {
    field.addEventListener('focus', function() {
        trackFormInteraction('field_focused', this.name);
    });
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('Contact page error:', e.error);
    // You could send this to an error reporting service
});

// ===== EXPORT FOR GLOBAL ACCESS =====
window.ContactApp = {
    validateForm,
    submitForm: handleFormSubmit,
    showSuccessModal,
    closeSuccessModal,
    toggleFAQ
};
