//类  模拟类的继承
function mixin(sourceObj, targetObj) {
  for (let key in sourceObj) {
    if (!(key in targetObj)) {
      //如果目标对象没有这个属性，就把这个属性添加进去
      targetObj[key] = sourceObj[key];
    }
  }
  return targetObj;
}
var Vehicle = {
  engines: 1,
  ignition: function () {
    console.log("Turning on my engine.");
  },
  drive: function () {
    this.ignition();
    console.log("Steering and moving forward!");
  },
};
var Car = mixin(Vehicle, {
  wheels: 4,
  drive: function () {
    Vehicle.drive.call(this);
    console.log("Rolling on all " + this.wheels + " wheels!");
  },
});
console.log("car", Car);
