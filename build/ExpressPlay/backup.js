"use strict";
// Create a new list element
function createList(title) {
    const newList = document.createElement("ul");
    newList.classList.add("task-list");
    const header = document.createElement("h3");
    header.textContent = title;
    newList.appendChild(header);
    newList.id = "taskList";
    document.body.appendChild(newList); // Append it to the body or a container
    return newList;
}
// Add a new task to the list
function addTask(ul, input) {
    const taskText = input.value.trim();
    if (taskText === "") {
        alert("Task cannot be empty!");
        return;
    }
    // Create a list item
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = taskText;
    // Append the span to the <li>
    li.appendChild(span);
    // Add the <li> to the <ul>
    ul.appendChild(li);
    // Clear the input field
    input.value = "";
}
// Main elements
const addListButton = document.getElementById("new");
const addTaskButton = document.getElementById("add");
const deleteListButton = document.getElementById("delete");
const input = document.getElementById("input");
// Create the <ul> when "New List" is clicked
let ul = null;
addListButton.addEventListener("click", () => {
    if (!ul) {
        ul = createList(input.value.trim());
    }
    else {
        alert("A list already exists!");
    }
});
// Add tasks to the <ul>
addTaskButton.addEventListener("click", () => {
    if (ul) {
        addTask(ul, input);
    }
    else {
        alert("You need to create a list first!");
    }
});
// Delete the entire list when "Delete" is clicked
deleteListButton.addEventListener("click", () => {
    if (ul) {
        ul.remove();
        ul = null; // Reset the reference
    }
    else {
        alert("No list to delete!");
    }
});
