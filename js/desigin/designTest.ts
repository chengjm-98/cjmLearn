class configManager {
  static #_instance: configManager;
  private config: Record<string, any> = {}; //Record<string,any> 会生成一个对象，对象的key是string，value是any
  // private config: { [key: string]: any } = {};  //这种写法也可以
  private constructor() {}
  public static getInstance(): configManager {
    if (!configManager.#_instance) {
      configManager.#_instance = new configManager();
    }
    return configManager.#_instance;
  }

  public getConfig(key: string): any {
    return this.config[key];
  }
  public setConfig(key: string, value: any): void {
    this.config[key] = value;
  }
}

const config = configManager.getInstance();
config.setConfig("name", "张三");
config.setConfig("age", 18);
console.log(config.getConfig("name"));
