// Declarations variables from html
const urlPage = 'http://localhost:3000/';
const taskInput = document.querySelector('.input-new-task');
const formInputNewTask = document.querySelector('.form-input-new-task');
const btnAddTask = document.querySelector('.btn-add-task');
const btnUncheckFinishedTasks = document.querySelector('.uncheck-done-task');
const btnCheckAllTasks = document.querySelector('.check-all-tasks');
const btndeleteCheckedTasks = document.querySelector('.delete-checked-tasks');
const listOfTasks = document.querySelector('.list-of-tasks');
const counterOfTasksDone = document.querySelector('.count-of-tasks-done');
const counterAllTasks = document.querySelector('.count-of-tasks');

const checkboxesForTask = document.querySelectorAll('.checkbox-of-task');
const btnsEditNameOfTask = document.querySelectorAll('.btn-edit-name-of-task');
const btnsDeleteTask = document.querySelectorAll('.btn-delete-task');

// Switch variables
let nameForChangingTask;
let idForChangingTask;
let isTaskNameEditing = false;

// Function

const convertDateFinishedTask = (dateFinishedTask) => {
  const listOfDay = [
    'niedziela',
    'poniedziałek',
    'wtorek',
    'środa',
    'czwartek',
    'piątek',
    'sobota',
  ];
  const listOfMonth = [
    'st',
    'lut',
    'mrz',
    'kw',
    'maj',
    'cz',
    'lip',
    'sier',
    'wrz',
    'paź',
    'lis',
    'gr',
  ];
  const day = listOfDay[dateFinishedTask.getDay()];
  const numberOfDay = dateFinishedTask.getDate();
  const month = listOfMonth[dateFinishedTask.getMonth()];
  const hours = dateFinishedTask.getHours();
  let minutes = dateFinishedTask.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  } else {
    minutes = minutes.toString();
  }
  const result = `Zakończone ${day} ${numberOfDay} ${month} ${hours}:${minutes}`;
  return result;
};

const updateCountOfTasks = (countOfTaskDone, allCountOfTask) => {
  counterOfTasksDone.textContent = countOfTaskDone;
  counterAllTasks.textContent = allCountOfTask;
};

const updateCountOfTasksForCheckingAndDeleting = async () => {
  const file = await fetch(`${urlPage}loadingData`);
  let data = await file.json();
  if (!data) {
    return;
  }
  data = JSON.parse(data);

  const countFinishedTask = data.filter((e) => e.isFinished === true).length;
  const allTasks = data.length;
  updateCountOfTasks(countFinishedTask, allTasks);
};

const setCheckboxForTask = async (e) => {
  const id = Number(e.target.getAttribute('data-id'));
  e.target.toggleAttribute('checked');

  const isFinished = e.target.hasAttribute('checked');
  const dateFinishedTask = isFinished
    ? convertDateFinishedTask(new Date())
    : null;

  const infosAboutTask = document.querySelectorAll('.infoAboutTask');
  [...infosAboutTask].forEach((el) => {
    if (Number(el.attributes[1].value) === id) {
      if (isFinished) {
        el.childNodes[0].classList.add('checked');
        const dateWhenTaskFinished = document.createElement('h4');
        dateWhenTaskFinished.innerText = dateFinishedTask;
        el.appendChild(dateWhenTaskFinished);
      } else {
        el.childNodes[0].classList.remove('checked');
        el.childNodes[1].remove();
      }
    }
  });
  await fetch(urlPage, {
    method: 'PATCH',
    body: JSON.stringify({
      id,
      isFinished,
      dateFinishedTask,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  updateCountOfTasksForCheckingAndDeleting();
};

const editTask = (e) => {
  taskInput.focus();
  idForChangingTask = Number(e.target.getAttribute('data-id'));
  const namesOfTask = document.querySelectorAll('.name-of-task');

  [...namesOfTask].forEach((el) => {
    if (Number(el.attributes[1].value) === idForChangingTask) {
      nameForChangingTask = el.innerText;
    }
  });

  // console.log(nameForChangingTask);
  isTaskNameEditing = true;
  taskInput.classList.add('editing');
  taskInput.value = nameForChangingTask;
};

const deleteTask = async (e) => {
  taskInput.focus();
  const idDeletingTask = Number(e.target.getAttribute('data-id'));
  const tasks = document.querySelectorAll('.task');
  for (const task of tasks) {
    if (Number(task.attributes['data-id'].value) === idDeletingTask) {
      task.remove();
    }
  }
  await fetch(urlPage, {
    method: 'DELETE',
    body: JSON.stringify({ idDeletingTask }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  isTaskNameEditing = false;
  taskInput.classList.remove('editing');
  taskInput.value = '';

  updateCountOfTasksForCheckingAndDeleting();
};

const postNewTaskOnPage = (taskName, id, isFinished, dateFinishedTask) => {
  // Create a main container
  const mainTask = document.createElement('div');
  mainTask.classList.add('task');
  mainTask.dataset.id = id;

  // Create checkbox
  const inputCheckbox = document.createElement('input');
  inputCheckbox.setAttribute('type', 'checkbox');
  inputCheckbox.classList.add('checkbox-of-task');
  inputCheckbox.dataset.id = id;
  inputCheckbox.addEventListener('click', setCheckboxForTask);
  // Create div which includes info about name and date when task have been finished
  const divNameOfTask = document.createElement('div');
  divNameOfTask.classList.add('infoAboutTask');
  divNameOfTask.dataset.id = id;

  const nameOfTask = document.createElement('h3');
  nameOfTask.innerText = taskName;
  nameOfTask.classList.add('name-of-task');
  nameOfTask.dataset.id = id;

  const dateWhenTaskFinished = document.createElement('h4');

  if (isFinished) {
    inputCheckbox.setAttribute('checked', 'true');
    dateWhenTaskFinished.innerText = dateFinishedTask;
    nameOfTask.classList.add('checked');
  }
  divNameOfTask.appendChild(nameOfTask);

  if (isFinished) {
    divNameOfTask.appendChild(dateWhenTaskFinished);
  }

  const divSettings = document.createElement('div');
  divSettings.classList.add('settings');
  const iElement = document.createElement('i');
  iElement.classList.add('fa-solid', 'fa-ellipsis');
  const elTaskMenu = document.createElement('ul');
  elTaskMenu.classList.add('task-menu');

  const liElEditTaskName = document.createElement('li');
  liElEditTaskName.dataset.id = id;
  liElEditTaskName.classList.add('btn-edit-task-of-name');
  liElEditTaskName.addEventListener('click', editTask);
  const iElEditTaskName = document.createElement('i');
  iElEditTaskName.classList.add('fa-solid', 'fa-pen');

  const liElDeleteTask = document.createElement('li');
  liElDeleteTask.dataset.id = id;
  liElDeleteTask.classList.add('btn-delete-task');
  liElDeleteTask.addEventListener('click', deleteTask);
  const iElDeleteTask = document.createElement('i');
  iElDeleteTask.classList.add('fa-solid', 'fa-trash');

  liElEditTaskName.appendChild(iElEditTaskName);
  liElEditTaskName.append('Edytuj');
  liElDeleteTask.appendChild(iElDeleteTask);
  liElDeleteTask.append('Usuń');

  elTaskMenu.appendChild(liElEditTaskName);
  elTaskMenu.appendChild(liElDeleteTask);
  divSettings.appendChild(iElement);
  divSettings.appendChild(elTaskMenu);

  mainTask.appendChild(inputCheckbox);
  mainTask.appendChild(divNameOfTask);
  mainTask.appendChild(divSettings);
  return mainTask;
};

// Loading data from the server
const showDataFromServer = async () => {
  const file = await fetch(`${urlPage}loadingData`);
  let data = await file.json();
  if (!data) {
    return;
  }
  data = JSON.parse(data);
  listOfTasks.innerText = '';
  data.forEach(({
    taskName, id, isFinished, dateFinishedTask,
  }) => {
    listOfTasks.appendChild(
      postNewTaskOnPage(taskName, id, isFinished, dateFinishedTask),
    );
  });
  const countFinishedTask = data.filter((e) => e.isFinished === true).length;
  const allTasks = data.length;
  updateCountOfTasks(countFinishedTask, allTasks);
};

showDataFromServer();

const addNewTask = async (el) => {
  el.preventDefault();
  const taskName = taskInput.value.trim();
  if (!taskName) {
    return;
  }
  if (isTaskNameEditing === false) {
    await fetch(urlPage, {
      method: 'POST',
      body: JSON.stringify({ taskName }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } else if (isTaskNameEditing === true) {
    if (taskName === nameForChangingTask) {
      return;
    }

    await fetch(`${urlPage}editName`, {
      method: 'PATCH',
      body: JSON.stringify({
        taskName,
        id: idForChangingTask,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    idForChangingTask = null;
    nameForChangingTask = null;
    isTaskNameEditing = false;
    taskInput.classList.remove('editing');
  }
  taskInput.value = '';
  showDataFromServer();
};

const uncheckFinishedTasks = async () => {
  await fetch(`${urlPage}checkUncheck`, {
    method: 'PATCH',
    body: JSON.stringify({ isFinished: false }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  showDataFromServer();
};

const checkAllTasks = async () => {
  const dateFinishedTask = convertDateFinishedTask(new Date());

  await fetch(`${urlPage}checkUncheck`, {
    method: 'PATCH',
    body: JSON.stringify({ isFinished: true, dateFinishedTask }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  showDataFromServer();
};

const deleteCheckedTasks = async () => {
  await fetch(`${urlPage}deleteCheckedTasks`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  showDataFromServer();
};

// Event handling

btnUncheckFinishedTasks.addEventListener('click', uncheckFinishedTasks);
btnCheckAllTasks.addEventListener('click', checkAllTasks);
btndeleteCheckedTasks.addEventListener('click', deleteCheckedTasks);

formInputNewTask.addEventListener('submit', addNewTask);
btnAddTask.addEventListener('click', addNewTask);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    taskInput.value = '';
    isTaskNameEditing = false;
    taskInput.classList.remove('editing');
  }
});

for (const checkboxForTask of checkboxesForTask) {
  checkboxForTask.addEventListener('click', setCheckboxForTask);
}

for (const btnEditNameOfTask of btnsEditNameOfTask) {
  btnEditNameOfTask.addEventListener('click', editTask);
}

for (const btnDeleteTask of btnsDeleteTask) {
  btnDeleteTask.addEventListener('click', deleteTask);
}
