        // Enhanced JavaScript for Trading Investment Platform
        
        // Elements
        const header = document.getElementById('siteHeader');
        const hamburger = document.getElementById('hamburger');
        const mobileNav = document.getElementById('mobileNav');
        const overlay = document.getElementById('overlay');
        const currentTime = document.getElementById('currentTime');
        const navLinks = document.querySelectorAll('.nav-link');
        const ctaButtons = document.querySelectorAll('.cta-button, .primary-btn, .plan-button, .submit-btn');
        const faqTriggers = document.querySelectorAll('.faq-trigger');
        const footerYear = document.getElementById('footer-year');
        
        // Set current year in footer
        if (footerYear) {
            footerYear.textContent = new Date().getFullYear();
        }
        
        // Update time function with next payout calculation
        function updateTime() {
            const now = new Date();
            
            // Calculate next payout time (next UTC midnight)
            const nextPayout = new Date();
            nextPayout.setUTCHours(24, 0, 0, 0);
            const timeUntilPayout = nextPayout - now;
            
            const hours = Math.floor(timeUntilPayout / (1000 * 60 * 60));
            const minutes = Math.floor((timeUntilPayout % (1000 * 60 * 60)) / (1000 * 60));
            
            if (currentTime) {
                currentTime.textContent = `Next Payout: ${hours}h ${minutes}m`;
            }
        }
        
        // Initialize time
        updateTime();
        setInterval(updateTime, 60000); // Update every minute
        
        // Scroll function for header
        function handleScroll() {
            const y = window.scrollY;
            if (y > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Update active nav link based on scroll position
            updateActiveNavLink();
        }
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        
        // Mobile menu functionality
        function toggleMobileMenu() {
            const isActive = mobileNav.classList.contains('active');
            
            if (isActive) {
                // Close menu
                mobileNav.classList.remove('active');
                overlay.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            } else {
                // Open menu
                mobileNav.classList.add('active');
                overlay.classList.add('active');
                hamburger.classList.add('active');
                hamburger.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
            }
        }
        
        hamburger.addEventListener('click', toggleMobileMenu);
        overlay.addEventListener('click', toggleMobileMenu);
        
        // Close mobile menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Scroll to section
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update active state
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    
                    // Close mobile menu if open
                    if (mobileNav.classList.contains('active')) {
                        toggleMobileMenu();
                    }
                }
            });
        });
        
        // Add click handlers to CTA buttons
        ctaButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Add loading animation
                this.classList.add('loading');
                
                // Remove loading after animation
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 1500);
                
                // If it's a form submit button, prevent default
                if (this.type === 'submit') {
                    e.preventDefault();
                    submitContactForm();
                }
            });
        });
        
        // Plan card selection
        function selectPlan(planName) {
            const planButtons = document.querySelectorAll('.plan-button');
            planButtons.forEach(btn => {
                btn.innerHTML = btn.innerHTML.replace('✓', '').replace('Selected', 'Invest');
            });
            
            const selectedButton = event.target.closest('.plan-button');
            if (selectedButton) {
                selectedButton.innerHTML = selectedButton.innerHTML.replace('Invest', '✓ Selected');
                selectedButton.style.background = 'linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(76, 175, 80, 0.1))';
                selectedButton.style.borderColor = 'rgba(76, 175, 80, 0.3)';
                
                // Get ROI based on plan
                let dailyROI = 0;
                switch(planName) {
                    case 'Basic': dailyROI = 1.8; break;
                    case 'Professional': dailyROI = 2.5; break;
                    case 'Elite': dailyROI = 3.2; break;
                }
                
                // Show success message
                showNotification(`Selected ${planName} Plan (${dailyROI}% Daily ROI)!`, 'success');
                
                // Show ROI calculator modal
                setTimeout(() => {
                    showROICalculator(planName, dailyROI);
                }, 1000);
            }
        }
        
        // Show ROI Calculator Modal
        function showROICalculator(planName, dailyROI) {
            // Remove existing calculator if present
            const existingCalculator = document.querySelector('.roi-calculator-modal');
            if (existingCalculator) existingCalculator.remove();
            
            const calculatorHTML = `
                <div class="roi-calculator-modal" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    backdrop-filter: blur(10px);
                ">
                    <div style="
                        background: rgba(20,20,20,0.95);
                        border: 1px solid rgba(255,255,255,0.1);
                        border-radius: 20px;
                        padding: 30px;
                        width: 90%;
                        max-width: 500px;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                    ">
                        <h3 style="color: #fff; margin-bottom: 20px;">${planName} Plan Calculator</h3>
                        <p style="color: #4CAF50; margin-bottom: 20px;">Daily ROI: ${dailyROI}%</p>
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; color: #fff; margin-bottom: 8px;">Investment Amount ($):</label>
                            <input type="number" id="investmentAmount" value="1000" min="99" max="50000" style="
                                width: 100%;
                                padding: 12px;
                                background: rgba(255,255,255,0.05);
                                border: 1px solid rgba(255,255,255,0.1);
                                border-radius: 8px;
                                color: #fff;
                                font-size: 16px;
                            ">
                        </div>
                        <div style="background: rgba(255,255,255,0.02); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span style="color: #aaa;">Daily Earnings:</span>
                                <span style="color: #4CAF50; font-weight: bold;" id="dailyEarnings">$${(1000 * dailyROI / 100).toFixed(2)}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span style="color: #aaa;">Weekly Earnings:</span>
                                <span style="color: #4CAF50; font-weight: bold;" id="weeklyEarnings">$${(1000 * dailyROI / 100 * 7).toFixed(2)}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: #aaa;">Monthly Earnings:</span>
                                <span style="color: #4CAF50; font-weight: bold;" id="monthlyEarnings">$${(1000 * dailyROI / 100 * 30).toFixed(2)}</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button onclick="proceedToInvestment('${planName}', ${dailyROI})" style="
                                flex: 1;
                                padding: 12px;
                                background: linear-gradient(135deg, #666, #444);
                                color: #fff;
                                border: none;
                                border-radius: 8px;
                                cursor: pointer;
                                font-weight: bold;
                            ">Proceed to Investment</button>
                            <button onclick="closeCalculator()" style="
                                padding: 12px 24px;
                                background: rgba(255,255,255,0.05);
                                color: #fff;
                                border: 1px solid rgba(255,255,255,0.1);
                                border-radius: 8px;
                                cursor: pointer;
                            ">Close</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add calculator to page
            const calculatorDiv = document.createElement('div');
            calculatorDiv.innerHTML = calculatorHTML;
            document.body.appendChild(calculatorDiv);
            
            // Add event listener for input changes
            document.getElementById('investmentAmount').addEventListener('input', function(e) {
                const amount = parseFloat(e.target.value) || 0;
                document.getElementById('dailyEarnings').textContent = '$' + (amount * dailyROI / 100).toFixed(2);
                document.getElementById('weeklyEarnings').textContent = '$' + (amount * dailyROI / 100 * 7).toFixed(2);
                document.getElementById('monthlyEarnings').textContent = '$' + (amount * dailyROI / 100 * 30).toFixed(2);
            });
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
        
        // Close calculator
        function closeCalculator() {
            const calculator = document.querySelector('.roi-calculator-modal');
            if (calculator) calculator.remove();
            document.body.style.overflow = '';
        }
        
        // Proceed to investment
        function proceedToInvestment(planName, dailyROI) {
            const amountInput = document.getElementById('investmentAmount');
            const amount = amountInput ? parseFloat(amountInput.value) : 1000;
            
            closeCalculator();
            
            showNotification(`Redirecting to ${planName} investment...`, 'success');
            
            // Simulate redirect (in real implementation, this would redirect to payment gateway)
            setTimeout(() => {
                showNotification(`Successfully invested $${amount} in ${planName} Plan!`, 'success');
            }, 1500);
        }
        
        // FAQ Accordion functionality
        faqTriggers.forEach(trigger => {
            trigger.addEventListener('click', function() {
                const isOpen = this.getAttribute('aria-expanded') === 'true';
                const panel = document.getElementById(this.getAttribute('aria-controls'));
                
                // Close all other FAQ items
                faqTriggers.forEach(otherTrigger => {
                    if (otherTrigger !== this) {
                        otherTrigger.setAttribute('aria-expanded', 'false');
                        otherTrigger.classList.remove('open');
                        const otherPanel = document.getElementById(otherTrigger.getAttribute('aria-controls'));
                        if (otherPanel) {
                            otherPanel.classList.remove('open');
                        }
                    }
                });
                
                // Toggle current item
                this.setAttribute('aria-expanded', !isOpen);
                this.classList.toggle('open');
                if (panel) {
                    panel.classList.toggle('open');
                }
            });
        });
        
        // Contact form submission
        function submitContactForm() {
            const form = document.getElementById('contactForm');
            const submitBtn = document.getElementById('submitBtn');
            const formStatus = document.getElementById('formStatus');
            
            // Get form data
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Simple validation
            if (!name || !email || !message) {
                showFormStatus('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showFormStatus('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show sending state
            submitBtn.innerHTML = '<span class="btn-text">Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Show success message
                showFormStatus('Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
                
                // Reset form
                form.reset();
                
                // Reset button
                submitBtn.innerHTML = '<span class="btn-text">Send Message</span><i class="fas fa-paper-plane"></i>';
                submitBtn.disabled = false;
                
                // Show notification
                showNotification('Your message has been sent successfully!', 'success');
            }, 2000);
        }
        
        // Email validation
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
        
        // Show form status
        function showFormStatus(message, type) {
            const formStatus = document.getElementById('formStatus');
            if (formStatus) {
                formStatus.textContent = message;
                formStatus.className = `form-status ${type}`;
                
                // Hide after 5 seconds
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                }, 5000);
            }
        }
        
        // Show notification
        function showNotification(message, type) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 14px;
                z-index: 9999;
                animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                backdrop-filter: blur(10px);
            `;
            
            document.body.appendChild(notification);
            
            // Remove after 3 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 3000);
        }
        
        // Create animated chart dots showing growth
        function createChartDots() {
            const chartContainer = document.querySelector('.chart-container');
            if (!chartContainer) return;
            
            // Clear existing dots
            chartContainer.querySelectorAll('.chart-dot').forEach(dot => dot.remove());
            
            // Create growing line pattern
            for (let i = 0; i < 12; i++) {
                const dot = document.createElement('div');
                dot.className = 'chart-dot';
                
                // Position dots in upward trend
                const left = 5 + (i * (90 / 11));
                const baseHeight = 30;
                const growth = i * 3; // Simulating growth
                const top = baseHeight + growth + (Math.random() * 5);
                
                dot.style.left = `${left}%`;
                dot.style.top = `${top}%`;
                
                // Make dots appear sequentially
                const delay = i * 0.2;
                dot.style.animationDelay = `${delay}s`;
                
                // Size increases with position (simulating growth)
                const size = 8 + (i * 0.5);
                dot.style.width = `${size}px`;
                dot.style.height = `${size}px`;
                
                // Color changes from green to gold (success)
                const greenValue = 100 + (i * 10);
                const goldValue = 150 + (i * 5);
                dot.style.background = `radial-gradient(circle at 30% 30%, rgb(${greenValue}, 255, ${greenValue}), rgb(255, ${goldValue}, 0))`;
                
                chartContainer.appendChild(dot);
            }
        }
        
        // Update active nav link based on scroll position
        function updateActiveNavLink() {
            const sections = document.querySelectorAll('section[id]');
            const scrollPosition = window.scrollY + 100;
            
            let currentSection = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = sectionId;
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        }
        
        // Initialize everything when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            createChartDots();
            updateTime();
            handleScroll();
            
            // Add keyboard navigation
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    // Close mobile menu if open
                    if (mobileNav.classList.contains('active')) {
                        toggleMobileMenu();
                    }
                    // Close calculator if open
                    closeCalculator();
                }
            });
            
            // Animate elements on scroll
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            // Observe elements for animation
            const animatedElements = document.querySelectorAll('.plan-card, .expertise-card, .form-group, .detail-item');
            animatedElements.forEach(el => {
                if (el.style.opacity === '0') {
                    observer.observe(el);
                }
            });
            
            // Newsletter subscription
            const subscribeForm = document.getElementById('subscribe-form');
            if (subscribeForm) {
                subscribeForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const emailInput = this.querySelector('input[type="email"]');
                    const button = this.querySelector('button');
                    
                    if (emailInput.value && validateEmail(emailInput.value)) {
                        // Show loading
                        const originalText = button.textContent;
                        button.textContent = 'Subscribing...';
                        button.disabled = true;
                        
                        // Simulate API call
                        setTimeout(() => {
                            // Show success
                            showNotification('Successfully subscribed to daily market updates!', 'success');
                            emailInput.value = '';
                            button.textContent = originalText;
                            button.disabled = false;
                        }, 1500);
                    } else {
                        showNotification('Please enter a valid email address.', 'error');
                    }
                });
            }
            
            // Add daily earnings ticker
            createDailyEarningsTicker();
        });
        
        // Create daily earnings ticker
        function createDailyEarningsTicker() {
            const tickerHTML = `
                <div style="
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: rgba(15,15,15,0.95);
                    border-top: 1px solid rgba(255,255,255,0.1);
                    padding: 10px 20px;
                    z-index: 999;
                    backdrop-filter: blur(10px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
                    color: #fff;
                    font-size: 14px;
                ">
                    <span>Today's Total Payouts:</span>
                    <span style="color: #4CAF50; font-weight: bold;">$</span>
                    <span style="color: #4CAF50; font-weight: bold;" id="tickerAmount">0</span>
                    <span style="color: #aaa; font-size: 12px;">• Updated every minute</span>
                </div>
            `;
            
            const tickerDiv = document.createElement('div');
            tickerDiv.innerHTML = tickerHTML;
            document.body.appendChild(tickerDiv);
            
            // Animate ticker
            let amount = 0;
            const targetAmount = 124857; // Random large number
            const tickerElement = document.getElementById('tickerAmount');
            
            const updateTicker = () => {
                if (amount < targetAmount) {
                    amount += Math.floor(Math.random() * 100) + 50;
                    if (amount > targetAmount) amount = targetAmount;
                    if (tickerElement) {
                        tickerElement.textContent = amount.toLocaleString();
                    }
                }
            };
            
            // Update every 2 seconds
            setInterval(updateTicker, 2000);
            updateTicker(); // Initial update
        }
        
        // Resize handler
        window.addEventListener('resize', function() {
            if (window.innerWidth > 992 && mobileNav.classList.contains('active')) {
                toggleMobileMenu();
            }
            
            // Recreate chart dots on resize
            createChartDots();
        });
        
        // Add scroll event for parallax effect
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroVisual = document.querySelector('.hero-visual');
            
            if (heroVisual) {
                heroVisual.style.transform = `translateY(${scrolled * 0.05}px)`;
            }
            
            // Animate expertise cards on scroll
            const expertiseCards = document.querySelectorAll('.expertise-card');
            expertiseCards.forEach((card, index) => {
                const cardTop = card.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (cardTop < windowHeight * 0.85) {
                    card.style.animationDelay = `${index * 0.2}s`;
                    card.style.animation = 'fadeIn 0.8s ease forwards';
                }
            });
        });
         function selectMethod(method) {
      const labels = {
        jazzcash: 'JazzCash',
        easypaisa: 'Easypaisa',
        paypal: 'PayPal',
        usdt: 'USDT',
        bank: 'Bank Transfer',
        skrill: 'Skrill',
        neteller: 'Neteller',
        bitcoin: 'Bitcoin',
        ethereum: 'Ethereum',
        perfectmoney: 'Perfect Money',
        payeer: 'Payeer',
        advcash: 'AdvCash',
        westernunion: 'Western Union',
        moneygram: 'MoneyGram',
        visa: 'Visa Card',
        mastercard: 'Mastercard'
      };
      
      // Remove active class from all cards
      document.querySelectorAll('.payment-card').forEach(card => {
        card.classList.remove('active');
      });
      
      // Add active class to clicked card
      event.currentTarget.classList.add('active');
      
      // For demo - in real app, this would integrate with your backend
      console.log(`Selected: ${labels[method]}`);
      
      // Optional: Show brief feedback
      alert(`${labels[method]} selected for withdrawal`);
      
      // Store the selected method for use in withdrawal form
      localStorage.setItem('selectedPaymentMethod', method);
    }
    
    // Initialize - check if there's a previously selected method
    document.addEventListener('DOMContentLoaded', function() {
      const savedMethod = localStorage.getItem('selectedPaymentMethod');
      if (savedMethod) {
        const savedCard = document.querySelector(`.payment-card.${savedMethod}`);
        if (savedCard) {
          savedCard.classList.add('active');
        }
      }
    });
       // Smooth scroll animation for steps
        document.addEventListener('DOMContentLoaded', function () {
            const steps = document.querySelectorAll('.task-earn-step');

            // Initially hide all steps
            steps.forEach(step => {
                if (!step.classList.contains('visible')) {
                    step.style.opacity = '0';
                    step.style.transform = 'translateY(20px)';
                }
            });

            // Intersection Observer for scroll animations
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '0px 0px -100px 0px'
            });

            steps.forEach(step => {
                observer.observe(step);
            });

            // Hover effects for cards
            const cards = document.querySelectorAll('.step-media, .step-content');
            cards.forEach(card => {
                card.addEventListener('mouseenter', function () {
                    this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                });

                card.addEventListener('mouseleave', function () {
                    this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                });
            });

            // Button click effects
            const buttons = document.querySelectorAll('.step-cta');
            buttons.forEach(button => {
                button.addEventListener('click', function (e) {
                    e.preventDefault();

                    // Add click animation
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 200);

                    // Get step number from parent
                    const stepNumber = this.closest('.task-earn-step').querySelector('.step-number').textContent;
                    console.log(`Step ${stepNumber} CTA clicked`);

                    // In a real application, this would redirect to the appropriate page
                    // alert(`Redirecting to ${this.getAttribute('href').substring(1)} page...`);
                });
            });

            // Add keyboard navigation
            document.addEventListener('keydown', function (e) {
                const visibleStep = document.querySelector('.task-earn-step:hover');

                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (visibleStep && visibleStep.nextElementSibling) {
                        visibleStep.nextElementSibling.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }

                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (visibleStep && visibleStep.previousElementSibling) {
                        visibleStep.previousElementSibling.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            });

            // Add smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    if (targetId !== '#') {
                        const targetElement = document.querySelector(targetId);
                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }
                });
            });
        });

        // Handle image loading errors
        window.addEventListener('load', function () {
            const images = document.querySelectorAll('.step-media img');
            images.forEach(img => {
                img.onerror = function () {
                    this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiByeD0iMjAiIGZpbGw9IiMxQTFBMUEiLz4KPHBhdGggZD0iTTIwMCAxNTBMMzAwIDI1MEw0MDAgMTUwIiBzdHJva2U9IiNGRkQ3MDAiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjMwMCIgcj0iNDAiIGZpbGw9IiNGRkQ3MDAiLz4KPGNpcmNsZSBjeD0iNDAwIiBjeT0iMzAwIiByPSI0MCIgZmlsbD0iI0ZGRDcwMCIvPgo8L3N2Zz4K';
                    this.alt = 'Placeholder Image';
                };
            });
        });
