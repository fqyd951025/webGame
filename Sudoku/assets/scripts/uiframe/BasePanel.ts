import { UILayerManager} from "./UILayerManager";

import { safeLoadRes } from "../common/SafeLoader";
import IPanel from "./IPanel";
import { UILayerType } from "./LayerType";

export default class BasePanel implements IPanel{
    protected _resName: string;
    protected _rootView: cc.Node;
    protected _layer : UILayerType = UILayerType.Main;
    protected _isDestroy : boolean = false;
    constructor() {
        this._rootView = null;
    }
    get layer(): UILayerType{
        return this._layer;
    }
    public getTransition(name: string) {
       
    }

    public getChild(name: string):cc.Node {
        if (this._rootView == null) {
            return null;
        }
        return this._rootView.getChildByName(name);
    }

    public addChild(object: any) {
        if (this._rootView == null) {
            return null;
        }
        return this._rootView.addChild(object)
    }

    public removeChild(object: any) {
        if (this._rootView == null) {
            return null;
        }
        return this._rootView.removeChild(object)
    }

    public show(msg?: any) {
        if(!this._rootView || !this._rootView.isValid){
            safeLoadRes(this._resName,(err, res)=>{
                if(!err){
                    this._rootView = cc.instantiate(res);
                    this.onCreate(msg);
                }
            });
            return;
        }
        this.onShow(msg);
    }
    public onCreate(msg?: any){
        if (this._rootView.parent == null) {
            UILayerManager.addWindow(this._layer,this._rootView);
        }
        this.onShow(msg);
    }
    public close() {
        this.onHide();
        if(this._rootView){
            this._rootView.active = false;
        }
        if(this._isDestroy){
            this._rootView.destroy();
        }
    }

    protected onShow(msg?: any) {
        //console.log(this._resName + " onShow()可重定义");
        this._rootView.active = true;
    }

    protected onHide() {
        //console.log(this._resName + " onHide()可重定义");
    }


    public setCloseButton(name: string) {
        let clostBtn = this.getChild(name);
        clostBtn.on("click",this.closeBtnOnClick, this)
    }

    private closeBtnOnClick() {
        this.close();
    }
    public setButtonClicked(btn:cc.Node,callback:Function,object){
        btn.on(cc.Node.EventType.TOUCH_END,function(){
            //SoundManager.Instance.playEffect("click");
            callback.call(object);
        }.bind(this),this)
    }
    public dispose() {
       
    }
}