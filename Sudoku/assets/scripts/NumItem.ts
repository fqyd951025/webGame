import { MessageCenter } from "./common/MessageCenter";
import { MessageID } from "./common/MessageIDS";
import SudokuData from "./SudokuData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NumItem extends cc.Component {

    @property(cc.Node)
    tipsmask: cc.Node = null;
    @property(cc.Node)
    mask: cc.Node = null;
    @property(cc.Node)
    bg: cc.Node = null;
    @property(cc.Label)
    num: cc.Label = null;
    //坐标
    private ii = 0;
    private jj = 0;
    private curColor: cc.Color;

    onLoad() {

    }

    init(i, j, num, bgcolor, numcolor) {
        this.ii = i;
        this.jj = j;
        bgcolor && this.setBgColor(bgcolor);
        numcolor && this.setNumColor(numcolor);
        MessageCenter.delListen(this);
        MessageCenter.addListen(this, (isActive) => {
            this.mask.active = isActive;
        }, SudokuData.strIndex(MessageID.MsgID_GeziMask, this.ii, this.jj));
        this.node.off(cc.Node.EventType.TOUCH_END);
        if (num != 0) {
            this.setNum(num);
            return;
        }
        this.setNum("");
        this.node.on(cc.Node.EventType.TOUCH_END, this.selectGezi, this);
        this.initEvent();
    }

    initEvent() {
        //监听选中格子，背景颜色发生变化
        MessageCenter.addListen(this, () => {
            this.bg.color = this.curColor;
        }, SudokuData.strIndex(MessageID.MsgID_ReSetSelected, this.ii, this.jj));

        //监听有数填进来
        MessageCenter.addListen(this, (num) => {
            this.setNum(num);
        }, SudokuData.strIndex(MessageID.MsgID_SelectNum, this.ii, this.jj));

        //监听提示数变化
        MessageCenter.addListen(this, (param) => {
            var [spliceNum, isSelectNum = false] = param;
            if (!SudokuData.isTips) return;
            this.setTipsNum(spliceNum, isSelectNum);
            SudokuData.changelist[this.ii][this.jj] = this.num.string;
        }, SudokuData.strIndex(MessageID.MsgID_SelectNumTips, this.ii, this.jj));

        //撤回监听
        MessageCenter.addListen(this, () => {
            this.selectGezi();
        }, SudokuData.strIndex(MessageID.MsgID_CheHui, this.ii, this.jj));
    }

    selectGezi() {
        console.log(`坐标 i=${this.ii}, j=${this.jj}`);
        MessageCenter.sendMessage(MessageID.MsgID_SelectGeZi, [this.ii, this.jj]);
        this.bg.color = cc.Color.BLACK;
        var list = SudokuData.getZuobiaos(this.ii, this.jj);
        SudokuData.closeMask();
        if (!SudokuData.isTips) {
            for (let k = 0; k < list.length; k++) {
                MessageCenter.sendMessage(SudokuData.strIndex(MessageID.MsgID_GeziMask, list[k][0], list[k][1]), true);
            }
        }
    }

    setBgColor(color: cc.Color) {
        this.bg.color = color;
        this.curColor = color;
    }

    setNum(num: any = "") {
        this.num.string = !num ? "" : num;
        SudokuData.changelist[this.ii][this.jj] = this.num.string;
    }

    setTipsNum(spliceNum, isSelectNum = false) {
        if (!isSelectNum) {
            this.num.string = spliceNum;
            return;
        }
        var str = new String(SudokuData.changelist[this.ii][this.jj]);
        if (!str) str = "";
        var nums = str.split("");
        if (nums.length == 0 && !isSelectNum) {
            this.num.string = spliceNum;
        }
        else {
            var index = nums.indexOf(spliceNum + "");
            if (0 <= index && 1 < nums.length) {
                nums.splice(index, 1);
            }
            this.num.string = nums.join("");
        }
        this.tipsmask.active = this.num.string != "";

    }

    setNumColor(color: cc.Color) {
        this.num.node.color = color;
    }

    update(){
        if(!SudokuData.canHandle) return;
        if(!SudokuData.isTips){
            this.tipsmask.active = false;
            return;
        }
        if(SudokuData.sudoCfg[this.ii][this.jj] == 0){
            this.tipsmask.active = true;
        }else{
            this.tipsmask.active = false;
        }
    }

    onDestroy() {
        MessageCenter.delListen(this);
        this.node.off(cc.Node.EventType.TOUCH_END);
    }
}
