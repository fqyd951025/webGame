
const {ccclass, property} = cc._decorator;
//排序枚举
enum Arrangement {
    Horizontal, //横排
    Vertical, //竖排
};

@ccclass
export default class UIGrid extends cc.Component {

    public onReposition:Function = null;

    @property
    _direction = 0;
    @property({type:cc.Enum({}),tooltip:"横排或竖排"})
    get direction() {
        return this._direction;
    }
    set direction(value) {
        if (this._direction === value) {
            return;
        }
        this._direction = value;
        
        cc.log(Arrangement[this._direction]);
    }
    /**
     * 重新排序(只有当node显示的时候调用才有效) 否则请调用repositionNow = true
     */
    public reposition()
    {
        let childList = this.getChildList();
        this.resetPosition(childList);
        if (this.onReposition != null) 
        {
            this.onReposition();    
        }
    }
    /**
     * 获取子节点列表
     */
    private getChildList()
    {
        let childCount = this.node.childrenCount;
        let childList = [];
        for (let index = 0; index < childCount; index++) 
        {
            let child = this.node.children[index]
            if ((child != null && child.active == true)) 
            {
                childList.push(child);
            }            
        }
        return childList;
    }
    /**
     * 重新设置位置（排序）
     * @param childList 
     */
    private resetPosition(childList)
    {
        let length = childList.length;
        let height = 0;
        let width = 0;
        for (let index = 0; index < length; index++) 
        {
            let child = childList[index];
            let pos = child.position;

            pos = new cc.Vec2(width,-height);
            child.position = pos;
            if(this.direction == Arrangement.Vertical){
                height += child.height;
            }else if(this.direction == Arrangement.Horizontal){
                width += child.width;
            }
        }
    }
}
cc.game.on(cc.game.EVENT_ENGINE_INITED, () => {
    let array = [];
    array.push({name:Arrangement[0], value: 0});
    array.push({name:Arrangement[1], value: 1});
    
    //@ts-ignore
    cc.Class.Attr.setClassAttr(UIGrid, 'direction', 'enumList', array);
})