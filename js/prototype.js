//原型
// var anotherObject = {
//   city: "Beijing",
// };
// //创建一个关联到anotherObject的对象
// var myObject = Object.create(anotherObject);
// //这行代码可以理解为anotherObject是myObject的原型
// // console.log(myObject.city);
// console.log("是否正确", myObject.__proto__ == anotherObject); //true

//--------------------------------------------------------------------->
//隐式屏蔽
// var anotherObject = {
//   a: 1,
// };
// var myObject = Object.create(anotherObject);
// console.log(anotherObject.a);
// console.log(anotherObject.hasOwnProperty("a"));//true
// console.log(myObject.a);
// console.log(myObject.hasOwnProperty("a")); //false
// myObject.a++; //a自身没有，但是原型链上有，且可读，那就会直接在myObject中添加一个名为foo的新属性，它是屏蔽属性。
// console.log(myObject.a); //2
// console.log(myObject.hasOwnProperty("a")); //true
// console.log(anotherObject.a); //1
// console.log(anotherObject.hasOwnProperty("a")); //true

//  --------------------------------------------------------------------->
//  关于__proto__和prototype的区别
// __proto__是每个实例对象都有的属性，而prototype是函数才有的属性。
// function Foo() {
//   this.a = 1;
//   this.b = 2;
// }
// var a = new Foo();
// console.log("a", a.__proto__);
// console.log("Foo", Foo.prototype);
//------------------------------------------------------------------->
//关于构造函数
// function Foo() {
//   console.log("Foo");
// }

// console.log(Foo.prototype.constructor === Foo);
// var a = new Foo();
// console.log(a.constructor === Foo);

//--------------------------------------------------------------------->
// function Foo(name) {
//   this.name = name;
// }
// Foo.prototype.myName = function () {
//   return this.name;
// };
// var a = new Foo("a");
// var b = new Foo("b");
// console.log(a.myName()); //a
// console.log(b.myName()); //b
//--------------------------------------------------------------------->
function Foo(name) {
  this.name = name;
}
Foo.prototype.myName = function () {
  return this.name;
};
function Bar(name, label) {
  Foo.call(this, name);
  this.label = label;
}
Bar.prototype = Object.create(Foo.prototype);
// Bar.prototype.prototype=Foo.prototype ?
Bar.prototype.myLabel = function () {
  return this.label;
};
var a = new Bar("a", "obj a");
console.log(a.myName()); //"a"
console.log(a.myLabel()); //"obj a"
//----------------------------------------------------------------------》
/*
关于模仿类和委托的比较
*/

//模仿类
function Foo(who) {
  this.me = who;
}
Foo.prototype.identify = function () {
  return "I am " + this.me;
};
function Bar(who) {
  Foo.call(this, who);
}

Bar.prototype = Object.create(Foo.prototype);

Bar.prototype.speak = function () {
  console.log("Hello, " + this.identify() + ".");
};
var b1 = new Bar("b1");
var b2 = new Bar("b2");
b1.speak();
b2.speak();

//对象委托
Foo = {
  init: function (who) {
    this.me = who;
  },
  identify: function () {
    return "I am " + this.me;
  },
};
Bar = Object.create(Foo);
Bar.speak = function () {
  console.log("Hello, " + this.identify() + ".");
};
var b1 = Object.create(Bar);
var b2 = Object.create(Bar);
b1.init("b1");
b2.init("b2");
b1.speak();
b2.speak();
var F1 = Object.create(Foo);
F1.init("F1");
F1.speak(); //F1没有speak方法
