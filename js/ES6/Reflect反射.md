# Reflect 反射

## 什么是反射机制

反射机制指的是程序在运行时能够获取自身的信息

## 关于 Reflect

Reflect 是一个**内置的对象**，它提供拦截 JavaScript 操作的方法。这些方法与 proxy handlers 的方法相同。Reflect 不是一个函数对象，因此它是不可构造
的。所有的属性方法都是静态的（就像 Math 对象）。  
 本质上：其实就是做了一些封装，它的底层实现基本上是通过调用对象本身的内置方法来实现的。

## 为什么要使用 Reflect

Reflect 实际上是通过对 JavaScript 内置对象和方法的封装，提供了一套更加一致的 API，用来操作对象的属性、方法、函数等。它的底层实现通常就是调用对象原生的操作方法，但通过更统一的接口提供给开发者，确保元编程操作的可控性和一致性。

## Reflect 内置的方法

1️⃣ `Reflect.get(target, propertyKey[, receiver])`：获取对象属性的值。  
2️⃣ `Reflect.set(target, propertyKey, value[, receiver])`：设置对象属性的值。  
3️⃣ `Reflect.has(target, propertyKey)`：检查对象是否拥有指定属性。  
4️⃣ `Reflect.deleteProperty(target, propertyKey)`：删除对象属性。  
5️⃣ `Reflect.ownKeys(target)`：返回对象所有属性的键名数组。  
6️⃣ `Reflect.apply(target, thisArgument, argumentsList)`：调用函数并指定 this 值和参数。

### 详细介绍

**入参**  
 - target：要调用的函数和方法 - thisArgument：指定要调用函数的 this 值 - argumentsList：一个包含要传递给 target 函数的参数的数组或类数组对象。
**返回值** - 调用函数的返回值。
**错误处理**
如果调用失败会抛出异常而不是返回 undefined。

```js
function greet(name) {
  console.log(`Hello, ${name}!`);
}

const result = Reflect.apply(greet, null, ["Alice"]); //Hello, Alice!
console.log("result", result); //undefined  因为原函数没有返回值
```

7️⃣ `Reflect.construct(target, argumentsList[, newTarget])`：使用构造函数创建对象。  
8️⃣ `Reflect.getPrototypeOf(target)`：获取对象的原型。  
9️⃣ `Reflect.setPrototypeOf(target, prototype)`：设置对象的原型。  
1️⃣0️⃣ `Reflect.isExtensible(target)`：检查对象是否可扩展。  
1️⃣1️⃣ `Reflect.preventExtensions(target)`：防止对象扩展。
