# 判断对象的方法的方法

1. 利用 typeof
   它适用于大多数基本数据类型和一些对象类型。

   ```jsx
   typeof "hello"; // "string"
   typeof 123; // "number"
   typeof true; // "boolean"
   typeof undefined; // "undefined"
   typeof null; // "object" (这是一个历史遗留问题)
   typeof {}; // "object"
   typeof []; // "object" (数组是对象类型)
   typeof function () {}; // "function"
   ```

2. 利用 instanceof

- instanceof 用来判断一个对象是否是某个类的实例。它适用于对象和类（构造函数）。

  ```js
  [1, 2, 3] instanceof Array // true
  ({}) instanceof Object // true
  function() {} instanceof Function // true

  ```

  - 手写 instanceof

  ```js
  function myInstanceof(obj, constructor) {
    // 获取对象的原型
    let proto = Object.getPrototypeOf(obj);

    // 不断向上查找原型链，直到找到 constructor.prototype 或者到达原型链的末尾（null）
    while (proto !== null) {
      if (proto === constructor.prototype) {
        return true;
      }
      proto = Object.getPrototypeOf(proto);
    }

    // 没找到的话返回 false
    return false;
  }
  ```

3. 利用 constructor
4. 利用 Object.prototype.toString.call()
   准确判断数据类型

```js
Object.prototype.toString.call([]); // "[object Array]"
Object.prototype.toString.call({}); // "[object Object]"
Object.prototype.toString.call("hello"); // "[object String]"
Object.prototype.toString.call(new Date()); // "[object Date]"
Object.prototype.toString.call(/abc/); // "[object RegExp]"
```
