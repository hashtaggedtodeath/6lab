// storage.js
const LS_USERS = 'spa_users_local';
const LS_TODOS = 'spa_todos_local';

export const storage = {
  getUsers() {
    try { return JSON.parse(localStorage.getItem(LS_USERS) || '[]'); } catch { return []; }
  },
  saveUsers(arr) { localStorage.setItem(LS_USERS, JSON.stringify(arr)); },
  addUser(u) {
    const arr = storage.getUsers();
    arr.push(u);
    storage.saveUsers(arr);
  },
  deleteUser(id) {
    const arr = storage.getUsers().filter(x => x.id !== id);
    storage.saveUsers(arr);
  },

  getTodos() {
    try { return JSON.parse(localStorage.getItem(LS_TODOS) || '[]'); } catch { return []; }
  },
  saveTodos(arr) { localStorage.setItem(LS_TODOS, JSON.stringify(arr)); },
  addTodo(t) {
    const arr = storage.getTodos();
    arr.push(t);
    storage.saveTodos(arr);
  },
  deleteTodosByUser(userId) {
    const arr = storage.getTodos().filter(t => t.userId !== userId);
    storage.saveTodos(arr);
  }
};
