# js 中存在的几种继承方式

## 1.原型链继承()

```js
function Parent(name) {
  this.class = "person";
  this.love = ["music", "movie"];
  console.log("构造函数");
  this.name = name;
}
Parent.prototype.say = function () {
  console.log("hello");
};
function Child() {}
Child.prototype = new Parent();
var c = new Child();
var c1 = new Child();
console.log(c.say()); //hello
console.log(c.name); //undefined
console.log(c.class); //person
c.love.push("code");
console.log(c1.love); //[ 'music','movie', 'code' ]
```

### 弊端

1. 引用类型的属性被所有实例共享
2. 在创建 Child 的实例时，不能向 Parent 传参
3. constructor 指向 Parent（指向错误）

## 2.借用构造函数继承()

```js
function Parent(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
  this.sayHello = function () {
    console.log("Hello!");
  };
}
Parent.prototype.getName = function () {
  console.log(this.name);
};
function Child(name) {
  Parent.call(this, name);
}
var child1 = new Child("kevin");
child1.colors.push("black");

var child2 = new Child("daisy");

console.log(child1.name);
console.log(child2.name);
// console.log(child1.getName());   //构造函数继承访问不到原型链上的方法
console.log(child1.colors);
console.log(child2.colors);
console.log(child1.sayHello === child2.sayHello); // ❌ false，每个实例都有自己的方法
```

输出：

```js
kevin;
daisy[("red", "blue", "green", "black")][("red", "blue", "green")];
false;
```

### 弊端

1. 只能继承父类的实例属性和方法，不能继承原型属性/方法
2. 继承方式导致每个实例都有独立的方法，浪费内存

## 3.组合继承()

```js
function Parent(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}
Parent.prototype.getName = function () {
  console.log(this.name);
};
function Child(name) {
  Parent.call(this, name);
}
Child.prototype = new Parent();
Child.prototype.constructor = Child; //纠正constructor指向

var child1 = new Child("kevin");
child1.colors.push("black");

var child2 = new Child("daisy");

console.log(child1.name);
console.log(child2.name);
child1.getName();
child2.getName();
console.log(child1.colors);
console.log(child2.colors);
```

### 弊端

1. 调用了两次父类构造函数，生成了两份实例（子类实例将子类原型上的那份屏蔽了），虽然不会影响结果，但是会占用内存

## 4.寄生组合继承

```js
function Parent(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}
Parent.prototype.getName = function () {
  console.log(this.name);
};
function Child(name) {
  Parent.call(this, name);
}
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child; //纠正constructor指向

var child1 = new Child("kevin");
child1.colors.push("black");

var child2 = new Child("daisy");

console.log(child1.name);
console.log(child2.name);
child1.getName();
child2.getName();
console.log(child1.colors);
console.log(child2.colors);
```

### 基本没有弊端

继承实例属性，不会共享引用属性。
继承原型方法，不会重复调用父类构造函数。
性能和代码结构最优。

## 5.ES6 class 继承

extend 在 classES6 那份文件中有详细介绍
