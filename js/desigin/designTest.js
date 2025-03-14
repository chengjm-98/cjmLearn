var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
//钟表产品类
var WatchClock = /** @class */ (function () {
    function WatchClock() {
    }
    WatchClock.prototype.tick = function () {
        console.log("手表 dida dida");
    };
    WatchClock.prototype.specialMethod = function () {
        console.log("手表特殊方法");
    };
    return WatchClock;
}());
//数字钟
var DigitalClock = /** @class */ (function () {
    function DigitalClock() {
    }
    DigitalClock.prototype.tick = function () {
        console.log("数字钟 beng beng");
    };
    DigitalClock.prototype.specialMethod = function () {
        console.log("数字钟特殊方法");
    };
    return DigitalClock;
}());
//抽象工厂类
var ClockFactory = /** @class */ (function () {
    function ClockFactory() {
    }
    ClockFactory.prototype.someOperation = function () {
        var product = this.createClock();
        product.tick();
    };
    return ClockFactory;
}());
//手表工厂
var WatchFactory = /** @class */ (function (_super) {
    __extends(WatchFactory, _super);
    function WatchFactory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WatchFactory.prototype.createClock = function () {
        return new WatchClock();
    };
    return WatchFactory;
}(ClockFactory));
//数字钟工厂
var DigitalFactory = /** @class */ (function (_super) {
    __extends(DigitalFactory, _super);
    function DigitalFactory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DigitalFactory.prototype.createClock = function () {
        return new DigitalClock();
    };
    return DigitalFactory;
}(ClockFactory));
//客户端
function clientCode(creator) {
    console.log("Client:我不知道创建者的类，但是它仍然在工作");
    creator.someOperation();
}
console.log("App: 启动");
clientCode(new WatchFactory());
console.log("");
console.log("App: 启动");
clientCode(new DigitalFactory());
