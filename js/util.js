// ---------------------\\
// JavaScript工具集合	\\
// Author: CoffeeKiller	\\
// Date: 2023_10_28		\\
// ---------------------\\


/**
  * @description: 防抖函数
  * @param {Function} fn: 回调函数
  * @param {number} delay: 延时
  * @param {boolean} immediate: 是否立即调用
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
  * @param {Function} fn: 回调函数
  * @param {number} interval: 时间间隔
  * @param {object} options: 可选参数 { leading首次触发, trailing最后触发 }
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
  * @description 获取URL参数
  * @param {string} name: 参数名称
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
  * @param {URL} url: URL链接
  * @param {string} arg: 需要修改的参数名
  * @param {Object} arg_val: 参数对象
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
 * 简单预加载图片
 * @param {string} url 图片url
 * @returns Promise
 * */ 
function loadImage(url){
    return new Promise((resolve, reject) => {
        let temp_img = new Image();
        temp_img.src = url;
        temp_img.onload = () => {
            resolve("load success");
        }
        temp_img.onerror = () => {
            reject("load error: " + temp_img.src);
        }
        temp_img = null;
    })
}



/**
 * 获取 URL 中的参数并转换为对象格式
 * @returns { key : value }
*/
function getQueryObject() {
    let objString = arguments.length > 0 && arguments[0] !== undefined
                    ? arguments[0] : window.location.href
    objString = objString.replace(/#.*\?/, '&')
    
    if (/\?.*#/.test(objString)) objString = objString.replace(/#.*/, '')
    if (objString.startsWith('&')) objString = objString.substr(1)
    if (objString.endsWith('&')) objString = objString.substr(0, objString.length-1)

    const result = {}
    objString.replace(/([^?&=]+)=([^?&=]*)/g, (rs, $1, $2) => {
        result[decodeURI($1)] = String(decodeURI($2))
        return rs
    })
    return result
}



/**
 * 异步加载 script 脚本
 * @param {string} url script脚本URL
 * */ 
function loadScript(url) {
    return new Promise(function (resolve) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        // IE6-8
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == 'loaded' || script.readyState == 'complete') {
                    script.onreadystatechange = null;
                    resolve(url);
                }
            };
        }
        // ie9+,chrome,ff
        else {
            script.onload = function () {
                resolve(url);
            };
        }
        const oHead = document.getElementsByTagName('head')[0];
        oHead.appendChild(script);
    });
};



/**
 * 使用对象的格式来更新 URL, 
 * 需要配合 getQueryObject 和 formatUrlParams 函数使用
 * @param {string} params.link 新URL (无参数)
 * @param {Object} params.params 需要转换为 query 参数的对象
 * @param {change} params.change 是否更新链接参数
 * */ 
function updateQueryParam(params) {
    
    const config = Object.assign({
        link: '',
        params: {},
        change: false,
    }, params)

    const CSS_STYLE = 'font-size:20px;color:orange;'
    const updateParams = Object.assign(getQueryObject(), config.params)
    console.log('%c更新的链接参数%v', CSS_STYLE, updateParams);

    let newUrl = ''
    if (config.link) {
        newUrl = config.link+'?'+formatUrlParams(updateParams, true) + window.location.hash
    } else {
        newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname
                    + '?' + formatUrlParams(updateParams, true) + window.location.hash
    }

    console.log('%c更新的链接%s', CSS_STYLE, newUrl);
    if (config.change) window.history.replaceState(null, '', newUrl)
    else return newUrl
}

/**
 * 将对象格式的数据来转换为 URL query 参数
 * @param { Object } params 需要转换为 query 参数的对象
 * @returns &k1=v1&k2=v2
 * */ 
function formatUrlParams(params, slice) {
    var src = '';
    for (var key in params) {
        src += '&' + key + '=' + params[key];
    }
    return slice ? src.slice(1) : src;
};




/**
 * 更加美观的控制台 log 输出, 允许自定义颜色和标题
 * @param {Object} options 添加自定义的样式对象
 * @returns {Object}
 * @example window.log = MyLog({ cust: { defaTitle:'自定义', color:'deepskyblue' } })
 * */ 
function MyLog(options) {

    const config = Object.assign({
        info: { defaTitle:'Info', color:'#909399'},
        error: { defaTitle:'Error', color:'#F56C6C'},
        warning: { defaTitle:'Warning', color:'#E6A23C'},
        success: { defaTitle:'Success', color:'#67C23A'},
    }, options)

    const isEmpty = (value) => {
        return value == null || value === undefined || value === ''
    }

    const myPrint = (title, text, color) => {
        console.log(
            `%c ${title} %c ${text} %c`,
            `background:${color};border:1px solid ${color}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
            `border:1px solid ${color}; padding: 1px; border-radius: 0 2px 2px 0; color: ${color};`,
            'background:transparent'
        )
    }

    return (() => {
        const _obj = {}
        Object.keys(config).forEach( key => {
            Object.defineProperty(_obj, key, {
                value: (textOrTitle, content = '') => {
                    const title = isEmpty(content) ? config[key].defaTitle : textOrTitle
                    const text = isEmpty(content) ? textOrTitle : content
                    myPrint(title, text, config[key].color)
                }
            })
        })
        return _obj
    })()
};

/**
 * 更加美观的控制台 log 输出, 允许自定义颜色和标题 (使用类的方式书写)
 * @param {Object} options 添加自定义的样式对象
 * @example const iLog = new ILog()
 * */ 
class ILog {

    config = {}
    
    constructor(options) {

        this.config = Object.assign({
            info: { defaTitle:'Info', color:'#909399'},
            error: { defaTitle:'Error', color:'#F56C6C'},
            warning: { defaTitle:'Warning', color:'#E6A23C'},
            success: { defaTitle:'Success', color:'#67C23A'},
        }, options)

        Object.keys(this.config).forEach( key => {
            Object.defineProperty(this, key, {
                value: (textOrTitle, content = '') => {
                    const title = this.isEmpty(content) ? this.config[key].defaTitle : textOrTitle
                    const text = this.isEmpty(content) ? textOrTitle : content
                    this.myPrint(title, text, this.config[key].color)
                }
            })
        })
    }

    isEmpty(value) {
        return value == null || value === undefined || value === ''
    }

    myPrint(title, text, color) {
        console.log(
            `%c ${title} %c ${text} %c`,
            `background:${color};border:1px solid ${color}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
            `border:1px solid ${color}; padding: 1px; border-radius: 0 2px 2px 0; color: ${color};`,
            'background:transparent'
        )
    }
}