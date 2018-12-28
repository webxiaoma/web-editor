module.exports = {
    dev:{   // development
        assetsSubDir: 'static',
        assetsPublicPath: '',
        proxyTable: {},

        host: 'localhost',
        port: 9092,
        openBrowser: true, 
    },
    build:{  // production
       assetsRoot:'./dist',  // 打包目录
       assetsSubDir: 'static',
       assetsPublicPath:''  // 公共路径
    }
}