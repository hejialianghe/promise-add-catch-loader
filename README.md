# promise-add-catch-loader

> automatic loader without `promise` injection into `catch`

> 自动为promise注入catch，捕获错误的loader

## Example

 before:

 ```js
function axios (){
	return new Promise((resolve,reject)=>{
      resolve('test')
    })
}
axios.then(res=>{
  console.log('test1');
})
 ```
after:

```js
function axios (){
	return new Promise((resolve,reject)=>{
      resolve('test')
    })
}
axios.then(res=>{
  console.log('test1');
}).catch(err=>{
    console.error(err)
})
```
### webpack config

```diff
module.exports = {
    module: {
    rules: [
            {
            test: /\.js$/,
            use: [
            {
+             loader:'promise-add-catch-loader',
+             options:{
+                 catchCode:"console.log(err.message)" // 选填参数，不传默认console.error(err)
+              }
            }
          ]
      }
    ]
  }
}
```
## options

| key（键）|  value（值）| Default（默认值）| remarks（备注）|
| :-----: | :--------: | :------------: | :------: | 
|  catchCode |  string |  console.error(err) |  catch回调中逻辑代码  |







