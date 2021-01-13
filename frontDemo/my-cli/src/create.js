const axios = require('axios');
const ora = require('ora');
const Inquirer = require('inquirer');

//把不是promise形式的函数转换成promise形式
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
let downloadGitReop = require('download-git-repo');
downloadGitReop = promisify(downloadGitReop);
const { downloadDirectory } = require('./constants');

let ncp = require('ncp');
ncp = promisify(ncp);


const MetalSmith = require('metalsmith'); // 遍历文件夹
let { render } = require('consolidate').ejs;
render = promisify(render); // 包装渲染方法

// 1).获取仓库列表
const fetchRepoList = async () => {
    // 获取当前组织中的所有仓库信息,这个仓库中存放的都是项目模板
    const { data } = await axios.get('https://api.github.com/orgs/suyuan-cli/repos');
    return data;
};

// 抓取tag列表
const fechTagList = async (repo) => {
    const { data } = await axios.get(`https://api.github.com/repos/suyuan-cli/${repo}/tags`);
    return data;
};

// 封装loading效果
const waitFnloading = (fn, message) => async (...args) => {
    const spinner = ora(message);
    spinner.start();
    const result = await fn(...args);
    spinner.succeed();
    return result;
};
//下载函数
const download = async (repo, tag) => {
    let api = `suyuan-cli/${repo}`;
    if (tag) {
        api += `#${tag}`;
    }
    // /user/xxxx/.template/repo
    const dest = `${downloadDirectory}/${repo}`;
    await downloadGitReop(api, dest);
    return dest; // 下载的最终目录
};
module.exports = async (projectName) => {
    // 1) 获取项目的模板 （所有的）
    let repos = await waitFnloading(fetchRepoList, 'fetching template ....')();
    // 选择模板
    repos = repos.map((item) => `${item.name}:${item.description}`);
    const { repo } = await Inquirer.prompt({
        name: 'repo',
        type: 'list',
        message: '请选择项目模板：',
        choices: repos, // 选择模式
    });
    //得到模板名称
    let tempName = repo.split(":")[0]

    //用模板名称加载tags
    let tags = await waitFnloading(fechTagList, 'fetching tags ....')(tempName);
    tags = tags.map((item) => item.name);

    //选择tags
    const { tag } = await Inquirer.prompt({
        name: 'tag', // 获取选择后的结果
        type: 'list',
        message: '请选择版本号',
        choices: tags,
    });
    //根据模板名称和tags下载模板
    // download-git-repo
    const result = await waitFnloading(download, 'download template')(tempName, tag);
    //如果项目模板中没有ask.js，就直接copy项目到当前的运行目里面
    if (!fs.existsSync(path.join(result, 'ask.js'))) {
        await ncp(result, path.resolve(projectName));
        console.log("cd " + projectName + " and run npm install")
    } else {
        //同步执行
        await new Promise((resovle, reject) => {
            MetalSmith(__dirname)
                .source(result) // 遍历下载的目录
                .destination(path.join(path.resolve(), projectName)) // 输出渲染后的结果
                .use(async (files, metal, done) => {
                    //弹框询问用户
                    const args = require(path.join(result, 'ask.js'));
                    const obj = await Inquirer.prompt(args);
                    const meta = metal.metadata();
                    Object.assign(meta, obj);
                    delete files['ask.js'];
                    done();
                })
                .use((files, metal, done) => {
                    //遍历每个文件判断如果有<% 就用ejs模板替换变量
                    Reflect.ownKeys(files).forEach(async (file) => {
                        let content = files[file].contents.toString(); // 获取文件中的内容
                        if (file.includes('.js') || file.includes('.json') || file.includes('.vue')) { // 如果是js或者json,vue才有可能是模板
                            if (content.includes('<%')) { // 文件中用<% 我才需要编译
                                content = await render(content, metal.metadata()); // 用数据渲染模板
                                files[file].contents = Buffer.from(content); // 渲染好的结果替换即可
                            }
                        }
                    });
                    done();
                })
                .build((err) => { // 执行中间件
                    if (!err) {
                        resovle();
                        console.log("cd " + projectName + " and run npm install")
                    } else {
                        reject();
                    }
                });
        });
    }


};