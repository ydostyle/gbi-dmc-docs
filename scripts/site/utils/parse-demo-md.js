const MD = require('./marked');
const YFM = require('yaml-front-matter');
const angularNonBindAble = require('./angular-nonbindable');
module.exports = function parseDemoMd(file) {
    // 获取meta信息
    const meta = YFM.loadFront(file);
    const content = meta.__content;
    delete meta.__content;

    const remark = require('remark')();
    const ast = remark.parse(content);

    let html = '';

    for (let i = 0; i < ast.children.length; i++) {
        const child = ast.children[ i ];
        html += MD(remark.stringify(child));
    }
    return {
        meta: meta,
        html: angularNonBindAble(html)
    };
};