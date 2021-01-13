
const parser = require("@babel/parser");
const traverse = require("babel-traverse").default;
const core = require("@babel/core");
var template = require("@babel/template");
const t = require("babel-types");

module.exports=function(source) {
  console.log(source)
    // 1、源码解析
    let ast = parser.parse(source, {
      sourceType: "module",
      plugins: ["dynamicImport"]
    });
    // 2、遍历
   traverse(ast, {
    CallExpression:function CallExpression (path) {
      const catchStatement = template.statement(`console.log(err)`)();
      
      const node = path.node //访问到当前的节点信息
    
      if(node.callee.property && node.callee.property.name === 'then') {
        // 创建箭头函数
        const defaultArrowFunc = t.arrowFunctionExpression([
          t.identifier('err')],
          t.blockStatement([catchStatement])
          )
        // 创建 xxx.then
        // const  originThen = t.callExpression(node.callee,node.arguments)
        // const  thenCatch = t.memberExpression(originThen,t.identifier('catch'))
        // const originExpress =  t.callExpression(thenCatch,[defaultArrowFunc])
     
        // path.replaceWith(thenCatch)
        
      }
    },
    ArrowFunctionExpression:function arrowFunctionExpression(path) {
      console.log('path',path.node);
      var node = path.node
      if(node.params[0].name && node.params[0].name === 'res'){
        const catchStatement = template.statement(`console.log(err)`)();
        const defaultArrowFunc = t.arrowFunctionExpression([
          t.identifier('err')],
          t.blockStatement([catchStatement])
          )
          path.replaceWith(defaultArrowFunc)
      }

    }
  },

  );
  return core.transformFromAstSync(ast, null, {
    configFile: false // 屏蔽 babel.config.js，否则会注入 polyfill 使得调试变得困难
  }).code;
}