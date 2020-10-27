import BasePanel from "../uiframe/BasePanel";
import { UILayerType } from "../uiframe/LayerType";
import { searchNode ,searchComp} from "../common/UITool";
import { UILayerManager } from "../uiframe/UILayerManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainPanel extends BasePanel {

    private renderTimer = null;

    constructor(){
        super();
        this._resName = "panel/MainPanel";
        this._layer = UILayerType.Main;
    }

    onCreate(msg?: any){
        super.onCreate(msg);
        this.setCloseButton("btnClose");
    }

    renderUI(info?: any){
        this.renderTimer && clearTimeout(this.renderTimer);
        this.renderTimer = setTimeout(()=>{
            let lab = cc.find("base/label", this._rootView).getComponent(cc.Label);
            lab.string = info;

        },30);
    }
}
