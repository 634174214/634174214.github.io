// 基本的静态资源路径定义在html中，这里只是对其引用
var hasOutLineUrl = (typeof ASSETS_URL === 'undefined') ? false : true;
// 如果有就用外部路径没用就用本地的
var giteeUrl = hasOutLineUrl ? ASSETS_URL : '/assets/';
$LAB
  .script(giteeUrl + "libs/jquery-1.11.1.min.js").wait()
  .script(giteeUrl + "libs/layer/layer.js").wait()
  .script(giteeUrl + "libs/go-top.js").wait()
  .script(giteeUrl + "libs/scrollfix.min.js").wait()
  .script(giteeUrl + "libs/storage.js")
  .script(giteeUrl + "js/public.js").wait(function() {
    // 滚动固定
    support.ispc && $("#left-fixed-bar").scrollFix({
      // 距离顶部多少时开始fixed
      distanceTop: 80,
      // 当距离底部高度多少时 停止在那,可以是数值或者是JQ对象
      endPos: '#footer',
      // fix时候添加的类名
      baseClassName: 'left-bar-fixed'
  });
    // 搜索主页的时候的搜索
    var SearchIndex = function () {
        function search() {
            this.$el = $('#search-index');
            if (this.$el.length <= 0) {
                return;
            }
            this.$input = this.$el.find('.search-input').eq(0);
            this.searchUrl = '/search?s=';
            this.init();
        }
        search.prototype = {
            init: function () {
                var self = this;
                this.$el.on('click', '.search-btn', function () {
                    var search_text = self.$input.val();
                    if (search_text == '') {
                        layer.msg('搜索内容不能为空！', {
                            time: 2000,
                            anim: 6
                        });
                        return;
                    }
                    window.location.href = self.searchUrl + search_text;
                })
            }
        }
        return new search();
    }();
});