import BasePanel from "../uiframe/BasePanel";
import { UILayerType } from "../uiframe/LayerType";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class AlertPanel extends BasePanel {

    private renderTimer = null;

    constructor() {
        super();
        this._resName = "panel/AlertPanel";
        this._layer = UILayerType.Main;
    }

    onCreate(msg?: any) {
        super.onCreate(msg);
        this.setCloseButton("btnConfirm");
    }

    renderUI(str?: any, callback:Function = null) {
        this.renderTimer && clearTimeout(this.renderTimer);
        this.renderTimer = setTimeout(() => {
            try {
                let text = cc.find("text", this._rootView).getComponent(cc.Label);
                text.string = str;
            } catch (error) {
                this.renderUI(str);
            }
        }, 30);
    }
}
