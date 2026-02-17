const addTodoBtn = document.getElementById("addTodoBtn")
const inputTag = document.getElementById("todoInput")
const todoListUl = document.getElementById("todoList")
const remaining = document.getElementById("itemsLeft")
const clearCompletedBtn = document.getElementById("clearCompletedBtn")
const filterBtn = document.querySelectorAll(".filter-btn")


let todoText; // This should be populated when the user clicks on Add button
let todos = [];
let todosString = localStorage.getItem("todos")
// If we have todos in the localStorage, we will read it
if (todosString) {
    todos = JSON.parse(todosString);
    remaining.innerHTML = todos.filter((item)=>{return item.isCompleted!=true}).length + " items left";
}

filterBtn.forEach((item) =>{
   let filtervalue ="all";
   item.addEventListener('click',(e)=>{
    
    // remove active class from all buttons first
    filterBtn.forEach(btn => btn.classList.remove("active"))
    
    // add active class to clicked button
    e.target.classList.add("active")
    
    // convert to lowercase to match your conditions
    filtervalue = e.target.innerHTML.toLowerCase()
    
    // re-render todos based on filter
    populateTodos(filtervalue)
   })
})
const populateTodos = (filtervalue ="all") => {    // filter sets the default value to all if no argument is passed 
    let filteredtodos = todos;
    if(filtervalue === "active"){
        filteredtodos = todos.filter(todo =>!todo.isCompleted)
    }
     if(filtervalue === "completed"){
        filteredtodos = todos.filter(todo =>todo.isCompleted)
    }

    let string = ""; 
    for (const todo of filteredtodos) {
        string += `<li id="${todo.id}" class="todo-item ${todo.isCompleted ? "completed" : ""}">
            <input type="checkbox" class="todo-checkbox" ${todo.isCompleted ? "checked" : ""} >
            <span class="todo-text">${todo.title}</span>
            <button class="delete-btn">×</button>
        </li>` 
    }
    todoListUl.innerHTML = string


    // Add the checkbox logic to populate todos
    const todoCheckboxes = document.querySelectorAll(".todo-checkbox")

    todoCheckboxes.forEach((element) => {
        element.addEventListener("click", (e) => {
            if (e.target.checked) {
                element.parentNode.classList.add("completed")
                // Grab this todo from todos array and update the todos array to set this todo's isCompleted attribute as true
                todos = todos.map(todo => {
                    if (todo.id == element.parentNode.id) {
                        return { ...todo, isCompleted: true }
                    }
                    else {
                        return todo
                    }
                })
                remaining.innerHTML = todos.filter((item)=>{return item.isCompleted!=true}).length + " items left";
                localStorage.setItem("todos", JSON.stringify(todos))
            }
            else {
                element.parentNode.classList.remove("completed")
                // Grab this todo from todos array and update the todos array to set this todos isCompleted attribute as false
                todos = todos.map(todo => {
                    if (todo.id == element.parentNode.id) {
                        return { ...todo, isCompleted: false }
                    }
                    else {
                        return todo
                    }
                })
                remaining.innerHTML =  todos.filter((item)=>{return item.isCompleted!=true}).length + " items left";
                localStorage.setItem("todos", JSON.stringify(todos))
            }
        })
    })
    let deleteBtns = document.querySelectorAll(".delete-btn")
    // Handle the delete buttons  
  deleteBtns.forEach((element) => {
        element.addEventListener("click", (e) => {
            const confirmation = confirm("Do you want to delete this todo") 
            if(confirmation){ 
                todos = todos.filter((todo) => {
                    return (todo.id) !== (e.target.parentNode.id)
                })
                remaining.innerHTML = todos.filter((item)=>{return item.isCompleted!=true}).length + " items left";
                localStorage.setItem("todos", JSON.stringify(todos))
                populateTodos(filtervalue)
            }
        })
    })
    
}


addTodoBtn.addEventListener("click", () => {
    todoText = inputTag.value
    // check if the length of todo is greater than 3 
    if(todoText.trim().length<4){
        alert("You cannot add a todo that small!")
        return
    }
    inputTag.value = ""
    let todo = {
        id: "todo-" + Date.now(),
        title: todoText,
        isCompleted: false
    }
    todos.push(todo)
    remaining.innerHTML = todos.filter((item)=>{return item.isCompleted!=true}).length + " items left";
    localStorage.setItem("todos", JSON.stringify(todos))
    populateTodos(filtervalue)
})


    // Handle the clear completed button click
    clearCompletedBtn.addEventListener("click", ()=>{
        const confirmation = confirm("Do you want to delete this todo") 
        if(confirmation){
            todos = todos.filter((todo)=> todo.isCompleted == false)
        }
        populateTodos()
        localStorage.setItem("todos", JSON.stringify(todos))

    })

populateTodos(filtervalue)
