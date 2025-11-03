
export function createEl(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') el.className = v;
    else if (k === 'on' && typeof v === 'object') {
      for (const [ev, fn] of Object.entries(v)) el.addEventListener(ev, fn);
    } else if (k === 'style' && typeof v === 'object') {
      Object.assign(el.style, v);
    } else if (k === 'href' && tag === 'a') {
      el.setAttribute('href', v);
    } else {
      el.setAttribute(k, String(v));
    }
  }
  for (const ch of children) {
    if (ch == null) continue;
    if (typeof ch === 'string' || typeof ch === 'number') el.appendChild(document.createTextNode(String(ch)));
    else el.appendChild(ch);
  }
  return el;
}

export function clear(node) { node.innerHTML = ''; }
