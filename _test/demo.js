function axios (){
	return new Promise((resolve,reject)=>{
      resolve('test')
    })
}
axios.then(res=>{
  console.log('test1');
})

axios.then(res=>{
  console.log('test2');
}).catch(err=>{
  console.log('err');
})


axios.then(res=>{
  console.log('test3');
  axios.then(res=>{
    console.log('test3');
  })
}).catch(err=>{
  console.log('err');
})

axios.then(function(res){
  console.log('test4');
  axios.then(res=>{
    console.log('test4');
  })
}).then(res=>{
  console.log('test4');
})