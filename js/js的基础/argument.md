# arguments 和函数形参的映射关系是怎样的？

arguments 是一个类数组对象，它包含了函数调用时传入的所有参数。

## 1.严格模式下

arguments 和函数形参不会生成映射关系。arguement 和函数形参是两个独立的变量，当形参发生变化时，argument 不会发生变化。当 arguement 发生变化时，函数形参也不会发生变化。

## 2.非严格模式下

arguments 和函数形参会生成映射关系，当形参发生变化时，argument 也会发生变化。

但是如果形参和实参的个数不一致，那么会生成映射关系，但是会忽略多余的形参。只有能对应上的那个形参会和 arguements 生成映射关系。

```js
//非严格模式下
function example(a, b) {
  console.log(arguments[0], arguments[1]); //1,undefined
  a = 11;
  b = 22;
  console.log(arguments[0], arguments[1]); //11,undefined
  arguments[0] = 111;
  console.log(a, b); //111,22
  arguments[1] = 222;
  console.log(a, b); //111,22
}
example(1);
```
