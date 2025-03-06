//自己实现一个迭代器
function createIterator(array) {
  let index = 0;
  //返回一个迭代器
  return {
    next: () => {
      if (index < array.length) {
        index++;
        return { value: array[index - 1], done: false };
      } else {
        return { value: undefined, done: true };
      }
    },
  };
}

var iterator = createIterator([1, 2, 3]);
console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true }

//给任意的一个对象定义迭代器
var myObject = {
  a: 1,
  b: 2,
};
Object.defineProperty(myObject, Symbol.iterator, {
  enumerable: false,
  writable: false,
  configurable: true,
  value: function () {
    let index = 0;
    console.log("this", this);
    let o = this;
    return {
      next: function () {
        return {
          value: o[Object.keys(o)[index++]],
          done: index > Object.keys(o).length,
        };
      },
    };
  },
});

var it = myObject[Symbol.iterator]();
console.log(it.next());
console.log(it.next());
console.log(it.next());

for (let i of myObject) {
  console.log(i);
}
