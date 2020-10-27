import { NETWORK_TYPE, NETWORK_TYPE_DESC, NetworkStateIsValid } from "./NetworkType";
import TimerManager from "../../scripts/common/TimerManager";
import { MessageCenter } from "../../scripts/common/MessageCenter";
import { MessageID } from "../../scripts/common/MessageIDS";

var __envContextMap = {
    isWeb: {isChecked: false, checkValue: false},
    isNodeJs: {isChecked: false, checkValue: false},
    isCocosNative: {isChecked: false, checkValue: false},
    isCocosRuntime: {isChecked: false, checkValue: false},
};

var __checkEnv = function (map, cond) {
    if (map.isChecked) return map.checkValue;
    map.isChecked = true;
    map.checkValue = cond;
    return map.checkValue;
};
const CHECK_TIMER = 3; // 每3s检查硬件网络的状态
export default class NetStateManager{
    private _netState = 0;
    private _isSupportNavOnline = true;
    constructor(){
        this._netState = this.getNetworkState();

        if (this.currentContextIsWeb()) {
            this._isSupportNavOnline = (typeof navigator.onLine === 'boolean') ? true : false;
        }
        else if (this.currentContextIsCocosNative()) {
            this._isSupportNavOnline = true;
        }
        else {
            // TODO: native暂时不支持断网检测
            this._isSupportNavOnline = false;
        }

        if (this._isSupportNavOnline) {
            

            // 在web上面如果不支持上面的标记就不需要起这个定时器了
            TimerManager.getInstance().addAlwayTimeCallBack(CHECK_TIMER,this.doTimerTask.bind(this));
        }
    }
    private currentContextIsWeb(){
        return __checkEnv(__envContextMap.isWeb,
            (typeof window !== 'undefined') && (typeof window.document !== 'undefined') && !((typeof jsb !== 'undefined') && (typeof jsb.reflection !== 'undefined'))
        );
    }
    private currentContextIsCocosNative(){
        return __checkEnv(__envContextMap.isCocosNative,
            (typeof cc !== 'undefined') && cc && cc.sys && cc.sys.isNative
        );
    }
    private getNetworkState(){
        if (this.currentContextIsWeb()) {
            if (this._isSupportNavOnline) {
                return (navigator.onLine) ? NETWORK_TYPE.connected : NETWORK_TYPE.none;
            }
            else {
                // 如果不支持则默认nav
                return NETWORK_TYPE.connected;
            }
        }
        else if (this.currentContextIsCocosNative()) {
            return this.getNetworkStateInCocosRuntime();
        }
        else {
            // in native
            return this.getNetworkStateInNative();
        }
    }
    private getNetworkStateInCocosRuntime() {
        var state = cc.sys.getNetworkType();
    
        if (state === cc.sys.NetworkType.NONE)  return NETWORK_TYPE.none;
        else if (state === cc.sys.NetworkType.WWAN) return NETWORK_TYPE.mobile;
        else if (state === cc.sys.NetworkType.LAN)   return NETWORK_TYPE.wifi;
        else {
            return NETWORK_TYPE.wifi;
        }
    }
    private getNetworkStateInNative() {
        // TODO: 未来自己的native网络环境监测的策略
        return NETWORK_TYPE.connected;
    }
    private doTimerTask() {
        var currentState = this.getNetworkState();
        this.onNetworkChange(currentState);
    }
    private onNetworkChange(currentState) {
        if (currentState !== this._netState) {
            var prevState = this._netState;
            this._netState = currentState;
    
            console.warn("network sate is changed! prev state is " + NETWORK_TYPE_DESC[prevState]
                + " current state is " + NETWORK_TYPE_DESC[this._netState]);
    
            MessageCenter.sendMessage(MessageID.MsgID_NetworkChange,{
                prevState: prevState,
                curState: this._netState,
                netIsValid: NetworkStateIsValid(this._netState)});
           
        }
    }
}
