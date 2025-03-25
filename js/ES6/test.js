function greet(name) {
  console.log(`Hello, ${name}!`);
}

const result = Reflect.apply(greet, null, ["Alice"]); //Hello, Alice!
// console.log("result", result);   //undefined  因为原函数没有返回值
