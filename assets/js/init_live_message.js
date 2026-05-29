// 基本的静态资源路径定义在html中，这里只是对其引用
var hasOutLineUrl = (typeof ASSETS_URL === 'undefined') ? false : true;
// 如果有就用外部路径没用就用本地的
var baseUrl = hasOutLineUrl ? ASSETS_URL : '/assets/';
var live_file = (jsfile === 'min') ? 'live-message.min.js' : 'live-message.js';

$LAB
.setOptions({
    CacheBust: true,
    BasePath: baseUrl //  设置资源请求的基本路径，可以是某个链接：http://lib.wubin.work/..
})
.script("libs/jquery-1.11.1.min.js").wait()
.script("libs/layer/layer.js").wait()
.script("libs/go-top.js").wait()
.script("libs/scrollfix.min.js").wait()
.script("libs/storage.js")
.script("js/public.js").wait()
.script('js/' + live_file);