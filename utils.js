// utils.js
export function debounce(fn, wait = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

export function parseHash(hash = location.hash) {
  const cleaned = (hash || '').replace(/^#/, '');
  const [pathPart, queryPart] = cleaned.split('?');
  const route = pathPart ? pathPart.split(/[\/#]/).filter(Boolean) : [];
  const params = {};
  if (queryPart) new URLSearchParams(queryPart).forEach((v,k)=>params[k]=v);
  return { route, params };
}
