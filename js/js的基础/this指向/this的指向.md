# this 的指向

his 的指向是在运行时决定的，this 的指向由**函数执行时**动态决定，它通常依赖于**函数的调用方式**而不是函数定义的位置。

## 普通函数

- 普通函数调用
  - 当 this 出现在普通的函数调用中（非箭头函数），this 会指向全局对象（在浏览器中是 window，在严格模式下是 undefined）。
- 方法调用

  - 当 this 出现在对象的方法调用中，this 会指向该对象。

  ```js
  const obj = {
    name: "John",
    showThis() {
      console.log(this); // 指向 obj
    },
  };
  obj.showThis();
  ```

- 构造函数调用

  - 当 this 出现在构造函数中（使用 new 关键字调用），this 会指向新创建的对象。

  ```js
  function Person(name) {
    this.name = name;
  }
  const person = new Person("Alice");
  console.log(person.name); // Alice
  ```

## 箭头函数

箭头函数没有自己的 this，它的 this 是在定义时确定的，而不是在调用时确定的。
箭头函数的 this 指向 外部函数的 this，而不是箭头函数的调用上下文。箭头函数没有自己的 this，它是 **词法绑定**的。

```js
const obj = {
  name: "Alice",
  greet() {
    setTimeout(() => {
      console.log(this.name);
      // `this` 指向外部的 `greet` 方法所在的 `obj`
    }, 1000);
  },
};
obj.greet(); // 输出 "Alice"
```

- 但是如果你在 setTimeout 中使用普通函数，this 就会指向 window

```js
const obj = {
  name: "Alice",
  greet() {
    setTimeout(function () {
      console.log(this.name); // 输出 "undefined"
    }, 1000);
  },
};
obj.greet();
```

- 输出"undefined"
- 在 setTimeout 的回调中，this 是指向 setTimeout 的执行上下文，通常是全局对象（在浏览器中是 window，在严格模式下是 undefined）。因此，this.name 就是 undefined，因为全局对象 (window) 中并没有 name 属性。
