var Crawler = require("crawler");
var fs = require("fs");
var colors = require("colors");



const host = 'http://images.lancaier.com/';
const filePath = '/Users/qiu/pictures/yrzx/'

var downloadImgC = new Crawler({
    maxConnections : 2,
    rateLimit: 5000,
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

var c = new Crawler({
    maxConnections : 1,
    rateLimit: 10000,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.error(error);
        }else{
          try {
            // 网站为了防爬，通过闭包中 eval 执行 一段 一定规则的正则替换生成图片相关信息，对外暴露 cInfo 全局变量，然后通过 core.js去解析，再去请求真实图片，替换loading动画。
            const $ = res.$;
            const script = $('#pager').parent().siblings('script')[0].children[0].data.match(/eval.*/)[0];
            eval(script);

            const imgs = cInfo.fs
            const picName = $("title").text().split('-')[0];
            // const pageNumOfUi = [].slice.call($('#pager a')
            //                 .map(item => Number(item.text))
            //                 .filter(item => !isNaN(item)))
            //                 .reverse();
            // const picCountOfPage = pageNumOfUi.length ? pageNumOfUi[0] : 0;
            //
            // const picSrc = $('table img')[0].src;
            // if(!picSrc) throw `${$('table img')},图片不存在`
            // let picUrlIndex = picSrc.match(/\/(\d+).jpg/)[1];
            //
            // picUrlIndex = Number(picUrlIndex)
            //
            // if(isNaN(picUrlIndex)) throw `图片地址后缀不是数字`

            imgs.forEach((item, index)=>{
              const matchList = item.match(/\/(\d+).jpg/)
              if(!matchList || isNaN(Number(matchList[1]))) return
              var img = { fileName: `${filePath}${picName}-${index + 1}.jpg`, uri: `${host}${item}`}

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

// 网站URL 259后缀 对应 235话，我看到 235，所以就从这边开始了
for(let i = 259; i < 303; i++ ){
  const index = `0${i}`
  c.queue([{
      uri: `http://www.57mh.com/27885/${index}.html`,
      jQuery: true
  }]);
}
