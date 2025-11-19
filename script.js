// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadPrinciples();
    loadGoals('four-years', GOALS_CONFIG.fourYears);
    loadGoals('four-months', GOALS_CONFIG.fourMonths);
    loadGoals('four-weeks', GOALS_CONFIG.fourWeeks);
    loadLastUpdated();
    setupAutoResize();
    setupDragSelection();
    setupChelseaEasterEgg();
    setupMariaEasterEgg();
    showView('home');
});

// Load principles from config
function loadPrinciples() {
    const container = document.getElementById('principles-container');
    GOALS_CONFIG.principles.forEach(principle => {
        const item = document.createElement('div');
        item.className = 'principle-item';
        item.innerHTML = `
            <input type="text" class="principle-title" value="${principle.title}" placeholder="principle name">
            <textarea class="principle-desc" placeholder="description">${principle.description}</textarea>
        `;
        container.appendChild(item);
    });
}

// Load goals from config
function loadGoals(timeline, goals) {
    const container = document.getElementById(`${timeline}-container`);
    goals.forEach((goal) => {
        const row = createGoalRow(goal.text, goal.date, goal.notes);
        container.appendChild(row);
    });
}

// Create a goal row element
function createGoalRow(text = '', date = '', notes = '') {
    const row = document.createElement('div');
    row.className = 'goal-row';
    row.innerHTML = `
        <textarea class="goal-box" placeholder="write your goal here...">${text}</textarea>
        <div class="notes-section">
            <input type="text" class="date-field" placeholder="date: __ / __ / __" value="${date}">
            <textarea class="notes-box" placeholder="notes">${notes}</textarea>
        </div>
    `;
    return row;
}

// Auto-resize textareas as user types
function setupAutoResize() {
    const textareas = document.querySelectorAll('.goal-box');

    textareas.forEach(textarea => {
        const resize = () => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        };

        textarea.removeEventListener('input', resize);
        textarea.addEventListener('input', resize);
        resize(); // Initial resize
    });
}

// Load last updated date
function loadLastUpdated() {
    const dateInput = document.getElementById('last-updated');
    const saved = localStorage.getItem('lastUpdated');
    if (saved) {
        dateInput.value = saved;
    } else {
        // Set default date
        dateInput.value = '11 / 20 / 2025';
        localStorage.setItem('lastUpdated', '11 / 20 / 2025');
    }

    dateInput.addEventListener('change', () => {
        localStorage.setItem('lastUpdated', dateInput.value);
    });
}

// Export to PDF
function exportToPDF() {
    window.print();
}

// Drag selection box
function setupDragSelection() {
    const selectionBox = document.getElementById('selection-box');
    let startX, startY, isSelecting = false;

    document.addEventListener('mousedown', (e) => {
        // Only start selection on container background
        if (e.target.classList.contains('container') || e.target.tagName === 'BODY') {
            isSelecting = true;
            startX = e.clientX;
            startY = e.clientY;
            selectionBox.style.left = startX + 'px';
            selectionBox.style.top = startY + 'px';
            selectionBox.style.width = '0px';
            selectionBox.style.height = '0px';
            selectionBox.style.display = 'block';
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isSelecting) return;

        const currentX = e.clientX;
        const currentY = e.clientY;

        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);
        const left = Math.min(currentX, startX);
        const top = Math.min(currentY, startY);

        selectionBox.style.left = left + 'px';
        selectionBox.style.top = top + 'px';
        selectionBox.style.width = width + 'px';
        selectionBox.style.height = height + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (isSelecting) {
            isSelecting = false;
            setTimeout(() => {
                selectionBox.style.display = 'none';
            }, 200);
        }
    });
}

// Chelsea easter egg - blue fireworks
function setupChelseaEasterEgg() {
    let typedText = '';

    document.addEventListener('keydown', (e) => {
        // Build up the typed text
        if (e.key.length === 1) {
            typedText += e.key.toLowerCase();

            // Keep only last 7 characters
            if (typedText.length > 7) {
                typedText = typedText.slice(-7);
            }

            // Check if "chelsea" was typed
            if (typedText.includes('chelsea')) {
                typedText = ''; // Reset
                triggerFireworks();
            }
        } else if (e.key === 'Enter' && typedText.includes('chelsea')) {
            typedText = '';
            triggerFireworks();
        }
    });
}

function triggerFireworks() {
    const colors = ['#4a90e2', '#5ba3f5', '#3a7bc8', '#6bb6ff'];
    const fireworkCount = 8;

    for (let i = 0; i < fireworkCount; i++) {
        setTimeout(() => {
            createFirework(colors);
        }, i * 200);
    }
}

function createFirework(colors) {
    // Random position on screen
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * (window.innerHeight * 0.5);

    // Create firework burst
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework-particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        document.body.appendChild(particle);

        // Random angle and distance
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 100 + Math.random() * 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        // Animate particle
        particle.animate([
            { transform: 'translate(0, 0)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 500,
            easing: 'cubic-bezier(0, .9, .57, 1)',
            fill: 'forwards'
        });

        // Remove particle after animation
        setTimeout(() => particle.remove(), 1500);
    }
}

// Maria easter egg - only visible at top of page
function setupMariaEasterEgg() {
    const mariaSecret = document.getElementById('maria-secret');

    function updateMariaVisibility() {
        // Only show when scrolled to top (within 50px)
        if (window.scrollY <= 50) {
            mariaSecret.style.display = 'block';
        } else {
            mariaSecret.style.display = 'none';
        }
    }

    // Check on scroll
    window.addEventListener('scroll', updateMariaVisibility);

    // Initial check
    updateMariaVisibility();
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

// ========== VIEW SWITCHING FUNCTIONALITY ==========

let currentView = 'home';

// Show a specific view
function showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view-container').forEach(view => {
        view.style.display = 'none';
    });

    // Remove active state from all buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show the selected view
    let viewId = '';
    let buttonId = '';

    if (viewName === 'home') {
        viewId = 'home-view';
        buttonId = 'home-btn';
    } else if (viewName === 'four-weeks') {
        viewId = 'four-weeks-view';
        buttonId = 'weeks-btn';
        loadHistoricalData('four-weeks');
    } else if (viewName === 'four-months') {
        viewId = 'four-months-view';
        buttonId = 'months-btn';
        loadHistoricalData('four-months');
    } else if (viewName === 'four-years') {
        viewId = 'four-years-view';
        buttonId = 'years-btn';
        loadHistoricalData('four-years');
    }

    // Show the view
    const viewElement = document.getElementById(viewId);
    if (viewElement) {
        viewElement.style.display = 'block';
        window.scrollTo(0, 0);
    }

    // Activate the button
    const buttonElement = document.getElementById(buttonId);
    if (buttonElement) {
        buttonElement.classList.add('active');
    }

    currentView = viewName;
}

// Load historical data for a timeline
function loadHistoricalData(timeline) {
    const historicalData = getHistoricalData(timeline);
    const container = document.getElementById(`${timeline}-historical`);

    if (!container) return;

    container.innerHTML = '';

    if (!historicalData || historicalData.length === 0) {
        // Show empty state
        container.innerHTML = `
            <div style="padding: 60px 40px; text-align: center;">
                <p style="color: var(--text-tertiary); font-size: 15px; margin-bottom: 12px;">
                    No historical data yet.
                </p>
                <p style="color: var(--text-tertiary); font-size: 13px;">
                    Archive your current ${timeline.replace('-', ' ')} goals to view them here.
                </p>
            </div>
        `;
    } else {
        // Load historical goals
        historicalData.forEach(goal => {
            const row = createGoalRow(goal.text, goal.date, goal.notes);
            container.appendChild(row);
        });
    }
}

// Get historical data for a timeline from localStorage
function getHistoricalData(timeline) {
    const key = `historical_${timeline}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
}
