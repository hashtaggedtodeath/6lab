// screens/comments.js
import { createEl, clear } from '../components.js';
import { api } from '../api.js';
import { debounce } from '../utils.js';
import { renderBreadcrumbs } from '../breadcrumbs.js';

export async function commentsScreen({root, params}) {
  const wrap = createEl('div', {class:'app-container'});
  wrap.appendChild(renderBreadcrumbs(['users','posts','comments']));

  const search = createEl('input', {type:'search', placeholder:'Поиск по name или body'});
  wrap.appendChild(createEl('div', {class:'search-row'}, search));
  const list = createEl('div', {class:'list'});
  wrap.appendChild(list);
  root.appendChild(wrap);

  const postId = params && params.postId ? params.postId : null;
  const allComments = postId ? await api.postComments(postId) : await api.comments();

  function renderList() {
    clear(list);
    const q = (search.value || '').toLowerCase().trim();
    const filtered = allComments.filter(c => !q || (c.name && c.name.toLowerCase().includes(q)) || (c.body && c.body.toLowerCase().includes(q)));
    if (!filtered.length) list.appendChild(createEl('div', {class:'small'}, 'Ничего'));
    for (const c of filtered) {
      const left = createEl('div', {},
        createEl('div', {}, createEl('strong', {}, c.name)),
        createEl('div', {class:'meta'}, c.body)
      );
      list.appendChild(createEl('div', {class:'item'}, left));
    }
  }

  const deb = debounce(renderList, 250);
  search.addEventListener('input', deb);
  renderList();
}
