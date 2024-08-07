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

/**
 * @description 借助HTML5 Blob实现文本信息文件下载
 * @param {*} url 图片url
 * @param {*} name 图片名（需要带后缀，否则默认下载jfit格式）
 */
const downloadRes = async (url, name) => {
    let response = await fetch(url)
    // 内容转变成blob地址
    let blob = await response.blob()
    // 创建隐藏的可下载链接
    let objectUrl = window.URL.createObjectURL(blob)
    let a = document.createElement('a')
    //地址
    a.href = objectUrl
    //修改文件名
    a.download = name
    // 触发点击
    document.body.appendChild(a)
    a.click()
    //移除
    setTimeout(() => document.body.removeChild(a), 1000)
}

/**
 * @description 借助 base64 下载图片资源
 * @param {*} url 图片url
 * @param {*} name 图片名（需要带后缀，否则默认下载jfit格式）
 * */ 
const downloadImg = async (url, name) => {
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL('image/png');
        let a = document.createElement('a');
        a.href = dataURL;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            canvas = null;
        }, 1000);
    };
    img.src = url;
};