<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2026-01-22 11:15:29
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-01-22 13:56:59
 * @FilePath: /cjmLearn/遇到的问题/请求几个接口，如果url一致就拿缓存的信息.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

# 请求几个接口，如果url一致就拿缓存的信息

- 需要创建一个缓存用于存储url和对应的数据
- 同时需要一个pending的map用于存储正在进行的请求，避免重复请求
- 还可以加个过期时间，过期后就清除缓存
- 最后需要一个清除缓存的方法

```jsx
class RequestController {
  private cache = new Map<string, { data: any; expire: number }>();
  private pending = new Map<string, Promise<any>>();
  private cacheTime: number;

  constructor(cacheTime = 0) {
    this.cacheTime = cacheTime; // 默认不缓存
  }

  request(url: string): Promise<any> {
    const now = Date.now();

    // 1. 返回缓存（如果存在且未过期）
    if (this.cache.has(url)) {
      const { data, expire } = this.cache.get(url)!;
      if (!expire || expire > now) {
        return Promise.resolve(data);
      } else {
        this.cache.delete(url);
      }
    }

    // 2. 如果请求正在进行，复用 Promise
    if (this.pending.has(url)) {
      return this.pending.get(url)!;
    }

    // 3. 发起新的请求（使用 fetch）
    const promise = fetch(url)
      .then(res => res.json()) // 假设返回 JSON
      .then(result => {
        if (this.cacheTime > 0) {
          this.cache.set(url, { data: result, expire: Date.now() + this.cacheTime });
        }
        return result;
      })
      .finally(() => {
        this.pending.delete(url);
      });

    this.pending.set(url, promise);
    return promise;
  }

  clearCache(url?: string) {
    if (url) this.cache.delete(url);
    else this.cache.clear();
  }
}
```
