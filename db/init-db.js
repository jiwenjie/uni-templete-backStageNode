/*
 * @Author: jiwenjie5 
 * @Date: 2021-04-Th 01:57:32 
 * @Last Modified by:   jiwenjie5 
 * @Last Modified time: 2021-04-Th 01:57:32 
 * 初始化数据库
 */
require('babel-core/register')({
    presets: ['stage-3']
});

const model = require('./model.js');
model.sync();

console.log('init db ok.');
process.exit(0);
