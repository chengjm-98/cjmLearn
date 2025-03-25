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
// 2. 具体类
var Coffee = /** @class */ (function () {
    function Coffee() {
    }
    Coffee.prototype.cost = function () {
        return 5;
    };
    return Coffee;
}());
var Snack = /** @class */ (function () {
    function Snack() {
    }
    Snack.prototype.calories = function () {
        return 150;
    };
    return Snack;
}());
// 3. 通用装饰器
var MultiDecorator = /** @class */ (function () {
    function MultiDecorator(costable, caloriable) {
        this.costable = null;
        this.caloriable = null;
        if (costable)
            this.costable = costable;
        if (caloriable)
            this.caloriable = caloriable;
    }
    // 扩展 costable 的功能
    MultiDecorator.prototype.cost = function () {
        return this.costable ? this.costable.cost() : 0;
    };
    // 扩展 caloriable 的功能
    MultiDecorator.prototype.calories = function () {
        return this.caloriable ? this.caloriable.calories() : 0;
    };
    return MultiDecorator;
}());
var coffeeSanckDecorator = /** @class */ (function (_super) {
    __extends(coffeeSanckDecorator, _super);
    function coffeeSanckDecorator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // 计算最终费用
    coffeeSanckDecorator.prototype.cost = function () {
        return _super.prototype.cost.call(this) + _super.prototype.calories.call(this);
    };
    return coffeeSanckDecorator;
}(MultiDecorator));
// 5. 客户端代码
var myCoffee = new Coffee();
var mySnack = new Snack();
//结合两种类
var myCoffeeSnack = new coffeeSanckDecorator(myCoffee, mySnack);
console.log(myCoffeeSnack.cost()); // 输出：155
