const fs = require('fs');
const path = require('path');
const camelCase = require('./camelcase');
const template = String(fs.readFileSync(path.resolve(__dirname, '../template/code-box.template.html')));

module.exports = function generateCodeBox(component, demoName, key, title, doc) {
    // code-box.template 模板
    let output = template;
    output = output.replace(/{{title}}/g, title);
    output = output.replace(/{{component}}/g, component);
    output = output.replace(/{{componentName}}/g, demoName);
    output = output.replace(/{{key}}/g, key);
    output = output.replace(/{{doc}}/g, doc);
    output = output.replace(/{{iframeSource}}/g, null);
    output = output.replace(/{{iframeHeight}}/g, null);
    output = output.replace(/{{code}}/g, camelCase(key));
    output = output.replace(/{{rawCode}}/g, `${camelCase(key)}Raw`);
    output = output.replace(/{{nzGenerateCommand}}/g, `ng g ng-zorro-antd:${component}-${key} <name>`);
    return output;
};
