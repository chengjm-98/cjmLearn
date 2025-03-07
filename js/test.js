function Parent(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}
Parent.prototype.getName = function () {
  console.log(this.name);
};
function Child(name) {
  Parent.call(this, name);
}
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child; //纠正constructor指向

var child1 = new Child("kevin");
child1.colors.push("black");

var child2 = new Child("daisy");

console.log(child1.name);
console.log(child2.name);
child1.getName();
child2.getName();
console.log(child1.colors);
console.log(child2.colors);
