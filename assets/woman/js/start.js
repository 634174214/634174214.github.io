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
    }()
  }


  !support.isIe && support.ispc && L2Dwidget.init({
    "model": {
        // jsonPath:"https://unpkg.com/live2d-widget-model-shizuku@1.0.5/assets/shizuku.model.json",
        jsonPath: path,
        "scale": 1
        }, 
        // 设置看板娘的canvas宽高 这里设置后 会X2
        "display": {
            "position": "left", 
            "width":  setting.width, 
            "height": setting.height,
            "hOffset": setting.hOffset, 
            // 垂直方向的偏移量
            "vOffset": setting.vOffset
        }, 
        "mobile": { 
            "show": true, 
            "scale": 2 
        },
        "react": { 
            "opacityDefault": 0.7, 
            "opacityOnHover": 0.2 
        }
});