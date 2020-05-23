let proxyObj = {};
proxyObj['/ws']={
    ws:true,
    target:"ws://localhost:8081"//以websocket协议转发；
}
proxyObj['/'] = {
    ws: false,
    target: 'http://localhost:8081',
    changeOrigin: true,
    pathRewrite: {
        '^/': ''
    }

}

module.exports={
    devServer:{
        host:'localhost',
        port:8080,
        proxy:proxyObj
    }
}

