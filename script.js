// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadPrinciples();
    loadGoals('four-years', GOALS_CONFIG.fourYears);
    loadGoals('four-months', GOALS_CONFIG.fourMonths);
    loadGoals('four-weeks', GOALS_CONFIG.fourWeeks);
    loadLastUpdated();
    setupAutoResize();
    setupScrollAnimations();
});

// Load principles from config
function loadPrinciples() {
    const container = document.getElementById('principles-container');
    GOALS_CONFIG.principles.forEach(principle => {
        const item = document.createElement('div');
        item.className = 'principle-item';
        item.innerHTML = `
            <input type="text" class="principle-title" value="${principle.title}" placeholder="Principle name">
            <textarea class="principle-desc" placeholder="Description">${principle.description}</textarea>
        `;
        container.appendChild(item);
    });
}

// Load goals from config with staggered animation
function loadGoals(timeline, goals) {
    const container = document.getElementById(`${timeline}-container`);
    goals.forEach((goal, index) => {
        const row = createGoalRow(goal.text, goal.date, goal.notes);
        row.style.animationDelay = `${index * 0.08 + 0.3}s`;
        container.appendChild(row);
    });
}

// Create a goal row element
function createGoalRow(text = '', date = '', notes = '') {
    const row = document.createElement('div');
    row.className = 'goal-row';
    row.innerHTML = `
        <textarea class="goal-box" placeholder="Write your goal here...">${text}</textarea>
        <div class="notes-section">
            <input type="text" class="date-field" placeholder="Date: __ / __ / __" value="${date}">
            <textarea class="notes-box" placeholder="notes">${notes}</textarea>
        </div>
    `;
    return row;
}

// Add new goal dynamically with smooth animation
function addGoal(timeline) {
    const container = document.getElementById(`${timeline}-container`);
    const row = createGoalRow();

    // Add with initial state
    row.style.opacity = '0';
    row.style.transform = 'translateX(-30px) scale(0.95)';
    container.appendChild(row);

    // Smooth entrance animation
    requestAnimationFrame(() => {
        setTimeout(() => {
            row.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            row.style.opacity = '1';
            row.style.transform = 'translateX(0) scale(1)';
        }, 10);
    });

    // Auto-resize for new textareas
    setupAutoResize();

    // Focus on the new goal with slight delay
    const goalBox = row.querySelector('.goal-box');
    setTimeout(() => {
        goalBox.focus();
    }, 300);
}

// Auto-resize textareas as user types with smooth transition
function setupAutoResize() {
    const textareas = document.querySelectorAll('.goal-box');

    textareas.forEach(textarea => {
        const resize = () => {
            textarea.style.height = 'auto';
            const newHeight = textarea.scrollHeight;
            textarea.style.height = newHeight + 'px';
        };

        textarea.removeEventListener('input', resize);
        textarea.addEventListener('input', resize);

        // Add focus and blur effects
        textarea.addEventListener('focus', () => {
            textarea.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });

        resize(); // Initial resize
    });
}

// Enhanced scroll animations for sections
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                // Stagger animate the goals within the section
                const goalRows = entry.target.querySelectorAll('.goal-row');
                goalRows.forEach((row, index) => {
                    setTimeout(() => {
                        row.style.opacity = '1';
                        row.style.transform = 'translateX(0)';
                    }, index * 50);
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.timeline-section').forEach(section => {
        observer.observe(section);
    });
}

// Load last updated date
function loadLastUpdated() {
    const dateInput = document.getElementById('last-updated');
    const saved = localStorage.getItem('lastUpdated');
    if (saved) {
        dateInput.value = saved;
    }
    
    dateInput.addEventListener('change', () => {
        localStorage.setItem('lastUpdated', dateInput.value);
    });
}

// Export to PDF
function exportToPDF() {
    // Show a nice animation
    const btn = document.querySelector('.export-btn');
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 200);
    
    // Trigger print dialog (which can save as PDF)
    window.print();
}

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add subtle parallax effect to header
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const header = document.querySelector('.header');
    if (header) {
        header.style.transform = `translateY(${scrolled * 0.3}px)`;
        header.style.opacity = 1 - (scrolled / 500);
    }
});

// Add ripple effect to dividers
document.querySelectorAll('.timeline-divider').forEach(divider => {
    divider.addEventListener('click', function(e) {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(74, 144, 226, 0.4)';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'ripple 0.6s ease-out';
        
        const rect = this.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top = (e.clientY - rect.top) + 'px';
        
        this.style.position = 'relative';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        from {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        to {
            transform: translate(-50%, -50%) scale(10);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add magnetic effect to buttons
function setupMagneticButtons() {
    const buttons = document.querySelectorAll('.add-goal-btn, .export-btn');

    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Limit the magnetic effect
            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = 50;

            if (distance < maxDistance) {
                const strength = 0.3;
                button.style.transform = `translate(${x * strength}px, ${y * strength}px) translateY(-3px) scale(1.01)`;
            }
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
}

// Setup enhanced interactions
document.addEventListener('DOMContentLoaded', () => {
    setupMagneticButtons();

    // Add smooth parallax to principles section
    const principlesSection = document.querySelector('.principles-section');
    if (principlesSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rect = principlesSection.getBoundingClientRect();
            const elementTop = rect.top + scrolled;
            const elementVisible = rect.top < window.innerHeight && rect.bottom > 0;

            if (elementVisible) {
                const parallaxSpeed = 0.1;
                const yPos = -(scrolled - elementTop) * parallaxSpeed;
                principlesSection.style.transform = `translateY(${yPos}px) translateX(4px)`;
            }
        });
    }

    // Add enhanced focus indicators
    const allInputs = document.querySelectorAll('input, textarea');
    allInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
    });
});