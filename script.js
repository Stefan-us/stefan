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
    loadSnapshots();
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

// ========== HISTORICAL SNAPSHOTS FUNCTIONALITY ==========

let currentSnapshotId = null;

// Save current state as a snapshot
function saveSnapshot() {
    const snapshot = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleString(),
        data: {
            principles: getPrinciplesData(),
            fourWeeks: getGoalsData('four-weeks'),
            fourMonths: getGoalsData('four-months'),
            fourYears: getGoalsData('four-years'),
            lastUpdated: document.getElementById('last-updated').value
        }
    };

    // Get existing snapshots
    const snapshots = getSnapshots();
    snapshots.push(snapshot);

    // Save to localStorage
    localStorage.setItem('goalSnapshots', JSON.stringify(snapshots));

    // Refresh the snapshot list
    loadSnapshots();

    // Show confirmation
    showNotification('Snapshot saved successfully!');
}

// Get all snapshots from localStorage
function getSnapshots() {
    const stored = localStorage.getItem('goalSnapshots');
    return stored ? JSON.parse(stored) : [];
}

// Load and display all snapshots
function loadSnapshots() {
    const snapshots = getSnapshots();
    const snapshotList = document.getElementById('snapshot-list');

    snapshotList.innerHTML = '';

    snapshots.forEach((snapshot, index) => {
        const btn = document.createElement('button');
        btn.className = 'snapshot-btn';
        if (currentSnapshotId === snapshot.id) {
            btn.classList.add('active');
        }

        const dateStr = new Date(snapshot.timestamp).toLocaleDateString();
        const timeStr = new Date(snapshot.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        btn.innerHTML = `
            <span>${dateStr} ${timeStr}</span>
            <span class="snapshot-delete" onclick="deleteSnapshot(event, ${snapshot.id})">×</span>
        `;

        btn.onclick = (e) => {
            if (!e.target.classList.contains('snapshot-delete')) {
                loadSnapshot(snapshot.id);
            }
        };

        snapshotList.appendChild(btn);
    });
}

// Load a specific snapshot
function loadSnapshot(snapshotId) {
    const snapshots = getSnapshots();
    const snapshot = snapshots.find(s => s.id === snapshotId);

    if (!snapshot) {
        console.error('Snapshot not found');
        return;
    }

    currentSnapshotId = snapshotId;

    // Load the snapshot data
    loadPrinciplesFromData(snapshot.data.principles);
    loadGoalsFromData('four-weeks', snapshot.data.fourWeeks);
    loadGoalsFromData('four-months', snapshot.data.fourMonths);
    loadGoalsFromData('four-years', snapshot.data.fourYears);

    if (snapshot.data.lastUpdated) {
        document.getElementById('last-updated').value = snapshot.data.lastUpdated;
    }

    // Update view label
    const dateStr = new Date(snapshot.timestamp).toLocaleString();
    document.getElementById('view-label').textContent = `Viewing: ${dateStr}`;

    // Update active states
    loadSnapshots();
}

// Load current/live view
function loadCurrentView() {
    currentSnapshotId = null;

    // Reload from config
    loadPrinciplesFromData(GOALS_CONFIG.principles);
    loadGoalsFromData('four-weeks', GOALS_CONFIG.fourWeeks);
    loadGoalsFromData('four-months', GOALS_CONFIG.fourMonths);
    loadGoalsFromData('four-years', GOALS_CONFIG.fourYears);

    // Restore last updated from localStorage
    const saved = localStorage.getItem('lastUpdated');
    if (saved) {
        document.getElementById('last-updated').value = saved;
    }

    // Update view label
    document.getElementById('view-label').textContent = 'Current View';

    // Update active states
    loadSnapshots();
}

// Delete a snapshot
function deleteSnapshot(event, snapshotId) {
    event.stopPropagation();

    if (!confirm('Delete this snapshot?')) {
        return;
    }

    let snapshots = getSnapshots();
    snapshots = snapshots.filter(s => s.id !== snapshotId);
    localStorage.setItem('goalSnapshots', JSON.stringify(snapshots));

    // If we're viewing the deleted snapshot, go back to current view
    if (currentSnapshotId === snapshotId) {
        loadCurrentView();
    } else {
        loadSnapshots();
    }

    showNotification('Snapshot deleted');
}

// Get current principles data
function getPrinciplesData() {
    const principles = [];
    const items = document.querySelectorAll('.principle-item');

    items.forEach(item => {
        const title = item.querySelector('.principle-title').value;
        const description = item.querySelector('.principle-desc').value;
        principles.push({ title, description });
    });

    return principles;
}

// Get current goals data for a timeline
function getGoalsData(timeline) {
    const goals = [];
    const container = document.getElementById(`${timeline}-container`);
    const rows = container.querySelectorAll('.goal-row');

    rows.forEach(row => {
        const text = row.querySelector('.goal-box').value;
        const date = row.querySelector('.date-field').value;
        const notes = row.querySelector('.notes-box').value;
        goals.push({ text, date, notes });
    });

    return goals;
}

// Load principles from data
function loadPrinciplesFromData(principlesData) {
    const container = document.getElementById('principles-container');
    container.innerHTML = '';

    principlesData.forEach(principle => {
        const item = document.createElement('div');
        item.className = 'principle-item';
        item.innerHTML = `
            <input type="text" class="principle-title" value="${principle.title}" placeholder="principle name">
            <textarea class="principle-desc" placeholder="description">${principle.description}</textarea>
        `;
        container.appendChild(item);
    });
}

// Load goals from data
function loadGoalsFromData(timeline, goalsData) {
    const container = document.getElementById(`${timeline}-container`);
    container.innerHTML = '';

    goalsData.forEach(goal => {
        const row = createGoalRow(goal.text, goal.date, goal.notes);
        container.appendChild(row);
    });
}

// Show a notification message
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--blue-accent);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        animation: slideDown 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }

    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);
