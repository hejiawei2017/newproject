class CopyrightWebpackPlugin {
   
   //webpack会自动调用类里面的apply 方法 compiler是webpack的实例
   //hooks 是webpack上面的钩子、
   //hooks 后面的时刻如果是同步的就有tap，异步的就有tapAsync方法
   //compilation 是这次打包的内容
	apply(compiler) {
      // 同步  打包完成时刻
		compiler.hooks.compile.tap('CopyrightWebpackPlugin', (compilation) => {
			console.log('compiler');
		})
        // 异步  hooks.emit 表示打包结束，把代码放到dist之前
		compiler.hooks.emit.tapAsync('CopyrightWebpackPlugin', (compilation, cb) => {
			
			//在打包代码中添加一个问题件内容是source
			compilation.assets['copyright.txt']= {
				source: function() { 
					return 'copyright by hello'
				},
				//文件的长度
				size: function() {
					return 18;
				}
			};
			//异步的话就要执行cb
			cb();
		})
	}

}

module.exports = CopyrightWebpackPlugin;