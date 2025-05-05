import { getTask, getProject } from './state.js';
import { createTask, createProject, completeTask, editTasks } from './app.js';
import { formatDistanceToNow } from 'date-fns';
import radioUncheckedIcon from '../assets/radio-unchecked.svg';
import radioCheckedIcon from '../assets/radio-checked.svg';
import openTaskIcon from '../assets/open.svg';
import dropdownArrow from '../assets/drop-down.svg';
import closeModalIcon from '../assets/close.svg';
import '../styles/style.css';

function createTaskElement(taskData) {
  const task = document.createElement('div');
  task.classList.add('task');
  task.id = taskData.id;

  const title = document.createElement('span');
  title.textContent = taskData.title;

  const radioButton = document.createElement('img');
  radioButton.classList.add('radio');
  radioButton.src = radioUncheckedIcon;
  radioButton.alt = 'Radio icon';

  const dueDate = document.createElement('span');
  dueDate.classList.add('dueDate');
  dueDate.textContent = taskData.dueDate
    ? formatDistanceToNow(taskData.dueDate)
    : 'No due date';

  const openTask = document.createElement('img');
  openTask.classList.add('open-task');
  openTask.src = openTaskIcon;
  openTask.alt = 'Open task icon';

  switch (taskData.priority) {
    case '1':
      task.classList.add('priority-1');
      break;
    case '2':
      task.classList.add('priority-2');
      break;
    case '3':
      task.classList.add('priority-3');
      break;
  }

  task.appendChild(title);
  task.appendChild(dueDate);
  task.appendChild(openTask);
  task.appendChild(radioButton);

  return task;
}

function createProjectElement(projectData) {
  const projectElement = document.createElement('li');
  projectElement.textContent = projectData.title;
  projectElement.id = projectData.id;

  return projectElement;
}

function showModal(id) {
  const modal = document.querySelector('.modal');
  modal.innerHTML = '';
  modal.id = id;
  const task = getTask(id);

  const closeModal = document.createElement('img');
  closeModal.src = closeModalIcon;
  closeModal.alt = 'Close modal';
  closeModal.classList.add('close-modal');

  const title = document.createElement('h2');
  title.textContent = task.title;
  title.contentEditable = 'true';

  title.addEventListener('blur', () => {
    if (title.textContent.trim() === '') {
      title.textContent = task.title;
    }

    editTasks({ id, title: title.textContent });
  });

  const project = document.createElement('div');
  project.classList.add('project-dropdown');
  const dropdownContent = document.createElement('div');
  const currentProject = document.createElement('span');
  currentProject.classList.add('current-project');
  const dropdownIcon = document.createElement('img');
  dropdownIcon.src = dropdownArrow;
  currentProject.textContent = task.project.title;
  project.appendChild(currentProject);
  currentProject.appendChild(dropdownIcon);
  getProject().forEach((obj) => {
    const projectElement = createProjectElement(obj);
    dropdownContent.appendChild(projectElement);
    project.appendChild(dropdownContent);
  });

  const description = document.createElement('p');
  description.classList.add('description');
  description.contentEditable = 'true';
  !task.description
    ? (description.textContent = 'Type your description here...')
    : (description.textContent = task.description);

  description.addEventListener('focus', () => {
    if (description.textContent.trim() === 'Type your description here...') {
      description.textContent = '';
    }
  });

  description.addEventListener('blur', () => {
    if (description.textContent.trim() === '') {
      description.textContent = 'Type your description here...';
    }

    editTasks({ id, description: description.textContent });
  });

  const priority = document.createElement('div');
  priority.classList.add('priority');
  for (let i = 1; i <= 3; i++) {
    const div = document.createElement('div');
    div.textContent = i;
    priority.appendChild(div);
  }
  const priorityElements = priority.querySelectorAll('div');
  priorityElements.forEach((el) => {
    if (el.textContent == task.priority) {
      el.classList.add('current-priority');
    }
  });

  const dueDate = document.createElement('input');
  dueDate.classList.add('dueDateInput');
  dueDate.type = 'date';
  task.dueDate ? (dueDate.value = task.dueDate) : '';
  dueDate.addEventListener('focus', (e) => {
    e.target.showPicker();
  });

  dueDate.addEventListener('blur', () => {
    editTasks({ id, dueDate: dueDate.value });
  });

  modal.appendChild(closeModal);
  modal.appendChild(title);
  modal.appendChild(project);
  modal.appendChild(description);
  modal.appendChild(priority);
  modal.appendChild(dueDate);
  modal.style.display = 'grid';
}

function loadProjects() {
  const projects = document.querySelector('#projects');
  projects.innerHTML = '';

  JSON.parse(localStorage.getItem('projects')).forEach((projectData) => {
    const projectElement = createProjectElement(projectData);
    projects.appendChild(projectElement);
  });
}

loadProjects();

function loadTasks(project = JSON.parse(localStorage.getItem('projects'))[0]) {
  const todolist = document.querySelector('#todolist');
  todolist.innerHTML = '';

  if (project.id != 1) {
    JSON.parse(localStorage.getItem('tasks'))
      .filter((task) => task.project.id == project.id)
      .forEach((taskData) => {
        const taskElement = createTaskElement(taskData);
        todolist.appendChild(taskElement);
      });
    return;
  }

  JSON.parse(localStorage.getItem('tasks')).forEach((taskData) => {
    const taskElement = createTaskElement(taskData);
    todolist.appendChild(taskElement);
  });
}

loadTasks();

function handleClick() {
  const tasks = document.querySelector('#todolist');
  const inputAddTask = document.querySelector('#add-task');
  const buttonAddTask = document.querySelector('.add-button');
  const modal = document.querySelector('.modal');
  const radios = document.querySelectorAll('.radio');
  const projects = document.querySelector('#projects');

  tasks.addEventListener('click', (e) => {
    const id = e.target.parentNode.id;
    if (e.target.classList.contains('radio')) {
      completeTask(id);
      loadTasks();
    } else if (e.target.classList.contains('open-task')) {
      showModal(id);
    }
  });

  inputAddTask.addEventListener('keydown', (e) => {
    if (e.key == 'Enter' && inputAddTask.value) {
      createTask(inputAddTask.value);
      inputAddTask.value = '';
      loadTasks();
    }
  });

  buttonAddTask.addEventListener('click', () => {
    if (inputAddTask.value) {
      createTask(inputAddTask.value);
      inputAddTask.value = '';
      loadTasks();
    }
  });

  radios.forEach((radio) => {
    radio.addEventListener('mouseover', () => {
      radio.src = radioCheckedIcon;
    });

    radio.addEventListener('mouseout', () => {
      radio.src = radioUncheckedIcon;
    });
  });

  projects.addEventListener('click', (e) => {
    if (e.target.tagName == 'LI') {
      const li = projects.querySelectorAll('li');
      li.forEach((el) => el.classList.remove('active-button'));
      e.target.classList.add('active-button');
      loadTasks(e.target);
    }
  });

  // Modal
  modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('current-project')) {
      const element = e.target.nextElementSibling.style;
      element.display == 'block'
        ? (element.display = 'none')
        : (element.display = 'block');
    } else if (e.target.classList.contains('close-modal')) {
      modal.style.display = 'none';
      loadTasks();
    } else if (e.target.parentNode.classList.contains('priority')) {
      const priority = document.querySelector('.priority');
      const children = priority.querySelectorAll('div');
      children.forEach((child) => child.classList.remove('current-priority'));
      e.target.classList.add('current-priority');
      editTasks({ id: modal.id, priority: e.target.textContent });
    } else if (e.target.id && e.target.tagName == 'LI') {
      const task = getTask(modal.id);
      const project = getProject(e.target.id);
      editTasks({ id: task.id, project });
      showModal(task.id);
    }
  });
}

handleClick();
