import { MessageCenter } from "./common/MessageCenter";
import { MessageID } from "./common/MessageIDS";
import SudokuData from "./SudokuData";
import WindowManager from "./uiframe/WindowManager";
import AlertPanel from "./panel/AlertPanel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SelectItem extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null;
    @property(cc.Label)
    num: cc.Label = null;

    private selNum = 0;

    onLoad(){
        this.node.on(cc.Node.EventType.TOUCH_END, this.selectNum, this);
    }

    selectNum(event){
        if(0 < this.selNum && this.selNum < 10){
            console.log(`数字 num=${this.selNum}`);
            var [i, j] = SudokuData.getCurPos();
            if(i < 0){
                WindowManager.open(AlertPanel);
                return;
            }
            MessageCenter.sendMessage(MessageID.MsgID_SelectNum + SudokuData.strIndex(i, j), this.selNum);
        }
    }

    setBgColor(color:cc.Color){
        this.bg.color = color;
    }

    setNum(num:any = ""){
        this.selNum = num;
        this.num.string = num;
    }

    setNumColor(color:cc.Color){
        this.num.node.color = color;
    }

    onDestroy(){
        
    }
}
