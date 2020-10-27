import UILayer from "./UILayer";
import IPanel from "./IPanel";

export default class SingleLayer extends UILayer{

    public push(panel:IPanel,msg?:any):void{
        if(this._list.length > 0){
            let delPanel = this._list.shift();
            delPanel.close();
        }
        this._list.push(panel);
        panel.show(msg);
    }
    public pop():void{

    }
}