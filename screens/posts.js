// screens/posts.js
import { createEl, clear } from '../components.js';
import { api } from '../api.js';
import { debounce } from '../utils.js';
import { renderBreadcrumbs } from '../breadcrumbs.js';

export async function postsScreen({root, params}) {
  const wrap = createEl('div', {class:'app-container'});
  wrap.appendChild(renderBreadcrumbs(['users','posts']));

  const search = createEl('input', {type:'search', placeholder:'Поиск title или body'});
  wrap.appendChild(createEl('div', {class:'search-row'}, search));
  const list = createEl('div', {class:'list'});
  wrap.appendChild(list);
  root.appendChild(wrap);

  const posts = await api.posts();

  function renderList() {
    clear(list);
    const q = (search.value || '').toLowerCase().trim();
    const filtered = posts.filter(p => !q || (p.title && p.title.toLowerCase().includes(q)) || (p.body && p.body.toLowerCase().includes(q)));
    if (!filtered.length) list.appendChild(createEl('div', {class:'small'}, 'Ничего'));
    for (const p of filtered) {
      const left = createEl('div', {},
        createEl('div', {}, createEl('strong', {}, p.title)),
        createEl('div', {class:'meta'}, p.body.substring(0, 120) + (p.body.length>120? '...':''))
      );
      const actions = createEl('div', {class:'actions'},
        createEl('a', {href: `#users/posts/comments?postId=${p.id}`}, 'Comments')
      );
      list.appendChild(createEl('div', {class:'item'}, left, actions));
    }
  }

  const deb = debounce(renderList, 250);
  search.addEventListener('input', deb);
  renderList();
}
