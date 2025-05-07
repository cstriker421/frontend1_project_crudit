const API_BASE = 'https://681906d15a4b07b9d1d1bbd7.mockapi.io/api/v1/todos';

let editingItemId = null;

// Loads todos on page load
window.addEventListener('DOMContentLoaded', () => {
    fetchTodos();  // Fetch todos from MockAPI
    startClock();  // Start the live clock
    applyViewPreference();  // Apply stored view preference (list/grid)
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

    const viewPreference = localStorage.getItem('viewMode') || 'list';  // Default to 'list' view if no preference
    container.className = viewPreference === 'grid' ? 'grid-view' : 'list-view';  // Apply view mode

    todos.forEach(todo => {
        const created = new Date(todo.createdAt).toLocaleString();
        const statusEmoji = todo.completed ? '✅' : '❌';
        const statusText = todo.completed ? 'Mark as incomplete' : 'Mark as complete';

        const item = document.createElement('div');
        item.className = 'box mb-4';
        
        // Handle the case where an item is being edited
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
            // Normal view
            const title = document.createElement('h2');
            title.innerHTML = `${todo.title} <span>${statusEmoji}</span>`;

            const desc = document.createElement('p');
            desc.textContent = todo.description;

            const date = document.createElement('small');
            date.textContent = `Created: ${created}`;

            // Create the toggle text with emoji and dynamic status
            const toggleText = document.createElement('span');
            toggleText.className = 'has-text-link is-clickable';
            toggleText.style.cursor = 'pointer';
            toggleText.textContent = `${statusEmoji} ${statusText}`; // Displays the emoji and text based on completion status

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

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => deleteTodo(todo.id);

            editBtn.className = 'button is-small is-warning mr-2';
            deleteBtn.className = 'button is-small is-danger is-light';

            item.appendChild(title);
            item.appendChild(desc);
            item.appendChild(date);
            item.appendChild(document.createElement('br'));
            item.appendChild(toggleContainer);
            item.appendChild(document.createElement('br'))
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

// Handles form submit
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

// Function to apply view preference from localStorage
function applyViewPreference() {
    const viewMode = localStorage.getItem('viewMode') || 'list';
    document.getElementById('theme-toggle').textContent = viewMode === 'grid' ? 'Switch to List View' : 'Switch to Grid View';

    const container = document.getElementById('todo-list');
    container.className = viewMode === 'grid' ? 'grid-view' : 'list-view'; // Applies correct class for the view
}

// Switches between list and grid view modes
document.getElementById('theme-toggle').addEventListener('click', () => {
    const currentView = localStorage.getItem('viewMode') || 'list';
    const newView = currentView === 'list' ? 'grid' : 'list';

    // Store the new view mode in localStorage
    localStorage.setItem('viewMode', newView);

    // Apply the new view preference and refresh the todos
    applyViewPreference();
    fetchTodos(); // Refresh todos after changing the view
});

// Clock and Date
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

// Inline editing functions
function startInlineEdit(id) {
    editingItemId = id;
    fetchTodos(); // Re-renders list with edit form
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
    const createdAt = new Date().toISOString(); // Optionally keeps original date
  
    if (!title || !description) {
        alert("Both fields are required.");
        return;
    }
  
    const updatedData = { title, description, completed, createdAt };
    updateTodo(id, updatedData);
    editingItemId = null;
}

// Checks if the browser supports service workers
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

// Exposes functions for HTML onclick
window.startInlineEdit = startInlineEdit;
window.cancelInlineEdit = cancelInlineEdit;
window.submitInlineEdit = submitInlineEdit;
window.deleteTodo = deleteTodo;
