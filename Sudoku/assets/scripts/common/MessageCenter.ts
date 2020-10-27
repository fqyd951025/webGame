import { MessageID } from "../../common/MessageIDS";

//当前事件所引用到的对象
export class MessageRecvObj {
	public _tObj = null;
    constructor()
    {
        this._tObj = null;
    }
    public dtor()
    {
        this._tObj = null;
    }
    public exeMessage(messageID:MessageID, func, param)
    {
        func.call(this._tObj,param);
    }
};


export class MessageCenter {
	
	private static _instance:MessageCenter;
	private _tMessageDict = [];			//记录监听消息ID的对象
    private _bIsGlobalCaching = false;	//是否缓冲消息
    private _tMessageBuffer = [];			//全局消息缓存区
    private _tObjectList:MessageRecvObj[] = [];			//记录消息接受者的一些数据
	public constructor() {
	}

	private getRecvObjIdx(obj)
    {
        for (let i = 0; i < this._tObjectList.length; ++i)
		{
			if (this._tObjectList[i]._tObj == obj)
			{
				return i;
			}
		}
		return -1;
    }
    private getObjArr(messageID:MessageID)
	{
		let arr = this._tMessageDict[messageID];
		if (arr === undefined)
		{
			arr = [];
			this._tMessageDict[messageID] = arr;
		}
		return arr;
    }
    private exeMessage(messageID:MessageID,param)
    {
        let arr = this.getObjArr(messageID);
        for (let i = 0;i < arr.length;i += 2)
        {
            let recvObj = arr[i];
            let func = arr[i + 1];
            recvObj.exeMessage(messageID,func,param);
        }
    }
	//注册监听
	/*
	@obj 当前监听事件的对象
	@func 当前对象接受事件的函数
	@messageID 消息ID
	*/
	private addListen(obj,func,messageID:MessageID)
	{
		let recvObj = null;
		let idx = this.getRecvObjIdx(obj);
		if (idx < 0)
		{
			recvObj = new MessageRecvObj();
			recvObj._tObj = obj;
			this._tObjectList.push(recvObj);
		}
		else
		{
			recvObj = this._tObjectList[idx];
		}

		let arr = this.getObjArr(messageID);
		if (arr.indexOf(obj) === -1)
		{
			arr.push(recvObj,func);
		}
	}
	//反注册监听
	private delListen(obj)
	{
		let idx = this.getRecvObjIdx(obj);
		if (idx >= 0)
		{
			let recvObj = this._tObjectList[idx];

			for (let k in this._tMessageDict)
			{
				let arr = this._tMessageDict[k];
				for (let i = 0;i < arr.length;i += 2)
				{
					if (arr[i] === recvObj)
					{
						arr.splice(i,2);
						break;
					}
				}
			}

			recvObj.dtor();
			this._tObjectList.splice(idx,1);
		}
	}
	//广播消息
	private sendMessage(messageID:MessageID,param?)
	{
		if (this._bIsGlobalCaching)
		{
			this._tMessageBuffer.push([messageID,param]);
		}
		else
		{
			this.exeMessage(messageID,param);
		}
	}
	//设置是否全局cache消息
	private setGlobalCacheMessage(isGlobalCaching)
	{
		this._bIsGlobalCaching = isGlobalCaching;
		if (!this._bIsGlobalCaching)
		{
			for (let i = 0;i < this._tMessageBuffer.length;++i)
			{
				let message = this._tMessageBuffer[i];
				let messageID = message[0];
				let param = message[1];
				this.exeMessage(messageID,param);
			}
			this._tMessageBuffer.length = 0;
		}
	}
	public static sendMessage(messageID:MessageID,param?){
		this.getInstance().sendMessage(messageID,param);
	}
	public static addListen(obj,func,messageID:MessageID){
		this.getInstance().addListen(obj,func,messageID);
	}
	public static delListen(obj){
		this.getInstance().delListen(obj);
	}
	private static getInstance():MessageCenter{
		if(!this._instance){
			this._instance = new MessageCenter();
		}
		return this._instance;
	}
}