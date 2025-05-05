import { setTask, setProject, getTask, getProject } from './state.js';

const generateID = () => crypto.randomUUID();

export function createProject(title) {
  const id = generateID();
  setProject({ id, title }, 'add');
  localStorage.setItem('projects', JSON.stringify(getProject()));
}

export function deleteProject(id) {
  const project = getProject(id);
  setProject(project, 'delete');
  localStorage.setItem('projects', JSON.stringify(getProject()));
}

export function createTask(title, project = getProject(1)) {
  const id = generateID();
  setTask({ id, title, project }, 'add');
  localStorage.setItem('tasks', JSON.stringify(getTask()));
}

export function editTasks(taskEdit) {
  setTask(taskEdit, 'edit');
  localStorage.setItem('tasks', JSON.stringify(getTask()));
}

export function completeTask(id) {
  const task = getTask(id);
  setTask(task, 'complete');
  localStorage.setItem('tasks', JSON.stringify(getTask()));
}

export function deleteTask(id) {
  const task = getTask(id);
  setTask(task, 'delete');
  localStorage.setItem('tasks', JSON.stringify(getTask()));
}
