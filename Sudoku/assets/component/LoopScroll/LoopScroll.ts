import UIGrid from "./UIGrid";

//滑动的方向
enum DirectionEnum{
    BottomToTop,
    TopToBottom,
    RightToLeft,
    LeftToRight
};

const {ccclass, property,executeInEditMode} = cc._decorator;

@ccclass
// @executeInEditMode
export default class LoopScroll extends cc.Component {

    @property({type:UIGrid,tooltip:"排序组件UIGrid"})
    uiGrid:UIGrid = null;
    @property({type:cc.ScrollView})
    scrowView:cc.ScrollView = null;
    @property({type:cc.Mask})
    viewMask = null;
    @property({type:cc.Prefab})
    itemPrefab = null;
    @property
    itemCount = 0;
    @property
    _direction = 0;
    @property({type:cc.Enum({}),tooltip:"显示方向"})
    get direction() {
        return this._direction;
    }
    set direction(value) {
        if (this._direction === value) {
            return;
        }
        this._direction = value;
        
        cc.log(DirectionEnum[this._direction]);
    }

    private _extents:number = 0; //所有预制体高度的一半
    private _maskSize:any = null;
    private _centerLocalPos:cc.Vec2 = null; //遮罩中心点局部坐标
    private _centerWorldPos:cc.Vec2 = null; //遮罩中心点世界坐标
    private _items:{obj:cc.Node,realIndex:number}[] = [];
    private _lastoffsetY = 0;
    private _lastoffsetX = 0;
    private _onRenderItem:Function = null;
    private _dataCount:number = 0;
    onLoad () {

        this.initObj();
        this.initMaskCornerLocalPos();
        this.initItems();

        this.scrowView.node.on('scroll-began', this.onScrollBeganEvent, this);
        this.scrowView.node.on('scrolling', this.onScrollingEvent, this);
    }
    private initObj()
    {
        this._maskSize = this.scrowView.node.getContentSize();

        if (this.scrowView.horizontal == true && this.scrowView.vertical == true) 
        {
            console.log("无限滑动组件不支持上下左右一起滑动"); 
            return;
        }

        if(this.direction == DirectionEnum.BottomToTop || this.direction == DirectionEnum.TopToBottom){
            this.scrowView.vertical = true;
            this.scrowView.horizontal = false;
            this._extents = this.scrowView.node.height*0.5;
        }else{
            this.scrowView.vertical = false;
            this.scrowView.horizontal = true;
            this._extents = this.scrowView.node.width*0.5;
        }
    }
    /**
     * 初始化遮罩边角局部坐标
     */
    private initMaskCornerLocalPos()
    {
        let halfHeight   = this._maskSize.height*0.5;
        let halfwidth    = this._maskSize.width*0.5;

        let minX         = this.viewMask.node.position.x - halfwidth; //最小x
        let maxX         = minX + this._maskSize.width; //最大x
        let minY         = this.viewMask.node.position.y - halfHeight; //最小y
        let maxY         = minY + this._maskSize.height; //最大y

        let rightUpLocalPos    = cc.v2(maxX,maxY); //右上
        let leftDownLocalPos   = cc.v2(minX,minY); //左下
        this._centerLocalPos     = (rightUpLocalPos.add(leftDownLocalPos));
        this._centerLocalPos.x   = this._centerLocalPos.x*0.5;
        this._centerLocalPos.y   = this._centerLocalPos.y*0.5;
    }
    /**
     * 初始化数据
     * @param dataCount 数据个数
     * @param onRenderItem 渲染回调
     */
    initData(dataCount:number, onRenderItem:Function)
    {
        this.scrowView.content.active = true;
        this.uiGrid.enabled = true;
        if (onRenderItem == null) 
        {
            console.log("无限滑动组件渲染回调没有注册事件");
        }
        this._onRenderItem = onRenderItem;
        this._dataCount = dataCount;
        this.onInitDatas();
        
        //this.scrowView.vertical && this.scrowView.scrollToTop(0.1);
    }
    /**
     * 当初始化数据的时候触发事件（第一次刷新所有的item数据）
     */
    private onInitDatas()
    {
        let startIndex = 0;
        let allHeight = 0;
        let allWidth = 0;
        let index = 0;
        cc.log(`onInitDatas direction = ${this.direction}`);
        let count = this.itemCount;
        if(this.direction == DirectionEnum.TopToBottom || this.direction == DirectionEnum.LeftToRight){
            if(this._dataCount > this.itemCount){
                startIndex = this._dataCount - this.itemCount;
            }
            count = this._dataCount;
        }
        cc.log(`onInitDatas itemCount = ${this.itemCount}  _dataCount = ${this._dataCount} count = ${count}`);
        for (let i = 0; i < count; i++) 
        {
            let item = this._items[index];
            let state = (index < this._dataCount);
            item.obj.active = state;
            if (state == true) //只有当数据足够的时候才会触发渲染回调
            {
                item.obj.position = cc.v3(allWidth,-allHeight);
                this.updateItem(index,i,item.obj);
                if(this.scrowView.vertical){
                    allHeight += item.obj.height;
                }else{
                    allWidth += item.obj.width;
                }
                
                item.realIndex = i;
            }
            if((this.direction == DirectionEnum.TopToBottom || this.direction == DirectionEnum.LeftToRight) && i >= startIndex){
                ++index;
            }else if(this.direction == DirectionEnum.BottomToTop || this.direction == DirectionEnum.RightToLeft){
                ++index;
            }
        }
        for(let j = this._dataCount; j < this.itemCount; ++j){
            let item = this._items[j];
            item.obj.active = false;
        }
        if(this.scrowView.vertical){
            this.scrowView.content.height = allHeight;
        }else{
            this.scrowView.content.width = allWidth;
        }
        cc.log(`onInitDatas allHeight = ${allHeight} allWidth = ${allWidth}`);
        this.updateScroll();
    }
    //根据不同的方向更新滚动条的起始位置
    private updateScroll(){
        switch(this.direction){
            case DirectionEnum.BottomToTop:
                this.scrowView.scrollToTop();
                break;
            case DirectionEnum.TopToBottom:
                this.scrowView.scrollToBottom();
                break;
            case DirectionEnum.RightToLeft:
                this.scrowView.scrollToLeft();
                break;
            case DirectionEnum.LeftToRight:
                this.scrowView.scrollToRight();
                break;
        }
    }
    /**
     * 刷新Item
     * @param itemIndex item下标
     * @param dataIndex  数据下标
     * @param item 需要渲染的item
     */
    private updateItem(itemIndex:number,dataIndex:number,item:cc.Node)
    {
        if (this._onRenderItem != null) 
        {
            this._onRenderItem(itemIndex,Math.floor(dataIndex),item);
        }
    }
    /**
     * 初始化item
     */
    private initItems()
    {
        for (let index = 0; index < this.itemCount; index++) 
        {
           let item = cc.instantiate(this.itemPrefab);
           item._objFlags |= cc.Object.Flags.DontSave;
           this._items.push({obj:item,realIndex:index});
           this.uiGrid.node.addChild(item);
        }
        this.uiGrid.onReposition = ()=>{
            cc.log("刷新完成");
        }
        this.uiGrid.reposition();
    }
    /**
     * 滑动开始监听
     * @param {any} event 
     */
    private onScrollBeganEvent(event){
        this._lastoffsetY = this.scrowView.getScrollOffset().y;
        this._lastoffsetX = this.scrowView.getScrollOffset().x;
        cc.log("toby: onScrollBeganEvent = " + event + "," + this._lastoffsetY); 
    }

    /**
     * 滑动中监听
     * @param {any} event 
     */
    private onScrollingEvent(event){
        let localPos = null;
        this.getMaskCenterWorldPos();
        let distance = 0;
        let newPos = null;
        if( this.scrowView.vertical ){
            var offsetY = this.scrowView.getScrollOffset().y;
            if (this._lastoffsetY > offsetY) {
                //console.log("toby: onScrollingEvent 向下滑动");
                 //向下滑动
                 let downitem = this._items[0];
                 localPos = downitem.obj.position;
                 distance = localPos.y - this._centerWorldPos.y;
                 newPos = downitem.obj.position;
                 if (downitem.realIndex > 0 && (distance-downitem.obj.height) < this._extents){
                     //console.log(`downitem.realIndex = ${downitem.realIndex}`);
                     let bottomItem = this._items.pop();//删除最后一个item
                     bottomItem.realIndex = downitem.realIndex-1;
                     this.scrowView.content.height -= bottomItem.obj.height;
                     this.updateItem(0,bottomItem.realIndex,bottomItem.obj);
                     newPos.y += bottomItem.obj.height;
                     bottomItem.obj.position = newPos;
                     this._items.splice(0,0,bottomItem);
                 }
            }
            else if(this._lastoffsetY < offsetY){
                //console.log("toby: onScrollingEvent 向上滑动");   
                //向上滑动
                let upitem = this._items[this.itemCount-1];
                localPos = upitem.obj.position;
                distance = localPos.y - this._centerWorldPos.y;
                newPos = upitem.obj.position;
                if (upitem.realIndex < this._dataCount-1 && distance > -this._extents){
                    newPos.y -= upitem.obj.height;
                    let topItem = this._items.shift();//删除第一个item
                    topItem.obj.position = newPos;
                    topItem.realIndex = upitem.realIndex+1;
                    this._items[this.itemCount-1] = topItem;
                    this.updateItem(this.itemCount-1,topItem.realIndex,topItem.obj);
                    this.scrowView.content.height += topItem.obj.height;
                }     
            }
            this._lastoffsetY = offsetY;
        }else{
            var offsetX = this.scrowView.getScrollOffset().x;
            if(this._lastoffsetX > offsetX){
                //cc.log("向左滑动");
                let upitem = this._items[this.itemCount-1];
                localPos = upitem.obj.position;
                distance = localPos.x - this._centerWorldPos.x;
                newPos = upitem.obj.position;
                if (upitem.realIndex < this._dataCount-1 && distance < this._extents){
                    newPos.x += upitem.obj.width;
                    let topItem = this._items.shift();//删除第一个item
                    topItem.obj.position = newPos;
                    topItem.realIndex = upitem.realIndex+1;
                    this._items[this.itemCount-1] = topItem;
                    this.updateItem(this.itemCount-1,topItem.realIndex,topItem.obj);
                    this.scrowView.content.width += topItem.obj.width;
                    
                }
            }else if(this._lastoffsetX < offsetX){
                //cc.log("向右滑动");
                let downitem = this._items[0];
                localPos = downitem.obj.position;
                distance = this._centerWorldPos.x - localPos.x;
                newPos = downitem.obj.position;
                if (downitem.realIndex > 0 && distance < this._extents){
                    let bottomItem = this._items.pop();//删除最后一个item
                    bottomItem.realIndex = downitem.realIndex-1;
                    this.scrowView.content.width -= bottomItem.obj.width;
                    this.updateItem(0,bottomItem.realIndex,bottomItem.obj);
                    newPos.x -= bottomItem.obj.width;
                    bottomItem.obj.position = newPos;
                    this._items.splice(0,0,bottomItem);
                }
            }
            this._lastoffsetX = offsetX;
        }
        
    }
    /**
     * 初始化遮罩中心世界坐标
     */
    private getMaskCenterWorldPos():void
    {
        this._centerWorldPos = this.convertCornerPosToContentSpace(this._centerLocalPos);
    }
     /**
     * 把遮罩的边角左边转换成content内的局部坐标
     * @param otherLocalPos 
     */
    private convertCornerPosToContentSpace(otherLocalPos:cc.Vec2):cc.Vec2
    {
        let contentPos = cc.Vec2.ZERO;
        let content = this.scrowView.content;
        let worldPos = this.viewMask.node.parent.convertToWorldSpaceAR(otherLocalPos);
        contentPos = content.convertToNodeSpaceAR(worldPos);
        return contentPos;
    }
}

cc.game.on(cc.game.EVENT_ENGINE_INITED, () => {
    let array = [];
    array.push({name:DirectionEnum[0], value: 0});
    array.push({name:DirectionEnum[1], value: 1});
    array.push({name:DirectionEnum[2], value: 2});
    array.push({name:DirectionEnum[3], value: 3});
    
    //@ts-ignore
    cc.Class.Attr.setClassAttr(LoopScroll, 'direction', 'enumList', array);
})