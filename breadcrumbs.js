// breadcrumbs.js
import { createEl } from './components.js';

const NAMES = { users: 'Пользователи', todos: 'Todos', posts: 'Посты', comments: 'Комменты' };

export function buildBreadcrumbs(routeArr = []) {
  const crumbs = [];
  let acc = '';
  for (let i=0;i<routeArr.length;i++){
    acc += (i? '/' : '') + routeArr[i];
    crumbs.push({ name: NAMES[routeArr[i]] || routeArr[i], hash: '#' + acc });
  }
  return crumbs;
}

export function renderBreadcrumbs(routeArr = []) {
  const crumbs = buildBreadcrumbs(routeArr);
  const nav = createEl('nav', {class: 'breadcrumbs'});
  crumbs.forEach((c, idx) => {
    const a = createEl('a', {href: c.hash}, c.name);
    nav.appendChild(a);
    if (idx < crumbs.length - 1) nav.appendChild(document.createTextNode(' › '));
  });
  return nav;
}
