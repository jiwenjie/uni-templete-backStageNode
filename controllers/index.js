/*
 * @Author: jiwenjie5 
 * @Date: 2021-04-Th 01:55:35 
 * @Last Modified by:   jiwenjie5 
 * @Last Modified time: 2021-04-Th 01:55:35 
 * api 接口，针对全局，返回 html，不过此处不使用
 */
/** 这里需要 nunjucks 插件，专门用来处理生成渲染 html 文件 */
module.exports = {
    'GET /': async (ctx, next) => {
        ctx.render('index.html');
    }
};
