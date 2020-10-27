/**
 * 资源加载类
 */

const retryCount = 6;
const retryInterval = 500;

export function safeLoadResWithType (assets, type, callback, initTry = 0) {
    cc.loader.loadRes(assets, type, (error, res) => {
        if (error) {
            if (initTry < retryCount) {
                initTry++;
                setTimeout(() => {
                    safeLoadResWithType(assets, type, callback, initTry);
                }, retryInterval);
                console.warn('try reload res: ' + assets);
            } else {
                //window.badjs.report("safeLoadResWithType: load resource failed, ret="+ error);
                callback && callback(error, res);
            }
        } else {
            callback && callback(error, res);
        }
    })
}

export function safeLoadRes (assets, callback, initTry = 0) {
    cc.loader.loadRes(assets, (error, prefab) => {
        if (error) {
            if (initTry < retryCount) {
                initTry++;
                setTimeout(() => {
                    safeLoadRes(assets, callback, initTry);
                }, retryInterval);
                //console.warn('try reload res: ' + assets);
            } else {
                //console.log(`safeLoadRes 1`);
                callback && callback(error, prefab);
            }
        } else {
            callback && callback(error, prefab);
        }
    })
}


export function safeLoad (resources, callback, initTry = 0) {
    cc.loader.load(resources, (error, prefab) => {
        if (error) {
            if (initTry < retryCount) {
                initTry++;
                setTimeout(() => {
                    safeLoad(resources, callback, initTry);
                }, retryInterval);
                console.warn('try reload res: ' + resources);
            } else {
                callback && callback(error, prefab);
            }
        } else {
            callback && callback(error, prefab);
        }
    })
}

