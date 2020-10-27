import LoopScroll from "../component/LoopScroll/LoopScroll";
import { searchComp } from "./common/UITool";

const {ccclass, property,executeInEditMode} = cc._decorator;

@ccclass
// @executeInEditMode
export default class LoopScrollTest extends cc.Component {
    @property(Number)
    minItemsWidth: number = 150;

    private _loopScroll:LoopScroll;
    private _data:number[] = [];

    onLoad () {
        this._data = [];
        for (let index = 0; index < 49; index++) {
            this._data.push(index);
            
        }
        this._loopScroll = searchComp(this.node,"Loop",LoopScroll);
        window.onresize = () => {
            this._loopScroll.initData(Math.ceil(this._data.length / Math.floor(this.node.width / this.minItemsWidth)), this.onRenderItem.bind(this));
        };
    }
       
    onRenderItem(itemIndex:number,dataIndex:number,item:cc.Node){
        let itemCount = Math.floor(this.node.width / this.minItemsWidth);
        item.getComponent("ItemCtrl").init(dataIndex, this._data, itemCount);
    }

    start () {
        this._loopScroll.initData(Math.ceil(this._data.length / Math.floor(this.node.width / this.minItemsWidth)), this.onRenderItem.bind(this));
    }
    // update (dt) {}
}
