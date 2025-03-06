//函数柯里化  实现add(1)(2)(3)() = 6
function add(a) {
  let sum = a;
  //   function curry(b) {
  //     if (b) {
  //       sum += b;
  //       return curry;
  //     } else {
  //       //当b没有传值的时候就是合适的结束时间
  //       return sum;
  //     }
  //   }
  //或者可以写成
  function curry(b) {
    if (Array.from(arguments).length > 0) {
      sum += b;
      return curry;
    } else {
      //当b没有传值的时候就是合适的结束时间
      return sum;
    }
  }
  return curry;
}
console.log(add(1)(2)(3)());

//或者柯里化的核心
/*
 1.返回函数，实现链式调用
 2.找到合适的时机结束链式调用
*/

function curry(fn) {
  return function curried(...args) {
    // 如果已经传递了足够的参数，直接调用原函数
    if (args.length >= fn.length) {
      return fn(...args);
    } else {
      console.log("传来的参数", args, "需要的参数", fn.lenght);
      // 否则返回一个新函数，继续接收剩余的参数
      return function (...nextArgs) {
        return curried(...args, ...nextArgs);
      };
    }
  };
}

// 示例：柯里化一个加法函数
function add(a, b, c, d) {
  return a + b + c + d;
}

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6

//---------------------------------------------------------->
//函数柯里化 实现add(1，2)(3)(4)
function add() {
  let _args = Array.prototype.slice.call(arguments); //转换成数组
  let adder = function () {
    if (Array.prototype.slice.call(arguments).length == 0) {
      const sum = _args.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
      return sum;
    } else {
      _args.push(...arguments);
    }
    return adder;
  };
  return adder;
}

console.log(add(1, 2)(3)(4)());
