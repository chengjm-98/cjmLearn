<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-12-28 16:19:48
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-12-28 19:03:33
 * @FilePath: /cjmLearn/js/你不知道的javascript/lhs和rhs和作用域.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

# lhs 和 rhs

- 比如 var a = 2; 这个语句中，a 是目标，2 是值。
- 目标和值的定义：
  - 目标：等号左边的变量。
  - 值：等号右边的值。
- 简单来说，LHS 查询是找到变量的容器本身，也就是我们想把值赋给的那个容器，RHS 查询是找到变量的值。
  比如：a=2 是 LHS 查询，而 console.log(a) 是 RHS 查询。

# 作用域

## 词法作用域

词法作用域就是定义在词法阶段的作用域。换句话说，词法作用域是由你在**写代码时将变量和块作用域写在哪里**来决定的，因此当词法分析器处理代码时会保持作用域不变（大部分情况下是这样的）。 --补充：定义过程发生在代码的**书写阶段**

## 作用域嵌套

### 作用域链

- 当查找变量的时候，会先从当前作用域开始查找，如果没有找到，就会向上一级作用域查找，直到找到该变量或者到达全局作用域。
- 作用域链的顶端，始终都是全局作用域。
- 全局执行环境的变量对象始终是作用域链的最后一个变量对象。

## 函数作用域

- 函数作用域是指在函数内部定义的变量或者函数，只能在函数内部访问。
- 任意代码片段外部添加包装函数，可以将内部的变量和函数定义“隐藏”起来，外部作用域无法访问包装函数内部的任何内容。

```jsx
var a = 2;
function foo() {
  var a = 3;
}
console.log(a); //2
```

## 块级作用域

```jsx
for (var i = 0; i < 10; i++) {
  console.log(i);
}
console.log(i); //10
```

本意上是想要在 for 循环中定义一个块级作用域，但是实际上是函数作用域。因为 var 声明的变量会被提升到函数的顶部。

**因此需要使用 let 或者 const 来定义块级作用域。**

# ReferenceError 和 TypeError

- 不成功的 RHS 引用会导致抛出 ReferenceError 异常。不成功的 LHS 引用会导致自动隐式地创建一个全局变量（非严格模式下），该变量使用 LHS 引用的目标作为标识符，或者抛出 ReferenceError 异常（严格模式下）。
- RHS 查询找到了一个变量，但是你尝试对这个变量的值进行不合理的操作，比如试图对一个非函数类型的值进行函数调用，或着引用 null 或 undefined 类型的值中的属性，那么引擎会抛出另外一种类型的异常，叫作 TypeError。
