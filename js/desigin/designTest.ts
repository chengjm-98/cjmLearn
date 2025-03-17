// class Singleton {
//     static #instance: Singleton;
//     private constructor() { }
//     public static get instance(): Singleton {
//         if (!Singleton.#instance) {
//             Singleton.#instance = new Singleton();
//         }

//         return Singleton.#instance;
//     }
//     public someBusinessLogic() {
//         // ...
//     }
// }
// function clientCode() {
//     const s1 = Singleton.instance;
//     const s2 = Singleton.instance;

//     if (s1 === s2) {
//         console.log(
//             'Singleton works, both variables contain the same instance.'
//         );
//     } else {
//         console.log('Singleton failed, variables contain different instances.');
//     }
// }

// clientCode();

class MySingleton {
  static #instance: MySingleton; //静态私有属性，用来存储 实例
  private constructor() {
    //构造函数私有化
  }
  //一个公有的静态获取实例的方法
  public static getInstance(): MySingleton {
    if (!MySingleton.#instance) {
      MySingleton.#instance = new MySingleton();
    }
    return MySingleton.#instance;
  }
}

let a = MySingleton.getInstance();
let b = MySingleton.getInstance();

console.log("是否是单例模式：", a === b);
