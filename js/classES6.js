// // es6 中的class 类
// function Person(name, age) {
//   this.name = name;
//   this.age = age;
// }
// Person.prototype.sayHello = function () {
//   console.log(`Hello, my name is ${this.name}, I am ${this.age} years old.`);
// };
// const person1 = new Person("Alice", 25);
// person1.sayHello(); // 输出 "Hello, my name is Alice, I am 25 years old."

//等同于：使用class
// class Person {
//   constructor(name, age) {
//     this.name = name;
//     this.age = age;
//   }
//   sayHello() {
//     console.log(`Hello, my name is ${this.name}, I am ${this.age} years old.`);
//   }
// }
// const person1 = new Person("Alice", 25);
// person1.sayHello(); // 输出 "Hello, my name is Alice, I am 25 years old."

//----------------------------------------------------------------------->
//getter和setter
// class MyClass {
//   constructor(name) {
//     this.name = name;
//   }
//   get prop() {
//     return "getter";
//   }
//   set prop(value) {
//     console.log("setter: " + value);
//   }
// }

// let inst = new MyClass();
// console.log(Object.getOwnPropertyDescriptor(MyClass.prototype, "prop"));
//-----------------------------------------------   ----------------------->
//属性表达式和class表达式
// let methodName = "sayHello";
// const MyClass = class Me {
//   constructor(name) {
//     this.name = name;
//   }
//   [methodName]() {
//     return "Hello!" + this.name;
//   }
// };
// let inst = new MyClass("Alice");
// console.log(inst.sayHello()); // 输出 "Hello!"
// //那么就可以写出一个立即执行类来
// let person = new (class {
//   constructor(name) {
//     this.name = name;
//   }
//   [methodName]() {
//     return "HelloNow!" + this.name;
//   }
// })("Alice");
// console.log(person.sayHello()); // 输出 "HelloNow!Alice"

//-------------------------------------------------------------------------->
//静态属性
// class Person {
//   static species = "Homo sapiens";
//   constructor(name, age) {
//     this.name = name;
//     this.age = age;
//   }
//   sayHello() {
//     console.log(`Hello, my name is ${this.name}, I am ${this.age} years old.`);
//   }
// }
// const person1 = new Person("Alice", 25);
// console.log(person1.species); // 输出 "undefined"
// console.log(Person.species); // 输出 "Homo sapiens"

// console.log(Object.getOwnPropertyDescriptor(Person.prototype, "sayHello"));
//-------------------------------------------------------------------------->
//私有属性
//通过实例在静态方法中访问私有属性
// class Person {
//   #Id = "142430199812231220";
//   constructor(name) {
//     this.name = name;
//   }
//   static getId(foo) {
//     return foo.#Id;
//   }
// }
// const person1 = new Person("cjm");
// console.log(Person.getId(person1));
//--------------------------------------------------------------------------->
class C {
  #brand;

  static isC(obj) {
    if (#brand in obj) {
      // 私有属性 #brand 存在
      return true;
    } else {
      // 私有属性 #foo 不存在
      return false;
    }
  }
}
let c1 = new C();
console.log(C.isC(c1));

class likeC {
  #brand;
}
let c2 = new likeC();
console.log(C.isC(c2));
