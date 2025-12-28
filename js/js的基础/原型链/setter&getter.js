//对象的访问描述符
/*
当你给一个属性定义setter和getter时，你实际上是在定义一个属性的访问描述符。
*/
// var myObject = {
//   get a() {
//     return 2;
//   },
// };
// Object.defineProperty(myObject, "b", {
//   get: function () {
//     return this.a * 2;
//   },
//   enumerable: true,
// });
// console.log(myObject.a); // 2
// console.log(myObject.b); // 4

var myObject = {
  get a() {
    return this._a_;
  },
  set a(val) {
    this._a_ = val * 2;
  },
};
myObject.a = 1;
console.log(myObject.a); // 2
console.log("_a_", myObject._a_); // 2
console.log("b", myObject.b); // b undefined
console.log("myObject", myObject); // { a: [Getter/Setter], _a_: 2 }
