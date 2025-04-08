import ContentInjectorWebpackPlugin from '../src/index';
import { Compiler, Compilation, sources } from 'webpack';

describe('ContentInjectorWebpackPlugin', () => {
  let compiler: Compiler;
  let compilation: Compilation;

  beforeEach(() => {
    // 创建 Compiler 实例
    compiler = new Compiler('/fake/context');

    // 使用 createCompilation 方法创建 Compilation 实例
    // @ts-ignore
    compilation = compiler.createCompilation();

    // 模拟 assets
    compilation.assets = {};
  });

  test('should initialize with default options', () => {
    const plugin = new ContentInjectorWebpackPlugin({ content: 'test' });
    expect(plugin).toBeInstanceOf(ContentInjectorWebpackPlugin);
    expect((plugin as any).options).toEqual({
      match: /\.js$/,
      position: 'head',
      content: 'test',
      injectHash: false,
      hashAlgorithm: 'md5',
      hashLength: 8
    });
  });

  test('should override default options', () => {
    const options = {
      match: /\.css$/,
      position: 'tail' as const,
      content: 'custom',
      injectHash: false,
      hashAlgorithm: 'md5',
      hashLength: 8
    };
    const plugin = new ContentInjectorWebpackPlugin(options);
    expect((plugin as any).options).toEqual(options);
  });

  test('should handle dynamic content generation', () => {
    const mockDate = new Date('2024-01-01').toLocaleString();
    const plugin = new ContentInjectorWebpackPlugin({
      content: () => `/* ${mockDate} */`
    });

    const result = (plugin as any).options.content();
    expect(result).toContain(mockDate);
  });

  test('should process js file with function content', () => {
    const plugin = new ContentInjectorWebpackPlugin({
      content: () => 'dynamic content'
    });

    compilation.assets['app.js'] = new sources.RawSource('original');
    plugin.apply(compiler);

    expect(compilation.assets['app.js']).toBeInstanceOf(sources.ConcatSource);
    expect(compilation.assets['app.js'].source()).toBe('dynamic contentoriginal');
  });

  test('should process js file with string content', () => {
    const plugin = new ContentInjectorWebpackPlugin({
      content: 'static content'
    });

    compilation.assets['app.js'] = new sources.RawSource('original');
    plugin.apply(compiler);

    expect(compilation.assets['app.js']).toBeInstanceOf(sources.ConcatSource);
    expect(compilation.assets['app.js'].source()).toBe('static contentoriginal');
  });

  test('should skip excluded file', () => {
    const plugin = new ContentInjectorWebpackPlugin({
      content: 'test',
      exclude: /vendor/
    });

    compilation.assets['vendor.js'] = new sources.RawSource('original');
    plugin.apply(compiler);

    expect(compilation.assets['vendor.js']).toBeInstanceOf(sources.RawSource);
    expect(compilation.assets['vendor.js'].source()).toBe('original');
  });

  test('should handle position correctly', () => {
    const headPlugin = new ContentInjectorWebpackPlugin({
      content: 'HEAD',
      position: 'head'
    });

    const tailPlugin = new ContentInjectorWebpackPlugin({
      content: 'TAIL',
      position: 'tail'
    });

    compilation.assets['test.js'] = new sources.RawSource('// original');

    headPlugin.apply(compiler);
    expect(compilation.assets['test.js'].source()).toBe('HEAD// original');

    tailPlugin.apply(compiler);
    expect(compilation.assets['test.js'].source()).toBe('HEAD// originalTAIL');
  });

  // 新增测试用例：测试 validateFilename 方法
  test('should validate filename with include and exclude', () => {
    const plugin = new ContentInjectorWebpackPlugin({
      content: 'test',
      include: /\.js$/,
      exclude: /vendor/
    });

    // 测试 include 匹配
    expect((plugin as any).validateFilename('app.js')).toBe(true);
    // 测试 exclude 匹配
    expect((plugin as any).validateFilename('vendor.js')).toBe(false);
    // 测试不匹配 include 的情况
    expect((plugin as any).validateFilename('app.css')).toBe(false);
  });

  // 新增测试用例：测试 matchCondition 方法
  test('should match condition with function, string, and regex', () => {
    const plugin = new ContentInjectorWebpackPlugin({
      content: 'test'
    });

    // 测试函数条件
    expect((plugin as any).matchCondition('test.js', (filename: string) => filename.endsWith('.js'))).toBe(true);
    // 测试字符串条件
    expect((plugin as any).matchCondition('test.js', '.js')).toBe(true);
    // 测试正则表达式条件
    expect((plugin as any).matchCondition('test.js', /\.js$/)).toBe(true);
    // 测试不匹配的情况
    expect((plugin as any).matchCondition('test.css', /\.js$/)).toBe(false);
  });

  // 新增测试用例：测试 matchCondition 方法中的无效条件
  test('should return false for invalid condition type', () => {
    const plugin = new ContentInjectorWebpackPlugin({
      content: 'test'
    });

    // 传入一个无效的 condition 参数（既不是函数、字符串，也不是正则表达式）
    const invalidCondition = 123; // 无效类型
    expect((plugin as any).matchCondition('test.js', invalidCondition as any)).toBe(false);
  });

  // 新增测试用例：测试 shouldProcessFile 方法
  test('should process text assets and skip source maps', () => {
    const plugin = new ContentInjectorWebpackPlugin({
      content: 'test'
    });

    // 测试文本文件
    expect((plugin as any).shouldProcessFile('app.js')).toBe(true);
    // 测试非文本文件
    expect((plugin as any).shouldProcessFile('app.png')).toBe(false);
    // 测试 source map 文件
    expect((plugin as any).shouldProcessFile('app.js.map')).toBe(false);
  });

  test('should handle zero length (edge case)', () => {
    const plugin = new ContentInjectorWebpackPlugin({
      content: (hash) => `/* HASH: ${hash} */`,
      injectHash: true,
      hashLength: 0
    });

    compilation.assets['zero.js'] = new sources.RawSource('content');
    plugin.apply(compiler);

    const result = compilation.assets['zero.js'].source();
    expect(result).toBe('/* HASH:  */content');
  });

  test('should handle hash injection', () => {
    const plugin = new ContentInjectorWebpackPlugin({
      content: (hash) => `/* HASH: ${hash} */`,
      injectHash: true,
      hashAlgorithm: 'md5',
      hashLength: 8
    });

    compilation.assets['hashed.js'] = new sources.RawSource('content');
    plugin.apply(compiler);

    const result = compilation.assets['hashed.js'].source();
    expect(result).toMatch(/^\/\* HASH: [a-f0-9]{8} \*\//);
    expect(result).toContain('content');
  });
});