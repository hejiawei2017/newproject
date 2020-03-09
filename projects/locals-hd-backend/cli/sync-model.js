'use strict';

const path = require('path');
const fs = require('fs');
const { promisify } = require('es6-promisify');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);

const modelPath = path.resolve(__dirname, '../app/model');

async function main() {
  console.log('start');
  const basePath = path.resolve(__dirname, '../app/model-define');
  const dirs = await readdir(basePath);

  function copy(d, p) {
    d.forEach(async childRend => {
      try {
        const currentPath = path.resolve(p, childRend);
        const currentStat = await stat(currentPath);
        if (currentStat.isDirectory()) {
          // TODO:
          copy(await readdir(currentPath), currentPath);
          return;
        }
        const dirName = path.basename(p);
        const fileName = childRend;

        const currentModelPath = path.resolve(modelPath, dirName);
        const existDir = fs.existsSync(currentModelPath);
        if (!existDir) {
          fs.mkdirSync(currentModelPath);
        }

        const code = `
        module.exports = app => {
          return require('../../model-define/${dirName}/${fileName}')(
            app.${dirName.replace('locals', 'model')},
            app.Sequelize
          );
        };
        `;

        if (/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(fileName)) {
          console.log('TCL: copy -> fileName', fileName);
          return;
        }

        if (fileName.includes('bak')) {
          return;
        }

        const filePath = path.resolve(currentModelPath, fileName);
        if (fs.existsSync(path.resolve(currentModelPath, fileName))) {
          console.info('文件已存在:', filePath);
          return;
        }
        fs.writeFileSync(filePath, code, 'utf8');
      } catch (error) {
        console.log('TCL: }catch -> error', error);
      }
    });
  }

  copy(dirs, basePath);
}

main();
