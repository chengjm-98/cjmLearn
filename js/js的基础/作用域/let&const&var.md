<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-12-28 21:54:58
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-12-28 22:05:46
 * @FilePath: /cjmLearn/js/js的基础/作用域/let&const&var.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

# var

- 作用域：函数作用域和全局作用域
- 变量提升：函数作用域中的变量会被提升到函数的顶部，全局作用域中的变量会被提升到全局对象（在浏览器中是 window）的顶部，而且会在顶部被初始化为 undefined，素以不会出现暂时性死区。
- 重复声明：可以重复声明变量，后面的声明会覆盖前面的声明。

# let

- 作用域：块级作用域，它的作用范围仅限于代码块内（例如：if、for 循环等）。
- 变量提升：提升：let 也会发生 提升，但不会初始化变量。它会进入 暂时性死区（Temporal Dead Zone，TDZ），在声明之前访问该变量会抛出 ReferenceError 错误。
- 重复声明：不允许重复声明变量，否则会抛出 SyntaxError 错误。

# const

- 用于声明常量（即不可变的变量）。常量一旦赋值后，不能再修改。
- 作用域：块级作用域
- 值不可变：const 声明的变量 不能重新赋值，这意味着你不能改变它的绑定。但是，如果 const 声明的是一个对象或数组，则其属性或元素是可以改变的。
- 重复声明：不允许重复声明变量，否则会抛出 SyntaxError 错误。
