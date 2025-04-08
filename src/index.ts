import { Compiler, Compilation, sources } from 'webpack';
import { createHash } from 'crypto';

interface PluginOptions {
  match?: RegExp | ((filename: string) => boolean);
  include?: RegExp | string | ((filename: string) => boolean);
  exclude?: RegExp | string | ((filename: string) => boolean);
  position?: 'head' | 'tail';
  content: string | (() => string) | ((hash: string) => string);
  injectHash?: boolean;
  hashAlgorithm?: string;
  hashLength?: number;
}

class ContentInjectorWebpackPlugin {
  private options: PluginOptions;

  constructor(options: PluginOptions) {
    this.options = {
      match: /\.js$/,
      position: 'head',
      injectHash: false,
      hashAlgorithm: 'md5',
      hashLength: 8,
      ...options,
    };
  }

  apply(compiler: Compiler) {
    compiler.hooks.emit.tapAsync(
      'ContentInjectorWebpackPlugin',
      (compilation: Compilation, callback: () => void) => {
        Object.keys(compilation.assets).forEach((filename) => {
          if (
            this.shouldProcessFile(filename) &&
            this.validateFilename(filename)
          ) {
            const asset = compilation.assets[filename];
            const originalSource = asset.source().toString();
            
            const fileHash = this.options.injectHash 
              ? this.getFileHash(originalSource)
              : '';

            let bannerContent: string;
            if (typeof this.options.content === 'function') {
              bannerContent = this.options.injectHash
                ? (this.options.content as (hash: string) => string)(fileHash)
                : (this.options.content as () => string)();
            } else {
              bannerContent = this.options.content;
            }
            const newSource =
              this.options.position === 'head'
                ? new sources.ConcatSource(bannerContent, originalSource)
                : new sources.ConcatSource(originalSource, bannerContent);
            compilation.assets[filename] = newSource;
          }
        });

        callback();
      }
    );
  }

  private getFileHash(content: string): string {
    const hash = createHash(this.options.hashAlgorithm!)
      .update(content)
      .digest('hex');
    return this.options.hashLength 
      ? hash.substring(0, this.options.hashLength)
      : '';
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

export default ContentInjectorWebpackPlugin;
