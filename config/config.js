/*
 * @Author: jiwenjie5 
 * @Date: 2021-04-Th 11:19:45 
 * @Last Modified by:   jiwenjie5 
 * @Last Modified time: 2021-04-Th 11:19:45 
 * 配置文件入口
 */
// config files:
const defaultConfig = './config-db.js';
const overrideConfig = './config-override.js';
const testConfig = './config-test.js';

const fs = require('fs');

var config = null;

if (process.env.NODE_ENV === 'test') {
    console.log(`Load ${testConfig}...`);
    config = require(testConfig);
} else {
    console.log(`Load ${defaultConfig}...`);
    config = require(defaultConfig);
    try {
        if (fs.statSync(overrideConfig).isFile()) {
            console.log(`Load ${overrideConfig}...`);
            config = Object.assign(config, require(overrideConfig));
        }
    } catch (err) {
        console.log(`Cannot load ${overrideConfig}.`);
    }
}

module.exports = config;
