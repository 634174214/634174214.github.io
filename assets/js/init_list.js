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

    var setRecommendsList = function () {
        var $detailNewsList = $('#detail-news-recommends').eq(0);
        var $listUl = $detailNewsList.find('.list-a').eq(0);
        var $loading = $detailNewsList.find('.list-loading').eq(0);
        var $nolist = $detailNewsList.find('.no-list').eq(0);

        console.log($detailNewsList)

        var apiurl = window.IS_GITHUB_PAGES
            ? '/public/api/recommends/recommends.json'
            : '/api/blog/recommends';

        var baseurl = {
            article: '/blog/articles',
            list: '/blog/list'
        };

        function listAItemTpl(item) {
            var preview = '';
            if (item.preview) {
                preview = `
                    <a href="${baseurl.article}/${item.id}" class="imgbox">
                        <div class="inner-box">
                            <img src="${item.preview}">
                        </div>
                    </a>
                `;
            }
            textbox = `
                <div class="textbox">
                    <div class="channel-label smaller">
                        <a href="${baseurl.list}/${item.short}">${item.channel_name}</a>
                    </div>
                    <h3><a href="${baseurl.article}/${item.id}" title="${item.title}">${item.title}</a></h3>
                    <p>${item.desc}</p>
                    <div class="info">
                                <span class="readnum">
                                    <i class="icon fa fa-eye"></i>
                                    <em>${item.readnum}次阅读</em>
                                </span>
                        <span class="goodnum">
                                    <i class="icon fa fa-thumbs-o-up"></i>
                                    <em>${item.goodnum}人点赞</em>
                                </span>
                        <span class="date">
                                    <i class="icon fa fa-clock-o"></i>
                                    <em>发布时间: ${item.date}</em>
                                </span>
                        <a href="${baseurl.article}/${item.id}" class="go">
                            立即查看<i class="icon fa fa-chevron-circle-right"></i>
                        </a>
                    </div>
                </div>
            `;
            return '<li>' + preview + textbox + '</li>';
        }

        $.ajax({
            url: apiurl,
            dataType: 'json',
            type: 'GET',
            success: function (res) {
                // console.log(res.data)
                if (res.data.length <= 0) {
                    $loading.hide();
                    $nolist.show();
                    $listUl.hide();
                } else {
                    var liststr = '';
                    $.each(res.data, function (index, item) {
                        var itemstr = listAItemTpl(item);
                        liststr += itemstr;
                    });
                    $loading.hide();
                    $listUl.append($(liststr));
                }
            },
            error: function () {
                $loading.hide();
                $nolist.show();
                $listUl.hide();
            }
        })
    };
    setRecommendsList();
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