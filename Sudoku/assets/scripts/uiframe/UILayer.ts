import IPanel from "./IPanel";
import { UILayerType } from "./LayerType";

export default abstract class UILayer{

    protected _node:cc.Node;
    protected _list:IPanel[];
    protected _layerType:UILayerType;
    constructor(layerType:UILayerType){
        this._layerType = layerType;
    }
    public init(parent:cc.Node,zIndex:number){
        this._node = new cc.Node();
        this._node.name = this._layerType.toString();
        parent.addChild(this._node);
        this._node.width = parent.width;
        this._node.height = parent.height;
        this.zIndex = zIndex;
        this._list = new Array<IPanel>();
    }
    public get zIndex(){
        return this._node.zIndex;
    }
    public set zIndex(value){
        this._node.zIndex = value;
    }
    public get isValid(){
        return this._node.isValid;
    }
    abstract push(panel:IPanel,msg?:any):void;
    abstract pop():void;

    addChild(node:cc.Node){
        this._node.addChild(node);
    }
}