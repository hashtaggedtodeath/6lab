// main.js
import { startRouter, registerRoute } from './router.js';
import { usersScreen } from './screens/users.js';
import { todosScreen } from './screens/todos.js';
import { postsScreen } from './screens/posts.js';
import { commentsScreen } from './screens/comments.js';

const root = document.getElementById('app');

registerRoute(['users'], usersScreen);
registerRoute(['users','todos'], todosScreen);
registerRoute(['users','posts'], postsScreen);
registerRoute(['users','posts','comments'], commentsScreen);

// default
registerRoute([], usersScreen);

startRouter(root);
