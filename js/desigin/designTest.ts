//产品的接口
interface ClockInterface {
  tick(): void;
}
//钟表产品类
class WatchClock implements ClockInterface {
  tick(): void {
    console.log("手表 dida dida");
  }
  specialMethod(): void {
    console.log("手表特殊方法");
  }
}
//数字钟
class DigitalClock implements ClockInterface {
  tick(): void {
    console.log("数字钟 beng beng");
  }
  specialMethod(): void {
    console.log("数字钟特殊方法");
  }
}
interface ClockConstructor {
  new (): ClockInterface;
}

//抽象工厂类
abstract class ClockFactory {
  abstract createClock(): ClockInterface;
  public someOperation(): void {
    const product = this.createClock();
    product.tick();
  }
}
//手表工厂
class WatchFactory extends ClockFactory {
  createClock(): ClockInterface {
    return new WatchClock();
  }
}
//数字钟工厂
class DigitalFactory extends ClockFactory {
  createClock(): ClockInterface {
    return new DigitalClock();
  }
}

//客户端
function clientCode(creator: ClockFactory) {
  console.log("Client:我不知道创建者的类，但是它仍然在工作");
  creator.someOperation();
}
console.log("App: 启动");
clientCode(new WatchFactory());
console.log("");
console.log("App: 启动");
clientCode(new DigitalFactory());
