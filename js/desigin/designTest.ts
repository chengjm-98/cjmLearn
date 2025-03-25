// 1. 定义通用的接口
interface Costable {
  cost(): number;
}

interface Caloriable {
  calories(): number;
}

// 2. 具体类
class Coffee implements Costable {
  cost(): number {
    return 5;
  }
}

class Snack implements Caloriable {
  calories(): number {
    return 150;
  }
}

// 3. 通用装饰器
class MultiDecorator implements Costable, Caloriable {
  private costable: Costable | null = null;
  private caloriable: Caloriable | null = null;

  constructor(costable?: Costable, caloriable?: Caloriable) {
    if (costable) this.costable = costable;
    if (caloriable) this.caloriable = caloriable;
  }

  // 扩展 costable 的功能
  cost(): number {
    return this.costable ? this.costable.cost() : 0;
  }

  // 扩展 caloriable 的功能
  calories(): number {
    return this.caloriable ? this.caloriable.calories() : 0;
  }
}
class coffeeSanckDecorator extends MultiDecorator {
  // 计算最终费用
  cost(): number {
    return super.cost() + super.calories();
  }
}

// 5. 客户端代码
const myCoffee = new Coffee();
const mySnack = new Snack();

//结合两种类
const myCoffeeSnack = new coffeeSanckDecorator(myCoffee, mySnack);
console.log(myCoffeeSnack.cost()); // 输出：155
