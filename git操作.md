<!--
 * @Author: jamie jamie.cheng@yuansuan.com
 * @Date: 2025-10-31 10:49:04
 * @LastEditors: jamie jamie.cheng@yuansuan.com
 * @LastEditTime: 2025-10-31 11:01:55
 * @FilePath: \cjmLearn\git操作.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

# 给项目设置走代理路径

## 重新设置正确代理端口，这个端口去看 verge 的代理端口

git config --global http.proxy http://127.0.0.1:7897
git config --global https.proxy http://127.0.0.1:7897

## 先清除旧代理

git config --global --unset http.proxy
git config --global --unset https.proxy

# 初始化将一个项目推到远程仓库

git init 初始化仓库
git add . 把所有文件添加到暂存区
git commit -m "first commit" 提交到本地仓库
git remote add origin 仓库地址 关联远程仓库
git push -u origin master 推送到远程仓库
