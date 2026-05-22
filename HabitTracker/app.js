let habits = [];
let currentWeekStart = getStartOfWeek(new Date());

function initApp() {
    let savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    loadData();

    document.getElementById('header').innerHTML = `
        <div class="header-brand">
            <h2>Habit Tracker</h2>
            <button class="theme-toggle" onclick="toggleTheme()">🌓 Theme</button>
        </div>
        <div class="header-actions">
            <input type="text" id="habit-input" placeholder="Add new habit...">
            <button class="btn-primary" onclick="addHabit()">Add</button>
        </div>
    `;

    let inputField = document.getElementById('habit-input');
    inputField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            addHabit();
        }
    });

    renderGrid();
}

function getStartOfWeek(date) {
    let d = new Date(date);
    let day = d.getDay();
    let diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return d;
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function addDays(date, days) {
    let d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

function changeWeek(offset) {
    currentWeekStart = addDays(currentWeekStart, offset * 7);
    renderGrid();
}

function resetWeek() {
    currentWeekStart = getStartOfWeek(new Date());
    renderGrid();
}

function loadData() {
    let saved = localStorage.getItem('habit-tracker-data');
    if(saved) {
        habits = JSON.parse(saved);
        habits.forEach(h => {
            if (!h.completedDates) h.completedDates = [];
        });
    } else {
        habits = [];
    }
}

function saveData() {
    localStorage.setItem('habit-tracker-data', JSON.stringify(habits));
}

function calculateStreak(completedDates) {
    let streak = 0;
    let today = new Date();
    let yesterday = addDays(today, -1);

    let todayStr = formatDate(today);
    let yesterdayStr = formatDate(yesterday);

    let checkDate = today;

    if (!completedDates.includes(todayStr) && completedDates.includes(yesterdayStr)) {
        checkDate = yesterday;
    } else if (!completedDates.includes(todayStr) && !completedDates.includes(yesterdayStr)) {
        return 0; 
    }

    while (true) {
        let dateStr = formatDate(checkDate);
        if (completedDates.includes(dateStr)) {
            streak++;
            checkDate = addDays(checkDate, -1);
        } else {
            break;
        }
    }
    return streak;
};

function renderGrid() {
    let navHtml = `
        <div class="week-nav-container">
            <button class="btn-secondary" onclick="changeWeek(-1)">← Prev</button>
            <h3 class="week-title">Week of ${formatDate(currentWeekStart)}</h3>
            <button class="btn-secondary" onclick="changeWeek(1)">Next →</button>
            <button class="btn-secondary btn-today" onclick="resetWeek()">Today</button>
        </div>
    `;
    document.getElementById('week-nav').innerHTML = navHtml;

    let container = document.getElementById('grid-container');

    if (habits.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3 class="empty-title">No habits yet</h3>
                <p class="empty-sub">Add a habit above to start building your routine.</p>
            </div>
        `;
        return;
    }

    let weekDates = [];
    for (let i = 0; i < 7; i++) {
        weekDates.push(addDays(currentWeekStart, i));
    }

    let todayStr = formatDate(new Date());

    let html = '<table class="habit-table">';
    html += '<thead><tr><th>Habit Name</th>';
    
    let dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (let i = 0; i < 7; i++) {
        let dateStr = formatDate(weekDates[i]);
        let isTodayClass = dateStr === todayStr ? 'is-today-text' : '';
        html += `<th class="${isTodayClass}">${dayNames[i]}<br><small class="date-small">${weekDates[i].getDate()}</small></th>`;
    }
    
    html += '<th>Streak</th><th>Action</th></tr></thead><tbody>';

    for(let i = 0; i < habits.length; i++) {
        html += '<tr>';
        html += `<td><strong>${habits[i].name}</strong></td>`;

        for (let j = 0; j < 7; j++) {
            let dateStr = formatDate(weekDates[j]);
            let isDone = habits[i].completedDates.includes(dateStr);
            let icon = isDone ? '✅' : '⬜';
            
            let bgClass = dateStr === todayStr ? 'is-today-bg' : '';

            html += `
                <td class="${bgClass}">
                    <button class="check-btn" onclick="toggleHabit(${i}, '${dateStr}')">
                        ${icon}
                    </button>
                </td>`;
        }

        let streakCount = calculateStreak(habits[i].completedDates);
        html += `<td><span class="streak-count">🔥 ${streakCount}</span></td>`;

        html += `<td><button class="delete-btn" onclick="deleteHabit(${i})">✖</button></td>`;
        html += '</tr>';
    }

    html += '</tbody></table>';
    container.innerHTML = html;
}

function addHabit() {
    let inputField = document.getElementById('habit-input');
    let newName = inputField.value.trim();

    if (newName !== "") {
        habits.push({
            name: newName,
            completedDates: [] 
        });
        inputField.value = "";
        saveData();
        renderGrid();
    }
}

function toggleHabit(habitIndex, dateStr) {
    let dateArray = habits[habitIndex].completedDates;
    let idx = dateArray.indexOf(dateStr);
    
    if (idx > -1) {
        dateArray.splice(idx, 1); 
    } else {
        dateArray.push(dateStr); 
    }
    
    saveData();
    renderGrid();
}

function deleteHabit(habitIndex) {
    habits.splice(habitIndex, 1);
    saveData();
    renderGrid();
}

function toggleTheme() {
    let currentTheme = document.documentElement.getAttribute('data-theme');
    let newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

initApp();