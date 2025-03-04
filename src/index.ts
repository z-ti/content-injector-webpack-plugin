import { Compiler, Compilation, sources } from 'webpack';

interface PluginOptions {
  match?: RegExp | ((filename: string) => boolean);
  include?: RegExp | string | ((filename: string) => boolean);
  exclude?: RegExp | string | ((filename: string) => boolean);
  position?: 'head' | 'tail';
  content: string | (() => string);
}

class WebpackBannerPlugin {
  private options: PluginOptions;

  constructor(options: PluginOptions) {
    this.options = {
      match: /\.js$/,
      position: 'head',
      ...options,
    };
  }

  apply(compiler: Compiler) {
    compiler.hooks.emit.tapAsync(
      'WebpackBannerPlugin',
      (compilation: Compilation, callback: () => void) => {
        const bannerContent = typeof this.options.content === 'function'
          ? this.options.content()
          : this.options.content;

        Object.keys(compilation.assets).forEach((filename) => {
          if (
            this.shouldProcessFile(filename) &&
            this.validateFilename(filename)
          ) {
            const asset = compilation.assets[filename];
            const originalSource = asset.source().toString();

            const newSource = this.options.position === 'head'
              ? new sources.ConcatSource(bannerContent, originalSource)
              : new sources.ConcatSource(originalSource, bannerContent);

            compilation.assets[filename] = newSource;
          }
        });

        callback();
      }
    );
  }

  private validateFilename(filename: string): boolean {
    const { include, exclude } = this.options;

    if (exclude && this.matchCondition(filename, exclude)) {
      return false;
    }

    if (include) {
      return this.matchCondition(filename, include);
    }

    return this.matchCondition(filename, this.options.match!);
  }

  private matchCondition(
    filename: string,
    condition: RegExp | string | ((filename: string) => boolean)
  ): boolean {
    if (typeof condition === 'function') {
      return condition(filename);
    }

    if (typeof condition === 'string') {
      return filename.includes(condition);
    }

    if (condition instanceof RegExp) {
      return condition.test(filename);
    }

    return false;
  }

  private shouldProcessFile(filename: string): boolean {
    const isTextAsset = /\.(js|css|txt|html?|xml|json|svg)$/i.test(filename);
    return isTextAsset && !/\.map$/.test(filename);
  }
}

export default WebpackBannerPlugin;
