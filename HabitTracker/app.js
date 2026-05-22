let habits = [
    {name: "Reade 30 min", days: [false, false, false, false, false, false, false] }
];

let daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function initApp() {
    loadData();

    document.getElementById('header').innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <h2>Habit Tracker</h2>
            <button class="theme-toggle" onclick="toggleTheme()">Theme</button>
        <div>
            <input type="text" id="habit-input" placeholder="Add new habit...">
            <button class="button" onclick="addHabit()">Add</button>
        </div>
        `;
    document.getElementById('week-nav').innerHTML = `
        <h3>This Week</h3>`;

    renderGrid();
}

function loadData() {
    let saved = localStorage.getItem('habit-tracker-data');
    if(saved) {
        habits = JSON.parse(saved);
    } else {
        habits = [];
    }
}

function saveData() {
    localStorage.setItem('habit-tracker-data', JSON.stringify(habits));
}

function renderGrid() {
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

    let html = '<table class="habit-table>"';

    html += '<tr><th>Habit Name</th>';
    for (let i = 0; i < daysOfWeek.length; i++) {
        html += `<th>${daysOfWeek[i]}</th>`;
    }
    html += '</tr>';

    html += '<th>Action</th>';
    html += '</tr>';

    for(let i = 0; i < habits.length; i++) {
        html += '<tr>';
        html += `<td>${habits[i].name}</td>`;

        for (let j = 0; j < daysOfWeek.length; j++) {
            let isDone = habits[i].days[j];

            let icon = isDone ? '' : '';
            html += `
                <td>
                    <button class="check-btn" onclick="toggleHabit(${i}, ${j})">
                        ${icon}
                    </button>
                </td>`
        }

        html += `<td>
                    <button class="delete-btn" onclick="deleteHabit(${i})">
                        X
                    </button>
                </td>`;
        html += '</tr>';
    }

    html += '</table>';
    container.innerHTML = html;
}

function addHabit() {
    let inputField = document.getElementById('habit-input');
    let newName = inputField.value;

    if (newName !== "") {
        habits.push({
            name: newName,
            days: [false, false, false, false, false, false, false]
        });
        inputField.value = "";
        saveData();
        renderGrid();
    }
}

function toggleHabit(habitIndex, dayIndex) {
    habits[habitIndex].days[dayIndex] = !habits[habitIndex].days[dayIndex];
    renderGrid();
}

function deleteHabit(habitIndex) {
    habits.splice(habitindex, 1);
    saveData();
    renderGrid();
}

function toggleTheme() {
    let currentTheme = document.getAttribute('data-theme');
    let newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}
initApp();