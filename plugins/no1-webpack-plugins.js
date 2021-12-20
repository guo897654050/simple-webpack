// 1.明确插件的调用，是否需要传递参数。
// 2.创建一个构造函数，以此确保创建一个插件实例。
// 3. 在构造函数上顶一个apply方法，并在其中利用compiler.plugin

class No1WebpackPlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    compiler.hooks.done.tap('No1', () => {
      console.log(this.options.msg)
    })
  }
}

module.exports = No1WebpackPlugin;