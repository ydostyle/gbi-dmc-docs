const fs = require('fs-extra');
const path = require('path');
const parseDocMdUtil = require('./utils/parse-doc-md');
const parseDemoMdUtil = require('./utils/parse-demo-md');
const nameWithoutSuffixUtil = require('./utils/name-without-suffix');
const generateCodeBox = require('./utils/generate-code-box');
const generateDemo = require('./utils/generate-demo');
const generateDocs = require('./utils/generate-docs');
const generateRoutes = require('./utils/generate-routes');
const capitalizeFirstLetter = require('./utils/capitalize-first-letter');
const camelCase = require('./utils/camelcase');
const getMeta = require('./utils/get-meta');
// 脚本生成的site目录
const showCasePath = path.resolve(__dirname, '../../site');
// 移除脚本创建的site目录重新创建
fs.removeSync(`${showCasePath}`);
fs.copySync(path.resolve(__dirname, '_site'), `${showCasePath}`);
// 组件目标路径
const showCaseTargetPath = `${showCasePath}/doc/app/`;
// iframe目标路径
const iframeTargetPath = `${showCasePath}/iframe/app/`;
// 原始组件目录
const rootPath = path.resolve(__dirname, '../../components');
// 浏览组件目录
const rootDir = fs.readdirSync(rootPath);
// 组件文档对象映射
const componentsDocMap = {};
// 组件对象映射
const componentsMap = {};
rootDir.forEach(componentName => {
    //是样式文件夹不进行处理
    if (componentName === 'style') {
        return;
    }
    //componentName => 组件名
    // 拼接路径 组件目录
    const componentDirPath = path.join(rootPath, componentName);
    // 如果该路径是一个目录
    if (fs.statSync(componentDirPath).isDirectory()) {
        // 克隆组件到组件目标路径
        const showCaseComponentPath = path.join(showCaseTargetPath, componentName);
        fs.mkdirSync(showCaseComponentPath);

        // 处理demo文件夹
        const demoDirPath = path.join(componentDirPath, 'demo');
        const demoMap = {};
        // 如果存在demo文件夹
        if (fs.existsSync(demoDirPath)) {
            // 读demo文件夹进行遍历
            const demoDir = fs.readdirSync(demoDirPath);
            demoDir.forEach(demo => {
                if (/.md$/.test(demo)) {
                    // 获取md文件名 md的命名方式(使用"-"分割单词，如certain-category)
                    const nameKey = nameWithoutSuffixUtil(demo);
                    // 读取demo单个md文件
                    const demoMarkDownFile = fs.readFileSync(path.join(demoDirPath, demo));
                    // 解析demo的md对象，转换为meta和html对象
                    demoMap[ nameKey ] = parseDemoMdUtil(demoMarkDownFile);
                    /*
                    * camelCase => 转换word-word为小驼峰wordWord
                    * capitalizeFirstLetter => 首字母大写
                    * */
                    // demo组件名拼接
                    demoMap[ nameKey ][ 'name' ] = `DmcDemo${camelCase(capitalizeFirstLetter(componentName))}${camelCase(capitalizeFirstLetter(nameKey))}Component`;
                    // conde-box.template模板解析保存在code字段上
                    demoMap[ nameKey ][ 'code' ] = generateCodeBox(
                        componentName, //等于该components文件夹名
                        demoMap[ nameKey ][ 'name' ],//components=>demo=>components name
                        nameKey, //md的文件夹名
                        demoMap[ nameKey ].meta.title, //该demo的title
                        demoMap[ nameKey ].html, // md解析完的html
                    );
                }
                if (/.ts$/.test(demo)) {
                    // 命名规则同md
                    const nameKey = nameWithoutSuffixUtil(demo);
                    // 读ts文件内容
                    demoMap[ nameKey ].ts = String(fs.readFileSync(path.join(demoDirPath, demo)));
                    // 将内容写入到目标组件路径 (/site/doc/app/[组件名]/[模板ts])
                    fs.writeFileSync(path.join(showCaseComponentPath, demo), demoMap[ nameKey ].ts);
                }
            });
        }


        // doc属性:解析主要doc文档，分成何时使用和api两部分
        const result = {
            name: componentName,
            doc: parseDocMdUtil(fs.readFileSync(path.join(componentDirPath, 'doc/index.md')), `components/${componentName}/doc/index.md`),
            demoMap
        };
        // 包含该组件的doc映射 meta字段只取title subtitle category分类(一般为Components) type类型(数据录入)
        componentsDocMap[ componentName ] = result.doc.meta;
        // 包含该组件的所有demo映射
        componentsMap[ componentName ] = demoMap;
        // 生成demo
        generateDemo(showCaseComponentPath, result);
    }
});

// 通用docs文件夹,一些常规文档
const docsPath = path.resolve(__dirname, '../../docs');
const docsDir = fs.readdirSync(docsPath);
let docsMap = {};
let docsMeta = {};
docsDir.forEach(doc => {
    const name = nameWithoutSuffixUtil(doc);
    docsMap[ name ] = fs.readFileSync(path.join(docsPath, `${name}.md`));
    docsMeta[ name ] = getMeta(docsMap[ name ]);
});
// 生成docs文档
generateDocs(showCaseTargetPath, docsMap);
generateRoutes(showCaseTargetPath, componentsDocMap, docsMeta);