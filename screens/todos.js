// screens/todos.js
import { createEl, clear } from '../components.js';
import { api } from '../api.js';
import { storage } from '../storage.js';
import { debounce } from '../utils.js';
import { renderBreadcrumbs } from '../breadcrumbs.js';

export async function todosScreen({root, params}) {
  const wrap = createEl('div', {class:'app-container'});
  wrap.appendChild(renderBreadcrumbs(['users','todos']));

  const userSelect = createEl('select');
  const search = createEl('input', {type:'search', placeholder:'Поиск по title'});
  const addBtn = createEl('button', {class:'button', on:{click:onShowForm}}, 'Добавить todo');
  const header = createEl('div', {class:'search-row'}, userSelect, search, addBtn);
  wrap.appendChild(header);

  const list = createEl('div', {class:'list'});
  wrap.appendChild(list);
  root.appendChild(wrap);

  const [apiUsers, apiTodos] = await Promise.all([api.users(), api.todos()]);
  const localUsers = storage.getUsers();
  const users = [...apiUsers, ...localUsers];

  userSelect.appendChild(createEl('option', {value:''}, 'Все пользователи'));
  for (const u of users) userSelect.appendChild(createEl('option', {value:u.id}, u.name));
  if (params && params.userId) userSelect.value = params.userId;

  let todos = [...apiTodos.map(t=>({...t})), ...storage.getTodos().map(t=>({...t}))];

  function renderList() {
    clear(list);
    const sel = userSelect.value;
    const q = (search.value || '').toLowerCase().trim();
    let filtered = todos.filter(t => !sel || String(t.userId) === String(sel));
    if (q) filtered = filtered.filter(t => t.title && t.title.toLowerCase().includes(q));
    if (!filtered.length) list.appendChild(createEl('div', {class:'small'}, 'Пусто'));
    for (const t of filtered) {
      const left = createEl('div', {},
        createEl('div', {}, createEl('strong', {}, t.title)),
        createEl('div', {class:'meta'}, `UserId: ${t.userId} • completed: ${t.completed}`)
      );
      const actions = createEl('div', {class:'actions'},
        createEl('button', {class:'btn-ghost', on:{click: ()=>onToggle(t.id)}}, 'Toggle'),
        createEl('button', {class:'btn-ghost', on:{click: ()=>onDelete(t.id)}}, 'Удалить')
      );
      const item = createEl('div', {class:'item'}, left, actions);
      list.appendChild(item);
    }
  }

  const deb = debounce(() => renderList(), 250);
  search.addEventListener('input', deb);
  userSelect.addEventListener('change', renderList);
  renderList();

  function onShowForm() {
    const form = createEl('div', {class:'form-row'},
      createEl('input', {placeholder:'Title', id:'tt'}),
      createEl('select', {id:'selUser'}, ...users.map(u=>createEl('option',{value:u.id},u.name))),
      createEl('button', {class:'button', on:{click:onCreate}}, 'Добавить'),
      createEl('button', {class:'btn-ghost', on:{click: ()=>form.remove()}}, 'Отмена')
    );
    if (userSelect.value) form.querySelector('#selUser').value = userSelect.value;
    wrap.appendChild(form);

    function onCreate() {
      const title = form.querySelector('#tt').value.trim();
      const uid = form.querySelector('#selUser').value;
      if (!title) return alert('Заголовок обязателен');
      const newTodo = { id: 'local-' + Date.now(), userId: uid, title, completed: false };
      storage.addTodo(newTodo);
      todos.push(newTodo);
      renderList();
      form.remove();
    }
  }

  function onToggle(id) {
    const idx = todos.findIndex(x=>x.id===id);
    if (idx>=0) {
      todos[idx].completed = !todos[idx].completed;
      if (String(id).startsWith('local-')) {
        const ls = storage.getTodos();
        const i2 = ls.findIndex(x=>x.id===id);
        if (i2>=0) { ls[i2].completed = todos[idx].completed; storage.saveTodos(ls); }
      }
      renderList();
    }
  }

  function onDelete(id) {
    if (!confirm('Удалить todo?')) return;
    if (String(id).startsWith('local-')) {
      const arr = storage.getTodos().filter(x=>x.id!==id);
      storage.saveTodos(arr);
    }
    todos = todos.filter(x=>x.id!==id);
    renderList();
  }
}
