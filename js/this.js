// this相关的代码
function identify() {
  return this.name.toUpperCase();
}
function speak() {
  var greeting = "Hello, I'm " + identify.call(this);
  console.log(greeting);
}
var me = {
  name: "Kyle",
};
var you = {
  name: "Reader",
};
identify.call(me); // KYLE
identify.call(you); // READER

speak.call(me); // Hello, I'm KYLE
speak.call(you); // Hello, I'm READER

// //--------------------------------------------------------------------------
function foo(num) {
  console.log("foo:" + num);
  this.count++;
}
foo.count = 0;
var i;
for (i = 0; i < 10; i++) {
  if (i > 5) {
    foo(i);
  }
}
console.log(foo.count);
//foo被调用了多少次？
/*
输出结果
“foo” 6
“foo” 7
“foo” 8
“foo” 9
0    --->count
*/
//--------------------------------------------------------------------------

function foo() {
  var a = 2;
  this.bar();
}
function bar() {
  console.log("error", this.a); //undefined
}
foo();

//完全错误，也不可能实现
//不要试图使用this来查找词法作用域中的变量

//隐式丢失-------------------------------------------------------------------------------
//---第一例----

function foo() {
  console.log(this.a);
}
var obj = {
  a: 1,
  foo: foo,
};
var a = "globalA";
obj.foo(); //1
var bar = obj.foo;
bar(); //globalA
//---第二例----------------
function foo() {
  console.log(this.a);
}
var obj = {
  a: 1,
  foo: foo,
};
var a = "globalA";
function bar(fn) {
  fn();
}
bar(obj.foo); //globalA
// //----第三例
function foo() {
  console.log(this.a);
}
var obj = {
  a: 1,
  foo: foo,
};
var a = "globalA";
setTimeout(obj.foo, 1000); //globalA

//显示绑定----------------------------------------------------->
function foo() {
  console.log(this.a);
}
var obj = {
  a: 1,
};
foo.call(obj); //1

//硬绑定  使用call实现

function foo() {
  console.log(this.a);
}
var obj = {
  a: 1,
  foo: foo,
};
var bar = function () {
  return foo.call(obj);
};
bar(); //1
var a = "globalA";
setTimeout(bar, 5000); //1

//--------------------------------------->

function foo(someThing) {
  console.log(this.a, someThing);
  return this.a + someThing;
}
var obj = {
  a: 2,
};

var bar = function () {
  return foo.apply(obj, arguments);
};

var b = bar(3);
console.log(b);
//---------------------------------------->
//bind
function foo(someThing) {
  console.log(this.a, someThing);
  return this.a + someThing;
}
var obj = {
  a: 2,
};
var bar = foo.bind(obj);
var b = bar(3); //2 3
console.log(b); //5

//---------------------------------------->
//bind的简化版实现
Function.prototype.mybind = function (context) {
  var fn = this; //保存原函数
  return function () {
    return fn.apply(context, arguments);
  };
};
//---------------------------------------->
//js中一些内置的函数，都提供了一个可选的参数，这个参数可以用来绑定this
function foo(el) {
  console.log(el, this.id);
}
var obj = {
  id: "awesome",
}[(1, 2, 3)].forEach(foo, obj); //1 awesome  2 awesome  3 awesome
//---------------------------------------->
//绑定的优先级  关于显示绑定和new绑定
//------------------------------------------->
//软绑定
// 软绑定
if (!Function.prototype.softBind) {
  Function.prototype.softBind = function (obj) {
    var fn = this;
    var curried = [].slice.call(arguments, 1); //通过call给slice方法传递上下文arguments，1是传递给slice的参数
    var bound = function () {
      if (!this || this === (window || global)) {
        debugger;
        console.log("绑定在全局");
      }
      return fn.apply(
        !this || this === (window || global) ? obj : this,
        curried.concat.apply(curried, arguments)
      );
    };
    bound.prototype = Object.create(fn.prototype);
    return bound;
  };
}

function foo(string) {
  console.log("name:", this.name, "string:", string);
}
var obj = {
  name: "obj",
};
var obj2 = {
  name: "obj2",
};
var obj3 = {
  name: "obj3",
};
