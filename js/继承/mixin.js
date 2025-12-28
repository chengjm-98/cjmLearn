/*
 * @Author: jamie jamie.cheng@yuansuan.com
 * @Date: 2025-02-27 17:39:18
 * @LastEditors: jamie jamie.cheng@yuansuan.com
 * @LastEditTime: 2025-03-06 15:33:09
 * @FilePath: \cjmLearn\js\mixin.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
//类  模拟类的继承
//对象混入
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
//------------------------------------------------------------------------------------------------------------->
//ES6中通过class实现混入
const sayMixin = (Base) => {
  return class extends Base {
    sayHi() {
      console.log(`Hello,${this.name}`);
    }
  };
};

const workMixin = (Base) => {
  return class extends Base {
    toWork() {
      console.log(`go to work,${this.name}`);
    }
  };
};
class Person {
  constructor(name) {
    this.name = name;
  }
}

const EnhancedPerson = workMixin(sayMixin(Person));
const person = new EnhancedPerson("cjm");
person.sayHi();
person.toWork();
