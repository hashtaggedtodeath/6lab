
const BASE = 'https://jsonplaceholder.typicode.com';
const memo = new Map();

async function cachedFetch(url) {
  if (memo.has(url)) return structuredClone(memo.get(url));
  const res = await fetch(url);
  if (!res.ok) throw new Error('Fetch error ' + res.status);
  const data = await res.json();
  memo.set(url, data);
  return structuredClone(data);
}

export const api = {
  users: () => cachedFetch(`${BASE}/users`),
  todos: () => cachedFetch(`${BASE}/todos`),
  posts: () => cachedFetch(`${BASE}/posts`),
  comments: () => cachedFetch(`${BASE}/comments`),
  userTodos: (userId) => cachedFetch(`${BASE}/todos?userId=${userId}`),
  userPosts: (userId) => cachedFetch(`${BASE}/posts?userId=${userId}`),
  postComments: (postId) => cachedFetch(`${BASE}/comments?postId=${postId}`)
};
