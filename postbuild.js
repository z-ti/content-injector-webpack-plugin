const replace = require('replace-in-file');

replace.sync({
  files: 'dist/cjs/index.js',
  from: /exports\.default = ContentInjectorWebpackPlugin/g,
  to: 'module.exports = ContentInjectorWebpackPlugin'
});