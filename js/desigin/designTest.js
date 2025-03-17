// class Singleton {
//     static #instance: Singleton;
//     private constructor() { }
//     public static get instance(): Singleton {
//         if (!Singleton.#instance) {
//             Singleton.#instance = new Singleton();
//         }
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _a, _MySingleton_instance;
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
    constructor() {
        //构造函数私有化
    }
    //一个公有的静态获取实例的方法
    static getInstance() {
        if (!__classPrivateFieldGet(_a, _a, "f", _MySingleton_instance)) {
            __classPrivateFieldSet(_a, _a, new _a(), "f", _MySingleton_instance);
        }
        return __classPrivateFieldGet(_a, _a, "f", _MySingleton_instance);
    }
}
_a = MySingleton;
_MySingleton_instance = { value: void 0 }; //静态私有属性，用来存储 实例
let a = MySingleton.getInstance();
let b = MySingleton.getInstance();
console.log("是否是单例模式：", a === b);
