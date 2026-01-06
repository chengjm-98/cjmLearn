<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-12-28 21:59:43
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-12-30 17:19:37
 * @FilePath: /cjmLearn/js/ES6/set&map&symbol.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

# set

Set 是一个集合对象，它可以存储任何类型的唯一值。其特点是：

值唯一性：Set 中的每个元素都是唯一的，不允许重复。

元素顺序：Set 中的元素是按插入顺序排列的。

类型：可以存储任何类型的值，包括原始值和对象引用。

```js
const mySet = new Set([1, 2, 3, 4, 5, 1]);
console.log(mySet); // Set { 1, 2, 3, 4, 5 }，重复的 1 会被移除

mySet.add(6); // 添加元素
mySet.delete(2); // 删除元素
console.log(mySet.has(3)); // true，检查是否存在元素 3
```

# map

Map 是一个键值对集合，其中每个键都是唯一的。其特点是：
键值对：Map 中的每个元素都是一个键值对，键和值可以是任意类型。
键的唯一性：Map 中的键是唯一的，不允许重复。
插入顺序：Map 中的元素是按插入顺序排列的。
类型：可以存储任何类型的值，包括原始值和对象引用。

```js
const myMap = new Map();
myMap.set("name", "Alice");
myMap.set(1, "One");
myMap.set({ a: 1 }, "Object");

console.log(myMap); // Map { 'name' => 'Alice', 1 => 'One', { a: 1 } => 'Object' }
console.log(myMap.get("name")); // 'Alice'
console.log(myMap.has(1)); // true，检查是否存在键 1
myMap.delete(1); // 删除键 1 对应的值
```

# symbol

Symbol 是一种基本数据类型，它代表一个唯一的值，通常用于对象的属性键，尤其是在需要避免属性名冲突时。每个 Symbol 都是唯一的，即使它们有相同的描述：

唯一性：每个 Symbol 都是唯一的，甚至两个具有相同描述的 Symbol 也是不同的。

不可变性：Symbol 的值不可改变。

不可枚举：Symbol 作为对象属性键时，它们不会出现在 for...in 或 Object.keys() 的结果中。
用途：Symbol 通常用于创建私有属性或方法，以防止外部代码直接访问或修改它们。

```js
const sym1 = Symbol("description");
const sym2 = Symbol("description");
console.log(sym1 === sym2); // false，Symbol 总是唯一的

const obj = {};
obj[sym1] = "value";
console.log(obj[sym1]); // 'value'

for (let key in obj) {
  console.log(key); // 不会输出 sym1，因为它不是可枚举的
}
```
