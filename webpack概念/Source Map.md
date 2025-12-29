# Source Map 的作用

- 调试：可以在浏览器开发者工具中查看未压缩的源代码，并定位错误。
- 错误堆栈追踪：即使在生产环境中出现错误，你也能看到源代码中的准确位置，而不是压缩代码的行号。
- 提高开发效率：可以直接在浏览器控制台上调试源代码，而不需要手动映射。

# 配置

```jsx
module.exports = {
  mode: "development",
  devtool: "eval-source-map", // 开发模式下常用的配置
  // 其他配置
};
```

# 常见的几种

## 'source-map'

- 生成外部 .map 文件，但是不会暴露给用户，适合用于生产环境。
- Source Map 的生成位置，生成的 .map 文件通常会与生成的 JS 文件放在一起，或者放在指定的目录下。你可以使用 output 选项来指定 .map 文件的位置

```jsx
module.exports = {
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    sourceMapFilename: "[file].map", // 映射文件的位置
  },
};
```

## 'cheap-source-map'：只生成文件的行映射，不生成列映射，适合开发调试，但不包含源代码的详细信息。

## 'inline-source-map'：将 source map 直接嵌入到生成的文件中，这样可以避免外部请求 map 文件。
