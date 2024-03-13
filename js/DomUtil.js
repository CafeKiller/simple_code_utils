/**
 * 创建一个音频播放管理对象
 * @param {string} [BGDomID='audioBg'] 用于播放背景音乐的 audio 标签ID
 * @param {string} [BGBtn=".music-btn"] 用于控制音乐是否播放的 class 标签
 * */ 
function createBGMusic(BGDomID = 'audioBg', BGBtn = ".music-btn" ) {
    // 自动播放
    var isAudioInit = false;
    var bgAudio = document.getElementById(BGDomID);
  
    var _play = function () {
        if (!isAudioInit) {
            bgAudio.play();
            isAudioInit = true;
        };
        document.removeEventListener('click', _play, false);
    }
  
    document.addEventListener('click', _play, false);
  
    var ready = function () {
        WeixinJSBridge.on('onPageStateChange', function (res) {
            if (res.active == 'false') {
                bgAudio.pause();
            } else {
                if (isBgAudioPlaying) {
                    toggleBgAudio(true);
                }
            }
        })
        _play();
    }
    // 处理微信相关
    if (!window.WeixinJSBridge || !WeixinJSBridge.invoke) {
        document.addEventListener('WeixinJSBridgeReady', ready, false)
    } else {
        ready()
    }
  
    // 监听页面是否进入后台
    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            bgAudio.pause();
        } else {
            if (isBgAudioPlaying) toggleBgAudio(true);
        }
    });
  
    // 音乐开关
    var _musicBTN = document.querySelector(BGBtn)
    var isBgAudioPlaying = true
    function toggleBgAudio(isplay) {
        if (isplay) {
            bgAudio.play()
            _musicBTN && (_musicBTN.classList.remove('off'))
        } else {
            bgAudio.pause()
            _musicBTN && (_musicBTN.classList.add('off'))
        }
        isBgAudioPlaying = isplay
    }
    if (_musicBTN) {
        _musicBTN.addEventListener('click', function () {
            toggleBgAudio(!isBgAudioPlaying)
        })
    }
  
    // 音效
    var isPlaying = false
    function playSoundEffect(id, force = true, fn) {
        if (isBgAudioPlaying) {
            if (force || !isPlaying) {
                var snd = document.createElement('audio')
                snd.src = id
                snd.onended = function() {
                    isPlaying = false
                    fn && fn()
                };
                snd.play()
                isPlaying = true
            }
        }
    }
  
    return {
        muted: () => !isBgAudioPlaying,
        playSoundEffect,
    }
}



/**
 * @description 判断元素有没有子元素 
 * @param {HTMLElement} e 
 * @returns true存在 | false不存在
*/
function hasChildren(e){
    let children = e.childNodes,
        len = children.length;

    for (let i = 0; i < len; i++) {
        if (children[i].nodeType === 1) {
          return true;
        }
    }
    return false;
}



/**
 * @description 实现页面元素的瀑布流, 当前只适配px单位
*/
class Waterfall {
    constructor(options) {
        this.$el = null;             // 父容器
        this.count = 4;              // 列数
        this.gap = 10;               // 间距
        Object.assign(this, options);
        this.width = 0;              // 列的宽度
        this.items = [];             // 子元素集合
        this.H = [];                 // 存储每列的高度方便计算
        this.flag = null;            // 虚拟节点集合
        this.init();
    }
    init() {
        this.items = Array.from(this.$el.children);
        this.reset();
        this.render();
    }
    reset() {
        this.flag = document.createDocumentFragment();
        this.width = this.$el.clientWidth / this.count;
        this.H = new Array(this.count).fill(0);
        this.$el.innerHTML = "";
    }

    render() {
        const { width, items,flag,H,gap } = this;
        items.forEach(item => {
            item.style.width = width + "px";
            item.style.position = "absolute";
            let img = item.querySelector("img");
            if(img.complete){
                let tag = H.indexOf(Math.min(...H)); 
                item.style.left = tag * (width + gap) + "px";
                item.style.top = H[tag] + "px";                  
                H[tag] += img.height*width/ img.width + gap;
                flag.appendChild(item);
            }
            else{
                img.addEventListener("load", () => {
                    let tag = H.indexOf(Math.min(...H)); 
                    item.style.left = tag * (width + gap) + "px";
                    item.style.top = H[tag] + "px";                  
                    H[tag] += img.height*width/ img.width + gap;
                    flag.appendChild(item);
                    this.$el.append(flag);
                })
            }
        })
        this.$el.append(flag);
    }
}

// 使用示例
window.onload = new Waterfall({
    $el: document.querySelector(".wrapper"),
    count: 4,
    gap: 10
})


/**
  * @description: 移动端页面适配 单位转换 ,支持px与rem
  * @param: {win} Window
  * @param: {doc} Document
  * @param: {mode} string: 单位模式, 提供px和rem可选
  */
(function (win, doc, mode) {
    var std = 750;
    if (/(iPhone|iPad|iPod|iOS|Android|Windows Phone|BlackBerry|SymbianOS)/i.test(navigator.userAgent)) {
        var h = document.getElementsByTagName("head")[0];
        h.insertAdjacentHTML("beforeEnd", '<meta name="apple-mobile-web-app-capable" content="yes">');
        h.insertAdjacentHTML("beforeEnd", '<meta name="apple-mobile-web-app-status-bar-style" content="black">');
        h.insertAdjacentHTML("beforeEnd", '<meta name="format-detection" content="telephone=no">');
        h.insertAdjacentHTML("beforeEnd",
            '<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,minimal-ui" />'
            );
        if (mode == "px") {
            if (!win.addEventListener) { return }
            var html = document.documentElement;
            function setFont() {
                function adaptVP(a) {
                    function c() {
                        var c, d;
                        return b.uWidth = a.uWidth ? a.uWidth : 750, b.dWidth = a.dWidth ? a.dWidth : window.screen.width ||
                            window.screen.availWidth, b.ratio = window.devicePixelRatio ? window.devicePixelRatio : 1, b
                            .userAgent = navigator.userAgent, b.bConsole = a.bConsole ? a.bConsole : !1, a.mode ? (b.mode = a
                            .mode, void 0) : (c = b.userAgent.match(/Android/i), c && (b.mode = "android-2.2", d = b.userAgent
                            .match(/Android\s(\d+.\d+)/i), d && (d = parseFloat(d[1])), 2.2 == d || 2.3 == d ? b.mode =
                            "android-2.2" : 4.4 > d ? b.mode = "android-dpi" : d >= 4.4 && (b.mode = b.dWidth > b.uWidth ?
                                "android-dpi" : "android-scale")), void 0)
                    }
        
                    function d() {
                        var e, f, g, h, c = "",
                            d = !1;
                        switch (b.mode) {
                            case "apple":
                                f = (window.screen.availWidth * b.ratio / b.uWidth) / b.ratio;
                                c = "width=" + b.uWidth + ",initial-scale=" + f + ",minimum-scale=" + f + ",maximum-scale=" + f +
                                    ",user-scalable=no";
                                break;
                            case "android-2.2":
                                a.dWidth || (b.dWidth = 2 == b.ratio ? 720 : 1.5 == b.ratio ? 480 : 1 == b.ratio ? 375 : 0.75 == b
                                    .ratio ? 240 : 480), e = window.screen.width || window.screen.availWidth, 375 == e ? b
                                    .dWidth = b.ratio * e : 750 > e && (b.dWidth = e), b.mode = "android-dpi", d = !0;
                            case "android-dpi":
                                f = 160 * b.uWidth / b.dWidth * b.ratio, c = "target-densitydpi=" + f + ", width=" + b.uWidth +
                                    ", user-scalable=no", d && (b.mode = "android-2.2");
                                break;
                            case "android-scale":
                                c = "width=" + b.uWidth + ", user-scalable=no"
                        }
                        g = document.querySelector("meta[name='viewport']") || document.createElement("meta"), g.name =
                            "viewport", g.content = c, h = document.getElementsByTagName("head"), h.length > 0 && h[0]
                            .appendChild(g)
                    }
        
                    function e() {
                        var a = "";
                        for (key in b) {
                            a += key + ": " + b[key] + "; "
                        }
                        alert(a)
                    }
                    if (a) {
                        var b = {
                            uWidth: 0,
                            dWidth: 0,
                            ratio: 1,
                            mode: "apple",
                            userAgent: null,
                            bConsole: !1
                        };
                        c(), d(), b.bConsole && e()
                    }
                }
                adaptVP({ uWidth: 750 })
            }
            win.addEventListener("resize", setFont, false);
            setFont()
        } else {
            if (mode == "rem") {
                var docEl = doc.documentElement,
                    resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
                    recalc = function () {
                        var clientWidth = docEl.clientWidth;
                        if (!clientWidth) { return }
                        docEl.style.fontSize = 100 * (clientWidth / std) + "px"
                    };
                if (!doc.addEventListener) { return }
                recalc();
                win.addEventListener(resizeEvt, recalc, false);
                doc.addEventListener("DOMContentLoaded", recalc, false)
            }
        }
    }
  })(window, document, "px");