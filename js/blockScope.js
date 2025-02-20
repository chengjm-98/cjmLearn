//块作用域
//google用来将ES6转换成ES5的项目  Traceur暂时已经弃用了，简单了解一下好了
//es6中的let 在ES5中怎么实现
//使用try catch
// try {
//   throw 2;
// } catch (a) {
//   console.log("访问的到", a);
// }
// console.log("访问不到吧", a);

try {
  console.log("变量声明提升a", a); // 第一次尝试访问a
} catch (error) {
  console.error("变量未定义");
}
(function () {
  var a = 1; // 这里声明了a
  console.log("内部a:", a); // 这里a已被赋值为1
})();
try {
  console.log("外部a:", a); // 尝试在外部访问a
} catch (error) {
  console.error("变量未定义");
}
