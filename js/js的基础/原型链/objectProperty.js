//对象的属性描述符
var myObject = {
  a: 1,
};
console.log(Object.getOwnPropertyDescriptor(myObject, "a"));

Object.defineProperty(myObject, "b", {
  value: 2,
  writable: true,
  configurable: true,
  enumerable: true,
});
console.log(Object.getOwnPropertyDescriptor(myObject, "b"));

Object.defineProperty(myObject, "b", {
  value: 2,
  writable: false,
  configurable: true,
  enumerable: true,
});
myObject.b = 3;

//设置为不可配置
Object.defineProperty(myObject, "b", {
  value: 2,
  writable: true,
  configurable: false,
  enumerable: true,
});
console.log("设置为不可配置之后", myObject.b);
delete myObject.b;
console.log("删除之后", myObject.b);
//--------------------------------------------------------------------->
const array = [1, 2, 3];
// 重写 push 方法，阻止数组内容的改变
Object.defineProperty(array, "push", {
  value: function () {
    console.log("Attempted to push an element, but the array is immutable.");
    return this.length; // 返回当前的 length
  },
  writable: true, // 可以重写
  configurable: true, // 可以删除或重新配置
});

// 调用 push 方法，尝试添加一个新元素
array.push(4);

console.log(array); // 输出 [1, 2, 3]
console.log(array.length); // 输出 3
//------------------------------------------------------------------------>
//不变性
//禁止扩展
var myObject = {
  a: 2,
};
Object.preventExtensions(myObject);
myObject.b = 3;
console.log(myObject); //{ a: 2 }
//密封 调用了Object.preventExtensions(..)并把所有现有属性标记为configurable:false。

var myObject = {
  a: 2,
};
Object.seal(myObject);

//冻结 调用了Object.seal(..)并把所有“数据访问”属性标记为writable:false，这样就无法修改它们的值。
var myObject = {
  a: 2,
};
Object.freeze(myObject);
