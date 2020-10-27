
const {ccclass, property,executeInEditMode} = cc._decorator;

// // 屏蔽2.3.1版本prefab嵌套prefab的弹框问题
// if (CC_EDITOR && !window["Editor"].isBuilder) {
//     window["_Scene"].DetectConflict.beforeAddChild = function() {
//         return false
//     }
// }

@ccclass
@executeInEditMode
export default class LoadPrefab extends cc.Component {

    @property
    private _prefab: cc.Prefab = null;
    @property({type: cc.Prefab, visible: true, displayName: "预制体"})
    set prefab(value: cc.Prefab) {
        this._onPrefabChanged(this._prefab, value)
    }

    get prefab(): cc.Prefab {
        return this._prefab
    }
    @property(cc.Node)
    parent:cc.Node = null;
    @property
    autoLoad: boolean = false;

    private _prefabNode:cc.Node;
    onLoad () {
        if(this.autoLoad){
            this.loadPrefab();
        }
    }
    //实例化预制体，设置父节点
    loadPrefab(){
        if (!this._prefab || this._prefabNode) {
            return
        }
        this._prefabNode = cc.instantiate(this.prefab);
        // cc.Object["Flags"].DontSave          // 当前节点不会被保存到prefab文件里
        // cc.Object["Flags"].LockedInEditor    // 当前节点及子节点在编辑器里不会被点击到
        // cc.Object["Flags"].HideInHierarchy   // 当前节点及子节点在编辑器里不显示
        this._prefabNode._objFlags |= cc.Object.Flags.DontSave;
        this._prefabNode.parent = this.parent || this.node;
        this._prefabNode.active = true;
        this._prefabNode.setPosition(cc.Vec3.ZERO);
    }
    private _onPrefabChanged(oldValue:cc.Prefab, newValue:cc.Prefab) {
        if (this._prefabNode) {
            this._prefabNode.destroy();
            this._prefabNode = null;
        }
        this._prefab = newValue
        if (newValue) {
            this.loadPrefab();
        }
    }
    getPrefabComp<T extends cc.Component>(component: {prototype: T}):T{
        return this._prefabNode ? this._prefabNode.getComponent(component) : null;
    }
}
