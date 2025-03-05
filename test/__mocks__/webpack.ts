const mockSources = {
  RawSource: class {
    constructor(public s: string) {}
    source() {
      return this.s;
    }
    size() {
      return this.s.length;
    }
    map() {
      return null;
    }
    sourceAndMap() {
      return { source: this.source(), map: null };
    }
    updateHash(hash: any) {
      hash.update(this.source());
    }
    buffer() {
      return Buffer.from(this.source());
    }
  },
  ConcatSource: class {
    constructor(public pre: string, public s: string) {}
    source() {
      return this.pre + this.s;
    }
    size() {
      return this.pre.length + this.s.length;
    }
    map() {
      return null;
    }
    sourceAndMap() {
      return { source: this.source(), map: null };
    }
    updateHash(hash: any) {
      hash.update(this.source());
    }
    buffer() {
      return Buffer.from(this.source());
    }
  }
};

const mockCompilation = {
  assets: {},
  hooks: {
    emit: {
      tapAsync: jest.fn()
    }
  },
  createCompilation: jest.fn(() => mockCompilation)
};

const mockCompiler = {
  hooks: {
    emit: {
      tapAsync: (name: string, callback: Function) => {
        callback(mockCompilation, () => {});
      }
    }
  },
  createCompilation: jest.fn(() => mockCompilation)
};

module.exports = {
  sources: mockSources,
  Compiler: jest.fn(() => mockCompiler),
  Compilation: mockCompilation
};