# spiderForBaoEr

## 大爱宝儿姐

《一人之下》挺好看，动漫没看爽，在线网站浏览漫画交互太烂（一话十几张，一张切一次网页，特费劲），为了方便就写直接下载到本地看了。

> 功能很简单，主要花时间在解析网页如何防爬的

### 主要依赖
 - crawler
 - colors
 - fs

### script

> 需要修改 开始值和结束值，文件存储路径。

- 网站一，只能下载到 284话

 ```
 npm run start
 ```

- 网站二，可以支持下载到 330话

```
 npm run start2
```

### 注意
- 开始值和漫画的章节数并不对应，但都是递增
- 并发和时间间隔修改到适当值，不然容易被封

```
maxConnections : 2
rateLimit: 5000
```
### 申明
- 代码仅供学习分享，禁止商业用途
