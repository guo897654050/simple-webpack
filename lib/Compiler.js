const path = require('path');
const fs = require('fs');
// 用于构建抽象语法树
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const ejs = require('ejs');

const { SyncHook } = require('tapable');


class Compiler {
  constructor(config) {
    this.config = config;
    this.entry = config.entry;
    this.root = process.cwd();
    this.modules = {};

    // loader
    this.rules = config.module.rules;

    // plugin钩子阶段
    this.hooks = {
      compiler: new SyncHook(),
      afterCompiler: new SyncHook(),
      emit: new SyncHook(),
      afterEmit: new SyncHook(),
      done: new SyncHook()
    }
  }

  getSource(path) {
    const source = fs.readFileSync(path, 'utf-8');
    return source;
  }

  depAnalyse(modulePath) {
    let source = this.getSource(modulePath);
    // loader处理
    const handleLoader = (loaderPath, obj) => {
      let loaderFn = require(path.resolve(`loader/${loaderPath}`));
      source = loaderFn.call(obj, source);
    }

    for (let i = this.rules.length - 1; i >= 0; i--) {
      const { test, use } = this.rules[i];
      // 验证后缀
      if (test.test(modulePath)) {
        if (typeof use === String) {
          handleLoader(use)
        } else if (Array.isArray(use)) {
          for (let loader = use.length - 1; loader >= 0; loader--) {
            handleLoader(use[loader]);
          }
        } else {
          // 处理是对象的情况
          handleLoader(use['loader'], { query: use.options })
        }
      }
    }

    let ast = babelParser.parse(source);
    // 存储依赖
    let dep = [];
    traverse(ast, {
      CallExpression(p) {
        if (p.node.callee.name === 'require') {
          p.node.callee.name = '__webpack_require__';
          let oldPath = p.node.arguments[0].value;
          let newPath = `./${path.join('src', oldPath)}`
          p.node.arguments[0].value = newPath;
          dep.push(newPath);
        }
      }
    })

    const code = generator(ast).code;

    let relativePath = `./${path.relative(this.root, modulePath)}`;
    this.modules[relativePath] = code;

    // console.log('依赖项', dep)

    dep.forEach((dep) => {
      this.depAnalyse(path.resolve(this.root, dep));
    })
  }

  emitFile() {
    let sourceFile = this.getSource(path.join(this.root, 'template/output.ejs'));
    let result = ejs.render(sourceFile, {
      entry: this.entry,
      modules: this.modules
    })
    fs.mkdir(this.config.output.path, () => {
      fs.writeFileSync(path.join(this.config.output.path, this.config.output.filename), result);
    });
  }

  start() {
    this.depAnalyse(path.resolve(this.root, this.entry));
    this.emitFile();
  }
}

module.exports = Compiler