// Enter key event listener Needed to add a DOMContentLoaded event listener to the document object to ensure that the 
// DOM is fully loaded before adding the keydown event listener to the input element. 
// This is because the input element is not available until the DOM is fully loaded. The keydown event listener listens for the Enter key press and calls the add_task function when the Enter key is pressed.
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("input").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            add_task();
        }
    });

    // Add an event listener to the days in the calendar to return the tasks for that day to the list
    document.getElementById("calendar_days").addEventListener("click", function(event) {
        if (event.target.tagName === "DIV") {
            // Get the day number from the clicked div
            var day_string = event.target.textContent;
            day = day_string.charAt(0);
            console.log("Day:", day);
            tasks_to_todo_from_calendar(day);
        }
    });

    // Load tasks from localStorage
    load_tasks();

    // Initialize the calendar
    init_calendar();
});

// Add a task to the list
function add_task() {
    console.log("Add Task");
    
    // Get the input value
    var task = document.getElementById("input").value;
    
    // Check if the input value is empty
    if (task == "") {
        alert("Please enter a task");
        return;
    }

    var li = document.createElement("li");  // Create a new list item

    // Create an input element for the checkbox
    var check = document.createElement("input");
    check.setAttribute("type", "checkbox");
    check.setAttribute("id", "task");

    // Create a span element for the task text
    var taskText = document.createElement("span");
    taskText.textContent = task;

    check.addEventListener("change", function() {
        if (this.checked) {
            taskText.classList.add("completed");
        } else {
            taskText.classList.remove("completed");
        }
        save_tasks(); // Save tasks whenever a checkbox is changed
    });

    li.appendChild(check); // Add the checkbox to the list item
    li.appendChild(taskText); // Add the task text to the list item

    // Add the list item to the list
    document.getElementById("task_list").appendChild(li);

    // Clear the input field
    document.getElementById("input").value = "";

    // Save tasks to localStorage
    save_tasks();
}

// Function to clear tasks from the list
function clear_tasks() {
    console.log("Clear Task button clicked");
    var taskList = document.getElementById("task_list"); // Get the task list
    var tasks = taskList.getElementsByTagName("li");     // Get all the list items

    for (var i = tasks.length - 1; i >= 0; i--) {    // Loop through all the list items
        if (tasks[i].querySelector("span").classList.contains("completed")) {   // Check if the task is completed
            taskList.removeChild(tasks[i]);
        }
    }

    // Save tasks to localStorage
    save_tasks();
}

// Function to save tasks to localStorage
function save_tasks() {
    var taskList = document.getElementById("task_list");
    var tasks = taskList.getElementsByTagName("li");
    var tasksArray = [];

    for (var i = 0; i < tasks.length; i++) {
        var taskText = tasks[i].querySelector("span").textContent;
        var isCompleted = tasks[i].querySelector("input[type='checkbox']").checked;
        tasksArray.push({ text: taskText, completed: isCompleted });
    }

    localStorage.setItem("tasks", JSON.stringify(tasksArray));
}

// Function to load tasks from localStorage
function load_tasks() {
    var tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks) {
        for (var i = 0; i < tasks.length; i++) {
            var li = document.createElement("li");

            var check = document.createElement("input");
            check.setAttribute("type", "checkbox");
            check.setAttribute("id", "task");

            // Create a span element for the task text
            var taskText = document.createElement("span");
            taskText.textContent = tasks[i].text;

            if (tasks[i].completed) {
                check.checked = true;
                taskText.classList.add("completed");
            }

            check.addEventListener("change", (function(taskText) {
                return function() {
                    if (this.checked) {
                        taskText.classList.add("completed");
                    } else {
                        taskText.classList.remove("completed");
                    }
                    save_tasks(); // Save tasks whenever a checkbox is changed
                };
            })(taskText));

            li.appendChild(check);
            li.appendChild(taskText);

            document.getElementById("task_list").appendChild(li);
        }
    }
}

// Function to create calendar functions
function init_calendar() {
    const calendarDays = document.getElementById("calendar_days");
    const monthYear = document.getElementById("month_year");
    const prevMonth = document.getElementById("prev_month");
    const nextMonth = document.getElementById("next_month");

    let currentDate = new Date();

    // Display the current month and year
    function renderCalendar() {
        calendarDays.innerHTML = "";
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();

        monthYear.innerHTML = `${currentDate.toLocaleString('default', { month: "long"})} ${year}`;
        
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDiv = document.createElement("div");
            calendarDays.appendChild(emptyDiv);
        }

        for(let i = 1; i <= daysInMonth; i++) { // Start from 1 instead of 0
            const dayDiv = document.createElement("div");
            dayDiv.setAttribute("id", "day" + i);
            dayDiv.textContent = i;
            calendarDays.appendChild(dayDiv);
        }
    }

    prevMonth.addEventListener("click", function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonth.addEventListener("click", function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar();
}

// Function to add tasks to the calendar from the todo list
function add_from_todo() {
    var date = document.getElementById("date").value;
    var tasks = document.getElementById("task_list").getElementsByTagName("li");
    var tasksArray = [];

    console.log("Date:", date, "Tasks:", tasks);


    for(let i = 0; i < tasks.length; i++) {
        var taskText = tasks[i].querySelector("span").textContent;  // Get the task text
        var isCompleted = tasks[i].querySelector("input[type='checkbox']").checked; //Check if the task is completed
        tasksArray.push({ text: taskText, completed: isCompleted }); // Add the task to the tasksArray
        console.log("Task Text:", taskText, "Is Completed:", isCompleted, "Tasks Array:", tasksArray); // Log the task text, isCompleted and tasksArray
    }

    //Now we need to save the tasks to localStorage
    //localStorage.setItem(date, JSON.stringify(tasksArray));


    //Display in calendar
    var task = document.getElementById("day" + date);

    console.log("Task:", task);
    
    for(let i = 0; i < tasksArray.length; i++) {
        var taskText = document.createElement("span" + i);
        taskText.setAttribute("id", "calendar_task");
        taskText.textContent = tasksArray[i].text;
        task.appendChild(taskText);

        /// Clear the tasks from the list
        for(let j = 0; j < tasks.length; j++){
            document.getElementById("task_list").removeChild(tasks[j]);
        }
        console.log("Task Text:", taskText);
    }

    


    return;
}

function tasks_to_todo_from_calendar(day) {
    console.log("Day:", day);
    var task = document.getElementById("day" + day);
    for(let i = 0; i<task.length; i++) {
        var taskText = task[i].querySelector("span" + i).textContent;
        var isCompleted = task[i].querySelector("input[type='checkbox']").checked;
        tasksArray.push({ text: taskText, completed: isCompleted });
    }

    console.log("Task:", task, "Tasks:", taskText, "Is Completed:", isCompleted);
}
