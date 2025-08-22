
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/tasks",
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/tasks"
  },
  {
    "renderMode": 2,
    "route": "/add-task"
  },
  {
    "renderMode": 2,
    "redirectTo": "/tasks",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 23549, hash: '0c931c7a287737a923bb115671442121f4e8d6c5d57680bd4be5d93fe27f3667', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17123, hash: '50395ee96b97d10d2ccd5734897d36befcad595b163d297e663374444f033be4', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'tasks/index.html': {size: 63442, hash: '7d21b59c90ee9b49e3dd6f4818d5a3f7013af1c69e2efe9f21daf6fc11da669c', text: () => import('./assets-chunks/tasks_index_html.mjs').then(m => m.default)},
    'add-task/index.html': {size: 63442, hash: '7d21b59c90ee9b49e3dd6f4818d5a3f7013af1c69e2efe9f21daf6fc11da669c', text: () => import('./assets-chunks/add-task_index_html.mjs').then(m => m.default)},
    'styles-36AW6TKX.css': {size: 6979, hash: 'vY6tjD/ce7M', text: () => import('./assets-chunks/styles-36AW6TKX_css.mjs').then(m => m.default)}
  },
};
