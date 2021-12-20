#! /usr/bin/env node

const path = require('path');
const config = require(path.resolve('webpack.config.js'));
const Compiler = require(path.resolve('lib/Compiler.js'));
//启动编译
new Compiler(config).start();
