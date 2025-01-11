"use strict";
// Create a new list element
function createList(title) {
    const newList = document.createElement("ul");
    newList.classList.add("task-list");
    const header = document.createElement("h3");
    header.textContent = title;
    newList.appendChild(header);
    // Generate a unique ID for the list
    newList.id = `taskList-${Date.now()}`;
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
// Track the currently selected list
let currentList = null;
// Create a new list when "New List" is clicked
addListButton.addEventListener("click", () => {
    const listTitle = input.value.trim();
    if (listTitle === "") {
        alert("List title cannot be empty!");
        return;
    }
    const newList = createList(listTitle);
    // Update the current list to the newly created list
    currentList = newList;
});
// Add tasks to the currently selected list
addTaskButton.addEventListener("click", () => {
    if (currentList) {
        addTask(currentList, input);
    }
    else {
        alert("You need to create or select a list first!");
    }
});
// Delete the currently selected list
deleteListButton.addEventListener("click", () => {
    if (currentList) {
        currentList.remove();
        currentList = null; // Reset the reference
    }
    else {
        alert("No list to delete!");
    }
});
// Optional: Add functionality to select a list
document.body.addEventListener("click", (event) => {
    const target = event.target;
    if (target.tagName === "H3") {
        const ul = target.parentElement;
        if (ul && ul.classList.contains("task-list")) {
            currentList = ul;
            alert(`Selected list: ${target.textContent}`);
        }
    }
});
