# Content Injector Webpack Plugin 🔌

[![node](https://img.shields.io/node/v/content-injector-webpack-plugin.svg)](https://github.com/z-ti/content-injector-webpack-plugin)
[![npm](https://img.shields.io/npm/v/content-injector-webpack-plugin.svg)](https://www.npmjs.com/package/content-injector-webpack-plugin)
[![Downloads](https://img.shields.io/npm/d18m/content-injector-webpack-plugin.svg)](https://npm-stat.com/charts.html?package=content-injector-webpack-plugin)
[![License: MIT](https://img.shields.io/npm/l/content-injector-webpack-plugin.svg)](https://github.com/z-ti/content-injector-webpack-plugin/blob/main/LICENSE)

内容注入插件，支持灵活的资源修改策略。可轻松添加构建信息、项目版本等通用内容。

## ✨ 特性

- ⏱ **构建时间注入** - 自动添加打包时间戳
- 🎯 **精准定位** - 支持正则/函数匹配文件
- 📌 **位置控制** - 头部/尾部自由选择
- 🧩 **多格式支持** - 原生支持 JS/CSS/HTML 等文本资源

## 📦 安装

```bash
npm install content-injector-webpack-plugin --save-dev
# 或
yarn add content-injector-webpack-plugin -D
# 或
pnpm install content-injector-webpack-plugin --save-dev
```

## 🚀 快速开始

```javascript
// webpack.config.js
const ContentInjector = require('content-injector-webpack-plugin');

module.exports = {
  plugins: [
    new ContentInjector({
      content: `/*! Build at: ${new Date().toLocaleString()} */\n`
    })
  ]
};
```

## ⚙️ 配置选项

| 参数        | 类型                                      | 默认值       | 说明                                 |
|-------------|------------------------------------------|-------------|--------------------------------------|
| `content`   | `string \| () => string`                 | **必填**     | 插入内容，支持动态函数               |
| `match`      | `RegExp \| (file: string) => boolean`    | `/\.js$/`   | 基础匹配条件                         |
| `include`   | `RegExp \| string \| (file: string) => boolean` | - | 白名单（优先级高于 match）            |
| `exclude`   | `RegExp \| string \| (file: string) => boolean` | - | 黑名单                              |
| `position`  | `'head' \| 'tail'`                       | `'head'`    | 内容插入位置                        |

## 🌈 高级用法

### 动态内容生成

```javascript
new ContentInjector({
  content: () => `/*! 
    Version: ${process.env.APP_VERSION || 'dev'}
    Build: ${new Date().toISOString()}
  */`,
  match: /app\.js$/
})
```

### 多文件类型处理

```javascript
new ContentInjector({
  content: '<!-- Built with Webpack -->',
  match: /\.(js|css|html)$/,
  exclude: /vendor/
})
```

### 组合条件

```javascript
new ContentInjector({
  content: '// @generated',
  include: /src\/lib/,
  exclude: file => file.includes('test'),
  position: 'tail'
})
```

## 🐛 问题

如果您遇到任何问题或有改进建议，请点击这里 [Issue Report](https://github.com/z-ti/content-injector-webpack-plugin/issues)

## 📄 许可证

MIT © 2025 flyfox  
完整协议见 [MIT](https://github.com/z-ti/content-injector-webpack-plugin/blob/master/LICENSE) 文件


