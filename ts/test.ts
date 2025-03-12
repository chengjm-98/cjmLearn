interface objType {
  name: string;
}
function setPersonMsg(item: objType) {
  console.log("输入姓名:" + item.name);
}
setPersonMsg({ name: "cjm", age: 26 } as objType);
