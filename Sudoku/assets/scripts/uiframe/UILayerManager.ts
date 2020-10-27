import BasePanel from "./BasePanel";
import { UILayerType } from "./LayerType";
import UILayer from "./UILayer";
import SingleLayer from "./SingleLayer";
import QueueLayer from "./QueueLayer";


const ZINDEX = [0,50,100];
export class UILayerManager {
    private static _dictLayer = {};
    
    public static clear(): void {
        this._dictLayer = {};
    }

    private static createUILayerPanel(layer: UILayerType): void {
        let layerCom: UILayer = null;
        let parent = cc.find("Canvas");
        switch(layer){
            case UILayerType.Main:
                layerCom = new SingleLayer(layer);
                break;
            case UILayerType.Second:
                layerCom = new QueueLayer(layer);
                break;
            case UILayerType.Tips:
                layerCom = new SingleLayer(layer);
                break;
        }
        layerCom.init(parent,ZINDEX[layer])
        this._dictLayer[layer] = layerCom;
    }

    public static addWindow(layer: UILayerType, com: cc.Node): void {
        
        let layerCom = <UILayer>this._dictLayer[layer];
        layerCom.addChild(com);
    }
    public static show(panel:BasePanel, msg?: any){
        if (this._dictLayer[panel.layer] == null || !this._dictLayer[panel.layer].isValid) {
            this.createUILayerPanel(panel.layer);
        }
        let layerCom = <UILayer>this._dictLayer[panel.layer];
        layerCom.push(panel,msg);
    }
    public static pop(panel:BasePanel){
        let layerCom = <UILayer>this._dictLayer[panel.layer];
        if(layerCom){
            layerCom.pop();
        }
    }
}