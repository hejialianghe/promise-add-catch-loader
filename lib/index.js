
const parser = require("@babel/parser");
const traverse = require("babel-traverse").default;
const core = require("@babel/core");
const template = require("@babel/template");
const t = require("babel-types");
const generate = require('@babel/generator').default

module.exports=function(source) {
  console.log(source)

    // 1、源码解析
    let ast = parser.parse(source, {
      sourceType: "module"
    });

    // 2、遍历
   traverse(ast, {
    CallExpression:function CallExpression (path) {
      const catchStatement = template.statement(`console.log(err)`)();
  
      const node = path.node //访问到当前的节点信息
      const arguments = node.arguments
      const parentNode = path.parentPath.node
      let firstExp
      console.log('----------',parentNode);

  
      arguments.forEach((item)=>{
        if(t.isIdentifier(parentNode.property) && parentNode.property.name==='catch') {
          return
        }
        if (t.isArrowFunctionExpression(item)) {

          // console.log('--------访问节点',t.isIdentifier(node.callee.property));
        firstExp = item.body.body[0]
       
        if(t.isExpressionStatement(firstExp) && 
           t.isIdentifier(node.callee.property) &&
           node.callee.property.name === 'then') {
         
          // 创建箭头函数
          const defaultArrowFunc = t.arrowFunctionExpression([
            t.identifier('err')],
            t.blockStatement([catchStatement])
            )
          // 创建 xxx.the
          const  originThen = t.callExpression(node.callee,node.arguments)
          originThen.arguments=node.arguments
          const  thenCatch = t.memberExpression(originThen,t.identifier('catch'))
          const originExpress =  t.callExpression(thenCatch,[defaultArrowFunc])
       
          path.replaceWith(originExpress)
        }
      }
      })

    }
  })

  return core.transformFromAstSync(ast, null, {
    configFile: false // 屏蔽 babel.config.js，否则会注入 polyfill 使得调试变得困难
  }).code;
}