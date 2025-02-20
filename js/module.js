// //闭包实现模块
// function  coolModule(){
//   var something = 'cool'
//   var another = [1,2,3]
//   function doSomeThing(){
//      console.log('someThing');
//   }
//   function doAnother(){
//     console.log( another.join( " ! " ) );
//   }
//   return {
//     doSomething: doSomething,
//     doAnother: doAnother
//   }
// }
// var foo = CoolModule();
// foo.doSomething(); // cool
// foo.doAnother(); // 1 ! 2 ! 3

// //使用立即执行函数实现单例模式模块
// var foo=(
// function  coolMOdule(){
//   var something = 'cool'
//   var another = [1,2,3]
//   function doSomeThing(){
//      console.log('someThing');
//   }
//   function doAnother(){
//     console.log( another.join( " ! " ) );
//   }
//   return {
//     doSomething: doSomething,
//     doAnother: doAnother
//   }
// })()
// foo.doSomething(); // cool
// foo.doAnother(); // 1 ! 2 ! 3
// //内部对模块实例进行修改
// var foo=function CoolModule(id){
//   function change(){
//    publicAPI.identify=identify2;
//   }
//   function identify(){
//     console.log(id);
//   }
//   function identify2(){
//     console.log(id.toUpperCase());
//   }
//   var publicAPI = {
//     change:change,
//     identify: identify,
//     identify2: identify2,
//   };
//     return publicAPI;
// }
// foo.identify(); // foo module
// foo.change();
// foo.identify(); // FOO MODULE

//关于闭包实现的现代的模块机制

var MyModule = (function Manager() {
  var modules = {};
  function define(name, deps, impl) {
    for (var i = 0; i < deps.length; i++) {
      deps[i] = modules[deps[i]];
    }
    modules[name] = impl.apply(impl, deps);
  }
  function get(name) {
    return modules[name];
  }
  return {
    define: define,
    get: get,
  };
})();

MyModule.define("bar", [], function () {
  function hello(who) {
    console.log("let me introduce " + who);
  }
  return {
    hello: hello,
  };
});

MyModule.define("foo", ["bar"], function (bar) {
  var hungry = "hippo1";
  function awesome() {
    console.log(bar.hello(hungry));
  }
  return {
    awesome: awesome,
  };
});
var bar = MyModule.get("bar");
var foo = MyModule.get("foo");
console.log(bar.hello("hippo"));
// foo.awesome();

//es6模块
//bar.js
function hello(who) {
  console.log("let me introduce " + who);
}
export { hello };
//foo.js
import { hello } from "./bar.js";
var hungry = "hippo2";
function awesome() {
  console.log(hello(hungry));
}
export { awesome };

//baz.js
import { hello } from "./bar.js";
import { awesome } from "./foo.js";
hello("hippo3"); // Let me introduce: hippo3
awesome(); // Let me introduce: hippo2
