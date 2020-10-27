import NetStateManager from "./NetStateManager";
import { MessageCenter } from "../../scripts/common/MessageCenter";
import { MessageID } from "../../scripts/common/MessageIDS";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NetLoading extends cc.Component {

    
    onLoad () {
        
        new NetStateManager();
        MessageCenter.addListen(this,this.onNetworkChange,MessageID.MsgID_NetworkChange);
    }
    start(){
        this.node.active = false;
    }
    private onNetworkChange(param){
        const {prevState,curState,netIsValid} = param;
        this.node.active = !netIsValid;
    }
}
