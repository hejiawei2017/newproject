const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');

const moduleAnalyser = (filename) => {
	//读取对应文件的内容
	const content = fs.readFileSync(filename, 'utf-8');
	//把内容变成ast语法树
	const ast = parser.parse(content, {
		sourceType: 'module'
	});
	//收集node节点上面的路径依赖关系
	const dependencies = {};
	traverse(ast, {
		ImportDeclaration({ node }) {
			const dirname = path.dirname(filename);
			const newFile = './' + path.join(dirname, node.source.value);
			dependencies[node.source.value] = newFile;
		}
	});
	//把ast转换成可执行文件代码
	const { code } = babel.transformFromAst(ast, null, {
		presets: ["@babel/preset-env"]
	});
	//放回带入口文件，依赖关系和执行代码的对象
	return {
		filename,
		dependencies,
		code
	}
}

const makeDependenciesGraph = (entry) => {
	const entryModule = moduleAnalyser(entry);
	const graphArray = [ entryModule ];
	for(let i = 0; i < graphArray.length; i++) {
		const item = graphArray[i];
		const { dependencies } = item;
		if(dependencies) {//递归依赖关系对象，生成依赖关系数数组
			for(let j in dependencies) {
				graphArray.push(
					moduleAnalyser(dependencies[j])
				);
			}
		}
	}
	const graph = {};
	graphArray.forEach(item => {
		graph[item.filename] = {
			dependencies: item.dependencies,
			code: item.code
		}
	});
	return graph;
}

// 最终生成的代码
const generateCode = (entry) => {
	const graph = JSON.stringify(makeDependenciesGraph(entry));
	return `
		(function(graph){
			function require(module) { 
				function localRequire(relativePath) {
					return require(graph[module].dependencies[relativePath]);
				}
				var exports = {};
				(function(require, exports, code){
					eval(code)
				})(localRequire, exports, graph[module].code);
				return exports;
			};
			require('${entry}')
		})(${graph});
	`;
}

const code = generateCode('./src/index.js');
console.log(code);

