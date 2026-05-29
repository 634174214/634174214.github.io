(function($, window) {
    window.SITEURL = 'https://www.wubin.work/';
    window.support = {
      ispc: function() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ['Android', 'iPhone',
            'SymbianOS', 'Windows Phone',
            'iPad', 'iPod'
        ];
        var flag = true;
        for (var i = 0; i < Agents.length; i++) {
            if (userAgentInfo.indexOf(Agents[i]) != -1) {
                flag = false;
                break;
            }
        }
        return flag;
      }(),
      iswexin: function() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/micromessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
      }(),
      isIe: function() {
        if (!!window.ActiveXObject || "ActiveXObject" in window){
          return true;
        } else{
          return false;
        }
      }(),
      // 能力检测，返回浏览器厂商的前缀
      vendor: function() {
        var elementStyle = document.createElement('div').style;
        var transformNames = {
          webkit: 'webkitTransform',
          Moz: 'MozTransform',
          O: 'OTransform',
          // IE
          ms: 'msTransform',
          // 标准的
          standard: 'transform'
        }
        // for in支持IE8
        for (var key in transformNames) {
          // 遍历所有的transform 如果创建元素中elementStyle['webkitTransform']不为空就代表存在供应商前缀
          if (elementStyle[transformNames[key]] !== undefined) {
            // 都没有就会返回标准
            return key
          }
        }
        // IE8 会返回false,IE9是ms
        return false
      }(),
      screenHeight: $(window).height(),
      screenWidth: $(window).width(),
      shareImg: SITEURL + 'assets/img/share.jpg',
      // 浏览器是否支持本地存储
      localStorage: typeof window.localStorage == 'undefined' ? false : true,
      // 证明是不是详细页
      isDetail: $('#article-control').length > 0
    }
  
    // 自定义事件的名称
    window.events = {
      // 动画结束的事件
      aniHasEnd: 'aniHasEnd',
      // 隐藏博客导航的事件
      hideBlogNav: 'hideBlogNav',
      // 返回顶部进行窗口尺寸变动时候
      goTopResize: 'goTopResize'
    }
  
    window.methods = {
      aniEndDo: function($el, callback) {
        if(!support.vendor) {
          return;
        }
        var funcEvent = support.vendor + 'AnimationEnd';
        $el.on(funcEvent, function() {
          callback();
          // 执行完回调函数要卸载事件,否则会重复触发
          $(this).off(funcEvent);
          // 当动画执行结束时，给这个元素触发一个自定义事件, 触发元素监听
          $(this).trigger(events.aniHasEnd);
        });
      },
      /* $el 动画元素 type 执行的动画类型down或者是up */
      fadeInY: function($el, type) {
        if(support.isIe) {
          $el.fadeIn();
        } else {
          $el[0].style.display = 'block';
          var cls = 'fade-' + type + '-in';
          $el.addClass(cls);
          // 传递一个回调函数
          methods.aniEndDo($el, function() {
            $el.removeClass(cls);
          });
        }
      },
      // 出入的类型要保持一致
      fadeOutY: function($el, type) {
        if(support.isIe) {
          $el.fadeOut();
        } else {
          var cls = 'fade-' + type + '-out';
          $el.addClass(cls);
          // 
          methods.aniEndDo($el, function() {
            $el[0].style.display = 'none';
            $el.removeClass(cls);
          });
        }
      },
      // 复制文字
      copyText: function(text, callback) {
        var tag = document.createElement('input');
        var tagId = 'copy_input';
        tag.setAttribute('id', tagId);
        tag.setAttribute('class', 'not-show');
        tag.value = text;
        document.getElementsByTagName('body')[0].appendChild(tag);
        tag.select();
        var copyOk = document.execCommand('copy');
        // tag.remove();
        if(copyOk && callback) {
          callback('success');
        }
        if(!copyOk && callback) {
          callback('wrong');
        }
      },
      /*
      el         显示倒计时的JS元素
      time       倒计时多少秒s
      before/after 指的调用倒计时函数时的作用域！
      methods.countDown.call(调用的类指向), el, 5);
       */
      countDown: function(el, time) {
        var that = this;
        that.before();
        el.innerHTML = time;
        var timer = setInterval(function() {
          if(time <= 0) {
            clearInterval(timer);
            that.after();
            return
          }
          el.innerHTML = time;
          time--;
        }, 1000);
      },
      // 将DOM元素转换为字符串
      domToString: function (elDom) {
        var div = document.createElement('div');
        div.appendChild(elDom)
        return div.innerHTML;
      }
    }
  
  
    // 顶部导航与滚动交互的效果, 下滚全部菜单 上滚博客菜单
    var NavbarScroll = function() {
      // 不是pc不执行
      if(!support.ispc){
        return;
      }
      var $navbar = $('#navbar-pc');
  
      var navheight = $navbar.outerHeight();
      var scrollTop = $(window).scrollTop();
      var timer = 0;
      // 节流的时间，IE时间长
      var dotime = support.ispc && support.isIe ? 500 : 250;
  
      var scroll = function() {
        var nowScrollTop = $(window).scrollTop();
        if(nowScrollTop > navheight) {
          $navbar.addClass('blog-show');
        } else {
          $navbar.removeClass('blog-show');
          $(this).trigger(events.hideBlogNav)
        }
        if(nowScrollTop > scrollTop) {
          $navbar.removeClass('all-show');
        } else {
          $navbar.addClass('all-show');
          // 这里自定义一个事件，当达到条件的时候触发$(this)指的是window,事件绑定在window上
          $(this).trigger(events.hideBlogNav)
        }
        scrollTop = nowScrollTop;
      }
  
      // 需要做节流 否则IE会有问题
      $(window).on('scroll.navbar', function() {
          if (!timer) {
            timer = setTimeout(function() {
                scroll();
                timer = 0;
            }, dotime);
          }
      });
    }
  
    // 搜索框
    var Search = function() {
      var SearchGo = function() {
        this.$search = $('#search');
        this.$hotSearch = $('#hot-search');
        // 搜索框的放大镜图标
        this.$icon = $('#search').parent().children('.icon');
        this.searchUrl = '/search?s=';
        // 首先获取全部的历史搜索
        this.historyArr = Storage.get(this.searchKey, []);
        // 历史记录最多
        this.historyMax = 5;
      }
      SearchGo.prototype = {
        // 定义一个空的历史元素
        $history: $(),
        $historyClear: $(),
        searchKey: '__search__',
        // 用于存储$hotSearch中是否有一级子元素
        hotSearchHasChild: true,
        hotSearchResize: function() {
          var self = this;
          $(window).on('resize.hotsearch', function() {
            // 如果没有子元素那么不执行
            if(!self.hotSearchHasChild) {
              return
            }
            hotLeft = self.$search.offset().left + 15;
            self.$hotSearch.css({
              left: hotLeft
            })
          });
        },
        resetHotSearch: function() {
          var self = this;
          $(window).on('scroll', function() {
            if(!self.hotSearchHasChild) {
              return
            }
            if(self.$hotSearch.is(':visible')) {
              // self.$hotSearch.fadeOut('fast');
              // 让input失去焦点，当失去焦点时候会自动执行失焦的事件
              self.$search[0].blur();
            }
          });
        },
        focus: function() {
          var self = this;
          this.$search.on('focus', function() {
            $(this).siblings('label').hide();
            self.hotSearchHasChild && self.$hotSearch.fadeIn('fast');
          });
        },
        blur: function() {
          var self = this;
          this.$search.on('blur', function() {
            var searchVal = $.trim($(this).val());
            // 只有有hotSearch子元素的时候才执行显示隐藏
            self.hotSearchHasChild && self.$hotSearch.fadeOut();
            // 判断失焦点的时候是否有内容
            if(!searchVal ||
               searchVal != ''
            ) {
              $(this).siblings('label').hide();
            }
            if( searchVal == ''){
              $(this).siblings('label').show();
            }
          });
        },
        historyWrapTpl: function(itemStr) {
          var tpl = '<dl class="history" id="history-search">';
          tpl += '<dt>搜索历史：';
          tpl += '<em id="history-clear" title="清空搜索记录"><i class="icon fa fa-trash-o"></i>清空</em>';
          tpl += '</dt>';
          tpl += '<dd>';
          tpl += itemStr;
          tpl += '</dd></dl>';
          return $(tpl);
        },
        historyItemTpl: function(searchVal) {
          var target = this.searchUrl + searchVal;
          var tpl = '<div class="item">';
          tpl += '<a href="' + target + '" title="' + searchVal + '">' + searchVal + '</a>';
          tpl += '<i class="icon fa fa-close" title="删除记录"></i>';
          tpl += '</div>';
          return tpl;
        },
        historyItemTplGet: function() {
          var self = this;
          var itemsTpl = '';
          $.each(this.historyArr, function(index, item) {
            itemsTpl += self.historyItemTpl(item);
          });
          return itemsTpl;
        },
        historyGet: function() {
          Storage.get(this.searchKey, []);
        },
        historySave: function(searchVal) {
          // 先检索是否在数组中的下标
          var index = $.inArray(searchVal, this.historyArr);
          if(index > -1) {
            // 存在就先删除
            this.historyArr.splice(index, 1);
          }
          this.historyArr.unshift(searchVal);
          // 判断历史数组长度，超过的话只取前5个
          this.historyArr = this.historyArr.splice(0, this.historyMax);
          Storage.set(this.searchKey, this.historyArr);
          this.historyRefresh();
        },
        historyInit: function() {
          var self = this;
          if(this.historyArr.length > 0) {
            var itemsTpl = this.historyItemTplGet();
            // 生成历史列表
            this.$history = this.historyWrapTpl(itemsTpl);
            this.$hotSearch.append(this.$history);

            // 插入后存一下clear按钮
            this.$historyClear = $('#history-clear');
            // 清空搜索记录
            this.$historyClear.click(function() {
              layer.confirm('是否清空搜索记录？', {
                btn: ['确定', '取消'],
                // 阻止浏览器滚动,可能会导致滚动条消失引起的页面整体晃动
                scrollbar: true
              }, function(){
                // 确定
                self.historyClear();
                layer.msg('搜索记录已删除');
              }, function() {
                self.$search.focus();
              });
            });

            // 删除每一项的记录
            this.$history.on('click', '.icon', function() {
              var itemIndex = $(this).parent().index();
              self.historyArr.splice(itemIndex, 1);
              Storage.set(self.searchKey, self.historyArr);
              if(self.historyArr.length > 0) {
                self.historyRefresh();
              } else {
                self.historyClear();
              }
              self.$search.focus();
              // self.hotSearchHasChild = true;
              return false;
            });
          }
        },
        // 对列表进行更新，传入如果重复的Index值
        historyRefresh: function() {
          // 先判断是否有历史搜索列表,没有就执行init生成一个
          if(this.$history.length <= 0) {
            // console.log(this.historyArr)
            this.historyInit();
            this.hotSearchHasChild = this.hasChild();
          } else {
            // console.log(this.$history.length)
            var $dd = this.$history.find('dd');
            $dd.empty();
            var $items = $(this.historyItemTplGet());
            $dd.prepend($items);
          }
        },
        historyClear: function() {
          this.$history.remove();
          // 在清空的时候 需要将history元素在类中清空，否则只是删除了元素
          this.$history = $();
          this.historyArr = [];
          Storage.remove(this.searchKey);
          this.$search.focus();
          // 重新获取一次 确定其中是否有元素
          this.hotSearchHasChild = this.hasChild();
        },
        historyItemDel: function() {

        },
        hasChild: function() {
          return this.$hotSearch.children().length > 0;
        },
        doso: function() {
          var searchValue = this.$search.val();
          if(searchValue == '') {
            layer.msg('搜索内容不能为空！', {
              time: 2000,
              anim: 6
            });
            return
          }
          this.historySave(searchValue);
          var url = this.searchUrl + searchValue;
          // window.open(url, '_blank');
          window.location.href = url;
        },
        // 执行搜索
        dosearch: function() {
          var self = this;
          this.$search.on('keypress', function(e) {
            if(e.keyCode == 13) {
              self.doso();
            }
          });
          this.$icon.on('click', function() {
            self.doso();
          });
        },
        init: function() {
          // 页面加载要先执行historyinit获取历史搜索并插入
          this.historyInit();
          // 再获取是否有子元素，作为启动相关操作的依据
          this.hotSearchHasChild = this.hasChild();

          this.hotSearchResize();
          $(window).trigger('resize.hotsearch');

          this.focus();
          this.blur();
          this.resetHotSearch();
          this.dosearch();
        }
      }
      return SearchGo;
    }();

  
    // 点击显示博客全部频道
    var BlogAllNav = function() {
      var Plugin = function() {
        this.$btn = $('#blognav-show-btn');
        this.$nav = $('#blog-all-nav');
        this.$text = this.$btn.find('em').eq(0);
        this.$btnfather = this.$btn.parent();
        this.text = {
          hide: '展开全部',
          show: '收起导航'
        }
      }
      Plugin.prototype = {
        click: function() {
          var self = this;
          this.$btn.on('click', function() {
            // 点击的时候总是出现遮罩层，在动画结束时候隐藏,这里要筛除ie的情况，IE的话就不添加遮罩层
            !support.isIe && self.$btnfather.addClass('cover');
            var isShow = $(this).hasClass('show');
            if(isShow) {
              $(this).removeClass('show');
              self.$text.text(self.text.hide);
              // this.$nav.fadeOut();
              methods.fadeOutY(self.$nav, 'down');
            } else {
              $(this).addClass('show');
              self.$text.text(self.text.show);
              // this.$nav.fadeIn();
              methods.fadeInY(self.$nav, 'down');
            }
            // self.check();
          });
        },
        reset: function() {
          this.$btn.removeClass('show');
          // this.$nav.fadeOut();
          methods.fadeOutY(this.$nav, 'down');
          this.$text.text(this.text.hide);
        },
        // 监听自定义事件，当动画结束时触发
        listenAni: function() {
          var self = this;
          this.$nav.on(events.aniHasEnd, function() {
            if(self.$btnfather.hasClass('cover')) {
               self.$btnfather.removeClass('cover');
            }
          })
        },
        init: function() {
          var self = this;
          this.click();
          this.listenAni();
          // 在NavbarScroll中绑定，在此处监听触发的时候执行
          $(window).on('hideBlogNav', function() {
            // 如果菜单是隐藏的 那么就不执行
            if(self.$nav.is(':hidden')) {
              return
            }
            self.reset();
          })
        }
      }
      return Plugin;
    }();
  
    // 联系我
    var Mycontact = function() {
      var Plugin = function() {
        this.$contact = $('#my-contact');
        this.$favorite = $('#favorite');
        this.$follow = $('#follow');
      }
      Plugin.prototype = {
        layertitle: '信息',
        // 要显示的提示语
        say: '',
        // 添加收藏
        addCollect: function() {
          this.$favorite.on('click', function() {
            var sURL = document.URL;
            var sTitle = document.title;
            try {
              window.external.addFavorite(sURL,sTitle);
            } catch(e) {
              try{ 
                window.sidebar.addPanel(sTitle, sURL, "");
              } catch(e) {
                layer.msg('加入收藏失败，请使用Ctrl+D进行添加');
              }
            };
          });
        },
        // 添加关注
        addFollow: function() {
          this.$follow.on('click', function() {
            layer.msg('功能正在开发中，敬请期待！');
          });
        },
        tpl: function(type, content) {
          var tpl = '';
          if(type === 'img') {
            content = content.split(',');
            // console.log(content)
            tpl = '<div class="popup">';
            $.each(content, function(index, item) {
              tpl = tpl + '<div class="qrbox"><img src="' + item + '"></div>';
            });
            tpl = tpl + '<p class="img-text">' + this.say + '</p></div>'; 
          }
          if(type === 'text') {
            tpl = '<div class="popup">' + this.say + '<strong>' +content + '</strong></div>';
          }
          return tpl;
        },
        getType: function(cls) {
          var type = '';
          switch(cls) {
            case 'gitee':
              type = 'text';
              this.say = '码云：';
              this.layertitle = '我的码云';
              break;
            case 'qq':
              type = 'img';
              this.say = '识别二维码 或 QQ搜索：634174214';
              this.layertitle = '我的QQ';
              break;
            case 'email':
              type = 'text';
              this.say = '邮箱：';
              this.layertitle = '我的邮箱地址';
              break;
            case 'wexin':
              type = 'img';
              this.say = '识别二维码，加我微信';
              this.layertitle = '我的微信二维码';
              break;
            case 'shang':
              type = 'img';
              this.say = '您的支持是我不断前进的动力';
              this.layertitle = support.ispc ? '扫码支持一下' : '长按二维码支持一下';
              break;
            default:
              type = false;
          }
          
          return type;
        },
        btnsClick: function() {
          var self = this;
          this.$contact.on('click', 'li', function() {
            var $this = $(this);
            var isActive = $this.hasClass('active');
            var cls = $this.data('cls');
            var content = $this.data('content');
            var type = self.getType(cls);
            if(!type) {
              return;
            }
            // 根据cls名称判断不同的模板
            var popInner = self.tpl(type, content);
            
            if(isActive) {
              $this.removeClass('active');
            } else {
              $this.addClass('active');
              $this.siblings().removeClass('active');
    
              layer.open({
                type: 1,
                shade: [0.3, '#07111B'], // 遮罩层
                shadeClose: false, // 点击遮罩层是否关闭
                title: self.layertitle, //不显示标题
                content: popInner,
                cancel: function(index, layero){ 
                  $this.removeClass('active');
                }    
              });
    
            }
          });
        },
        init: function() {
          this.btnsClick();
          this.addCollect();
          this.addFollow();
        }
      }
      return Plugin;
    }();

    // 本地存储的操作
    var ArticleDataBase = function() {
      function Local() {
        this.key = '__favourite__';
        // 获取全部的本地存储内容
        this.old = Storage.get(this.key, []);
        this.init();
      }
      Local.prototype = {
        get: function() {
          return Storage.get(this.key, []);
        },
        // 存储文章的标题/链接/文章id
        save: function(val) {
          if(this.getHas(val.article_id)) {
            return false;
          }
          this.old.unshift(val);
          Storage.set(this.key, this.old);
          return true;
        },
        // 检测详细页初始化时 id是否存在
        getHas: function(id) {
          var ishas = false;
          // 执行的时候先获取一下
          this.old = this.get();
          // 如果数组长度为0 那么肯定不存在
          if(this.old.length <= 0) {
            return ishas;
          }
          $.each(this.old, function () {
            if(this.article_id == id) {
              ishas = true;
              return;
            }
          });
          return ishas;
        },
        remove: function(id) {
          var i = false;
          $.each(this.old, function (index) {
            if(this.article_id === id) {
              // 获取在数组中的位置
              i = index;
              return i;
            }
          });
          if(i !== false) {
            // 删除一项
            this.old.splice(i, 1);
            Storage.set(this.key, this.old);
          } else {
            layer.msg('抱歉，您要删除的项不存在');
          }
        },
        // 不支持的情况
        noSupport: function() {
          // 内页喜欢按钮隐藏
          $('.favourite').hide();
          // 触发列表按钮隐藏
          $('.my-favourite').hide();
        },
        init: function() {
          // 如果不支持 那么就隐藏一些元素
          (support.isIe || !support.localStorage) && this.noSupport();
        }
      }
      return Local;
    }();

    // 我喜欢的按钮点击
    var MyFavourite = function() {
      function favArticle(obj) {
        this.$btn = $(obj.cls);
        this.link = obj.link;
        this.key = '__favourite__';
        this.init();
      }
      favArticle.prototype = {
        // 喜欢文章的数组
        favouriteArr: [],
        // 创建的layer弹窗
        layerPop: null,
        init: function() {
          this.btnClick();
        },
        getTpl: function() {
          var item_tpl = this.tplItems();
          var tpl = this.tplWrap(item_tpl);
          return tpl;
        },
        tplItems: function() {
          var self = this;
          var tpl = '';
          $.each(this.favouriteArr, function(index, item) {
            var target = self.link + item.article_id;
            tpl += '<li>';
            // 这里改为本页跳转避免有bug
            tpl += '<a href="' + target + '" target="_self" title="' + item.article_title + '">';
            tpl += '<p class="title">';
            tpl += '<i class="icon fa fa-caret-right"></i>';
            tpl += item.article_title + item.article_id;
            tpl += '</p>';
            tpl += '<p class="desc">' + item.article_desc + '</p>';
            tpl += '</a>';
            tpl += '<i class="icon fa fa-close del" title="删除"></i>';
            tpl += '</li>';
          });
          return tpl;
        },
        tplWrap: function(items) {
          var tpl = '<div class="favourite-list" id="favourite-list">';
          tpl += '<div class="fav-list-top">';
          tpl += '操作:';
          tpl += '<div class="fav-list-control"><span class="clear"><i class="icon fa fa-trash"></i>清空所有文章</span><span class="refresh"><i class="icon fa fa-refresh"></i>刷新列表</span></div>';
          tpl += '</div>';
          tpl += '<ul class="list">';
          tpl += items;
          tpl += '</ul>';
          tpl += '</div>';
          return tpl;
        },
        favouriteEmpty: function() {
          if(this.favouriteArr.length <= 0) {
           layer.close(this.layerPop);
          }
        },
        eventListen: function(self) {
          var $favouriteList = $('#favourite-list');
          $favouriteList.on('click', '.del', function() {
            var $li = $(this).parent();
            var index = $li.index();
            // 在数组中删除对应项
            var removed = self.favouriteArr.splice(index, 1);
            Storage.set(self.key, self.favouriteArr);
            $li.remove();
            // 检测页面中是否有#article-control元素有的话就是详细页
            // 并且删除的Id与页面Id相同
            if(support.isDetail && removed[0].article_id === articleInfo.article_id && $('#article-control').find('.favourite').hasClass('like')
            ) {
              $('#article-control').find('.favourite').removeClass('like');
              $('#article-control').find('.favourite').find('.icon').removeClass('fa-heart').addClass('fa-heart-o')
            }
            // 当都清空的时候
            self.favouriteEmpty();
          });

          $favouriteList.on('click', '.clear', function() {
            layer.confirm('确定要清空所有收藏的文章吗？', {
              btnAlign: 'r',
              btn: ['确定', '取消'] 
            }, function(){
              // 在数组中删除对应项
              self.favouriteArr = [];
              Storage.set(self.key, self.favouriteArr);
              self.favouriteEmpty();
            });
          });

          // 刷新列表
          $favouriteList.on('click', '.refresh', function() {
            var $list = $favouriteList.find('.list').eq(0);
            $list.empty();
            // 重新获取一次缓存数据
            self.favouriteArr = methods.articleLocal.get();
            var item_tpl = self.tplItems();
            $list.append($(item_tpl));
          });
        },
        btnClick: function() {
          var self = this;
          this.$btn.on('click', function() {
            var $this = $(this);
            $this.addClass('active');
            self.favouriteArr = methods.articleLocal.get();
            if(self.favouriteArr.length <= 0) {
              layer.msg('您的收藏空空如也，快去添加一篇试试吧！');
              return false;
            }
            // 如果长度大于0
            var content = self.getTpl();
            self.layerPop = layer.open({
              type: 1,
              anim: 0,
              title: ['我收藏的文章', 'font-size:14px;font-weight:Bold;'],
              skin: 'layui-layer-rim', //加上边框
              // area: ['400px', 'auto'], //宽高
              area: '400px', // 只定义宽度 高度依然自适应
              // maxHeight: 400,
              content: content,
              scrollbar: true,
              cancel: function(index, layero){ 
                $this.removeClass('active');
              }    
            });
            // 只有当弹窗创建的时候 才执行删除清空事件监听
            self.eventListen(self);
          });
        }
      }
      return favArticle;
    }();

    // 换一组文章 应用于列表页与详细页
    var RefreshGuess = (function() {
      var Guess = function(el) {
          this.$guess = $(el);
          if($(el).length <= 0) {
            return;
          }
          this.$list = this.$guess.find('ul');
          this.$countDown = this.$guess.find('.count-down');
          this.$countDownTips = this.$guess.find('.count-down-tips');
          this.$refresh = this.$guess.find('.refresh');
          this.init();
      } 
      Guess.prototype = {
          tplStr: '',
          tpl: function(row) {
              var target =  '/blog/articles/' + row.id;
              var tpl = '<li>';
              tpl += '<a href="' + target + '" class="imgbox">';
              tpl += '<img src="' + row.preview + '">';
              tpl += '</a>';
              tpl += '<a href="' + target + '" class="title" title="' + row.title + '">';
              tpl += row.title;
              tpl += '</a>';
              tpl += '</li>';
              return tpl;
          },
          emptyAndAppend: function() {
              this.$list.empty().append($(this.tplStr));
          },
          getTplStr: function(self, data) {
              $.each(data, function() {
                  self.tplStr += self.tpl(this);
              });
          },
          getList: function(self) {
              $.ajax({
                  url: '/api/blog/newgroup',
                  dataType: 'json',
                  type: 'GET'
              })
              .done(function(res) {
                  if(res.error === 0) {
                      console.log(res);
                      self.getTplStr(self, res.data);
                      self.emptyAndAppend();
                  }
              })
          },
          click: function() {
              var self = this;
              this.$refresh.on('click.refresh', function() {
                  // 每次点击都重置
                  self.tplStr = '';
                  // console.log(self)
                  // 改变methods.countDown中this的指向，指向Guess类
                  methods.countDown.call(self, self.$countDown[0], 5);
                  self.getList(self);
              });
          },
          offClick: function() {
              this.$refresh.off('click.refresh');
          },
          // 用于定时器，开始以及倒计时结束时的执行函数
          before: function() {
              this.offClick();
              this.$countDownTips.text('秒钟后可重新获取')
          },
          after: function() {
              this.$countDown[0].innerHTML = '';
              this.click();
              this.$countDownTips.text('换一组文章')
          },
          init: function() {
              this.click();
          }
      }
      return Guess;
  })();

    // 返回上一页
   $('.go-back').on('click', function() {
    window.history.back();
    return false;
   });

   // 描点定位在当前页进行滚动 配合menuInpageScroll组件
   $('#menu-inpage-scroll').on('click', '.inpage-item', function (e) {
     e.preventDefault();
     var elId = $(this).attr('href');
     $('html,body').animate({
       scrollTop: $(elId).position().top
     }, 'slow')
   });
  
  
    var searchStart = new Search();
    var contactStart = new Mycontact();
    var blogAllNavStart = new BlogAllNav();
    var navbarStart = new NavbarScroll();
    new RefreshGuess('#guess-you-like');
    searchStart.init();
    contactStart.init();
    blogAllNavStart.init();

    // 操作挂载在methods上
    methods.articleLocal = new ArticleDataBase();
    new MyFavourite({
      cls: '.my-favourite',
      // 文章的链接如/blog/articles/24
      link: '/blog/articles/'
    });
    // 页面加载好后移除禁止transition的样式
    $(window).on('load', function () {
      $('body').removeClass('preload');
    });
    // IE在加载后拼接出的layer样式链接错误，动态修改链接指向
    if (support.isIe) {
      $('#layuicss-layer').attr('href', '/assets/libs/layer/theme/default/layer.css');
    }
  })(jQuery, window);
  