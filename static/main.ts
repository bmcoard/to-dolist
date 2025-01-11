getLists()

// Function to get all lists
async function getLists() {
    const response = await fetch('http://localhost:3003/api/lists') 
    const data = await response.json() // Parse lists
    data.lists.forEach((list: any) => {
        const listHTML = addListHTML(list)
        
        list.tasks.forEach((task: any) => {
            addTaskHTML(task, listHTML)
        })
    })
    console.log("Lists:", data.lists )
}

// Create a new list
async function createList(title: string): Promise<HTMLUListElement> {
    
    const response = await fetch('http://localhost:3003/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': "application/json"},
        body: JSON.stringify({title}), // Send the title in the request body
    })
    
    if (!response.ok) {
        throw new Error('Failed to create list');
    }

    const data = await response.json(); // parse created list
    const newList = addListHTML(data.list)
    return newList
}

function addListHTML(listData: any) {
    const newList = document.createElement("ul");
    newList.classList.add("task-list");

    const header = document.createElement("h3");
    header.textContent = listData.title;
    newList.appendChild(header);

    // Generate a unique ID for the list
    newList.id = listData._id;
    console.log("newList id:", newList.id)
    document.body.appendChild(newList); // Append it to the body or a container
    return(newList)
}

function addTaskHTML(taskData: any, ul: HTMLUListElement) {
    const listId = ul.id

    // Create a list item
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = taskData.text;

    // Append the span to the <li>
    li.appendChild(span);

    // Add an edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-button");

    // Add functionality to the edit button
    editButton.addEventListener("click", () => editTask(span, taskData._id, listId));

    // Add a delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");

    // Add functionality to the delete button
    deleteButton.addEventListener("click", async () => {
        
        await deleteTask(taskData._id, listId);
        //remove task element

        ul.removeChild(li); 

    });

    // Append the span, edit button, and delete button to the <li>
    li.appendChild(span);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    // Add the <li> to the <ul>
    ul.appendChild(li);
}

// Add a new task to the list
async function addTask(ul: HTMLUListElement, input: HTMLInputElement): Promise<void> {
    const taskText = input.value.trim();
    const listId = ul.id; // Extract list ID

    console.log("listId:", listId)

    if(listId == null){
        console.error("listId is undefined")
        return
    }

    const response = await fetch(`http://localhost:3003/api/lists/${listId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': "application/json"},
        body: JSON.stringify({text: taskText}), // Send the task elements
    })
    
    if (!response.ok){
        console.error("Failed to add task")
        return
    }

    const newTask = await response.json()
    
    addTaskHTML(newTask, ul)
    // Clear the input field
    input.value = "";
}


// Edit a task
async function editTask (span: HTMLSpanElement, taskId: string, listId: string): Promise<void> {
    const newText = prompt("Edit task:", span.textContent || "");

    if (newText !== null) {
        span.textContent = newText.trim() || span.textContent; // Update text if not empty
    }
    
    const response = await fetch(`http://localhost:3003/api/lists/tasks`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listId, taskId, text: newText }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update task");
    }

    const data = await response.json()
    span.textContent = data.task.text
}


// Delete a task
async function deleteTask (taskId: string, listId: string): Promise<void> {
    const response = await fetch(`http://localhost:3003/api/lists/tasks`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listId, taskId }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete task");
    }

    console.log("Task deleted successfully");
}

//delete list
async function deleteList(listElement: HTMLUListElement): Promise<void> {
    const listId = listElement.id

    try {
        const response = await fetch(`http://localhost:3003/api/lists/${listId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to delete list");
        }

        console.log("List deleted successfully");
        listElement.remove(); // ??
    } catch (error) {
        console.error("Error deleting list:", error);
        alert("Failed to delete the list. Please try again.");
    }
}


// Main elements
const addListButton = document.getElementById("new") as HTMLButtonElement | null;
const addTaskButton = document.getElementById("add") as HTMLButtonElement | null;
const deleteListButton = document.getElementById("delete") as HTMLButtonElement | null;
const input = document.getElementById("input") as HTMLInputElement | null;

if (!addListButton || !addTaskButton || !deleteListButton || !input) {
    throw new Error("Required elements are not found in the DOM. Ensure correct IDs are used.");
}

// Track the currently selected list
let currentList: HTMLUListElement | null = null;

//Delete the currently selected list
deleteListButton.addEventListener("click", () => {
    if (currentList) {
        deleteList(currentList);
        currentList = null; // Reset the reference
    } else {
        alert("No list to delete!");
    }
});


// Create a new list when "New List" is clicked
addListButton.addEventListener("click", async () => {
    if (!input) return;

    const listTitle = input.value.trim();
    if (listTitle === "") {
        alert("List title cannot be empty!");
        return;
    }

    const newList = await createList(listTitle);

    // Update the current list to the newly created list

    if (currentList){
        currentList.style.border = "2px solid white"; // Reset background to white
    }
        currentList = newList;
});

// Add tasks to the currently selected list
addTaskButton.addEventListener("click", () => {
    if (!input) return;

    if (currentList) {
        addTask(currentList, input);
    } else {
        alert("You need to create or select a list first!");
    }
});

// Add functionality to select/deselect a list
document.body.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;

    if (target.tagName === "H3") {
        const ul = target.parentElement as HTMLUListElement | null;
        console.log("Selector, ul: ", ul)

        if (ul && ul.classList.contains("task-list")) {
            
            // Check if the clicked list is already selected
            if (currentList === ul) {
               
                // Deselect the current list
                currentList.style.border = "2px solid white"; // Reset background to white
                currentList = null; // Clear the reference
            
            } else {

                // Deselect the previously selected list, if any
                if (currentList) {
                    currentList.style.border = "2px solid white";
                }

                console.log("Select new list: ", currentList)

                // Select the new list
                currentList = ul;
                currentList.style.border = "2px solid blue"; // Set background to blue
            }
        }
    }
});

