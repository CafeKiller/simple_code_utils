type Func = (...args: any[]) => any

/**
 * @description 节流函数
 * @param func 回调函数
 * @param interval 延时
 * */
export function throttle(func: Func, interval: number, options = { leading: false, trailing: true }) {
    let timer: null | ReturnType<typeof setTimeout> = null;
    let lastTime = 0;
    const { leading, trailing } = options;
    const _throttle = function(this: unknown, ...args: any[]) {
        const nowTime = Date.now();
        if (!lastTime && !leading) lastTime = nowTime;
        const remainTime = interval - (nowTime - lastTime);
        if (remainTime <= 0) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            lastTime = nowTime;
            func.apply(this, args);
        }
        if (trailing && !timer) {
            timer = setTimeout(() => {
                lastTime = !leading ? 0 : Date.now();
                timer = null;
                func.apply(this, args);
            }, remainTime);
        }
    };
    _throttle.cancel = function() {
        if (timer) clearTimeout(timer);
        timer = null;
        lastTime = 0;
    };
    return _throttle;
}

/**
 * @description 防抖函数
 * @param func 回调函数
 * @param delay 延时
 * */
export function debounce(func: Func, delay: number, immediate?: boolean, resultCallback?: Func) {
    let timer: null | ReturnType<typeof setTimeout> = null;
    let isInvoke = false;
    const _debounce = function(this: unknown, ...args: any[]) {
        return new Promise((resolve, reject) => {
            if (timer) clearTimeout(timer);
            if (immediate && !isInvoke) {
                try {
                    const result = func.apply(this, args);
                    if (resultCallback) resultCallback(result);
                    resolve(result);
                } catch (e) {
                    reject(e);
                }
                isInvoke = true;
            } else {
                timer = setTimeout(() => {
                    try {
                        const result = func.apply(this, args);
                        if (resultCallback) resultCallback(result);
                        resolve(result);
                    } catch (e) {
                        reject(e);
                    }
                    isInvoke = false;
                    timer = null;
                }, delay);
            }
        });
    };
    _debounce.cancel = function() {
        if (timer) clearTimeout(timer);
        isInvoke = false;
        timer = null;
    };
    return _debounce;
}

/**
 * @description 判断当前页面是否到达页面最底部
 * @return true 表示到达最底部, false 表示未到达
 * */
export const hasPageBottom = ():boolean => {
    // 距离顶部距离
    let scrollTop:number = document.documentElement.scrollTop || document.body.scrollTop
    // 当前窗口高度
    let pageHeight:number = document.documentElement.clientHeight
    // 页面总高度

    let scrollHeight:number = document.documentElement.scrollHeight
    if (scrollTop + pageHeight+1 >= scrollHeight){
        return true
    }
    return false
}

/**
 * 更加美观的控制台 log 输出, 允许自定义颜色和标题
 * @param { LogStyle } options 添加自定义的样式对象
 * @returns {Object}
 * @example window.log = MyLog({ cust: { defaTitle:'自定义', color:'deepskyblue' } })
 * */ 
type LogStyle = {
    [key: string]: {
        defaTitle: string,
        color: string
    }
}
function MyLog(options: LogStyle) : {} {

    const config = Object.assign({
        info: { defaTitle:'Info', color:'#909399'},
        error: { defaTitle:'Error', color:'#F56C6C'},
        warning: { defaTitle:'Warning', color:'#E6A23C'},
        success: { defaTitle:'Success', color:'#67C23A'},
    }, options)

    const isEmpty = (value: string) => {
        return value == null || value === undefined || value === ''
    }

    const myPrint = (title: string, text: string, color: string) => {
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
                value: (textOrTitle: string, content = '') => {
                    const title = isEmpty(content) ? config[key].defaTitle : textOrTitle
                    const text = isEmpty(content) ? textOrTitle : content
                    myPrint(title, text, config[key].color)
                }
            })
        })
        return _obj
    })()
};

const log = MyLog({
    cust: { defaTitle:'自定义', color:'deepskyblue' }
})

/**
 * 更加美观的控制台 log 输出, 允许自定义颜色和标题 (使用类的方式书写)
 * @param {Object} options 添加自定义的样式对象
 * @example const iLog = new ILog()
 * */ 
class ILog {
    config = {}
    constructor(options: LogStyle) {

        this.config = Object.assign({
            info: { defaTitle:'Info', color:'#909399'},
            error: { defaTitle:'Error', color:'#F56C6C'},
            warning: { defaTitle:'Warning', color:'#E6A23C'},
            success: { defaTitle:'Success', color:'#67C23A'},
        }, options)

        Object.keys(this.config).forEach( key => {
            Object.defineProperty(this, key, {
                value: (textOrTitle: string, content = '') => {
                    const title = this.isEmpty(content) ? this.config[key].defaTitle : textOrTitle
                    const text = this.isEmpty(content) ? textOrTitle : content
                    this.myPrint(title, text, this.config[key].color)
                }
            })
        })
    }

    isEmpty(value: string) {
        return value == null || value === undefined || value === ''
    }

    myPrint(title: string, text: string, color: string) {
        console.log(
            `%c ${title} %c ${text} %c`,
            `background:${color};border:1px solid ${color}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
            `border:1px solid ${color}; padding: 1px; border-radius: 0 2px 2px 0; color: ${color};`,
            'background:transparent'
        )
    }
}