/** 接口请求封装部分代码，对响应体进行了封装，包括基本的数据返回结构和报错的展示 */
module.exports = {
    APIError: function (code, message) {
        this.code = code || 'internal:unknown_error';
        this.message = message || '';
    },

    // 接口请求封装，设置接口返回公共展示类型
    restify: (pathPrefix) => {
        pathPrefix = pathPrefix || '/api/';
        return async (ctx, next) => {
            if (ctx.request.path.startsWith(pathPrefix)) {
                console.log(`Process API ${ctx.request.method} ${ctx.request.url}...`);
                ctx.rest = (data) => {
                    ctx.response.type = 'application/json';
                    ctx.response.body = data;
                }
                try {
                    await next();
                } catch (e) {
                    console.log('Process API error...');
                    ctx.response.status = 400;
                    ctx.response.type = 'application/json';
                    ctx.response.body = {
                        code: e.code || 'internal:unknown_error',
                        message: e.message || ''
                    };
                }
            } else {
                await next();
            }
        };
    }
};
