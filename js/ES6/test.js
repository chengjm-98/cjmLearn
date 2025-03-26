function greet(name) {
  return "Hello " + name;
}
greet = new Proxy(greet, {
  apply: function (target, thisArg, argumentsList) {
    console.log("函数被调用了");
    return target.apply(thisArg, argumentsList);
  },
});
greet("cjm");
