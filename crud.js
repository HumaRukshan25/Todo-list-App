fetch('https://crudcrud.com/api/54f4f2c296164c018089b482ca9790a3/todos', {
  method: 'GET', // or 'POST', 'PUT', etc.
  headers: {
    'Content-Type': 'application/json',
    'X-Auth-Token': 'your-auth-token',
    'Origin': 'http://127.0.0.1:5500',
    'Authorization': 'Bearer your-access-token'
  },
})
.then(response => response.json())
.then(data => {
  console.log(data);
})
.catch(error => {
  console.error('Error:', error);
});

document.addEventListener("DOMContentLoaded", function () {
    const newTodo = document.getElementById("newTodo");
    const addTodo = document.getElementById("addTodo");
    const allButton = document.getElementById("all");
    const completedButton = document.getElementById("completed");
    const notCompletedButton = document.getElementById("not-completed");
    const todoList = document.getElementById("todoList");
    const storedData = document.getElementById("storedData");

    // Load todos from the API
    let todos = [];

    // Function to render todos
    function renderTodos(filter) {
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
                todos[index].completed = checkbox.checked;
                saveTodosToAPI(todos); // Save todos to the API when checkbox changes
                renderTodos(filter);
            });

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.classList.add("edit-button");
            editButton.addEventListener("click", () => {
                const newText = prompt("Edit the to-do item:", todo.text);
                if (newText !== null) {
                    todos[index].text = newText;
                    saveTodosToAPI(todos); // Save todos to the API when edited
                    renderTodos(filter);
                }
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => {
                todos.splice(index, 1);
                saveTodosToAPI(todos); // Save todos to the API when deleted
                renderTodos(filter);
            });

            li.appendChild(checkbox);
            li.appendChild(editButton);
            li.appendChild(deleteButton);
            todoList.appendChild(li);
        });
    }

    addTodo.addEventListener("click", () => {
        const text = newTodo.value.trim();
        if (text) {
            todos.push({ text, completed: false });
            newTodo.value = "";
            saveTodosToAPI(todos); // Save todos to the API when a new item is added
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

    // Function to save todos to the API
    function saveTodosToAPI(todos) {
        const apiUrl = "https://crudcrud.com/api/54f4f2c296164c018089b482ca9790a3/todos"; // Replace with your API URL
        axios.post(apiUrl, { todos })
            .then(response => {
                console.log("To-do list saved to the API:", response.data);
            })
            .catch(error => {
                console.error("Error saving to-do list:", error);
            });
    }

    // Function to retrieve todos from the API
    function loadTodosFromAPI() {
        const apiUrl = "https://crudcrud.com/api/54f4f2c296164c018089b482ca9790a3/todos"; // Replace with your API URL
        axios.get(apiUrl)
            .then(response => {
                todos = response.data.todos || [];
                renderTodos("all");
                console.log("To-do list loaded from the API:", todos);
            })
            .catch(error => {
                console.error("Error loading to-do list:", error);
            });
    }

    // Load todos from the API when the page loads
    loadTodosFromAPI();

    // Display stored data
    
    //storedData.textContent = "Stored Data: Data is stored in the API.";
});
