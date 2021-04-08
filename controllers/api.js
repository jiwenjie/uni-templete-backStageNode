/*
 * @Author: jiwenjie5 
 * @Date: 2021-04-Th 01:55:21 
 * @Last Modified by:   jiwenjie5 
 * @Last Modified time: 2021-04-Th 01:55:21 
 * api 接口
 */
const products = require('../other/products');
const APIError = require('../utils/rest').APIError;

const model = require('../model');

let User = model.User;

// 这里的接口具体实现需要连接数据库查询数据
module.exports = {
    'GET /api/products': async (ctx, next) => {
        ctx.rest({
            products: products.getProducts()
        });
    },

    'POST /api/products': async (ctx, next) => {
        var p = products.createProduct(ctx.request.body.name, ctx.request.body.manufacturer, parseFloat(ctx.request.body.price));
        ctx.rest(p);
    },

    'DELETE /api/products/:id': async (ctx, next) => {
        console.log(`delete product ${ctx.params.id}...`);
        var p = products.deleteProduct(ctx.params.id);
        if (p) {
            ctx.rest(p);
        } else {
            throw new APIError('product:not_found', 'product not found by id.');
        }
    },
    
    // 测试接口
    'GET /api/test': async (ctx, next) => {
        var user = await User.create({
            phone: "15625364758",
            name: 'John',
            gender: false,
            // email: 'john-' + Date.now() + '@garfield.pet',
            passwd: 'hahaha'
        });
            console.log('created: ' + JSON.stringify(user));
        ctx.rest({
            user: user
        });
    },
};
