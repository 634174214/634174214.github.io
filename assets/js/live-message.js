var querys = function(){
    var qs = (location.search.length > 0 ? location.search.substr(1) : ''),
        //保存每一项
        args = {},
        //得到每一项
        items = qs.length ? qs.split('&') : [],
        item = null,
        name = null,
        value = null,
        i = 0,
        len = items.length;

        for(i = 0;i<len ;i++){
            item = items[i].split('='),
            name = decodeURIComponent(item[0])
            value = decodeURIComponent(item[1])
            if(name.length){
                args[name] = value;
            }
        }
        return args;
}();

// 全局配置layer
layer.config({
    title: '系统提示'
});

var menuActive = function() {
    var url = window.location.href;
    if(url.indexOf('message') > -1) {
        $('.left-nav').find('.active').eq(0).removeClass('active');
        $('#live-message-link').addClass('active');
    }
}();

// 选择用户头像
function UAvatarChoose() {
    var $uAvatarList = $('#your-avatar-list');
    var $uAvatar = $('#your-avatar');
    var $uAvatarImg = $('#your-avatar-img');
    var $avataImgs = $uAvatarList.find('img');
    var IMG_WIDTH = 40;
    var IMG_MARG_LEFT = 10;

    var listWidth = function() {
        var len = $avataImgs.length;
        return IMG_WIDTH * len + IMG_MARG_LEFT * (len - 1)
    }();

    if(support.ispc) {
        $uAvatarList.width(listWidth);
    }

    $uAvatar.on('click', function() {
        if(!$uAvatarList.is('hidden')) {
            $uAvatarList.fadeIn();
            return false;
        }
    });

    $uAvatarList.on('click', 'img', function() {
        var src = this.src;
        var avatarIndex = $(this).data('uavatar');
        $uAvatarImg.attr('src', src);
        $uAvatarImg.attr('data-uavatar', avatarIndex);
        $uAvatarList.fadeOut();
        return false;
    });

    $(document).on('click', function() {
        if(!$uAvatarList.is('hidden')) {
            $uAvatarList.fadeOut();
        }
        return;
    });
}


// 获取随机昵称
var randomName = function() {
    var dir = '风中找感觉,天堂不寂寞,等待未来的我,随便,潇洒,擅长隐身,灵气,海誓不盟,浪,风花雪月,跳跃指间的幸福,突然不想平凡,向前看,哭也要有君子的风度,小米粥,伊水,白衣宝宝,然后、那,心、归何方,每天快乐一点,你定,红颜为谁美,三国的黎明,水中的鱼,醉了累了,浪狼,淡如烟,那奇妙的梦,随风飘,无聊,那些年,平行线,指尖芭蕾,雨中霞,五谷轮回之所,出鞘的利剑,花落雨停心为伴,看你,没好网名,爷，红遍全球,捷报频传,期待,浪郎,好运常在,三轮车夫,风记忆,姑娘，请留步,夜里，你在想着谁,光秃秃的树枝,云和山的彼端,中国移动我不动,就当我任性,空格,比情兽更禽兽,往事不堪回首,简简单单,风行者,狼,换我一世繁华,飘零天涯,日月同辉,此生为了谁,别忘了我,痴人不说梦了,对不起，我滚远了,黛依,为你而等待,就当我任性,对对对,肤浅,五更天的星星,Just only,灵风,郎,出鞘的利剑,我就假装相信你了,等一旧人,废墟上的繁华,雨,你走呀,潭深深,洁娜,kina,kobe,菲菲,苏堇小姐,醉卧红尘笑,冰公主,冰若依,叹清寒,横颜,冷颜,泪颜,朝花夕拾,叶落归根,安于现状,沦陷的痛,物是人非,望眼欲穿,隔境之羌,安然等待,两情相悦,一爱到底,维持现状,只言片语,不堪回首,我们都傻,梦醉红颜,残花飞舞,不想长大,扑朔迷离,孤岛惊魂,变形金刚,淡忘那伤,逃离回忆,无言以对,无休无止,暖人迷恋,红色幻想,半个灵魂,怪咖小姐,半俗不雅,旧情绵绵,旧忆如梦,变成沙砾,阴霾深处,浮世之绘,歇斯底里,物是人非,柔情范儿,旧梦难温,红颜祸水,如此不堪,往如时忆,遗日惜时,此生不换,开不了口,言犹在耳,宠辱不惊,只淡不断,是我的海,我不舍得,情非得已,你好色彩,明媚笑颜,何必多情,我很舍得,三时日光,话未道尽,释迦侔尼,五行三界,公开警告,第九朵云,关键是我,遇之表白,类似爱情,处女空气,弱水三千,黑牢日记,维多利亚,广岛之恋,三生三世,若离梦靥,一秒一幕,空虚人生,无解方程,北去候鸟,春秋大梦,夕夕成玦,恩及若离,十二岁月,情绪失控,向死而生,恩恩爱爱,窒息到点,做回自己,喝醉醉醉,我的天堂,明天晴天,一样倔强,龌龊想法,巴黎左岸,东京铁塔,妖颜惑众,时光小偷,稍纵即逝,年少轻狂,若如初见,如梦初醒,仲夏成霜,关于今昔,一缕牵挂,兵慌马乱,冷冷清清,你知我在,你知我爱,少年如他,他的风景,空如此生,此生不悔,两小无猜,时间糖果,时至今日,令人窒息,我不想逃,安静就好,自顾自乐,不闻不问,夏日未央,隐隐作痛,黑白梦境,造化弄人,安分守己,没有希望,失心腐骨,裙下之君,望梦之城,北城旧事,梦回俊尘,少年无知,暗夜微凉,滔滔人生,若思若想,繁华似锦,赢了爱情,痛定思痛,似水柔情,月光倾城,流绪微梦,残花败柳,夏花依旧,演绎轮回,一抹红尘,悲欢自饮,稚气未脱,离经叛道,两重心事,心安勿忘,悲欢离合,无处安放,残缺韵律,眼神调情,安然放心,内心深处,负面情绪,心有所属,时间在流,流年开花,守住时间,静待死亡,梦绕魂牵,半世晨晓,惜你若命';
    var arrName = dir.split(',');
    var arrLen = arrName.length;

    // 获取指定范围内的随机数
    function randomAccess(min,max){
        return Math.floor(Math.random() * (min - max) + max)
    }

    function getName() {
        var random = randomAccess(0, arrLen);
        return arrName[random];
    }

    return {
        getName: getName
    }
}();


// 赞助榜滚动
function ZanPayScroll() {
    var speed = 30;
    var delay = 1000;
    // 外容器高度
    var height = 188;
    var time;
    var area = document.getElementById('slide-pays-roll');
    area.innerHTML += area.innerHTML;

    function scroll() {
        if (area.scrollTop % height == 0) {
            clearInterval(time);
            setTimeout(start, delay);
        } else {
            area.scrollTop++;
            if (area.scrollTop >= area.scrollHeight / 2) {
                area.scrollTop = 0;
            }
        }
    }

    function start() {
        time = setInterval(scroll, speed);
        area.scrollTop++;
    }
    setTimeout(start, delay);

    // 设置每个span的属性
    function setAttr() {
        var $name = $(area).find('.name');
        var $money =  $(area).find('.money');
        $name.each(function() {
            $(this).attr('title', $(this).text());
        });
        $money.each(function() {
            $(this).attr('title', $(this).text() + '元');
        });
    }
    setAttr();
}

// 创建昵称
function createNikeName() {
    var $nikeInput = $('#nikename');
    $('#create-nike-name').on('click', function() {
        var nikename = randomName.getName();
        $nikeInput.val(nikename);
    });
}

function goPingxingyuzhou() {
    var yimg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjU3MDUwODAyMzIwQzExRUM4RUI4OTJCNjUyMTIzMzQ3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjU3MDUwODAzMzIwQzExRUM4RUI4OTJCNjUyMTIzMzQ3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTcwNTA4MDAzMjBDMTFFQzhFQjg5MkI2NTIxMjMzNDciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NTcwNTA4MDEzMjBDMTFFQzhFQjg5MkI2NTIxMjMzNDciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4g6qesAABTDElEQVR42ty9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';
    var $thanksList = $('#slide-thanks-list');
    var $second = $thanksList.find('.thanks-item').eq(1);
    var $img = $second.find('img').eq(0);
    var $name = $second.find('.name').eq(0);
    var $p = $second.find('p').eq(1);
    $img.attr('src', yimg);
    $name.text('\u8001\u5a46\u002d\u6768\u9759\u96ef');
    $p.text('\u4f46\u66fe\u76f8\u89c1\u672a\u76f8\u77e5\u3002\u5728\u6211\u5fc3\u4e2d\uff0c\u4f60\u59cb\u7ec8\u8fd8\u662f\u90a3\u4e2a\u5e74\u5c11\u7684\u6a21\u6837\u2665\uff0c\u5e0c\u671b\u6765\u751f\u6709\u671d\u4e00\u65e5\u4e0e\u4f60\u518d\u5ea6\u76f8\u9022\u3002');
}

// 发布留言
function sendLiveMessage() {
    /* 规定验证状态 */
    // 当天未评论 但已经发送验证码
    var ERR_HAS_SEND_EMAIL = 200;
    // 当天已经评论
    var ERR_HAS_LIVE_MES = 100;
    // 验证码验证失败
    var ERR_VERIFY = 10;
    // 数据库存储失败
    var ERR_DATA_SAVE = 1;
    // 没有任何问题
    var ERR_OK = 0;
    // 用户被禁言
    var ERR_HAS_STOP_SAY = 300;

    var $submitBtn = $('#submit-btn');
    var $textarea = $('#message-text');
    var $textCount = $('#text-count');
    var $emailInput = $('#email-input');
    var $emailing = $('#live-msg-emailing');
    var $checking = $('#live-msg-checking');
    var $nikename = $('#nikename');
    var $uAvatarImg = $('#your-avatar-img');
    var $uAvatarListImgs = $('#your-avatar-list').find('img');
    var layerLoad = null;

    // 检测用户邮箱
    var URL_CHECK_USER_EMAIL = '/apimessage/checkuseremail';
    // 发送验证邮件
    var URL_SEND_EMAIL = '/apimessage/sendverify';
    // 提交留言
    var URL_SEND_MESSAGE = '/apimessage/sendmessage';

    function sendMes() {
        // 用于储存留言
        this.text = '';
        // 用于存储用户邮箱
        this.email = '';
        // 用于存储用户昵称
        this.nikename = '';
        // 存储用户头像索引
        this.avatarIndex = 0;

        this.init();
    }

    sendMes.prototype = {
        init: function() {
            this.inputTextarea();
            this.submit();
        },
        submit: function() {
            var self = this;
            $submitBtn.on('click', function() {
                var text = $.trim($textarea.val());
                var email = $.trim($emailInput.val());
                var nikename = $.trim($nikename.val());

                if(!text) {
                    layer.msg('请填写留言内容后再进行提交');
                    return;
                }
                if(text.length < 10) {
                    layer.msg('留言内容不能低于10个字符！');
                    return;
                }
                // 如果昵称存在那么必须2-20之间
                if(nikename && 
                   (nikename.length > 20 || nikename.length < 2)) {
                    layer.msg('昵称必须在2-20字之间');
                    return;
                }
                if(!email || !self._checkEmail(email)) {
                    layer.msg('请填写有效邮箱地址后再提交');
                    return;
                }
                // 全局存储留言、邮箱
                self.text = text;
                self.email = email;
                self.nikename = nikename ? nikename : '';
                self.avatarIndex = self._getAvatarIndex();

                self._ajaxSendCheck();
            });
        },
        // 获取头像的索引
        _getAvatarIndex: function() {
            var len = $uAvatarListImgs.length;
            var avatarIndex = $uAvatarImg.attr('data-uavatar');
            avatarIndex = (avatarIndex <= len && avatarIndex >= 0 ) ? avatarIndex : 0;
            return parseInt(avatarIndex);
        },
        // 打开验证码输入框
        _openPrompt: function() {
            var self = this;
            layer.prompt({
                formType: 3,
                title: '请输入您邮箱中的验证码',
            }, function(value, index, elem){
                // value是input中的值
                layer.close(index);
                self._ajaxSendMessage(value);
            });
        },
        // 发送前对当前邮箱进行验证
        _ajaxSendCheck: function() {
            var self = this;
            $checking.fadeIn();
            $.ajax({
                url: URL_CHECK_USER_EMAIL,
                type: 'POST',
                data: { email: self.email },
                dataType: 'json',
                // 请求等待的时间10秒
                timeout: 10000
            })
            .done(function(res) {
                setTimeout(function () {
                    // 回调执行时候隐藏
                    $checking.hide();
                    // 未评论未发送验证码 则发送验证邮件
                    if(res.error == ERR_OK) {
                        self._ajaxSendEmail();
                        return;
                    }
                    // 当天已经留言了
                    if(res.error == ERR_HAS_LIVE_MES) {
                        layer.msg('您今天已提交过留言啦，每日只能发布一条留言');
                        return;
                    }
                    // 用户被禁言
                    if(res.error == ERR_HAS_STOP_SAY) {
                        layer.msg('抱歉，您已经被禁言了。');
                        return;
                    }
                    // 当天未评论 但已经发送验证码
                    if(res.error == ERR_HAS_SEND_EMAIL) {
                        var msg = '系统检测到已发送验证码至您的' + res.data.email + '邮箱中，是否需要重新发送？';
                        layer.confirm(msg, {
                            btn: ['确定', '输入验证码']
                        }, function(index, layero){
                            // 确定回调
                            layer.close(index);
                            self._ajaxSendEmail();
                        }, function(index){
                            // 输入验证码回调
                            layer.close(index);
                            self._openPrompt();
                        });
                        return;
                    }
                    // 如果是其他则军代表意外失败
                    layer.alert(res.msg);
                    // console.log(res.code + res.msg);
                }, 500);
            })
            .fail(function () {
                $checking.hide();
                layer.alert('校验发送失败，请检查网络环境后刷新页面重试');
            })
            ;
        },
        _ajaxSendEmail: function() {
            var self = this;
            $emailing.fadeIn();
            $.ajax({
                url: URL_SEND_EMAIL,
                type: 'POST',
                data: { email: self.email },
                dataType: 'json',
                // 请求等待的时间5秒
                timeout: 5000
            })
            .done(function(res) {
                if(res.error === 0) {
                    setTimeout(function() {
                        $emailing.hide();
                        var msg = '验证码已成功发送到您' + self.email + '邮箱中,请查收邮件后点击确定，输入收到的验证码。';
                        layer.alert(msg, {
                            title: '<em class="fa-in-layer-ok fa fa-check-square-o"></em>已发送验证邮件',
                            yes: function(index) {
                                layer.close(index);
                                self._openPrompt();
                            }
                        });
                        // self._openPrompt();
                    }, 1000);
                } else {
                    layer.msg(res.msg);
                    console.log('邮件发送失败，错误码' + res.error);
                    $emailing.fadeOut();
                }
            })
            .fail(function(err) {
                $emailing.hide();
                layer.alert('抱歉，请求发送失败，请刷新重试');
            })
            // 请求完毕后一定执行
            .always(function() {
                //  $emailing.hide();
            });
        },
        // 发送留言内容并进行验证
        _ajaxSendMessage: function(verify) {
            var self = this;
            var obj = {
                verify_code: verify,
                email: self.email,
                live_message: self.text,
                nikename: self.nikename,
                avatar_index: self.avatarIndex
            };
            layerLoad = layer.load(1);
            $.ajax({
                url: URL_SEND_MESSAGE,
                type: 'POST',
                data: obj,
                dataType: 'json',
                timeout: 10000
            })
            .done(function(res) {
                setTimeout(function() {
                    layer.close(layerLoad);

                    // 验证码验证失败
                    if(res.error == ERR_VERIFY) {
                        layer.alert(res.msg, function(index) {
                            layer.close(index);
                            self._openPrompt();
                        });
                        return;
                    }

                    // 其他存储问题
                    if(res.error !== ERR_OK) {
                        layer.alert(res.msg);
                        return;
                    }

                    layer.msg(res.msg);

                }, 500);
            })
            .fail(function() {
                layer.close(layerLoad);
                layer.alert('抱歉，请求发送失败，请刷新重试');
            })
            .always(function() {
                // layer.close(layerLoad);
            });
        },
        inputTextarea: function() {
            $textarea.on('input', function() {
                var len = $textarea.val().length;
                $textCount.text(len);
            });
        },
        _checkEmail: function(email) {
            return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email);
        }
    }

    return new sendMes();
}

// 加载更多留言
function loadMoreMessage() {
    var ERR_OK = 0;
    // 如果上传gitee后 图片路径
    // var assetsPath = '/assets/';
    // var assetsPath = 'https://634174214.gitee.io/myblog-www-assets/';
    var assetsPath = ASSETS_URL;
    var $loadmore = $('#message-load-more');
    var $mesList = $('#live-message-list');
    var $emptyList = $('#empty-message-list');

    // 初始化获取所有留言
    var URL_ALL_MESSAGE = '/apimessage/allmes';

    function loadmore() {
        // 默认是第一页
        this.nowPage = 1;

        this.init();
    }
    loadmore.prototype = {
        init: function() {
            // 用于存储每次获得的留言列表
            this.meslist = [];
            // 用于记录获取到数据的页码
            this.getPage = 1;

            this.inintList();

            this.beginLoad();
        },
        // 初始化获取留言列表 改为php动态插入
        inintList: function() {
            var self = this;
            $.ajax({
                url: URL_ALL_MESSAGE,
                type: 'GET',
                dataType: 'json',
                timeout: 10000,
                data: { page: self.nowPage }
            })
            .done(function(res) {
                if(res.error === ERR_OK) {
                    if(res.data.length <= 0 ||
                        res.data.live_messages.length <= 0
                    ) {
                        self._initListFail('目前还没有人留言，还不快来抢占沙发~');
                        return;
                    }
                    self.meslist = res.data.live_messages;
                    self.getPage = res.data.page;
                    self._appendList();

                    self.getPage++;
                } else {
                    self._initListFail();
                }
            })
            .fail(function() {
                self._initListFail();
            })
        },
        _initListFail: function(text) {
            text = text || '抱歉，留言展示暂时关闭~'
            $emptyList.text(text).fadeIn();
            $mesList.hide();
            $loadmore.hide();
        },
        // 开始加载
        beginLoad: function() {
            var self = this;
            $loadmore.on('click', '.no-load', function() {
                self._setLoadStatus('loading');
                self._ajaxLoadMore();
            });
        },
        // 加载状态
        _setLoadStatus: function(status) {
            switch(status) {
                // 加载中
                case 'loading':
                    $loadmore.addClass('loading');
                    break;
                // 加载全部完成
                case 'loaded':
                    $loadmore.removeClass('loading').addClass('loaded-over');
                    break;
                // 加载暂停 等待结束 
                case 'pause':
                    $loadmore.removeClass('loading');
                    break;
            }
        },
        _ajaxLoadMore: function() {
            var self = this;
            self.nowPage++;
            $.ajax({
                url: URL_ALL_MESSAGE,
                type: 'GET',
                dataType: 'json',
                timeout: 10000,
                data: { page: self.nowPage }
            })
            .done(function(res) {
                if(res.error === ERR_OK) {
                    self.meslist = res.data.live_messages;
                    self.getPage = res.data.page;

                    setTimeout(function() {
                        if(res.data.live_messages.length <= 0) {
                            self._setLoadStatus('loaded');
                            return;
                        }
                        self._appendList();
                    }, 1000);
                } else {
                    layer.msg('数据获取失败，请稍后刷新重试');
                    setTimeout(function() {
                        self._setLoadStatus('pause');
                    }, 1000);
                }
            })
            .fail(function() {
                layer.alert('抱歉，留言获取失败，请稍后重试');
            })
            // 成功或者失败最终都执行
            .always(function() {
                setTimeout(function() {
                    self._setLoadStatus('pause');
                }, 1000);
            })
            ;
        },
        _appendList: function() {
            var self = this;
            var html = '';
            // console.log(self.meslist)
            $.each(self.meslist, function(index, item) {
                html += self._tplMoreItme(item);
            });
            $mesList.append($(html));
        },
        // 获取用户假定头像
        _getUavatar: function(u_avatar_num) {
            var src = 'live-message-u-avatar-' + u_avatar_num + '.png';
            src = assetsPath + 'img/' + src;
            return src;
        },
        // 获取我的假定头像
        _getMyAvatar: function(my_avatar_num) {
            my_avatar_num = my_avatar_num || 1;
            var src = 'live-message-my-avatar-' + my_avatar_num + '.png';
            src = assetsPath + 'img/' + src;
            return src;
        },
        // 加载更多的模版
        _tplMoreItme: function(obj) {
            // 用户头像
            var u_avatar = this._getUavatar(obj.u_avatar);
            var my_avatar = '';
            var u_name = obj.nikename ? obj.nikename : obj.u_email;
            var hasReply = (obj.reply_message && obj.reply_time) ? true : false;
            if(hasReply) {
                my_avatar = this._getMyAvatar(obj.reply_myavatar);
            }
            
            var tpl = '<li>';
                tpl += '<div class="clear">';
                tpl += '<div class="mes-avatar"><img src="' + u_avatar + '"></div>';
                tpl += '<dl class="mes-content">';
                tpl += '<dt>';
            if(obj.ischoosen === 1) {
                tpl += '<span class="choosed"><i class="icon fa fa-star"></i>精选</span>';
            }
                tpl += '<span class="name">' + u_name + '</span>';
                tpl += '<span class="time">发布于 ' + obj.u_send_time + '</span>';
                tpl += '</dt>';
                tpl += '<dd>' + obj.u_message + '</dd>';
                tpl += '</div>';
            if(hasReply) {
                tpl += '<div class="reply">';
                tpl += '<div class="reply-inner">';
                tpl += '<img src="' + my_avatar + '" class="reply-avatar">';
                tpl += '<dl class="reply-content">';
                tpl += '<dt>';
                tpl += '<span class="name">' + obj.reply_myname + '</span>';
                tpl += '回复于<span class="date">' + obj.reply_time + '</span>';
                tpl += '</dt>';
                tpl += '<dd>' + obj.reply_message + '</dd>';
                tpl += '</dl>';
                tpl += '</div>';
                tpl += '</div>';
            }
            tpl += '</li>';

            return tpl;
        }
    }

    return new loadmore();
}

// 精选留言随机刷新
function refreshChoosen() {
    var ERR_OK = 0;
    var $refreshBtn = $('#refresh-choosen');
    var $list = $('#choosen-list');
    // 允许点击间隔时间
    var MAX_TIME = 5;

    var URL_CHOOSEN_GET = '/apimessage/choosenmessage';

    function choosen() {
        this.init();
    }
    choosen.prototype = {
        init: function() {
            // 存储精选列表
            this.list = [];
            // 用于记录是否支持请求的状态
            this.allowRefresh = true;
            this.timer = null;
            // 倒计时的秒
            this.second = MAX_TIME;

            this.refresh();
        },
        refresh: function() {
            var self = this;
            $refreshBtn.on('click', function() {
                layer.closeAll();
                if(!self.allowRefresh) {
                    var second = (self.second <= 0) ? 1 : self.second;
                    var msg = '您的点击太频繁了，请 ' +second + ' 秒后重试';
                    layer.msg(msg);
                    return;
                }
                self._ajaxGetChoosen();
            });
        },
        // 设置允许的状态 开启定时器
        _setAllowed: function() {
            var self = this;
            this.timer = setInterval(function() {
                self.second--;
                if(self.second < 0) {
                    clearInterval(self.timer);
                    // 重置状态以及倒计时秒
                    self.allowRefresh = true;
                    self.second = MAX_TIME;
                    return;
                }
            }, 1000);
        },
        _ajaxGetChoosen: function() {
            var self = this;
            $.ajax({
                url: URL_CHOOSEN_GET,
                type: 'GET',
                dataType: 'json'
            })
            .done(function(res) {
                if(res.error === ERR_OK) {
                    if (res.data.choosen_list.length <= 0) {
                        layer.msg('希望您就是下一位被选中的少年！');
                        return;
                    }
                    self.list = res.data.choosen_list;
                    self.allowRefresh = false;
                    $list.empty();

                    setTimeout(function() {
                        self._appendEl();
                        self._setAllowed();
                    }, 1000);

                }
            })
            ;
        },
        _appendEl: function() {
            var self = this;
            var html = '';
            $.each(self.list, function(index, item) {
                html += self._tplItme(item);
            });
            $list.append($(html));
        },
        _tplItme: function(obj) {
            var u_name = obj.nikename ? obj.nikename : obj.u_email;
            var tpl = '<li class="bestmes-item">';
                tpl += '<p>' + obj.u_message + '</p>';
                tpl += '<div class="mes-info">';
                tpl += '<span class="name">' + u_name + '</span>';
                tpl += '<span class="time">' + obj.u_send_time + '</span>';
                tpl += '</div>';
                tpl += '</li>';
            return tpl;
        }
    }
    return new choosen();
}

// 滚动固定
function scrollToFixed() {
    if (!support.ispc) {
        return;
    }
    var $bestmes = $("#slide-bestmes");
    var top = $bestmes.offset().top - 80;
    $(window).on('scroll', function () {
        var scrollTop = $(window).scrollTop();
        if (scrollTop > top) {
            $bestmes.addClass('fixed');
        } else {
            $bestmes.removeClass('fixed');
        }
    });
}

ZanPayScroll();
UAvatarChoose();
createNikeName();
sendLiveMessage();
loadMoreMessage();
refreshChoosen();
scrollToFixed();