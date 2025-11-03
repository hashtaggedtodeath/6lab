// screens/users.js
import { createEl, clear } from '../components.js';
import { api } from '../api.js';
import { storage } from '../storage.js';
import { debounce } from '../utils.js';
import { renderBreadcrumbs } from '../breadcrumbs.js';

export async function usersScreen({root}) {
  const wrap = createEl('div', {class:'app-container'});
  wrap.appendChild(renderBreadcrumbs(['users']));

  const search = createEl('input', {type:'search', placeholder:'Поиск по имени или email'});
  const addBtn = createEl('button', {class:'button', on:{click: onShowForm}}, 'Добавить пользователя');
  const headerRow = createEl('div', {class:'search-row'}, search, addBtn);
  wrap.appendChild(headerRow);

  const list = createEl('div', {class:'list'});
  wrap.appendChild(list);
  root.appendChild(wrap);

  let apiUsers = await api.users();
  let localUsers = storage.getUsers();
  let users = [...apiUsers.map(u=>({ ...u })), ...localUsers.map(u=>({...u}))];

  function renderList(filter='') {
    clear(list);
    const f = (filter || '').toLowerCase().trim();
    const filtered = users.filter(u => !f || (u.name&&u.name.toLowerCase().includes(f)) || (u.email&&u.email.toLowerCase().includes(f)));
    if (!filtered.length) list.appendChild(createEl('div', {class:'small'}, 'Ничего не найдено'));
    for (const u of filtered) {
      const left = createEl('div', {},
        createEl('div', {}, createEl('strong', {}, u.name || '—')),
        createEl('div', {class:'meta'}, u.email || '')
      );
      const actions = createEl('div', {class:'actions'},
        createEl('a', {href: `#users/todos?userId=${u.id}`}, 'Todos'),
        createEl('a', {href: `#users/posts?userId=${u.id}`}, 'Posts'),
        createEl('button', {class:'btn-ghost', on:{click: ()=>onDelete(u.id)}}, 'Удалить')
      );
      const item = createEl('div', {class:'item'}, left, actions);
      list.appendChild(item);
    }
  }

  const deb = debounce(e => renderList(e.target.value), 300);
  search.addEventListener('input', deb);
  renderList();

  function onShowForm() {
    const form = createEl('div', {class:'form-row'},
      createEl('input', {placeholder:'Имя', id:'newName'}),
      createEl('input', {placeholder:'Email', id:'newEmail'}),
      createEl('button', {class:'button', on:{click:onCreate}}, 'Создать'),
      createEl('button', {class:'btn-ghost', on:{click: ()=>form.remove()}}, 'Отмена')
    );
    wrap.appendChild(form);
    function onCreate() {
      const name = form.querySelector('#newName').value.trim();
      const email = form.querySelector('#newEmail').value.trim();
      if (!name || !email) return alert('Заполните имя и email');
      const newId = 'local-' + Date.now();
      const newUser = { id: newId, name, email };
      storage.addUser(newUser);
      users.push(newUser);
      renderList();
      form.remove();
    }
  }

  function onDelete(id) {
    if (!String(id).startsWith('local-')) {
      if (!confirm('Удаление API-пользователей не поддерживается. Удалить локальные todos пользователя?')) return;
      storage.deleteTodosByUser(id);
      alert('Локальные todos пользователя удалены (если были)');
      return;
    }
    if (!confirm('Удалить локального пользователя и его локальные todos?')) return;
    storage.deleteUser(id);
    storage.deleteTodosByUser(id);
    users = users.filter(u => u.id !== id);
    renderList();
  }
}
