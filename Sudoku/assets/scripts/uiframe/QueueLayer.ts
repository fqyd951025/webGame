import UILayer from "./UILayer";
import IPanel from "./IPanel";
import { UILayerType } from "./LayerType";

export default class QueueLayer extends UILayer{
    private _msgList:any[];
    constructor(layerType:UILayerType){
        super(layerType);
        this._msgList = new Array<any>();
    }
    public push(panel:IPanel,msg?:any):void{
        this._list.push(panel);
        this._msgList.push(msg);
        if(this._list.length == 1){
            panel.show(msg);
        }
    }
    public pop():void{
        if (this._list.length > 0) {
            this._list.shift();
            this._msgList.shift();
            if (this._list.length > 0) {
                this._list[0].show(this._msgList[0]);
            }
        }
    }
}