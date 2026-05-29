(function($) {
    // 更新分享图指向
    support.shareImg = articleInfo.article_img !== '' ? articleInfo.article_img : support.shareImg;

    // 看板娘下拉到某一位置就改变fixed元素固定的bottom值目标元素，滚动到哪个元素的位置时停下
    var PetFixed = (function() {
        function FixOnFooter(el, target) {
            // 检测传入的目标元素,
            this.$el = $(el);
            this.$target = $(target);
            this.target = this.$target.offset().top
            this.scrollHeight = Math.floor($('#left-fixed-bar').height() / 2) + 10;
            this.init();
        }
        FixOnFooter.prototype = {
            screenHeight: $(window).height(),
            setLeft: function() {
                var self = this;
                self.$el.css({
                    left: gotop.coordinate.right - 10
                });
                $(window).on(events.goTopResize, function(e, xy) {
                    self.$el.css({
                        left: xy.right - 10
                    });
                });
            },
            scroll: function() {
                var self = this;
                $(window).on('scroll', function() {
                    var scrollTop = $(window).scrollTop();
                    if(scrollTop > self.scrollHeight) {
                        self.$el.fadeIn();
                    }
                    if(scrollTop < self.scrollHeight){
                        self.$el.fadeOut();
                    }
                    if((self.screenHeight + scrollTop) >=  self.target) {
                        self.$el.removeClass('fixed').addClass('no-fixed');
                    } else {
                        self.$el.removeClass('no-fixed').addClass('fixed');
                    }
                });
            },
            init: function() {
                this.setLeft();
                this.scroll();
            }
        }

        return FixOnFooter;
    })();

    // 分享
    var ShareBtns = (function() {
        function Plugin() {
            this.$shareWrap = $('#sharebar');
            this.url = window.location.href;
            this.title = document.title;
            this.desc = $('meta[name="description"]').attr('content');
            // 概要主要应用于QQ
            this.summary = articleInfo.article_desc;
            this.pic = support.shareImg;
            this.init();
        }
        Plugin.prototype = {
            shareUrl: '',
            // 存储中心位置的坐标
            center: {},
            qzone: function() {
                var qzongUrl = 'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?';
                qzongUrl += 'url=' + this.url;
                qzongUrl += '&title=' + this.title;
                qzongUrl += '&desc=' + this.desc;
                qzongUrl += '&pics=' + this.pic;
                qzongUrl += '&summary=' + this.summary;
                this.shareUrl = qzongUrl;
            },
            qq: function() {
                var qqUrl = 'http://connect.qq.com/widget/shareqq/index.html?';
                qqUrl += 'url=' + this.url;
                qqUrl += '&title' + this.title;
                qqUrl += '&desc=' + this.desc;
                qqUrl += '&pics=' + this.pic;
                qqUrl += '&summary=' + this.summary;
                this.shareUrl = qqUrl;
            },
            weibo: function() {
                var weiboUrl = 'https://service.weibo.com/share/share.php?';
                weiboUrl += 'url=' + this.url;
                weiboUrl += '&title=' + this.title;
                weiboUrl += '&pic=' + this.pic;
                this.shareUrl = weiboUrl;
            },
            open: function() {
                window.open(this.shareUrl, '');
            },
            msg: function() {
                var issuccess = (arguments[0] === 'success');
                var msg = '当前页面地址已复制，去分享给更多的朋友吧！';
                if(!issuccess) {
                    msg = '当前页面地址复制失败，请手动复制'
                }
                layer.msg(msg);
            },
            init: function() {
                var self = this;
                this.$shareWrap.on('click', 'a', function() {
                    var cls = $(this).attr('class');
                    switch(cls) {
                        case 'qq':
                            self.qq();
                            self.open();
                            break;
                        case 'weibo':
                            self.weibo();
                            self.open();
                            break;
                        case 'qzone':
                            self.qzone();
                            self.open();
                            break;
                        case 'copy':
                            var copy_text = '【' + document.title + '】' + self.url;
                            methods.copyText(copy_text, self.msg);
                            break;
                        default:
                            return
    
                    }
                    return false;
                });
            }
        }

        return Plugin;
    })();

    // 目录喜欢操作位置
    var ContentsPlace = (function() {
        var Plugin = function() {
            this.$el = $('#article-control');
            this.$contents = $('#article-contents');
            this.init();
        }
        Plugin.prototype = {
            resize: function() {
                var self = this;
                $(window).on(events.goTopResize, function(e, coordinate) {
                    self.$el.css({
                        right: coordinate.right
                    })
                });
            },
            contentsOpen: function(type) {
                var width = type === 'open' ? '220px' : 0;
                this.$contents.animate({
                    width: width
                }, 400)
            },
            contentsClick: function() {
                var self = this;
                this.$el.on('click', '.catalogue', function() {
                    // 检测目录是否处于动画中，是的话就return
                    if(self.$contents.is(':animated')) {
                        return;
                    }
                    var $text = $(this).find('em').eq(0);
                    var isActive = $(this).hasClass('active');
                    var text = '';
                    if(isActive) {
                        $(this).removeClass('active');
                        text = '目录';
                        self.contentsOpen('close');
                    } else {
                        $(this).addClass('active');
                        text = '收起';
                        self.contentsOpen('open');
                    }
                    $text.text(text);
                    return false;
                });
            },
            // 点击页面任意处 关闭目录
            contentsClose: function() {
                var self = this;
                var $catalogue = $('.catalogue', self.$el);
                var $em = $('em', $catalogue);
                this.$contents.on('click', '.close', function() {
                    if(!$catalogue.hasClass('active')) {
                        return;
                    }
                    self.contentsOpen('close');
                    $catalogue.removeClass('active');
                    $em.text('目录');
                });
            },
            favouriteClick: function() {
                this.$el.on('click', '.favourite', function() {
                    var hasLike = $(this).hasClass('like');
                    var $icon = $(this).find('.icon').eq(0);
                    if(hasLike) {
                        $icon.removeClass('fa-heart').addClass('fa-heart-o');
                        methods.articleLocal.remove(articleInfo.article_id);
                    } else {
                        var isSaved = methods.articleLocal.save(articleInfo);
                        if(isSaved) {
                            $icon.removeClass('fa-heart-o').addClass('fa-heart');
                            layer.msg('收藏成功，去《喜欢的文章》频道看看吧！');
                        } else {
                            // 防止手动去掉like类导致错误
                            layer.msg('这篇文章已在收藏中，请不要重复添加');
                            return;
                        }
                    }
                    $(this).toggleClass('like');
                });
            },
            // 本地缓存变化的时候进行监听,排除本页面必须是同源页面操作这里才会监听到
            favouriteChange: function() {
                var self = this;
                var $fav = $('.favourite', self.$el);
                var $icon = $fav.find('.icon').eq(0);
                $(window).on('storage', function() {
                    // 当改变的时候获取所有缓存
                    var nowLocal = methods.articleLocal.get();
                    if(nowLocal.length > 0) {
                        var i = 0;
                        $.each(nowLocal, function(index, item) {
                            // 如果当前的id在缓存中,那么证明被收藏了,那么
                            if(item.article_id == articleInfo.article_id ) {
                                return false;
                            }
                            i++;
                        });
                        // 如果article_id不在收藏缓存中且有like那么证明被删除了
                        if(i === nowLocal.length && $fav.hasClass('like')) {
                            $fav.removeClass('like');
                            $icon.removeClass('fa-heart').addClass('fa-heart-o');
                        }   
                    } else {
                        // 如果没有数据证明在其他页面已经清空了这里直接去掉like
                        $fav.removeClass('like');
                        $icon.removeClass('fa-heart').addClass('fa-heart-o');
                    }
                });
            },
            favouriteInit: function() {
                var isHas = methods.articleLocal.getHas(articleInfo.article_id);
                // console.log(articleInfo.article_id);
                if(isHas) {
                    var $favourite = this.$el.find('.favourite');
                    var $icon = $favourite.find('.icon');
                    $favourite.addClass('like')
                    $icon.removeClass('fa-heart-o').addClass('fa-heart');
                }
            },
            init: function() {
                this.favouriteInit();
                this.$el.css({
                    top: 80,
                    right: gotop.coordinate.right
                })
                .addClass('infixed');
                this.resize();
                this.favouriteClick();
                this.contentsClick();
                this.contentsClose();
                this.favouriteChange();
            }
        }

        return Plugin;
    })();

 

    // 滚动固定
    support.ispc && $("#left-fixed-bar").scrollFix({
        // 距离顶部多少时开始fixed
        distanceTop: 80,
        // 当距离底部高度多少时 停止在那,可以是数值或者是JQ对象
        endPos: '#guess-you-like',
        // fix时候添加的类名
        baseClassName: 'left-bar-fixed'
    });

    // 支持一下点击
    $('#support-me').on('click', function() {
        $('.shang','#my-contact').trigger('click');
        return false;
    });
    // 点赞
    $('#zan-me').on('click', function() {
        if($(this).hasClass('has-zan')) {
            layer.msg('您的鼓励就是我坚持下去的动力！');
            return
        }
        var $goodnum = $('#content-header-info').find('.goodnum').eq(0);
        var $em = $('em', $goodnum);
        $(this).addClass('has-zan')
               .find('cite')
               .eq(0)
               .text('感谢您的鼓励')
               .prev()
               .removeClass('fa-thumbs-o-up')
               .addClass('fa-thumbs-up');
        var goodUrl = '/api/blog/good?article=' + articleInfo.article_id;
        console.log(goodUrl);
        $.ajax({
            url: goodUrl ,
            type: 'GET',
            dataType: 'json'
        })
        .done(function(res) {
            if (res.error === 0 && res.good) {
                var goodnum = parseInt($em.text()) + 1;
                $em.text(goodnum);
            } else {
                layer.msg('抱歉，请求失败请稍后重试');
            }
        })
        .fail(function(err) {
            layer.msg('抱歉，请求失败请稍后重试');
        })
    });

    // 进入页面的时候增加阅读数
    var getNewReadNum = function() {
        $.ajax({
            url: '/api/blog/read?article=' + articleInfo.article_id,
            type: 'GET',
            dataType: 'json'
        });
    }();

    // 文章目录
    var ArticleContents = function() {
        function Contents() {
            this.$body = $('#content-body');
            this.$list = $('.catalog-list', '#article-contents');
            this.init();
        }
        Contents.prototype = {
            h2Arr: [],
            // 所有的li.item
            $items: $(),
            tplStr: '',
            // 如果第一个h2之前有兄弟元素，那么所有兄弟元素的高度
            firstH2PrevAllHeight: 0,
            tpl: function(text, id) {
                // 去掉焦点添加的事件
                var isactive = (id == 'article-body-h2-0') ? ' active' : '';
                // console.log(id)
                var tpl = '<li class="item' + isactive + '">';
                // var tpl = '<li class="item">';
                tpl += '<a href="#' + id + '" title="' + text + '">';
                tpl += text;
                tpl += '</a>';
                tpl += '</li>';
                return tpl;
            },
            // 文章标签内部H2使用span重新包裹
            h2InnerSpan: function(id) {
                return '<span id="'+ id + '"></span>';
            },
            // 设置目录条
            setContents: function(text, id) {
               this.tplStr += this.tpl(text, id);
            },
            // 将第一个h2之前的所有元素打包入一个div并获得高度
            getPrevAllHeight: function($prevAll, $h2First) {
                var prevStr = '';
                var len = $prevAll.length - 1;
                var $prevBox = $('<div class="prev-box"></div>');
                while (len >= 0) {
                    // 将之前的DOM转成字符串进行拼接
                    prevStr += methods.domToString($prevAll[len]);
                    len--;
                }
                $prevBox.append($(prevStr));
                $h2First.before($prevBox);
                this.firstH2PrevAllHeight = $prevBox.outerHeight();
            },
            // 获得全部的h2
            getTitle: function() {
                var self = this;
                var idStr = 'article-body-h2-';
                var $h2 = this.$body.find('h2');
                $h2.each(function(index, item) {
                    var idAttr = idStr + index;
                    var text = $(item).text();
                    var inner = self.h2InnerSpan(idAttr);
                    // 获取第一个h2之前有无兄弟元素，有的话用一个div抱起来
                    if (index === 0) {
                        var $prevAll = $(item).prevAll();
                        $prevAll.length > 0 && self.getPrevAllHeight($prevAll, $(item));
                    }

                    // 给每个h2内部插入一个span
                    $(item).wrapInner(inner);
                    // 创建目录列表
                    self.setContents(text, idAttr);
                    // 将每个h2距离顶部高度存入数组中
                    self.h2Arr.push(Math.floor($(item).offset().top));
                });
                this.$items = $(this.tplStr);
                this.$list.append(this.$items);
            },
            // 获取第一个标题以及最后一个标题距离父元素位置
            // getRedLine: function() {
            //     this.h2RedLine.first = this.h2Arr[0].top;
            //     this.h2RedLine.last = this.h2Arr[this.h2Arr.length - 1].top;
            // },
            // 给滚动加上动画
            click: function() {
                var self = this;
                this.$list.on('click', 'a', function(e) {
                    e.preventDefault();
                    var h2 = $(this).attr('href');
                    $('html, body').animate({
                        scrollTop: $(h2).position().top
                    }, 'slow');
                    
                });
            },
            debounce: function() {
                var self = this;
                var timeout = null;    
                return function() {        
                    if(timeout !== null) {
                        clearTimeout(timeout);
                    }
                    // 这里必须要使用一个闭包，不可以s(this.scroll()...)  
                    timeout = setTimeout(function() {
                        self.scroll();
                    }, 100);    
                }
            },
            scroll: function() {
                var self = this;
                // 如果顶部有内容，那么会占用一部分高度，那么会影响索引定位，因此再加上这个高度
                var scrollY = Math.floor($(window).scrollTop()) + 70 + self.firstH2PrevAllHeight;
                var i = 0;
                $.each(self.h2Arr, function(index, h2) {
                    var height1 = h2;
                    var height2 = self.h2Arr[index + 1];
                    if ((scrollY >= height1 && scrollY < (height2 - 0))) {
                        // console.log('gun:' + scrollY);
                        // console.log(height1,height2);
                        // console.log('index:' + index);
                        i = index;
                    }
                    if (scrollY > (height2 - 0)) {
                        i = self.h2Arr.length - 1;
                    }
                    // 去掉焦点添加
                    self.$items.removeClass('active');
                    self.$items.eq(i).addClass('active');
                });
            },
            // 对每个图片父亲元素添加
            imgLoaded: function() {
                var $imgs = this.$body.find('img');
                $imgs.each(function() {
                    $(this).parent().addClass('imgbox');
                });
            },
            // 对文章中每个a添加
            aAddBlank: function() {
                // 如果a的样式加了except-a那么就排除那个a元素
                var $as = this.$body.find('a').not('.except-a');
                $as.each(function() {
                    $(this).attr('target', '_blank');
                });
            },
            init: function() {
                // 获取文章中所有的图片 等图片加载完毕再去获得每个标题的高度
                this.imgLoaded();
                this.aAddBlank();
                this.getTitle();
                this.click();
                // 向工具函数中传作用域用call参考这种写法
                $(window).on('scroll', this.debounce());
            }
        }
        return Contents;
    }();

    var AudioPlay = function() {
        function audioPlay() {
            this.$bgm = $('#bgmusic');
            if(this.$bgm.length <= 0) {
                return;
            }
            this.$btn = $('#audiobtn');
            this.offsetTop= 80;
            this.init();
        }
        audioPlay.prototype = {
            btnClick: function(self) {
                this.$btn.on('click', function() {
                    var isPlay = $(this).hasClass('on');
                    if(isPlay) {
                        $(this).removeClass('on').addClass('off');
                        self.$bgm[0].pause();
                    } else {
                        $(this).removeClass('off').addClass('on');
                        self.$bgm[0].play();
                    }
                });
            },
            setBtnFixed: function() {
                this.$btn.addClass('fixed');
                this.$btn.css({
                    right: gotop.coordinate.right + 100
                });
            },
            scroll: function(self) {
                $(window).on('scroll', function() {
                    var scrollY = $(window).scrollTop();
                    var isPlay = self.$btn.hasClass('on');
                    if(!isPlay) {
                        self.$btn.removeClass('fixed');
                        return;
                    }
                    if(scrollY > self.offsetTop && isPlay) {
                        self.setBtnFixed.call(self);
                    }
                    if(scrollY <= self.offsetTop && isPlay) {
                        self.$btn.removeClass('fixed');
                    }
                });
            },
            init: function() {
                var self = this;
                $(document).one('click', function() {
                    self.$bgm[0].play();
                    self.$btn.addClass('on');
                    var scrollY = $(window).scrollTop();
                    if(scrollY > self.offsetTop) {
                        self.setBtnFixed.call(self);
                    }
                });
                this.btnClick(self);
                this.scroll(self);
            }
        }
        return audioPlay;
    }();

    // 文章动态二维码进行赋值
    $('.qr-img').attr({
        src : '/other/qrcode?size=9&data=' + articleInfo.article_link
    })

    new ArticleContents();
    new ContentsPlace();
    new ShareBtns();
    !support.isIe && support.ispc && new PetFixed('#detail-pet', '#footer');
    !support.isIe && support.ispc && new AudioPlay();
})(jQuery);