abstract class PetStyle {
  name: NameClass;
  master: MasterClass;
  //购买一只宠物
  abstract creatPet(): void;
  abstract petBreak(): void;
  public setMssage(name: NameClass, master: MasterClass): void {
    this.name = name;
    name.setName();
    this.master = master;
    master.setMasterMsg();
  }
}
class Dog extends PetStyle {
  creatPet(): void {
    // console.log(
    //   this.name.getName() + "是一只小狗",
    //   "它的主人是" + this.master.name + this.master.eatPet()
    // );
    console.log(this.name.name + "是一只小狗", "它的主人是" + this.master.name);
  }
  petBreak(): void {
    console.log("小狗汪汪");
  }
}
class Cat extends PetStyle {
  creatPet(): void {
    console.log(
      this.name.getName() + "是一只小猫",
      "它的主人是" + this.master.name
    );
  }
  petBreak(): void {
    console.log("小猫喵喵");
  }
}
//宠物的名字类型接口
interface NameClass {
  name: string;
  getName(): string;
  setName(): void;
}
//主人类型接口
interface MasterClass {
  name: string;
  sex: string;
  eatPet(): void;
  setMasterMsg(): void;
}
//宠物的名字类
class Name1 implements NameClass {
  name: string;
  constructor() {}
  getName(): string {
    return this.name;
  }
  setName(): void {
    this.name = "suisui";
  }
}
class Name2 implements NameClass {
  name: string;
  constructor() {}
  getName(): string {
    return this.name;
  }
  setName(): void {
    this.name = "niannian";
  }
}
class Master1 implements MasterClass {
  constructor() {}
  name: string;
  sex: string;
  eatPet(): void {
    console.log("给宠物吃");
  }
  setMasterMsg(): void {
    this.name = "cjm";
    this.sex = "girl";
  }
}
class Master2 implements MasterClass {
  constructor() {}
  name: string;
  sex: string;
  eatPet(): void {
    console.log("给宠物吃");
  }
  setMasterMsg(): void {
    this.name = "zjj";
    this.sex = "boy";
  }
}

//测试
let dog = new Dog();
let name1 = new Name1();
let master1 = new Master1();
dog.setMssage(name1, master1);
dog.creatPet();
dog.petBreak();

let cat = new Cat();
let name2 = new Name2();
let master2 = new Master2();
cat.setMssage(name2, master2);
cat.creatPet();
cat.petBreak();
