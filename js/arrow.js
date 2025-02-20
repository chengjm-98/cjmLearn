//箭头函数
var obj = {
  id: "awesome",
  cool: function coolFn() {
    console.log(this.id);
  },
};
var id = "not awesome";
// obj.cool(); // awesome
setTimeout(obj.cool(), 100); // not awesome
// setTimeout(function () {
//   obj.cool();
// }, 100); // awesome
