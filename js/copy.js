//关于深拷贝和浅拷贝
//---------------------------------------------------------------->
//浅拷贝
// object.assign(target,obj1,obj2) 用于嵌套对象
// let obj = {
//   a: {
//     b: {
//       c: 1,
//     },
//   },
// };
// let obj2 = {
//   b: 1111,
// };
// let obj3 = {
//   b: 2222,
// };
// let newObj = Object.assign({}, obj, obj2, obj3);
// newObj.a.b.c = 2;
// console.log(newObj); //{ a: { b: { c: 2 } }, b: 2222 }
// console.log("obj", obj); //obj  { a: { b: { c: 2 } } }
// console.log("obj2", obj2); //obj2 { b: 1111 }
//用于单层对象（对于单层对象来说看起来是深拷贝）
//------------------------------------------------------------------>
let obj = {
  a: 1,
};
let newObj = Object.assign({}, obj);
obj.a = 2;
console.log("newObj", newObj); //newObj { a: 1 }
console.log("obj", obj); //obj { a: 2 }

//object.assgin 用于数组
//------------------------------------------------------------------>
let array1 = [1, 2, 3];
let array2 = [4, 5, 6];
let newArray = Object.assign([], array1, array2);
console.log("NEW", newArray); //NEW [ 4,5,6 ]
//原因：因为是按照索引（当作是对象的属性值）来进行合并的，所以会把前面的值覆盖掉
