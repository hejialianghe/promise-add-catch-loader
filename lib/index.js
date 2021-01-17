
const parser = require("@babel/parser");
const traverse = require("babel-traverse").default;
const core = require("@babel/core");
const template = require("@babel/template");
const t = require("babel-types");
const loaderUtils = require('loader-utils')

const defaultCatchCode = `console.error(err)`

function generatePromiseCatch (path, catchStatement) {

  // node 当前节点 parentPath:父节点
  const { node, parentPath } = path
  const parentNode = parentPath.node

  // 如果已经有了catch 就return
  if (t.isIdentifier(parentNode.property)
      && parentNode.property.name === 'catch') {
    return
  }
  
  // 如果是xxx.then(callback).then(callback)情况，只会在最后一个then后面加入catch
  if (t.isIdentifier(parentNode.property)
      && parentNode.property.name === 'then'
      && t.isIdentifier(node.callee.property)
      && node.callee.property.name === 'then'
      ) {
      return
    }

  if (
    t.isIdentifier(node.callee.property) &&
    node.callee.property.name === 'then') {

    // 创建箭头函数
    const defaultArrowFunc = t.arrowFunctionExpression([
      t.identifier('err')],
      t.blockStatement([catchStatement])
    )
    // 创建 xxx.then(callback).catch(callback)
    const originThen = t.callExpression(node.callee, node.arguments)
    originThen.arguments = node.arguments
    const thenCatch = t.memberExpression(originThen, t.identifier('catch'))
    const originExpress = t.callExpression(thenCatch, [defaultArrowFunc])

    path.replaceWith(originExpress)
  }
}

module.exports = function (source) {

  // 获取loader传递的options
  const options = loaderUtils.getOptions(this) 

   // 创建catch回调函数的函数体
  const catchStatement = template.statement(options.catchCode || defaultCatchCode)();

  // 1. 源码解析成ast
  let ast = parser.parse(source, {
    sourceType: "module"
  });

  // 2. 遍历
  traverse(ast, {
    CallExpression: function CallExpression (path, state) {
      try {
        generatePromiseCatch(path,catchStatement)
      } catch (err) {
        throw err
      }
    }
  })

 // 3. 给定AST，对其进行转换成code
  return core.transformFromAstSync(ast, null, {
    configFile: false // 屏蔽 babel.config.js
  }).code;
}