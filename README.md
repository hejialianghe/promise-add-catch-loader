# promise-add-catch-loader

> automatic loader without `promise` injection into `catch`

自动为promise注入catch捕获错误的loader

## Install

```bash
npm i promise-add-catch-loader
# or
yarn add promise-add-catch-loader
```
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
    console.log(err)
})
```
### weback config

```diff
module.exports = {
    module: {
    rules: [
            {
            test: /\.js$/,
            use: [
            {
            +  loader:'promise-add-catch-loader',
                options:{
                 catchCode:"console.log(err.message)"
                }
            }
          ]
      }
    ]
  }
}
```






