/*
作者（Author）:    jason

描述（Describe）: 定时器管理类
*/
import HashMap from "./HashMap";

enum TIME_DESTORY {
    DESTORY = 0,
    ALWAY = 1,  //一直执行
    COUNT = 2,  //执行指定的次数
};

class TimeCallBack {
    private _type:TIME_DESTORY;
    private _key:number = 0;
    private _callBack:Function;
    private _args:any;
    private _speed:number;
    private _length:number;
    private _beginTime:number;
    private _endTime:number;
    private _count:number;
    constructor(k, length, speed, callback, args, td) {
        this._type = td;
        this._key = k;
        this._callBack = callback;
        this._args = args;
        this._speed = speed;
        if (this._speed <= 0) this._speed = 1;
        this._length = (length / this._speed) * 1000;
        this._beginTime = (new Date()).getTime();
        this._endTime = this._beginTime + this._length;
        this._count = 0;
    }

    get speed() {
        return this._speed;
    }

    set speed(value) {
        let old = this._speed;
        this._speed = value;
        let scale = this._speed / old;
        let surplus1 = this.surplusTime;
        let surplus2 = surplus1 / scale;
        this._endTime += (surplus2 - surplus1);
    }

    //剩余时间（毫秒）
    get surplusTime() {
        return (this._endTime - (new Date()).getTime());
    }

    update() {
        if (this.surplusTime <= 0) {
            if (this._callBack != null) {
                ++this._count;
                this._callBack(this._args);
            }

            if (this._type == TIME_DESTORY.ALWAY) {
                this._beginTime = (new Date()).getTime();
                this._endTime = this._beginTime + this._length;
                return false;
            }
            else if (this._type == TIME_DESTORY.COUNT && this._count < this._args[0]) {
                this._beginTime = (new Date()).getTime();
                this._endTime = this._beginTime + this._length;
                return false;
            }
            return true;
        }
        return false;
    }
}

export default class TimerManager{
    private _timeCallBack:HashMap<number,TimeCallBack> = new HashMap();	//计时器数组
    private _freeTimeKey = [];			//空闲的计时器ID
    private _delCallBack = [];			//要删除的计时器数组 下一帧统一删除
    private _validKey = 1;
    private static _instance:TimerManager;
    private getFreeKey() {
        return this._validKey++;
    }

    
    public addTimeCallBack(length, callBack, args?) {
        let Key = this.getFreeKey();
        this._timeCallBack.add(Key,new TimeCallBack(Key, length, 1, callBack, args, TIME_DESTORY.DESTORY));
        return Key;
    }
    public addAlwayTimeCallBack(length, callBack, args?) {
        let Key = this.getFreeKey();
        this._timeCallBack.add(Key,new TimeCallBack(Key, length, 1, callBack, args, TIME_DESTORY.ALWAY));
        return Key;
    }
    public addCountTimeCallBack(length, callBack, args?) {
        let Key = this.getFreeKey();
        this._timeCallBack.add(Key,new TimeCallBack(Key, length, 1, callBack, args, TIME_DESTORY.COUNT));
        return Key;
    }
    public removeTimeCallBack(Key) {
        if (this._timeCallBack.has(Key)){
            this._delCallBack.push(Key);
        }
    }
    public update(deltaTime) {
        for (let i = 0; i < this._delCallBack.length; ++i) {
            if (this._timeCallBack.has(this._delCallBack[i])) {
                this._timeCallBack.remove(this._delCallBack[i]);
                this._freeTimeKey.push(this._delCallBack[i]);
            }
        }
        this._delCallBack.length = 0;
        let endKey = [];
        this._timeCallBack.forEach((k,v:TimeCallBack)=>{
            if(v.update()){
                endKey.push(k);
            }
        })

        for (let i = 0; i < endKey.length; ++i) {
            this.removeTimeCallBack(endKey[i]);
        }
    }
    public static getInstance():TimerManager{
        if(!TimerManager._instance){
            TimerManager._instance = new TimerManager();
        }
        return TimerManager._instance;
    }
}

