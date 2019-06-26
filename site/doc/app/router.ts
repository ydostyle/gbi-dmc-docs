export const ROUTER_LIST = {
  'intro'     : [
  {
    "path": "docs/introduce",
    "label": "Ant Design of Angular",
    "order": 0
  },
  {
    "path": "docs/faq",
    "label": "常见问题",
    "order": 9
  },
  {
    "path": "docs/changelog",
    "label": "更新日志",
    "order": 11
  }
],
  'components': [
  {
    "name": "布局",
    "children": [
      {
        "label": "Grid",
        "path": "components/grid",
        "zh": "栅格"
      }
    ]
  },
  {
    "name": "数据展示",
    "children": [
      {
        "label": "Avatar",
        "path": "components/avatar",
        "zh": "头像"
      }
    ]
  }
]
};
export const DEMO_ROUTES = [
  {'path': 'components/avatar', 'loadChildren': () => import('./avatar/index.module').then(m => m.DmcDemoAvatarModule)},
  {'path': 'components/grid', 'loadChildren': () => import('./grid/index.module').then(m => m.DmcDemoGridModule)},

];
