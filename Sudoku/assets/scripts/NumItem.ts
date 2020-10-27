import { MessageCenter } from "./common/MessageCenter";
import { MessageID } from "./common/MessageIDS";
import SudokuData from "./SudokuData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NumItem extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null;
    @property(cc.Label)
    num: cc.Label = null;
    //坐标
    private ii = 0;
    private jj = 0;
    private curColor:cc.Color;

    onLoad(){
        this.node.on(cc.Node.EventType.TOUCH_END, this.selectGezi, this);
    }

    init(i, j){
        this.ii = i;
        this.jj = j;
        MessageCenter.delListen(this);
        MessageCenter.addListen(this, (num)=>{
            this.num.string = num;
        }, MessageID.MsgID_SelectNum + SudokuData.strIndex(i, j));

        MessageCenter.addListen(this, ()=>{
            this.bg.color = this.curColor;
        }, MessageID.MsgID_ReSetSelected + SudokuData.strIndex(i, j));
    }

    selectGezi(event){
        console.log(`坐标 i=${this.ii}, j=${this.jj}`);
        this.bg.color = cc.Color.BLACK;
        MessageCenter.sendMessage(MessageID.MsgID_SelectGeZi, [this.ii, this.jj]);
    }

    setBgColor(color:cc.Color){
        this.bg.color = color;
        this.curColor = color;
    }

    setNum(num:any = ""){
        this.num.string = num;
    }

    setNumColor(color:cc.Color){
        this.num.node.color = color;
    }

    onDestroy(){
        MessageCenter.delListen(this);
    }
}
