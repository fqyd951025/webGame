const {ccclass, property, requireComponent} = cc._decorator;

@ccclass
@requireComponent(cc.Camera) //前置要求摄像机组件
export default class ScrollCamera extends cc.Component {
    @property
    speed: number = 200;

    @property({type:cc.Node})
    loopGrounds = [];

    private _camera:cc.Camera = null;
    onLoad () {

    }

    start () {
        this._camera = this.getComponent(cc.Camera);
    }
    /** *每帧更新函数 
     *1. 更新摄像机位置 
     *2. 检查循环节点， 设置新位置 
    **/
    update (dt) {
        //获取当前节点 
        let current = this.loopGrounds[0];
        //计算当前节点在摄像机中的位置 
        let pt = this._camera.getWorldToScreenPoint(current.position);
        //当前节点超出摄像机范围（ 摄像机可视范围就是屏幕大小）
        if (pt.y <= -cc.winSize.height){
            //取最后一个地图节点
            let last = this.loopGrounds[this.loopGrounds.length - 1]; 
            //将当前节点从数组中移除 
            this.loopGrounds.shift(); 
            //将当前节点放到数组最后 
            this.loopGrounds.push(current);
            //将当前节点位置移动到最顶部位置 
            current.y = last.y + (last.height + current.height) / 2;
        }
        //更新摄像机节点位置 
        this.node.y += dt * this.speed;
    }
}
