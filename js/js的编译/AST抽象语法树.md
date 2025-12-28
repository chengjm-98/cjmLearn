# 什么是抽象语法树

ast 树是编译的中间产物。它是源代码语法结构的一种抽象表示。它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构。

# 为何需要抽象语法树（抽象语法树作用）

编程语言太多，需要一个**统一的结构**让计算机识别。
作用：比如 ts 的类型检查，IDE 的语法高亮，代码检查，转译等等，都是需要先将代码转化成 AST 在进行后续的操作。

# 如何生成和查看 AST：

- Babel：一个流行的 JavaScript 转译器，可以通过 @babel/parser 来解析 JavaScript 代码并生成 AST。
- Esprima：另一个用于解析 JavaScript 代码的库，可以生成 AST。
- AST Explorer：一个在线工具，可以让你输入 JavaScript 代码并生成 AST，同时支持多种语言和解析器。 https://astexplorer.net/
