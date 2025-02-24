//作用域
function foo() {
  console.log(a); //2
}
function bar() {
  var a = 3;
  foo();
}
var a = 2;
bar();
//如果是以上这样的，就是输出2
/* 
   因为函数foo中的console.log(a)，在执行的时候，会先去函数foo的作用域链中查找a，
   函数foo的作用域链中没有a，所以会去函数foo的上层作用域中查找，也就是全局作用域（为什么是全局作用域呢，因为foo定义在全局作用域中），
   全局变量var a=2，变量声明提升了，所以全局作用域中有var a=2，所以会输出2
 */

function foo() {
  console.log(a); //undefined
}
function bar() {
  var a = 3;
  foo();
}
bar();
var a = 2;
//------------------------------------------------------------------------------

//如果是以下这样的，就是输出3
// /*
//  因为函数foo中的console.log(a)，在执行的时候，会先去函数foo的作用域链中查找a，
//  函数foo的作用域链中没有a，所以会去函数foo的上层作用域中查找，也就是函数bar的作用域，
//  bar中没有b
//  函数bar的作用域中没有b，所以会去函数bar的上层作用域中查找，也就是全局作用域（为什么是全局作用域呢，因为foo定义在全局作用域中），
//  全局变量var b=2，变量声明提升了，所以全局作用域中有var b=2
//  同时bar中的b=3给全局变量b赋值了，所以全局作用域中的b被覆盖变成了3
// 这个是函数bar中的b=3这个赋值会覆盖全局的var b=2 */
function foo() {
  console.log(b); //3
}
function bar() {
  b = 3;
  foo();
}
var b = 2;
bar();
