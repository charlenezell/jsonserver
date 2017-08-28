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
                    body.aaa = "zellinject"
                }
                return body;
            })
        }
    }
}));

// server.use('/www', proxy({
//     target: 'http://www.100bt.com',
//     changeOrigin: true,
//     pathRewrite: {
//         '^/www': ''
//     }
// }));

// server.use('/my', proxy({
//     target: 'http://my.100bt.com',
//     changeOrigin: true,
//     pathRewrite: {
//         '^/my': ''
//     }
// }));

// server.use('/service', proxy({
//     target: 'http://service.100bt.com',
//     changeOrigin: true,
//     pathRewrite: {
//         '^/service': ''
//     }
// }));
// server.use('/service', proxy({
//     target: 'http://service.100bt.com',
//     changeOrigin: true,
//     pathRewrite: {
//         '^/service': ''
//     },
//     onProxyRes: function (proxyRes, req, res) {
//         res.writeHead = function(){
//             if( proxyRes.headers && proxyRes.headers[ 'content-length' ] ){
//                 res.setHeader(
//                     'content-length',
//                     parseInt( proxyRes.headers[ 'content-length' ], 10 ) + scriptElm.length
//                 );
//             }

//             // This disables chunked encoding
//             res.setHeader( 'transfer-encoding', '' );

//             // Disable cache for all http as well
//             res.setHeader( 'cache-control', 'no-cache' );

//             _writeHead.apply( this, arguments );
//         };
//         if (typeis(proxyRes, ['application/json'])) {
//             hpj(res, proxyRes.headers['content-encoding'], (body) => {
//                 if (body) {
//                     body.aaa = "zellinject"
//                 }
//                 return body;
//             })
//         } else if (typeis(proxyRes, ['html'])) {
//             console.log("html")
//         } else if (typeis(proxyRes, ['application/javascript'])) {

//             hpjp(req,res, proxyRes.headers['content-encoding'], (body) => {
//                 if (body) {
//                     body.aaa = "zellinject"
//                 }
//                 return body;
//             });

//         }
//     }
// }));

server.use(router);

server.listen(3100);