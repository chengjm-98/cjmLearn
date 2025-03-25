import { useEffect } from "react";
import "./App.css";

function App() {
  function log(target: any, key: string, descriptor: PropertyDescriptor) {
    console.log("Decorator applied to:", target, key, descriptor);
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      console.log(`Calling ${key} with args:`, args);
      return originalMethod.apply(this, args);
    };
    return descriptor;
  }
  class User {
    @log
    greet(name: string) {
      // ✅ 这里是方法
      console.log(`Hello, ${name}!`);
    }
  }
  useEffect(() => {
    const user = new User();
    user.greet("Alice");
  }, []);
  return (
    <>
      <div>cjm的项目</div>
    </>
  );
}

export default App;
