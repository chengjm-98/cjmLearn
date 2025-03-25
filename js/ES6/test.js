let obj = {
  name: "cjm",
};
let p = new Proxy(obj, {
  get(target, key) {
    console.log("取数了!");
    return target[key];
  },
});
let name = p.name;
