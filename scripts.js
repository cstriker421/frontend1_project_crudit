const API_BASE = 'https://681906d15a4b07b9d1d1bbd7.mockapi.io/api/v1/todos';

let editingItemId = null;

// Progress Bar Web Component
class ProgressBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['percentage'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'percentage') {
            this.render();
        }
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const percentage = this.getAttribute('percentage') || 0;
        this.shadowRoot.innerHTML = `
        <style>
            .progress-bar {
                width: 100%;
                height: 20px;
                background-color: #f0f0f0;
                border-radius: 10px;
            }
            .progress-bar-inner {
                height: 100%;
                background-color: #00d1b2;
                border-radius: 10px;
                width: ${percentage}%;
            }
        </style>
        <div class="progress-bar">
            <div class="progress-bar-inner"></div>
        </div>
        `;
    }
}

customElements.define('progress-bar', ProgressBar);

// Canvas Emoji Meter
function drawEmojiMeter(percentage, totalTodos) {
    const canvas = document.getElementById('emoji-meter');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let emoji = '🙃';
    if (totalTodos > 0) {
        if (percentage === 0) emoji = '😟';
        else if (percentage <= 33) emoji = '🙁';
        else if (percentage <= 66) emoji = '🙂';
        else if (percentage < 100) emoji = '😁';
        else emoji = '🤩';
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '64px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, canvas.width / 2, canvas.height / 2);
}

// Loads todos on page load
window.addEventListener('DOMContentLoaded', () => {
    fetchTodos();
    startClock();
    applyViewPreference();
});

async function fetchTodos() {
    const res = await fetch(API_BASE);
    const todos = await res.json();
    displayTodos(todos);
}

async function createTodo(todo) {
    await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo)
    });
    fetchTodos();
}

async function updateTodo(id, updatedData) {
    await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    });
    fetchTodos();
    resetForm();
}

async function deleteTodo(id) {
    await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE'
    });
    fetchTodos();
}

function displayTodos(todos) {
    const container = document.getElementById('todo-list');
    container.innerHTML = '';

    const viewPreference = localStorage.getItem('viewMode') || 'list';
    container.className = viewPreference === 'grid' ? 'grid-view' : 'list-view';

    const completedTodos = todos.filter(todo => todo.completed).length;
    const totalTodos = todos.length;
    const completionPercentage = totalTodos === 0 ? 0 : (completedTodos / totalTodos) * 100;

    drawEmojiMeter(completionPercentage, totalTodos);

    const progressBar = document.getElementById('completion-progress');
    progressBar.setAttribute('percentage', completionPercentage.toFixed(0));

    const percentageText = document.getElementById('completion-percentage');
    let percentageMessage = '';
    if (totalTodos === 0) {
        percentageMessage = 'You have not added any tasks yet!';
    } else if (completedTodos === 0) {
        percentageMessage = 'You have not completed any tasks. You may need to get started.';
    } else if (completedTodos === totalTodos) {
        percentageMessage = 'Congratulations! All tasks are complete!';
    } else {
        percentageMessage = `Completed: ${Math.round(completionPercentage)}%`;
    }
    percentageText.textContent = percentageMessage;

    todos.forEach(todo => {
        const created = new Date(todo.createdAt).toLocaleString();
        const statusEmoji = todo.completed ? '✅' : '❌';
        const statusText = todo.completed ? 'Mark as incomplete' : 'Mark as complete';

        const item = document.createElement('div');
        item.className = 'box mb-4';

        if (editingItemId === todo.id) {
            const form = document.createElement('form');
            form.onsubmit = (e) => submitInlineEdit(e, todo.id);
            form.className = 'box';

            const titleInput = document.createElement('input');
            titleInput.type = 'text';
            titleInput.id = `edit-title-${todo.id}`;
            titleInput.value = todo.title;
            titleInput.required = true;
            titleInput.className = 'input mb-3';

            const descInput = document.createElement('textarea');
            descInput.id = `edit-description-${todo.id}`;
            descInput.value = todo.description;
            descInput.required = true;
            descInput.className = 'textarea mb-3';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `edit-completed-${todo.id}`;
            checkbox.checked = todo.completed;

            const checkboxLabel = document.createElement('label');
            checkboxLabel.textContent = ' Completed';
            checkboxLabel.prepend(checkbox);
            checkboxLabel.className = 'checkbox mb-3';

            const checkboxField = document.createElement('div');
            checkboxField.className = 'field';
            checkboxField.appendChild(checkboxLabel);

            const saveBtn = document.createElement('button');
            saveBtn.type = 'submit';
            saveBtn.textContent = 'Save';
            saveBtn.className = 'button is-success mr-2';

            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.textContent = 'Cancel';
            cancelBtn.onclick = () => cancelInlineEdit();
            cancelBtn.className = 'button is-light';

            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'field is-grouped mt-3';
            buttonGroup.appendChild(saveBtn);
            buttonGroup.appendChild(cancelBtn);

            form.appendChild(titleInput);
            form.appendChild(descInput);
            form.appendChild(checkboxField);
            form.appendChild(buttonGroup);

            item.appendChild(form);
        } else {
            const title = document.createElement('h2');
            title.innerHTML = `${todo.title} <span>${statusEmoji}</span>`;

            const desc = document.createElement('p');
            desc.textContent = todo.description;

            const date = document.createElement('small');
            date.textContent = `Created: ${created}`;

            const toggleText = document.createElement('span');
            toggleText.className = 'has-text-link is-clickable';
            toggleText.style.cursor = 'pointer';
            toggleText.textContent = `${statusEmoji} ${statusText}`;
            toggleText.addEventListener('click', () => {
                const updatedCompleted = !todo.completed;
                updateTodo(todo.id, {
                    title: todo.title,
                    description: todo.description,
                    completed: updatedCompleted,
                    createdAt: todo.createdAt
                });
            });

            const toggleContainer = document.createElement('div');
            toggleContainer.className = 'field mt-3';
            toggleContainer.appendChild(toggleText);

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.onclick = () => startInlineEdit(todo.id);
            editBtn.className = 'button is-small is-warning mr-2';

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => deleteTodo(todo.id);
            deleteBtn.className = 'button is-small is-danger is-light';

            item.appendChild(title);
            item.appendChild(desc);
            item.appendChild(date);
            item.appendChild(document.createElement('br'));
            item.appendChild(toggleContainer);
            item.appendChild(document.createElement('br'));
            item.appendChild(editBtn);
            item.appendChild(deleteBtn);
        }

        container.appendChild(item);
    });
}

function resetForm() {
    document.getElementById('todo-form').reset();
    document.getElementById('submit-button').textContent = 'Add Todo';
}

document.getElementById('todo-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const createdAt = new Date().toISOString();
    const completed = document.getElementById('completed').checked;

    if (!title || !description) {
        alert("Both fields are required.");
        return;
    }

    const todo = { title, description, createdAt, completed };
    createTodo(todo);
    resetForm();
});

function applyViewPreference() {
    const viewMode = localStorage.getItem('viewMode') || 'list';
    document.getElementById('theme-toggle').textContent = viewMode === 'grid' ? 'Switch to List View' : 'Switch to Grid View';

    const container = document.getElementById('todo-list');
    container.className = viewMode === 'grid' ? 'grid-view' : 'list-view';
}

document.getElementById('theme-toggle').addEventListener('click', () => {
    const currentView = localStorage.getItem('viewMode') || 'list';
    const newView = currentView === 'list' ? 'grid' : 'list';
    localStorage.setItem('viewMode', newView);
    applyViewPreference();
    fetchTodos();
});

function startClock() {
    const clock = document.getElementById('current-time');
    if (!clock) return;

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    setInterval(() => {
        const now = new Date();
        const dayName = capitalize(now.toLocaleDateString(undefined, { weekday: 'long' }));
        const timeString = now.toLocaleTimeString();
        const dateString = now.toLocaleDateString();
        clock.textContent = `${dayName}, ${dateString} ${timeString}`;
    }, 1000);
}

function startInlineEdit(id) {
    editingItemId = id;
    fetchTodos();
}

function cancelInlineEdit() {
    editingItemId = null;
    fetchTodos();
}

function submitInlineEdit(e, id) {
    e.preventDefault();
    const title = document.getElementById(`edit-title-${id}`).value.trim();
    const description = document.getElementById(`edit-description-${id}`).value.trim();
    const completed = document.getElementById(`edit-completed-${id}`).checked;
    const createdAt = new Date().toISOString();

    if (!title || !description) {
        alert("Both fields are required.");
        return;
    }

    const updatedData = { title, description, completed, createdAt };
    updateTodo(id, updatedData);
    editingItemId = null;
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope: ', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed: ', error);
            });
    });
}

window.startInlineEdit = startInlineEdit;
window.cancelInlineEdit = cancelInlineEdit;
window.submitInlineEdit = submitInlineEdit;
window.deleteTodo = deleteTodo;
