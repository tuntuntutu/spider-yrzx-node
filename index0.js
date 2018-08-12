var Crawler = require("crawler");
var fs = require("fs");
var colors = require("colors");



const host = 'http://pic.fxdm.cc/tu/undefined/%E4%B8%80%E4%BA%BA%E4%B9%8B%E4%B8%8B';
// todo
const filePath = '/Users/qiu/pictures/284-330/'
const startIndex = 364684;
const endIndex = 364731;

var downloadImgC = new Crawler({
    maxConnections : 4,
    rateLimit: 2000,
    encoding:null,
    jQuery:false,// set false to suppress warning message.
    callback:function(err, res, done){
        if(err){
            console.log(err.stack.error);
        }else{
            fs.createWriteStream(res.options.fileName).write(res.body);
            console.log(`文件存储在${res.options.fileName}`.green)
        }

        done();
    }
});
 // downloadImgC.queue({"fileName": filePath + "一人之下235-16.jpg","uri":"http://img21.mtime.cn/CMS/Gallery/2011/07/02/170837.97014036_160X160.jpg"});

var c = new Crawler({
    maxConnections : 2,
    rateLimit: 4000,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error.red);
        }else{
          try {
            // 网站为了防爬，通过闭包中 eval 执行 一段 一定规则的正则替换生成图片相关信息，对外暴露 cInfo 全局变量，然后通过 core.js去解析，再去请求真实图片，替换loading动画。
            const $ = res.$;
            const script = $('.mtb4').siblings('script')[0].children[0].data;

            eval(script);

            console.log(cInfo.files)
            const imgs = cInfo.files;

            const picName = $("title").text().split(' ')[0].match(/\d+/)[0];


            imgs.forEach((item, index)=>{
              if(!item) return
              var img = { fileName: `${filePath}${picName}-${index + 1}.jpg`, uri: `${host}/${picName}/${item}`}

              console.log(`开始下载：${JSON.stringify(img)}`.green);

              downloadImgC.queue(img);
            })
          }catch(e){
            console.log(e.red)
          }
        }

        done();
    }
});

// 364730
for(let i = startIndex; i < endIndex; i++ ){
  const uri = `http://www.omanhua.com/comic/17521/${i}/`
  console.log(`发起请求：${uri}`.green);
  c.queue([{
      uri: uri,
      jQuery: true
  }]);
}
