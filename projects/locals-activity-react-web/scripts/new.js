const fs = require('fs');
const paths = require('../config/paths');
const yargs = require('yargs');
const argv = yargs.argv;
const [ ACTIVITY_NAME ] = argv._

if (fs.existsSync(paths.activityIndexJs)) {
  console.log('活动名称已存在!')
  process.exit();
}

if (!ACTIVITY_NAME) {
  console.log('请输入活动名称')
  process.exit()
}

fs.mkdirSync(paths.activityPath, '0777');
fs.writeFileSync(`${paths.activityPath}/deploy.json`, deployJsonTemplate(), err => {
  if (err) throw err;
})
fs.writeFileSync(paths.activityIndexJs, getTemplate(), err => {
  if (err) throw err;
})

console.log('文件生产成功!')

function getTemplate() {
  return `import React from 'react'

class App extends React.Component {
  render() {
    return (
      <div>活动名称:${ACTIVITY_NAME}</div>
    )
  }
}

export default App
  `
}

function deployJsonTemplate() {
  return `{
  "activity_id": ""
}`
}