
function createProxy(value=0){
  return new Proxy({},{
    get:function(target,key){
        if(key==Symbol.toPrimitive){
          return function(){
            //对toPrimitive进行拦截和重写
            return value;
          }
        }
      return createProxy(value+Number(key));
    },
    // toPrimitive:function(){
    //   return value;
    // }
  })
}
var a= createProxy();

// var a=new Proxy({},{
//   get:function(target,key){
//     return Number(key);
     
//   },
// })
console.log(a[1][2][5]+4)

// Reflect
// let a={};
// let b=new Proxy(a,{
//   set:function(target,key){

//   }
// })
//  let tag= Reflect.set(b,1,1);
// console.log(tag)
