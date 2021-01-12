
const parser = require("@babel/parser");
const traverse = require("babel-traverse").default;
module.exports=function(source) {
    // 1、源码解析
    let ast = parser.parse(source, {
      sourceType: "module",
      plugins: ["dynamicImport"]
    });
    // 2、遍历
   traverse(ast, {

  });
  console.log('ast',ast);
}