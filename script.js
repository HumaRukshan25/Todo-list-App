document.addEventListener("DOMContentLoaded", function () {
    const newTodo = document.getElementById("newTodo");
    const addTodo = document.getElementById("addTodo");
    const allButton = document.getElementById("all");
    const completedButton = document.getElementById("completed");
    const notCompletedButton = document.getElementById("not-completed");
    const todoList = document.getElementById("todoList");

    const API_BASE_URL = 'https://crudcrud.com/api/5e183cd21fd14d4e9f74021c6c928e88';
    let todos = [];

    async function fetchTodos() {
        try {
            const response = await fetch(`${API_BASE_URL}/todos`);
            if (response.ok) {
                todos = await response.json();
            }
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    }

    async function saveTodoToApi(todo) {
        try {
            const response = await fetch(`${API_BASE_URL}/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(todo)
            });

            if (response.ok) {
                const createdTodo = await response.json();
                todos.push(createdTodo);
            }
        } catch (error) {
            console.error("Error saving todo:", error);
        }
    }

    async function updateTodoInApi(todo) {
        try {
            const response = await fetch(`${API_BASE_URL}/todos/${todo._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(todo)
            });

            if (!response.ok) {
                console.error("Error updating todo:", response.status);
            }
        } catch (error) {
            console.error("Error updating todo:", error);
        }
    }

    async function deleteTodoFromApi(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                todos = todos.filter(todo => todo._id !== id);
            }
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    }

    async function renderTodos(filter) {
        todoList.innerHTML = "";
        todos.forEach((todo, index) => {
            if (filter === "completed" && !todo.completed) {
                return;
            }
            if (filter === "not-completed" && todo.completed) {
                return;
            }
            const li = document.createElement("li");
            li.textContent = todo.text;

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = todo.completed;
            checkbox.addEventListener("change", () => {
                todo.completed = checkbox.checked;
                updateTodoInApi(todo);
                renderTodos(filter);
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => {
                deleteTodoFromApi(todo._id);
                renderTodos(filter);
            });

            li.appendChild(checkbox);
            li.appendChild(deleteButton);
            todoList.appendChild(li);
        });
    }

    addTodo.addEventListener("click", () => {
        const text = newTodo.value.trim();
        if (text) {
            const newTodoItem = { text, completed: false }; // Change to completed: false
            saveTodoToApi(newTodoItem);
            newTodo.value = "";
            renderTodos("all");
        }
    });
    

    allButton.addEventListener("click", () => {
        renderTodos("all");
    });

    completedButton.addEventListener("click", () => {
        renderTodos("completed");
    });

    notCompletedButton.addEventListener("click", () => {
        renderTodos("not-completed");
    });

    fetchTodos()
        .then(() => renderTodos("all"))
        .catch(error => console.error("Error loading todos:", error));
});
