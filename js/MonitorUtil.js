/**
 * @description 一个简易的原生性能监视器对象, 用于性能监控与数据上报
 * */ 
function createMonitor() {
    const monitor = {
        url: '', // 数据上传地址
        performance: {}, // 性能信息
        resources: {}, // 资源信息
        errors: [], // 错误信息
        user: { // 用户信息
            screen: screen.width, // 屏幕宽度
            height: screen.height, // 屏幕高度
            platform: navigator.platform, // 浏览器平台
            userAgent: navigator.userAgent, // 浏览器的用户代理信息
            language: navigator.language, // 浏览器用户界面的语言
        },
        // 手动添加错误
        addError(error) {
            const obj = {}
            const { type, msg, url, row, col } = error
            if (type) obj.type = type
            if (msg) obj.msg = msg
            if (url) obj.url = url
            if (row) obj.row = row
            if (col) obj.col = col
            obj.time = new Date().getTime()
            monitor.errors.push(obj)
        },
        // 重置 monitor 对象
        reset() {
            window.performance && window.performance.clearResourceTimings()
            monitor.performance = getPerformance()
            monitor.resources = getResources()
            monitor.errors = []
        },
        // 清空 error 信息
        clearError() {
            monitor.errors = []
        },
        // 上传监控数据
        upload() {
            // TODO: 自定义上传
            /*
                axios.post({
                    url: monitor.url,
                    data: {
                        performance,
                        resources,
                        errors,
                        user,
                    }
                })
            */
        },
        // 设置数据上传地址
        setURL(url) {
            monitor.url = url
        },
    }

    // 获取性能信息
    const getPerformance = () => {
        if (!window.performance) return
        const timing = window.performance.timing
        const performance = {
            // 重定向耗时
            redirect: timing.redirectEnd - timing.redirectStart,
            // 白屏时间
            whiteScreen: whiteScreen,
            // DOM 渲染耗时
            dom: timing.domComplete - timing.domLoading,
            // 页面加载耗时
            load: timing.loadEventEnd - timing.navigationStart,
            // 页面卸载耗时
            unload: timing.unloadEventEnd - timing.unloadEventStart,
            // 请求耗时
            request: timing.responseEnd - timing.requestStart,
            // 获取性能信息时当前时间
            time: new Date().getTime(),
        }

        return performance
    }

    // 获取资源信息
    const getResources = () => {
        if (!window.performance) return
        const data = window.performance.getEntriesByType('resource')
        const resource = {
            xmlhttprequest: [],
            css: [],
            other: [],
            script: [],
            img: [],
            link: [],
            fetch: [],
            // 获取资源信息时当前时间
            time: new Date().getTime(),
        }

        data.forEach(item => {
            const arry = resource[item.initiatorType]
            arry && arry.push({
                // 资源的名称
                name: item.name,
                // 资源加载耗时
                duration: item.duration.toFixed(2),
                // 资源大小
                size: item.transferSize,
                // 资源所用协议
                protocol: item.nextHopProtocol,
            })
        })

        return resource
    }

    window.onload = () => {
        // 在浏览器空闲时间获取性能及资源信息 https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback
        if (window.requestIdleCallback) {
            window.requestIdleCallback(() => {
                monitor.performance = getPerformance()
                monitor.resources = getResources()

                console.log('页面性能信息',monitor.performance)
                console.log('页面资源信息', monitor.resources)
            })
        } else {
            setTimeout(() => {
                monitor.performance = getPerformance()
                monitor.resources = getResources()

                console.log('页面性能信息',monitor.performance)
                console.log('页面资源信息', monitor.resources)
            }, 0)
        }
    }

    // 捕获资源加载失败错误 js css img...
    addEventListener('error', e => {
        const target = e.target
        if (target != window) {
            monitor.errors.push({
                type: target.localName,
                url: target.src || target.href,
                msg: (target.src || target.href) + ' is load error',
                // 错误发生的时间
                time: new Date().getTime(),
            })
            console.error('所有的错误信息', monitor.errors)
        }
    }, true)

    // 监听 js 错误
    window.onerror = function(msg, url, row, col, error) {
        monitor.errors.push({
            type: 'javascript', // 错误类型
            row: row, // 发生错误时的代码行数
            col: col, // 发生错误时的代码列数
            msg: error && error.stack? error.stack : msg, // 错误信息
            url: url, // 错误文件
            time: new Date().getTime(), // 错误发生的时间
        })
        console.error('所有的错误信息', monitor.errors)
    }

    // 监听 promise 错误 缺点是获取不到行数数据
    addEventListener('unhandledrejection', e => {
        monitor.errors.push({
            type: 'promise',
            msg: (e.reason && e.reason.msg) || e.reason || '',
            // 错误发生的时间
            time: new Date().getTime(),
        })
        console.error('所有的错误信息', monitor.errors)
    })

    return monitor
}

const monitor = createMonitor()


// 补充:
// 一下这段代码可以获取到页面的白屏加载时间, 建议放到 head 标签之前
var whiteScreen = new Date() - performance.timing.navigationStart
// 通过 domLoading 和 navigationStart 也可以
var whiteScreen = performance.timing.domLoading - performance.timing.navigationStart



// 同样是一个性能监控器, 但使用的API比较新
const base = {
    log() {},
    logPackage() {},
    getLoadTime() {},
    getTimeoutRes() {},
    bindEvent() {},
    init() {}
}
const pm = (function() {
    // 向前兼容
    if (!window.performance) return base
    const pMonitor = { ...base }
    let config = {}
    const SEC = 1000
    const TIMEOUT = 10 * SEC
    const setTime = (limit = TIMEOUT) => time => time >= limit
    const getLoadTime = ({ startTime, responseEnd }) => responseEnd - startTime
    const getName = ({ name }) => name
    // 生成表单数据
    const convert2FormData = (data = {}) =>
        Object.entries(data).reduce((last, [key, value]) => {
            if (Array.isArray(value)) {
                return value.reduce((lastResult, item) => {
                    lastResult.append(`${key}[]`, item)
                    return lastResult
                }, last)
            }
            last.append(key, value)
            return last
        }, new FormData()
    )
    // 拼接 GET 时的url
    const makeItStr = (data = {}) => Object.entries(data).map(([k, v]) => `${k}=${v}`).join('&')
    pMonitor.getLoadTime = () => {
        const [{ domComplete }] = performance.getEntriesByType('navigation')
        return domComplete
    }
    pMonitor.getTimeoutRes = (limit = TIMEOUT) => {
        const isTimeout = setTime(limit)
        const resourceTimes = performance.getEntriesByType('resource')
        return resourceTimes
            .filter(item => isTimeout(getLoadTime(item)))
            .map(getName)
    }
    // 上报数据
    pMonitor.log = (url, data = {}, type = 'POST') => {
        const method = type.toLowerCase()
        const urlToUse = method === 'get' ? `${url}?${makeItStr(data)}` : url
        const body = method === 'get' ? {} : { body: convert2FormData(data) }
        const init = {
            method,
            ...body
        }
        fetch(urlToUse, init).catch(e => console.log(e))
    }
    // 封装一个上报两项核心数据的方法
    pMonitor.logPackage = () => {
        const { url, timeoutUrl, method } = config
        const domComplete = pMonitor.getLoadTime()
        const timeoutRes = pMonitor.getTimeoutRes(config.timeout)
        // 上报页面加载时间
        pMonitor.log(url, { domComplete }, method)
        if (timeoutRes.length) {
            pMonitor.log(
                timeoutUrl,
                {
                    timeoutRes
                },
                method
            )
        }
    }
    // 事件绑定
    pMonitor.bindEvent = () => {
      const oldOnload = window.onload
      window.onload = e => {
        if (oldOnload && typeof oldOnload === 'function') {
            oldOnload(e)
        }
        // 尽量不影响页面主线程
        if (window.requestIdleCallback) {
            window.requestIdleCallback(pMonitor.logPackage)
        } else {
            setTimeout(pMonitor.logPackage)
        }
      }
    }
  
    /**
     * @param {object} option
     * @param {string} option.url 页面加载数据的上报地址
     * @param {string} option.timeoutUrl 页面资源超时的上报地址
     * @param {string=} [option.method='POST'] 请求方式
     * @param {number=} [option.timeout=10000]
     */
    pMonitor.init = option => {
        const { url, timeoutUrl, method = 'POST', timeout = 10000 } = option
        config = {
            url,
            timeoutUrl,
            method,
            timeout
        }
        // 绑定事件 用于触发上报数据
        pMonitor.bindEvent()
    }
  
    return pMonitor
})()