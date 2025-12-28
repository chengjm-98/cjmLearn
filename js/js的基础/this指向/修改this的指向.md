<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-12-28 21:46:59
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-12-28 21:51:03
 * @FilePath: /cjmLearn/js/js的基础/this指向/修改this的指向.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

# 手动修改 this 的指向的方法

## 1. call

call 方法调用一个函数，并且指定 this 指向特定的对象。call 方法的第一个参数是 this 指向的对象，后面是函数参数。

```js
function greet(age, city) {
  console.log(`${this.name} is ${age} years old and lives in ${city}.`);
}

const person = { name: "Alice" };

// 使用 call 改变 this 指向 person 对象
greet.call(person, 25, "New York");
// 输出: Alice is 25 years old and lives in New York.
```

## 2. apply

apply 方法与 call 类似，唯一的不同是，apply 接受一个数组作为参数列表。它会将这个数组作为函数参数传递给函数。

```js
function greet(age, city) {
  console.log(`${this.name} is ${age} years old and lives in ${city}.`);
}

const person = { name: "Alice" };

// 使用 apply 改变 this 指向 person 对象
greet.apply(person, [25, "New York"]);
// 输出: Alice is 25 years old and lives in New York.
```

## 3. bind

bind 方法与 call 和 apply 不同，它不会立即执行函数，而是返回一个新的函数，这个新的函数的 this 被绑定到指定的对象。

```js
function greet(age, city) {
  console.log(`${this.name} is ${age} years old and lives in ${city}.`);
}

const person = { name: "Alice" };

// 使用 bind 改变 this 指向 person 对象
const boundGreet = greet.bind(person);

// 绑定后调用新的函数
boundGreet(25, "New York");
// 输出: Alice is 25 years old and lives in New York.
```

## 区别

| 方法    | 执行时机 | 是否返回新函数 | 参数传递方式             | 主要用途                       |
| ------- | -------- | -------------- | ------------------------ | ------------------------------ |
| `call`  | 立即执行 | 否             | 参数按顺序传递给函数     | 改变 `this` 指向并立即执行函数 |
| `apply` | 立即执行 | 否             | 参数以数组形式传递给函数 | 改变 `this` 指向并立即执行函数 |
| `bind`  | 延迟执行 | 是             | 参数按顺序传递给函数     | 改变 `this` 指向并返回新函数   |
