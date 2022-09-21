const form = document.querySelector('.form');
const input = form.querySelector('input');
const todoList = document.querySelector('.list');
const count = document.querySelector('.count');

let state = []

form.addEventListener('submit', handleSubmit);
document.addEventListener('DOMContentLoaded', renderTodo);

function handleSubmit(event) {
    event.preventDefault();


    if (validata()) {
        let todo = {
            id: new Date().getTime(),
            title: input.value,
            completed: false,
        }

        setState([todo, ...state])

        form.reset()
    } else {
        alert("Сделайте заметку")
    }

}

function validata() {
    let isValid = false

    if (input.value !== ''.trim()) {
        isValid = true
    }

    return isValid
}

function printTodos() {
    const todosHtml = state.map(({id, title, completed}) => {
        return `
                    <li class="list__item" data-id="${id}">
                        <label class="check">
                            <input class="check__input" type="checkbox" ${completed ? 'checked' : ''}>
                            <span class="check__box"></span>
                            ${title}
                        </label>
                        <button class="list__close button">&times;</button>
                    </li>
                `
    }).join('')  

    todoList.innerHTML = todosHtml;

    handlersClose()
    handleChange()
}

function setToStorage() {
    localStorage.setItem('tasks', JSON.stringify(state)) || [];
}

function getFromStorage() {
    const todos = JSON.parse(localStorage.getItem('tasks') || '[]');
    const newState = [...state, ...todos];
    setState(newState)
}

// remove todo

function handlersClose() {
    const closeBtn = todoList.querySelectorAll('button')
    closeBtn.forEach(btn => btn.addEventListener('click', removeTodo))
}

function handlersReClose() {
    const closeBtn = todoList.querySelectorAll('button')
    closeBtn.forEach(btn => btn.removeEventListener('click', removeTodo))
}

function removeTodo() {
    const id = +this.closest('li').getAttribute('data-id')
    const newState = state.filter(todo => todo.id !== id)
    setState(newState)
    removeToStorage(id)
}

function removeToStorage(id) {
    const todos = JSON.parse(localStorage.getItem('tasks')) || [];
    localStorage.setItem('tasks', JSON.stringify(todos.filter(todo => todo.id !== id)))
}

// toggleCheck

function toggleCheck() {
    const id = +this.closest('li').getAttribute('data-id')
    const newState = state.map(todo => {
        if (todo.id === id) {
            todo.completed = !todo.completed
        }
        return todo
    })
    setState(newState);
}

function handleChange() {
    const checkbox = todoList.querySelectorAll('input[type="checkbox"]')
    checkbox.forEach(el => el.addEventListener('change', toggleCheck))
}

// rendering and working the state

function setState(todos) {
    const newState = [...todos]
    state = newState
    setToStorage()
    printTodos()
    todoCount(state)
}

function todoCount(state) {
    let stateCount = state.length

    if (stateCount === 0) {
        count.innerHTML = `You have no tasks`
    } else {
        count.innerHTML =`You have ${stateCount} tasks`
    }
}


function renderTodo() {
    getFromStorage()
}
