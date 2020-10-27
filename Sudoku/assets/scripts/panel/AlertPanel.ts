import BasePanel from "../uiframe/BasePanel";
import { UILayerType } from "../uiframe/LayerType";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class AlertPanel extends BasePanel {

    private renderTimer = null;

    constructor(){
        super();
        this._resName = "panel/AlertPanel";
        this._layer = UILayerType.Main;
    }

    onCreate(msg?: any){
        super.onCreate(msg);
        this.setCloseButton("btnClose");
        this.setButtonClicked(cc.find("btnConfirm", this._rootView), this.close, this);
    }

    renderUI(str?: any){
        this.renderTimer && clearTimeout(this.renderTimer);
        this.renderTimer = setTimeout(()=>{
            let text = cc.find("text", this._rootView).getComponent(cc.Label);
            text.string = str;
        },30);
    }
}
