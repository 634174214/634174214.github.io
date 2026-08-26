(function ($) {
    var mySwiper = support.isIe ? null : new Swiper('#index-slider', {
        loop: true, // 循环模式选项
        autoplay: {
            delay: 4000,
            stopOnLastSlide: false,
            // 拖动后还会自动播放=false
            disableOnInteraction: false
        },
        // autoplay: false,
        // 如果需要分页器
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },

        // 如果需要前进后退按钮
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    // 博客导航滚动固定
    var AsideFixed = function () {
        var Fixed = function (el) {
            if (!support.ispc) {
                return;
            }
            this.$channel = $(el);
            this.offsetTop = Math.floor(this.$channel.offset().top);
        }
        Fixed.prototype = {
            init: function () {
                var self = this;
                this.offsetTop = this.offsetTop - 90;
                $(window).on('scroll', function () {
                    var scrollTop = $(this).scrollTop();
                    if (scrollTop >= self.offsetTop) {
                        self.$channel.addClass('fixed');
                    } else {
                        self.$channel.removeClass('fixed');
                    }
                });
            }
        }
        return Fixed;
    }();

    // 滚动到底部加载
    var Loadmore = function () {
        var More = function (obj) {

            // 如果在本地 并且链接里面有?github.io
            if (window.IS_GITHUB_PAGES &&
                window.IS_BLOG_LOCAL
            ) {
                this.server = '/public' + obj.server;
            } else {
                this.server = obj.server;
            }

            this.page = obj.pageStart;
            this.desc = !!obj.desc;
            this.id = obj.id;
            this.newsList = obj.newsList;
            this.init();
        };
        More.prototype = {
            // 用来储存元素
            el: {},
            screenHeight: $(window).height(),
            timer: 0,

            _insertNode: function () {
                this.el.icon = $('<i class="refresh-icon"></i>');
                this.el.label = $('<span class="refresh-label">向上拖动 加载更多</span>');
                this.el.refresh = $(this.id);
                this.el.list = $(this.newsList);
                this.el.refresh.append(this.el.icon).append(this.el.label);
            },

            // 检测是否在屏幕中
            _checkIn: function () {
                var rect = this.el.refresh[0].getBoundingClientRect();
                if (this.screenHeight > (Math.floor(rect.top) + 30)) {
                    return true;
                }
                return false;
            },

            // 等待加载
            _waiting: function () {
                var self = this;
                self.el.icon.addClass('loading');
                self.el.label.text('数据加载中，请稍后...');
                setTimeout(function () {
                    self._getNews();
                }, 1000);
            },

            // 将获取内容拼接成字符串
            _getResStr: function (list) {
                var liArr = [];
                $.each(list, function () {
                    liArr.push(this.html);
                });
                return liArr.join('');
            },

            _tpl: function (row) {
                var targetUrl = '/blog/articles/' + row.id;
                if (window.IS_GITHUB_PAGES) {
                    targetUrl += '/';
                }
                // console.log(row)
                var tpl = '<li class="ani">';
                if (row.preview) {
                    tpl += '<a href="' + targetUrl + '" target="_blank" class="imgbox">';
                    tpl += '<img src="' + row.preview + '">';
                    tpl += '</a>';
                }
                tpl += '<div class="content">';
                tpl += '<div class="info">';
                tpl += '<span class="date">' + row.date + '</span>';
                tpl += '<span class="channel">' + row.channel + '</span>';
                tpl += '</div>';
                tpl += '<a href="' + targetUrl + '" target="_blank" class="title">' + row.title + '</a>';
                tpl += '<p>' + row.desc + '</p>';
                tpl += '<div class="bot">';
                tpl += '<ul class="num">';
                // 这里需要判断推荐或者仅仅自己==1才是 等于0则不推荐 不仅自己看
                if (row.recommend == 1) {
                    tpl += '<li class="isrecommend"><i class="icon fa fa-star"></i>推荐</li>';
                }
                if (row.onlyme == 1) {
                    tpl += '<li class="isonlyme"><i class="icon fa fa-lock"></i>仅自己</li>';
                }
                tpl += '<li><i class="icon fa fa-eye"></i>' + row.readnum + '</li>';
                tpl += '<li><i class="icon fa fa-thumbs-o-up"></i>' + row.goodnum + '</li>';
                tpl += '<li><i class="icon fa fa-pencil-square-o"></i>' + row.author + '</li>';
                tpl += '</ul>';
                tpl += '<a href="' + targetUrl + '" target="_blank" class="go">立即查看<i class="icon fa fa-chevron-circle-right"></i></a>';
                tpl += '</div></div></li>';
                return tpl;
            },

            // 插入新闻
            _appendNews: function (data) {
                var finalHtml = '';
                var self = this;
                $.each(data, function (index, item) {
                    finalHtml = finalHtml + self._tpl(item);
                });
                this.el.list.append($(finalHtml));
                // 数据插入后再开启滚动事件
                this._scrolling();
                this._resetWait();
            },

            // 重置等待
            _resetWait: function () {
                this.el.icon.removeClass('loading');
                this.el.label.text('向上拖动 加载更多');
            },

            _loadEnd: function () {
                this.el.icon.removeClass('loading');
                this.el.label.text('抱歉，已经没有更多内容了');
                // 卸载滚动事件
                $(window).off('scroll.loadmore');
            },

            _sleep: function () {
                $(window).off('scroll.loadmore');
            },

            _getNews: function () {
                var self = this;
                // 静态站正序存储：从最后一页(最新)倒序向前加载，减到 0 即结束
                if (this.desc && this.page < 1) {
                    this._loadEnd();
                    return;
                }
                var url = this.server + this.page;
                if (window.IS_GITHUB_PAGES) {
                    url += '.json'
                }

                $.ajax({
                    url: url,
                    dataType: 'json',
                    type: 'GET',
                    // async: false, // 设为同步请求，避免多次触发时漏加载
                    success: function (res) {
                        if (res.error === 0 &&
                            res.data.length > 0
                        ) {
                            self._appendNews(res.data);
                            self.page = self.desc ? self.page - 1 : self.page + 1;
                        } else {
                            // 代表没有数据了
                            self._loadEnd();
                        }
                    },
                    error: function () {
                        console.log('数据获取失败');
                        if (self.desc) {
                            self._loadEnd();
                        }
                    }
                });
            },

            _scrolling: function () {
                var timer = 0;
                var self = this;
                $(window).on('scroll.loadmore', function () {
                    if (!timer) {
                        timer = setTimeout(function () {
                            // 检测到在屏幕中了
                            if (self._checkIn()) {
                                self._waiting();
                                // 当加载数据的时候卸载滚动事件
                                self._sleep();
                            }
                            timer = 0;
                        }, 250);
                    }
                });
            },

            init: function () {
                // 如果是手机版不触发滚动加载
                if (!support.ispc) {
                    return;
                }
                this._insertNode();
                this._scrolling();
            }
        };
        return More;
    }();

    if (support.ispc) {
        var channelStart = new AsideFixed('#channel-list');
        var tagsStart = new AsideFixed('#tags-list');
        channelStart.init();
        tagsStart.init();
    }

    var loadnews = new Loadmore({
        // 上拉加载的标识
        id: '#refresh-down',
        // 新闻容器的样式或者id
        newsList: '.article-list',
        // 初始加载的页码
        pageStart: 1,
        // 服务器的地址
        server: '/api/blog/'
    });

    // 静态站(GitHub Pages)正序存储：读取 manifest 得到总页数，从最后一页倒序向前加载
    if (window.IS_GITHUB_PAGES) {
        var sorollOnBottomUrl = '/api/blog/manifest.json';
        if (window.IS_BLOG_LOCAL) {
            sorollOnBottomUrl = '/public' + sorollOnBottomUrl
        }
        $.getJSON(sorollOnBottomUrl, function (m) {
            loadnews.page = m.pages || 1;
            loadnews.desc = true;
        });
    }
})(jQuery);
