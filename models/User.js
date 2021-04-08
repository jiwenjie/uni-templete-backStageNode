/*
 * @Author: jiwenjie5 
 * @Date: 2021-04-Th 11:18:38 
 * @Last Modified by:   jiwenjie5 
 * @Last Modified time: 2021-04-Th 11:18:38 
 * 
 */
const db = require('../db/db');

module.exports = db.defineModel('users', {
    phone: {
        type: db.STRING(20),       // string 类型
        unique: true    // 唯一性校验
    },
    // email: {
    //     type: db.STRING(100),
    //     unique: true    // 唯一性校验
    // },
    passwd: db.STRING(100),
    name: db.STRING(100),
});
