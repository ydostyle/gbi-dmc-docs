const path = require('path');
const fs = require('fs');
const templateRouter = String(fs.readFileSync(path.resolve(__dirname, '../template/router.template.ts')));
const capitalizeFirstLetter = require('./capitalize-first-letter');
const camelCase = require('./camelcase');

function generateData(itemData, reverseMap, key) {
    const subtitle = itemData.subtitle || '';
    const title = itemData.title;
    const type = itemData.type;
    // 这里的zh
    const content = {
        label: title,
        path: `components/${key}`,
        zh: subtitle
    };
    if (!reverseMap[ type ]) {
        reverseMap[ type ] = { list: [ content ] };
    } else {
        reverseMap[ type ].list.push(content);
    }
}

function generateNav(componentsDocMap) {
    const reverseMap = {};
    let routes = '';
    for (const key in componentsDocMap) {
        generateData(componentsDocMap[ key ], reverseMap, key);
        const moduleName = capitalizeFirstLetter(camelCase(key));
        routes += `  {'path': 'components/${key}', 'loadChildren': () => import('./${key}/index.module').then(m => m.DmcDemo${moduleName}Module)},\n`;
    }
    return { reverseMap, routes };
}

module.exports = function generateRoutes(showCaseTargetPath, componentsDocMap, docsMeta) {
    let intro = [];
    let components = [];
    for (const key in docsMeta) {
        intro.push({
            path: `docs/${key}`,
            label: docsMeta[ key ].title,
            order: docsMeta[ key ].order
        });
    }
    intro.sort((pre, next) => pre.order - next.order);
    fs.writeFileSync(path.join(showCaseTargetPath, `intros.json`), JSON.stringify(intro, null, 2));
    const navData = generateNav(componentsDocMap);
    const routes = navData.routes;
    for (const key in navData.reverseMap) {
        components.push({
            name: key,
            children: navData.reverseMap[ key ].list
        });
    }
    const sortMap = {
        '通用': 0,
        '布局': 1,
        '导航': 2,
        '数据录入': 3,
        '数据展示': 4,
        '反馈': 5,
        '其他': 7
    };
    components.sort((pre, next) => {
        return sortMap[ pre.name ] - sortMap[ next.name ];
    });
    const fileContent = templateRouter.replace(/{{intro}}/g, JSON.stringify(intro, null, 2)).replace(/{{components}}/g, JSON.stringify(components, null, 2)).replace(/{{routes}}/g, routes);
    fs.writeFileSync(path.join(showCaseTargetPath, `router.ts`), fileContent);
};