let tasks = [];

function addTask() {
    const taskTitle = document.getElementById("taskTitle").value.trim();
    const taskDescription = document.getElementById("taskDescription").value.trim();

    if (taskTitle === "" || taskDescription === "") return;

    const newTask = {
        id: Date.now(),
        title: taskTitle,
        description: taskDescription,
        isCompleted: false,
        createdAt: new Date().toLocaleString(),
        completedAt: null,
    };

    tasks.push(newTask);

    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";

    renderTasks();
}

function renderTasks() {
    const pendingTasksEl = document.getElementById("pendingTasks");
    const completedTasksEl = document.getElementById("completedTasks");
    pendingTasksEl.innerHTML = "";
    completedTasksEl.innerHTML = "";

    tasks.forEach(task => {
        const taskEl = document.createElement("li");
        taskEl.className = "task-item";

        const taskTitle = document.createElement("div");
        taskTitle.className = "task-item-title";
        taskTitle.textContent = task.title;

        const taskDesc = document.createElement("div");
        taskDesc.className = "task-item-desc";
        taskDesc.textContent = task.description;

        const timestamp = document.createElement("div");
        timestamp.className = "timestamp";
        timestamp.textContent = task.isCompleted ? `Completed: ${task.completedAt}` : `Created: ${task.createdAt}`;

        const taskButtons = document.createElement("div");
        taskButtons.className = "task-buttons";

        if (!task.isCompleted) {
            const completeBtn = document.createElement("button");
            completeBtn.className = "complete-btn";
            completeBtn.textContent = "✔";
            completeBtn.onclick = () => toggleCompleteTask(task.id);
            taskButtons.appendChild(completeBtn);
        }

        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.textContent = "✎";
        editBtn.onclick = () => editTask(task.id);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "✖";
        deleteBtn.onclick = () => deleteTask(task.id);

        taskButtons.appendChild(editBtn);
        taskButtons.appendChild(deleteBtn);

        taskEl.appendChild(taskTitle);
        taskEl.appendChild(taskDesc);
        taskEl.appendChild(timestamp);
        taskEl.appendChild(taskButtons);

        if (task.isCompleted) {
            completedTasksEl.appendChild(taskEl);
        } else {
            pendingTasksEl.appendChild(taskEl);
        }
    });
}

function toggleCompleteTask(taskId) {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.isCompleted = true;
        task.completedAt = new Date().toLocaleString();
        renderTasks();
    }
}

function editTask(taskId) {
    const task = tasks.find(task => task.id === taskId);
    const newTitle = prompt("Edit title:", task.title);
    const newDesc = prompt("Edit description:", task.description);

    if (newTitle && newDesc) {
        task.title = newTitle;
        task.description = newDesc;
        renderTasks();
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    renderTasks();
}
