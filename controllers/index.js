/** 这里需要 nunjucks 插件，专门用来处理生成渲染 html 文件 */
module.exports = {
    'GET /': async (ctx, next) => {
        ctx.render('index.html');
    }
};
