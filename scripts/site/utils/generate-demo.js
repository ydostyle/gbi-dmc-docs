const path = require('path');
const fs = require('fs');
const capitalizeFirstLetter = require('./capitalize-first-letter');
const camelCase = require('./camelcase');
const PrismAngular = require('./angular-language-marked');

module.exports = function (showCaseComponentPath, result) {
    // demoTemplate包含了整个当前页面包括whoWhen和api的模板
    const demoTemplate = generateTemplate(result);
    fs.writeFileSync(path.join(showCaseComponentPath, `demoTemplate.html`), demoTemplate);
    const demoComponent = generateDemoComponent(result);
    fs.writeFileSync(path.join(showCaseComponentPath, `demoTemplate.component.ts`), demoComponent);
    const demoModule = generateDemoModule(result);
    fs.writeFileSync(path.join(showCaseComponentPath, `index.module.ts`), demoModule);
};

function generateDemoModule(content) {
    const demoModuleTemplate = String(fs.readFileSync(path.resolve(__dirname, '../template/demo-module.template.ts')));
    const component = content.name;
    const demoMap = content.demoMap;
    let imports = '';
    let declarations = '';
    let entryComponents = [];
    for (const key in demoMap) {
        const declareComponents = [ `DmcDemo${componentName(component)}${componentName(key)}Component` ];
        const entries = retrieveEntryComponents(demoMap[ key ] && demoMap[ key ].ts);
        entryComponents.push(...entries);
        declareComponents.push(...entries);
        // 拼接component import 和 declarations字段
        imports += `import { ${declareComponents.join(', ')} } from './${key}';\n`;
        declarations += `\t\t${declareComponents.join(',\n\t')},\n`;
    }
    imports += `import { DmcDemo${componentName(component)}Component } from './demoTemplate.component';\n`;
    declarations += `\t\tDmcDemo${componentName(component)}Component,\n`;
    return demoModuleTemplate.replace(/{{imports}}/g, imports).replace(/{{declarations}}/g, declarations).replace(/{{component}}/g, componentName(component)).replace(/{{entryComponents}}/g, entryComponents.join(',\n'));
}

function componentName(component) {
    return camelCase(capitalizeFirstLetter(component));
}

function generateComponentName(component, tag) {
    return `DmcDemo${componentName(component)}${capitalizeFirstLetter(tag)}Component`;
}

function generatePageDemoComponent(content) {
    const component = content.name;
    let zhOutput = content.pageDemo.zhCode;
    let enOutput = content.pageDemo.enCode;
    zhOutput = zhOutput
        .replace(`NzPageDemo${componentName(component)}Component`, `NzPageDemo${componentName(component)}ZhComponent`)
        .replace(`nz-page-demo-${component}`, `nz-page-demo-${component}-zh`);
    enOutput = enOutput
        .replace(`NzPageDemo${componentName(component)}Component`, `NzPageDemo${componentName(component)}EnComponent`)
        .replace(`nz-page-demo-${component}`, `nz-page-demo-${component}-en`);
    return {
        en: enOutput,
        zh: zhOutput
    };
}

function generateDemoComponent(content) {
    const demoComponentTemplate = String(fs.readFileSync(path.resolve(__dirname, '../template/demo-component.template.ts')));
    const component = content.name;
    const demoMap = content.demoMap;
    let code = '';
    let rawCode = '';
    for (const key in demoMap) {
        const angularCode = encodeURIComponent(PrismAngular.highlight(demoMap[ key ].ts, Prism.languages[ 'angular' ]));
        // angular高亮代码
        code += `\t${camelCase(key)} = \`${angularCode}\`;\n`;
        // angular原始代码
        rawCode += `\t${camelCase(key)}Raw = \`${encodeURIComponent(demoMap[ key ].ts)}\`;\n`;
    }
    let output = demoComponentTemplate;
    output = output.replace(/{{component}}/g, component);
    output = output.replace(/{{code}}/g, code);
    output = output.replace(/{{rawCode}}/g, rawCode);
    output = output.replace(/{{componentName}}/g, generateComponentName(component, ''));
    return output;
}

function generateTemplate(result) {
    const generateTitle = require('./generate.title');
    const innerMap = generateExample(result);
    const titleMap = generateTitle(result.doc.meta, result.doc.path);
    const name = result.name;
    return wrapperAll(
        generateToc(result.name, result.demoMap),
        wrapperHeader(titleMap, result.doc.whenToUse, innerMap, name) + wrapperAPI(result.doc.api)
    )
}

function wrapperAPI(content) {
    return `<section class="markdown api-container" ngNonBindable>${content}</section>`;
}

function wrapperHeader(title, whenToUse, example, name) {
    if (example) {
        return `<section class="markdown">
	${title}
	<section class="markdown" ngNonBindable>
		${whenToUse}
	</section>
	<h2>
		<span>代码演示</span>
		<i nz-icon type="appstore" class="code-box-expand-trigger" nz-tooltip nzTitle="展开全部代码" (click)="expandAllCode()"></i>
	</h2>
</section>${example}`;
    } else {
        return `<section class="markdown">
	${title}
	<section class="markdown">
		${whenToUse}
	</section></section>`;
    }

}

function wrapperAll(toc, content) {
    return `<article>${toc}${content}</article>`;
}

function generateToc(name, demoMap) {
    let linkArray = [];
    for (const key in demoMap) {
        linkArray.push(
            {
                content: `<nz-link nzHref="#components-${name}-demo-${key}" nzTitle="${demoMap[ key ].meta.title}"></nz-link>`,
                order: demoMap[ key ].meta.order
            }
        );
    }
    linkArray.sort((pre, next) => pre.order - next.order);
    const links = linkArray.map(link => link.content).join('');
    return `<nz-affix class="toc-affix" [nzOffsetTop]="16">
    <nz-anchor [nzAffix]="false" nzShowInkInFixed (nzClick)="goLink($event)">
      ${links}
    </nz-anchor>
  </nz-affix>`;
}

function generateExample(result) {
    const demoMap = result.demoMap;
    const isUnion = result.doc.meta.cols;
    // 两行
    const templateSplit = String(fs.readFileSync(path.resolve(__dirname, '../template/example-split.template.html')));
    // 独占一行
    const templateUnion = String(fs.readFileSync(path.resolve(__dirname, '../template/example-union.template.html')));
    let demoList = [];
    for (const key in demoMap) {
        demoList.push(Object.assign(
            { name: key }, demoMap[ key ]
        ));
    }
    demoList.sort((pre, next) => pre.meta.order - next.meta.order);
    let firstPart = '';
    let secondPart = '';
    let part = '';
    demoList.forEach((item, index) => {
        part += item.code;
        if (index % 2 === 0) {
            firstPart += item.code;
        } else {
            secondPart += item.code;
        }
    });
    // 是否demo独占一行
    if (isUnion) {
        return templateUnion.replace(/{{content}}/g, part)
    } else {
        return templateSplit.replace(/{{first}}/g, firstPart).replace(/{{second}}/g, secondPart)
    }
}

function retrieveEntryComponents(plainCode) {
    const matches = (plainCode + '').match(/^\/\*\s*?entryComponents:\s*([^\n]+?)\*\//) || [];
    if (matches[ 1 ]) {
        return matches[ 1 ].split(',').map(className => className.trim()).filter((value, index, self) => value && self.indexOf(value) === index);
    }
    return [];
}
