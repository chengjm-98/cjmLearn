function log(target: any, key: string, descriptor: PropertyDescriptor): void {
  console.log("Decorator applied to:", target, key, descriptor);
  const originalMethod = descriptor.value; //先暂存下原来的方法，防止被覆盖掉

  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${key} with args:`, args);
    return originalMethod.apply(this, args);
  };
}

class User {
  @log
  greet(name: string) {
    // ✅ 这里是方法
    console.log(`Hello, ${name}!`);
  }
}

const user = new User();
user.greet("Alice");
