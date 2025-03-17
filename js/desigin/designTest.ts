class target {
  targetFun(): void {
    console.log("这里是目标类型的targetFun");
  }
}
class adaptee {
  adapteeFun(): void {
    console.log("这里是被适配的类型的adapteeFun");
  }
}
//适配器类
class adapter extends target {
  private adaptee: adaptee;
  constructor(adaptee: adaptee) {
    super();
    this.adaptee = adaptee;
  }
  targetFun(): void {
    this.adaptee.adapteeFun();
  }
}
//测试  客户端代码
function clientCode(target: target) {
  target.targetFun();
}
//使用适配器兼容以后的adaptee
clientCode(new adapter(new adaptee()));
//如果直接使用adaptee 则会报错
//clientCode(new adaptee())
