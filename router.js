// router.js
import { parseHash } from './utils.js';

const routes = new Map();

export function registerRoute(pathArr, handler) {
  routes.set(pathArr.join('/'), handler);
}

function findHandler(routeArr) {
  const key = routeArr.join('/');
  if (routes.has(key)) return routes.get(key);
  for (let len = routeArr.length; len >= 0; len--) {
    const sub = routeArr.slice(0,len).join('/');
    if (routes.has(sub)) return routes.get(sub);
  }
  return null;
}

export function startRouter(root) {
  window.addEventListener('hashchange', () => render(root));
  render(root);
}

export function render(root) {
  const { route, params } = parseHash(location.hash);
  root.innerHTML = '';
  const handler = findHandler(route);
  if (!handler) {
    root.appendChild(document.createTextNode('Route not found'));
    return;
  }
  handler({root, route, params});
}
