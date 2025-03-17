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
var _a, _configManager__instance;
class configManager {
    // private config: { [key: string]: any } = {};  //这种写法也可以
    constructor() {
        this.config = {}; //Record<string,any> 会生成一个对象，对象的key是string，value是any
    }
    static getInstance() {
        if (!__classPrivateFieldGet(_a, _a, "f", _configManager__instance)) {
            __classPrivateFieldSet(_a, _a, new _a(), "f", _configManager__instance);
        }
        return __classPrivateFieldGet(_a, _a, "f", _configManager__instance);
    }
    getConfig(key) {
        return this.config[key];
    }
    setConfig(key, value) {
        this.config[key] = value;
    }
}
_a = configManager;
_configManager__instance = { value: void 0 };
const config = configManager.getInstance();
config.setConfig("name", "张三");
config.setConfig("age", 18);
console.log(config.getConfig("name"));
