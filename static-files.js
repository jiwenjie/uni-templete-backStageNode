const path = require('path');
const mime = require('mime');
const fs = require('mz/fs');

// 读取静态文件方法，不过这里注意 mime.lookup 方法是哪个版本的，新版本中好像没了，如果使用需要查询文档更改替换
function staticFiles(url, dir) {
    return async (ctx, next) => {
        let rpath = ctx.request.path;
        if (rpath.startsWith(url)) {
            let fp = path.join(dir, rpath.substring(url.length));
            if (await fs.exists(fp)) {
                ctx.response.type = mime.lookup(rpath);
                ctx.response.body = await fs.readFile(fp);
            } else {
                ctx.response.status = 404;
            }
        } else {
            await next();
        }
    };
}

module.exports = staticFiles;
