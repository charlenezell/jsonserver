const jsonServer = require('json-server');
const server = jsonServer.create();
var proxy = require('http-proxy-middleware');
var hpj = require("node-http-proxy-json");
var hpjp = require("./modifyjsonp.js");
let createDBObject = require("./db.js");
var router = jsonServer.router(createDBObject());
var typeis = require('type-is');

server.use('/hs', proxy({
    target: 'http://www.hushuoapp.com',
    changeOrigin: true,
    pathRewrite: {
        '^/hs': ''
    },
    onProxyRes: function (proxyRes, req, res) {
        if (typeis(proxyRes, ['application/json'])) {
            hpj(res, proxyRes.headers['content-encoding'], (body) => {
                if (body) {
                    body.aaa = "zellinject"
                }
                return body;
            })
        } else if (typeis(proxyRes, ['html'])) {
            console.log("html")
        } else if (typeis(proxyRes, ['application/javascript'])) {
            hpjp(req,res, proxyRes.headers['content-encoding'], (body) => {
                if (body) {
                    body.aaa = "荆防颗粒大房间打开撒浪费的健康酸辣粉就到时卡拉夫大家撒浪费电视剧啊理发店几十块拉夫点击萨克拉发就到时卡拉夫近段时间发的快乐撒减肥的快乐撒附近的斯科拉法经典款酸辣粉就到时卡拉夫就到时卡拉夫点击萨克拉发大家看了三分点击萨克拉发的健康酸辣粉就到时卡拉夫就打开了萨芬就打开了萨芬大家快来撒发的健康绿山咖啡就到时卡拉夫点击萨克拉"
                }
                return body;
            })
        }
    }
}));

server.use('/my', proxy({
    target: 'http://my.100bt.com',
    changeOrigin: true,
    pathRewrite: {
        '^/my': ''
    }
}));

server.use('/account', proxy({
    target: 'http://account.100bt.com',
    changeOrigin: true,
    pathRewrite: {
        '^/account': ''
    }
}));
server.use('/service', proxy({
    target: 'http://service.100bt.com',
    changeOrigin: true,
    pathRewrite: {
        '^/service': ''
    },
    onProxyRes: function (proxyRes, req, res) {
        if (typeis(proxyRes, ['application/json'])) {
            hpj(res, proxyRes.headers['content-encoding'], (body) => {
                if (body) {
                    body.aaa = "zellinject"
                }
                return body;
            })
        } else if (typeis(proxyRes, ['html'])) {
            console.log("html")
        } else if (typeis(proxyRes, ['application/javascript'])) {
            delete proxyRes.headers['content-length'];
            hpjp(req,res, proxyRes.headers['content-encoding'], (body) => {
                if (body) {
                    body.aaa = "荆防颗粒大房间打开撒浪费的健康酸辣粉就到时卡拉夫大家撒浪费电视剧啊理发店几十块拉夫点击萨克拉发就到时卡拉夫近段时间发的快乐撒减肥的快乐撒附近的斯科拉法经典款酸辣粉就到时卡拉夫就到时卡拉夫点击萨克拉发大家看了三分点击萨克拉发的健康酸辣粉就到时卡拉夫就打开了萨芬就打开了萨芬大家快来撒发的健康绿山咖啡就到时卡拉夫点击萨克拉"
                }
                return body;
            })
        }
    }
}));

server.use(router);

server.listen(3100);