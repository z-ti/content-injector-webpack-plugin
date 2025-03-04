// postbuild.js
const replace = require('replace-in-file');

// 修复 CJS 导出
replace.sync({
  files: 'dist/cjs/index.js',
  from: /exports\.default = WebpackBannerPlugin/g,
  to: 'module.exports = WebpackBannerPlugin'
});