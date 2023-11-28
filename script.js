const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.querySelector(".add-button");
const editButton = document.querySelector(".edit-button");
const alertMessage = document.getElementById("alert-message");
const taskBody = document.querySelector("tbody")
const deleteAllButton = document.getElementById("delete-all") ;
const filterButtons = document.querySelectorAll(".filter-button");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

const saveToLocalStorage = () => {
    localStorage.setItem("todos", JSON.stringify(todos))
}

const idGenerator = () => {
    return Math.round(Math.random()*Math.random()*Math.pow(10, 15)).toString()
}

const showAlert = (message, type) => {
    alertMessage.innerHTML = "";
    const alert = document.createElement("p");
    alert.innerText = message;
    alert.classList.add("alert");
    alert.classList.add(`alert-${type}`)
    alertMessage.append(alert)

    setTimeout(() => {
        alert.style.display = "none"
    }, 2000)
}

const displayTask = (data) => {
    const todoList = data || todos;
    taskBody.innerHTML = ""
    if(!todoList.length) {
        taskBody.innerHTML = "<tr><td colspan= '4'>no task found!</td></tr>";
        return;
    }

    todoList.forEach(todo => {
        taskBody.innerHTML += `
        <tr>
            <td>${todo.task}</td>
            <td>${todo.date || "no date"}</td>
            <td>${todo.completed ? "completed" : "pending"}</td>
            <td>
                <button onclick="editHandler('${todo.id}')">Edit</button>
                <button onclick="toggleHandler('${todo.id}')">${todo.completed ? "Undo" : "Done"}</button>
                <button onclick="deleteTask('${todo.id}')">Delete</button>
            </td>
        </tr>
        `
    });
}

const addTask = () => {
    const task = taskInput.value;
    const date = dateInput.value;
    const todo = {
        id: idGenerator(),
        task,
        date,
        completed: false,
    };
    if (task) {
        todos.push(todo);
        saveToLocalStorage(todo);
        displayTask();
        taskInput.value = ""
        dateInput.value = "";
        showAlert("task added successfully!", "success")
        console.log(todos)
    }else {
        showAlert("please enter a task", "error")
    }

}

const deleteAll = () => {
    if(todos.length) {
        todos = [];
        saveToLocalStorage();
        displayTask();
        showAlert("all tasks were cleared successfully", "success")
    } else {
        showAlert("no task to clear", "error")    
    }
    
}
    
const deleteTask = (id) => {
    const newTodos = todos.filter(todo => todo.id !== id)
    todos = newTodos;
    saveToLocalStorage();
    displayTask();
    showAlert("task were deleted successfully", "success") 
}

const toggleHandler = (id) => {
    const todo = todos.find(todo => todo.id === id);
    todo.completed = !todo.completed;
    saveToLocalStorage();
    displayTask();
    showAlert("task status changed successfully", "success")
}

const editHandler = (id) => {
    const todo = todos.find(todo => todo.id === id);
    taskInput.value = todo.task;
    dateInput.value = todo.date;
    addButton.style.display =  "none";
    editButton.style.display = "inline-block";
    editButton.dataset.id = todo.id;

}

const applyEdit = (event) => {
    const id = event.target.dataset.id;
    const todo = todos.find(todo => todo.id === id);
    todo.task = taskInput.value;
    todo.date = dateInput.value;
    addButton.style.display =  "inline-block";
    editButton.style.display = "none";
    taskInput.value = "";
    dateInput.value = "";
    saveToLocalStorage();
    displayTask();
    showAlert("task was edited successfully", "success")

}

const filterHandler = (event) => {
    let filteredTodos = null;
    const filter = event.target.innerText;
    switch (filter) {
        case "Pending":
            filteredTodos = todos.filter((todo) => todo.completed === false)
            break;
        case "Completed":
            filteredTodos = todos.filter((todo) => todo.completed === true)
            break;
        default:
            filteredTodos = todos;
            break;
    
    }
    displayTask(filteredTodos)
}
addButton.addEventListener("click", addTask);
deleteAllButton.addEventListener("click", deleteAll);
editButton.addEventListener("click", applyEdit);
filterButtons.forEach(filterButton => {filterButton.addEventListener("click", filterHandler)})
window.addEventListener("load", () => displayTask());