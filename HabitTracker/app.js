let habits = [
    {name: "Reade 30 min", days: [false, false, false, false, false, false, false] }
];

let daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function initApp() {
    document.getElementById('header').innerHTML = `
        <h2>Habit Tracker</h2>
        <div>
            <input type="text" id="habit-input" placeholder="Add new habit...">
            <button onclick="addHabit()">Add</button>
        </div>
        `;
    document.getElementById('week-nav').innerHTML = `
        <h3>This Week</h3>`;

    renderGrid();
}

function renderGrid() {
    let container = document.getElementById('grid-container');

    let html = '<table class="habit-table"';

    html += '<tr><th>Habit Name</th>';
    for (let i = 0; i < daysOfWeek.length; i++) {
        html += `<tr>${daysOfWeek[i]}</th>`;
    }
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
        renderGrid();
    }
}

function toggleHabit(habitIndex, dayIndex) {
    habits[habitIndex].days[dayIndex] = !habits[habitIndex].days[dayIndex];
    renderGrid();
}

initApp();