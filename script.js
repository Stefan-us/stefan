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
    initHistorySidebar();
    loadHistoricalLogs();
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

    // Set to current date in format MM/DD/YYYY
    const today = new Date();
    const formattedDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
    dateInput.value = `last updated: ${formattedDate}`;
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

// Historical Logs Sidebar Functions
function initHistorySidebar() {
    const sidebar = document.getElementById('history-sidebar');
    sidebar.classList.add('collapsed');
}

function toggleHistorySidebar() {
    const sidebar = document.getElementById('history-sidebar');
    sidebar.classList.toggle('collapsed');
}

function switchHistoryTab(tabName) {
    console.log('Switching to tab:', tabName); // Debug log

    // Update tab buttons
    document.querySelectorAll('.history-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }

    // Update panels
    document.querySelectorAll('.history-panel').forEach(panel => {
        panel.classList.remove('active');
        panel.style.display = 'none';
    });
    const activePanel = document.getElementById(`history-${tabName}`);
    if (activePanel) {
        activePanel.classList.add('active');
        activePanel.style.display = 'block';
    }
}

// Make functions globally accessible
window.toggleHistorySidebar = toggleHistorySidebar;
window.switchHistoryTab = switchHistoryTab;

function loadHistoricalLogs() {
    // Load from localStorage
    const history = {
        'four-weeks': JSON.parse(localStorage.getItem('history-four-weeks') || '[]'),
        'four-months': JSON.parse(localStorage.getItem('history-four-months') || '[]'),
        'four-years': JSON.parse(localStorage.getItem('history-four-years') || '[]')
    };

    // Render each history panel
    Object.keys(history).forEach(timeline => {
        renderHistoryPanel(timeline, history[timeline]);
    });
}

function renderHistoryPanel(timeline, entries) {
    const panel = document.getElementById(`history-${timeline}`);

    if (entries.length === 0) {
        panel.innerHTML = '<p class="history-empty">no previous entries yet.</p>';
        return;
    }

    panel.innerHTML = entries.map((entry, index) => `
        <div class="history-card">
            <div class="history-card-date">archived: ${entry.archived || 'unknown date'}</div>
            <div class="history-card-content">${entry.text || ''}</div>
            ${entry.notes ? `<div class="history-card-notes">${entry.notes}</div>` : ''}
        </div>
    `).join('');
}

function archiveCurrentGoals(timeline) {
    // Get current goals
    const container = document.getElementById(`${timeline}-container`);
    const goalBoxes = container.querySelectorAll('.goal-box');

    const goals = Array.from(goalBoxes).map(box => ({
        text: box.value,
        archived: new Date().toLocaleDateString()
    }));

    // Load existing history
    const historyKey = `history-${timeline}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');

    // Add current goals to history
    history.unshift(...goals);

    // Save to localStorage
    localStorage.setItem(historyKey, JSON.stringify(history));

    // Re-render history panel
    renderHistoryPanel(timeline, history);
}

// Make archive function available globally for manual archiving
window.archiveCurrentGoals = archiveCurrentGoals;
