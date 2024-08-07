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
 * @description 借助HTML5 Blob实现文本信息文件下载
 * @param {string} url 图片url
 * @param {string} name 图片名（需要带后缀，否则默认下载jfit格式）
 */
const downloadRes = async (url: string, name: string): Promise<void> => {
    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // 内容转变成blob地址
        let blob = await response.blob();
        // 创建隐藏的可下载链接
        let objectUrl = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        // 地址
        a.href = objectUrl;
        // 修改文件名
        a.download = name;
        // 触发点击
        document.body.appendChild(a);
        a.click();
        // 移除
        setTimeout(() => document.body.removeChild(a), 1000);
    } catch (error) {
        console.error('Download failed:', error);
    }
};


/**
 * @description 借助 base64 下载图片资源
 * @param {string} url 图片url
 * @param {string} name 图片名（需要带后缀，否则默认下载jfit格式）
 */
const downloadImg = async (url: string, name: string): Promise<void> => {
    try {
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = dataURL;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
            }, 1000);
        };
        img.src = url;
    } catch (error) {
        console.error('Download failed:', error);
    }
};
