<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-12-28 23:54:18
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-12-28 23:56:08
 * @FilePath: /cjmLearn/js/js的编译/js的编译.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

## 1.词法分析 (Lexical Analysis)

源代码中的每个字符被转换成词法单元（token：token 是不可分割的词法单元) ,如关键字、标识符、操作符、常量等。比如，let x = 10; 会被拆解成 let、x、=、10 和 ; 等单元。->分成一个 tokens 列表（数组）

## 2.语法分析(Syntax Analysis)

词法单元会按照 JavaScript 的语法规则组织成语法树（AST，Abstract Syntax Tree）。语法树是一种树状结构，表示代码的语法结构，能帮助引擎理解程序的逻辑结构。

## 3.语义分析 (Semantic Analysis)

引擎会检查代码是否符合语义规则，例如变量是否已声明、类型是否正确等。如果发现错误，比如未声明的变量，语义分析会报错。

## 4.字节码生成

将 AST 编译成字节码（中间表示）。

## 5.即时编译 (JIT)

将频繁执行的字节码转换为机器码，并进行优化。

## 6.执行

最终执行编译后的代码。
