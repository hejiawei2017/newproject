import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'lib-flexible';

moment.locale('zh-cn');
// 获取环境变量的活动名称, 由于import是静态执行，所以不能使用表达式和变量
// import App from './abc/index';
const { default: App } = require(`./pages/${process.env.ACTIVITY_NAME}/index`);

ReactDOM.render(<App />, document.getElementById('root'));
