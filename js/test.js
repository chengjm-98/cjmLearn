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
