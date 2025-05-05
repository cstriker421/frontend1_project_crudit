const API_BASE = 'https://681906d15a4b07b9d1d1bbd7.mockapi.io/api/v1/todos';

let editingItemId = null;

// Loads todos on page load
window.addEventListener('DOMContentLoaded', fetchTodos);

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
    todos.forEach(todo => {
        const created = new Date(todo.createdAt).toLocaleString();
        const statusEmoji = todo.completed ? '✅' : '❌';
  
        const item = document.createElement('div');
        item.className = 'box mb-4';
        if (editingItemId === todo.id) {
            // Shows edit form inside the todo item
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
            cancelBtn.className = 'button is-light';

            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.textContent = 'Cancel';
            cancelBtn.onclick = () => cancelInlineEdit();

            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'field is-grouped mt-3';
            buttonGroup.appendChild(saveBtn);
            buttonGroup.appendChild(cancelBtn);

            form.appendChild(titleInput);
            form.appendChild(descInput);
            form.appendChild(checkboxField);
            form.appendChild(saveBtn);
            form.appendChild(cancelBtn);

            item.appendChild(form);
        } else {
            // Normal view
            const title = document.createElement('h3');
            title.innerHTML = `${todo.title} <span>${statusEmoji}</span>`;

            const desc = document.createElement('p');
            desc.textContent = todo.description;

            const date = document.createElement('small');
            date.textContent = `Created: ${created}`;

            const toggle = document.createElement('input');
            toggle.type = 'checkbox';
            toggle.checked = todo.completed;
            toggle.id = `toggle-${todo.id}`;

            const toggleLabel = document.createElement('label');
            toggleLabel.textContent = ' Mark as completed';
            toggleLabel.prepend(toggle);

            const toggleContainer = document.createElement('div');
            toggleContainer.className = 'field mt-3';
            toggleContainer.appendChild(toggleLabel);

            toggle.addEventListener('change', () => {
                const newCompleted = toggle.checked;
                updateTodo(todo.id, {
                    title: todo.title,
                    description: todo.description,
                    completed: newCompleted,
                    createdAt: todo.createdAt
                });
            });

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.onclick = () => startInlineEdit(todo.id);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => deleteTodo(todo.id);

            editBtn.className = 'button is-small is-warning mr-2';
            deleteBtn.className = 'button is-small is-danger';

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
    const createdAt = new Date().toISOString(); // Optionally keep original date
  
    if (!title || !description) {
      alert("Both fields are required.");
      return;
    }
  
    const updatedData = { title, description, completed, createdAt };
    updateTodo(id, updatedData);
    editingItemId = null;
  }  

// Exposes functions so HTML onclick="..." works
window.startInlineEdit = startInlineEdit;
window.cancelInlineEdit = cancelInlineEdit;
window.submitInlineEdit = submitInlineEdit;
window.deleteTodo = deleteTodo;
