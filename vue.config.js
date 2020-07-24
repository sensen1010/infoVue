module.exports ={
    publicPath: './'
    ,
    devServer: {
        port: 8082, // 端口
        // proxyTable: {
        //              '/api': {
        //                   target: '192.168.1.52:8081',
        //                   changeOrigin: true,
        //                   pathRewrite: {
        //                     '^/api': '/' 
        //                   }
        //                 }
        //         },
    }
}