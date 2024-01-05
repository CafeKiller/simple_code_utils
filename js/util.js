// ---------------------\\
// JavaScript工具集合	\\
// Author: CoffeeKiller	\\
// Date: 2023_10_28		\\
// ---------------------\\


/**
  * @description: 防抖函数
  * @param: {Function} fn: 回调函数
  * @param: {number} delay: 延时
  * @param: {boolean} immediate: 是否立即调用
  */
function debounce(fn, delay, immediate = false) {
    let timer = null
    let isInvoke = false

    const _debounce = function(...args) {
        return new Promise((resolve, reject) => {
            if (timer) clearTimeout(timer)

            if (immediate && !isInvoke) {
                const result = fn.apply(this, args)
                resolve(result)
                isInvoke = true
            } else {
                timer = setTimeout(() => {
                const result = fn.apply(this, args)
                resolve(result)
                isInvoke = false
                timer = null
                }, delay)
            }
        })
    }

    _debounce.cancel = function() {
        if (timer) clearTimeout(timer)
        timer = null
        isInvoke = false
    }

    return _debounce
}

/**
  * @description: 节流函数
  * @param: {Function} fn: 回调函数
  * @param: {number} interval: 时间间隔
  * @param: {object} options: 可选参数 { leading首次触发, trailing最后触发 }
  */
function throttle(fn, interval, options = { leading: true, trailing: false }) {
    const { leading, trailing, resultCallback } = options
    let lastTime = 0
    let timer = null
  
    const _throttle = function(...args) {
      return new Promise((resolve, reject) => {
        const nowTime = new Date().getTime()
        if (!lastTime && !leading) lastTime = nowTime
  
        const remainTime = interval - (nowTime - lastTime)
        if (remainTime <= 0) {
          if (timer) {
            clearTimeout(timer)
            timer = null
          }
  
          const result = fn.apply(this, args)
          resolve(result)
          lastTime = nowTime
          return
        }
  
        if (trailing && !timer) {
          timer = setTimeout(() => {
            timer = null
            lastTime = !leading ? 0: new Date().getTime()
            const result = fn.apply(this, args)
            resolve(result)
          }, remainTime)
        }
      })
    }
  
    _throttle.cancel = function() {
      if(timer) clearTimeout(timer)
      timer = null
      lastTime = 0
    }
    return _throttle
}
  
/**
  * @description: 获取URL参数
  * @param: {string} name: 参数名称
  */
function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var reg_rewrite = new RegExp('(^|/)' + name + '/([^/]*)(/|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  var q = window.location.pathname.substr(1).match(reg_rewrite)
  if (r != null) {
    return unescape(r[2])
  } else if (q != null) {
    return unescape(q[2])
  } else {
    return ''
  }
}

/**
  * @description: 修改URL参数
  * @param: {URL} url: URL链接
  * @param: {string} arg: 需要修改的参数名
  * @param: {Object} arg_val: 参数对象
  */
function changeURLArg(url, arg, arg_val) {
  var pattern = arg + '=([^&]*)';
  var replaceText = arg + '=' + arg_val;
  if (url.match(pattern)) {
    var tmp = '/(' + arg + '=)([^&]*)/gi';
    tmp = url.replace(eval(tmp), replaceText);
    return tmp;
  } else {
    if (url.match('[\?]')) {
      return url + '&' + replaceText;
    } else {
      return url + '?' + replaceText;
    }
  }
}

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
	  if (!win.addEventListener) {
		return
	  }
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
		adaptVP({
		  uWidth: 750
		})
	  }
	  win.addEventListener("resize", setFont, false);
	  setFont()
	} else {
	  if (mode == "rem") {
		var docEl = doc.documentElement,
		  resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
		  recalc = function () {
			var clientWidth = docEl.clientWidth;
			if (!clientWidth) {
			  return
			}
			docEl.style.fontSize = 100 * (clientWidth / std) + "px"
		  };
		if (!doc.addEventListener) {
		  return
		}
		recalc();
		win.addEventListener(resizeEvt, recalc, false);
		doc.addEventListener("DOMContentLoaded", recalc, false)
	  }
	}
  }
})(window, document, "px");



/**
  * @describe: 实现页面元素的瀑布流, 当前只适配px单位
  * @date: 2023_11_20 23:29
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
 * @description 获取指定范围内的指定数量的随机数数组 (默认范围1-27, 数量5)
 * @param {Array} oldNums 旧随机数数组, 旧值不会出现在新的随机数数组内 (默认不启用)
 * @returns {Array} 随机数数组
 * */ 
function genRandomNum(start=1, end=27, count=5, oldNums=[0]) {
    const numbers = Array.from(Array(end - start + 1).keys(), (x) => x + start);
    const result = [];
    for (let i = 0; i < count; i++) {
      const index = Math.floor(Math.random() * numbers.length);
      if (numbers.length <= 0) {
        break;
      }
      result.push(numbers[index]);
      numbers.splice(index, 1);
    }
    if ( oldNums.find(item => result.includes(item)) ) {
        return genRandomNum(start, end, count, oldNums)
    }
    return result;
}