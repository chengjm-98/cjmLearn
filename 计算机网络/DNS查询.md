<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2026-01-07 09:38:46
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-01-07 10:08:36
 * @FilePath: /cjmLearn/计算机网络/DNS查询.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

DNS 查询是将域名解析为 IP 地址的过程。
浏览器会先查**浏览器缓存、操作系统缓存和 hosts 文件**，如果没有命中，就向本地 DNS 服务器发起递归查询。本地 DNS 再通过根 DNS、顶级域 DNS 和权威 DNS 进行迭代查询，最终拿到 IP 地址并返回，同时进行缓存。前端可以通过 dns-prefetch 和 preconnect 来优化 DNS 解析时间。
