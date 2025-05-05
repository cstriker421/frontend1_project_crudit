const API_BASE = 'https://681906d15a4b07b9d1d1bbd7.mockapi.io/api/v1/todos';

let isEditing = false;
let currentEditId = null;

// Load todos on page load
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
    const item = document.createElement('div');
    item.className = 'todo-item';
    item.innerHTML = `
      <h3>${todo.title}</h3>
      <p>${todo.description}</p>
      <button onclick="editTodo('${todo.id}', '${todo.title}', '${todo.description}')">Edit</button>
      <button onclick="deleteTodo('${todo.id}')">Delete</button>
    `;
    container.appendChild(item);
  });
}

function editTodo(id, title, description) {
  document.getElementById('title').value = title;
  document.getElementById('description').value = description;
  isEditing = true;
  currentEditId = id;
  document.getElementById('submit-button').textContent = 'Update Todo';
}

function resetForm() {
  document.getElementById('todo-form').reset();
  document.getElementById('submit-button').textContent = 'Add Todo';
  isEditing = false;
  currentEditId = null;
}

// Handle form submit
document.getElementById('todo-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const createdAt = new Date().toISOString();

  if (!title || !description) {
    alert("Both fields are required.");
    return;
  }

  const todo = { title, description, createdAt };

  if (isEditing) {
    updateTodo(currentEditId, todo);
  } else {
    createTodo(todo);
  }

  resetForm();
});
