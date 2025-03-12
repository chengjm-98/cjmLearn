// function foo() {
//   console.log(a);
//   if (true) {
//     var a = 1;
//   }
// }
// foo();
function foo() {
  var a = 4;
  console.log(a);
  if (true) {
    var a = 1;
  }
  var a = 3;
  console.log(a);
}
foo();
