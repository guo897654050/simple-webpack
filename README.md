# simple-webpack
### 实现一个简单的webpack
1. 可以先看一下原生的webpack打包后的文件的输出。我们要做的也是通过自己的方式，实现类似webpack打包后的输出。
2. 可以看到输出文件最终会读取一个对象。
```
  modules: {
    'filepath': code
  }
```
其中`filepath`代表了文件的相对路径,`code`为对应文件的代码。而其中webpack打包后的结果将`require`替换成了`__webpack__require__`。
3. webpack的loader其实是个`function`，其中通过正则匹配文件，然后输出，顺序从下到上，从右到左。
4. webpack的pliguns是一个`class`，因为我们每次都要`new  xxplugin`，而plugin涉及多个钩子，相应的`compiler.hooks`都是通过`tapable`这个库来做的。

#### 实现方式
1. 那么我们要做的就是把每个文件的`require`替换成`__webpack__require__`。思路是通过fs读取对应路径的file，然后通过`babelParse`将file解析为AST,通过`babel/traversal`遍历AST找到`require`对应的节点，替换为`__webpack__require__`。然后通过`bable/generator`将AST生成对应的code。每访问一个文件递归的将require的文件添加到依赖，执行替换操作。
2. 上一步将每个文件的`require`替换，接下来我们要做的是读取的文件输出。我们通过`ejs`这个库构造好对应的模板，同时将对应的`entry`和`modules`传入，通过`fs.writeFileSync`将其输出到dist目录。那么我们也就完成了基本的打包。
3. loader处理，由于loader本质是一个function，通过正则匹配文件，那么我们只需要将读取的文件即fs读取的文件作为入参传入到loader即可。
4. plugins，本质是一个class，涉及到多个钩子，在不用的钩子节点可以进行处理。具体参考`plugins`文件夹下的文件。

#### 执行
- `yarn`安装对应依赖。
- `npm link` 将bin目录的命令会映射到对应的node的`/bin`目录下，然后可以执行此命令。
- `simple-pack` 执行命令，查看输出。