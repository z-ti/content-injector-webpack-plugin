# Content Injector Webpack Plugin 🔌

[![npm](https://img.shields.io/npm/v/content-injector-webpack-plugin.svg)](https://www.npmjs.com/package/content-injector-webpack-plugin)
[![node](https://img.shields.io/node/v/content-injector-webpack-plugin.svg)](https://github.com/z-ti/content-injector-webpack-plugin)
[![Downloads](https://img.shields.io/npm/d18m/content-injector-webpack-plugin.svg)](https://npm-stat.com/charts.html?package=content-injector-webpack-plugin)
[![License: MIT](https://img.shields.io/npm/l/content-injector-webpack-plugin.svg)](https://github.com/z-ti/content-injector-webpack-plugin/blob/main/LICENSE)
[![Coverage](https://codecov.io/gh/z-ti/content-injector-webpack-plugin/branch/main/graph/badge.svg)](https://codecov.io/gh/z-ti/content-injector-webpack-plugin)

English | [简体中文](./README.zh-CN.md)

A flexible Webpack plugin for injecting dynamic content (e.g., version, timestamps) into build assets with precise file matching and position control.

## ✨ Features

- ⏱ **Build Time Injection** - Automatically adds a packaging timestamp.
- 🎯 **Precise Targeting** - Supports regex/function matching for files.
- 📌 **Position Control‌** - Choose between head or tail for content insertion.
- 🧩 **Multi-Format Support‌** - Native support for JS/CSS/HTML and other text resources.
- 🔐 **Hash Injection** - Supports content-based hash value injection, Configurable hash algorithm and length.

## 📦 Installation

```bash
npm install content-injector-webpack-plugin --save-dev
# or
yarn add content-injector-webpack-plugin -D
# or
pnpm install content-injector-webpack-plugin --save-dev
```

## 🚀 Quick Start

```javascript
// webpack.config.js
const ContentInjector = require('content-injector-webpack-plugin');

module.exports = {
  plugins: [
    new ContentInjector({
      content: `/*! Build at: ${new Date().toLocaleString()} */\n`,
    }),
  ],
};
```

## ⚙️ Options

| Name            | Type                                                 | Default       | Description                                                            |
| --------------- | ---------------------------------------------------- | ------------- | ---------------------------------------------------------------------- |
| `content`       | `string \| () => string \| (hash: string) => string` | **Required‌** | The content to insert, supporting dynamic functions and hash parameter |
| `match`         | `RegExp \| (file: string) => boolean`                | `/\.js$/`     | Basic matching condition                                               |
| `include`       | `RegExp \| string \| (file: string) => boolean`      | -             | Whitelist (takes precedence over match)                                |
| `exclude`       | `RegExp \| string \| (file: string) => boolean`      | -             | Blacklist                                                              |
| `position`      | `'head' \| 'tail'`                                   | `'head'`      | Position for content insertion                                         |
| `injectHash`    | `boolean`                                            | `false`       | Whether to inject file hash value                                      |
| `hashAlgorithm` | `string`                                             | `md5`         | Hash algorithm (e.g. 'sha1', 'sha256')                                 |
| `hashLength`    | `number`                                             | `8`           | Hash value truncation length                                           |

## 🌈 Advanced Usage

### Dynamic Content Generation

```javascript
new ContentInjector({
  content: () => `/*! 
    Version: ${process.env.APP_VERSION || 'dev'}
    Build: ${new Date().toISOString()}
  */`,
  match: /app\.js$/,
});
```

### Multi-File Type Handling

```javascript
new ContentInjector({
  content: '<!-- Built with Webpack -->',
  match: /\.(js|css|html)$/,
  exclude: /vendor/,
});
```

### Combined Conditions

```javascript
new ContentInjector({
  content: '// @generated',
  include: /src\/lib/,
  exclude: (file) => file.includes('test'),
  position: 'tail',
});
```

### Hash Value Injection

```javascript
new ContentInjector({
  content: (hash) => {
    return `/*! APP v${require('./package.json').version} ContentHash: ${hash} */\n`;
  },
  match: /\.(js|css)$/,
  injectHash: true,
  hashAlgorithm: 'md5',
  hashLength: 12,
});
```

## 🐛 Issues

If you encounter any issues or have suggestions for improvements, please click here [Issue Report](https://github.com/z-ti/content-injector-webpack-plugin/issues)

## 📄 License

[MIT](https://github.com/z-ti/content-injector-webpack-plugin/blob/master/LICENSE)

Copyright (c) 2025-present flyfox
