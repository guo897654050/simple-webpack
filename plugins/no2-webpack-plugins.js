class No2WebpackPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.compiler.tap('no2', () => {
      console.log('compiler')
    })
    compiler.hooks.done.tap('no2', () => {
      console.log('pack is ok!')
    })
  }
}

module.exports = No2WebpackPlugin;