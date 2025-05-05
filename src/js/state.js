const state = {
  tasks: [],
  projects: [{ id: 1, title: 'All' }],
  completedTasks: [],
};

state.tasks = JSON.parse(localStorage.getItem('tasks'));
state.projects = JSON.parse(localStorage.getItem('projects'));

export const getTask = (id, project = state.projects[0]) => {
  if (id) {
    return state.tasks.filter((task) => task.id == id)[0];
  }

  if (state.tasks.some((task) => task.hasOwnProperty('priority'))) {
    return state.tasks.sort((a, b) => a.priority - b.priority);
  }

  return state.tasks;
};

export const setTask = (task, command) => {
  const index = state.tasks.findIndex((obj) => obj.id == task.id);
  if (command == 'add') {
    state.tasks.push(task);
  } else if (command == 'complete') {
    state.tasks.splice(index, 1);
    state.completedTasks.push(task);
  } else if (command == 'delete') {
    state.tasks.splice(index, 1);
  } else if (command == 'edit') {
    const { id, ...edit } = task;
    const newElement = { ...getTask(id), ...edit };
    state.tasks[index] = newElement;
  }
};

export const getProject = (id) => {
  if (id) {
    return state.projects.filter((project) => project.id == id)[0];
  }

  return state.projects;
};

export const setProject = (project, command) => {
  if (command == 'add') {
    state.projects.push(project);
  } else if (command == 'delete') {
    const index = state.projects.findIndex((obj) => obj.id == project.id);
    state.projects.splice(index, 1);
    console.log(`${project.title} was deleted`);
  }
};
