import SudokuData from "./SudokuData";
import { safeLoadRes } from "./common/SafeLoader";
import { MessageCenter } from "./common/MessageCenter";
import { MessageID } from "./common/MessageIDS";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Sudoku extends cc.Component {
    @property(cc.Prefab)
    numItem: cc.Node = null;
    @property(cc.Prefab)
    selectItem: cc.Node = null;

    private mainUI: cc.Node;
    private sudokuUI: cc.Node;
    private selectNum: cc.Node;
    private btns: cc.Node;
    private chongzhi: cc.Node;
    private tishi: cc.Node;
    private isTips: cc.Node;
    private kaishi: cc.Node;
    private chehui: cc.Node;

    private haoshi: cc.Label;

    onLoad() {
        this.mainUI = cc.find("mainUI", this.node);
        this.sudokuUI = cc.find("sudokuUI", this.mainUI);
        this.selectNum = cc.find("selectNum", this.mainUI);
        this.btns = cc.find("btns", this.mainUI);
        this.chongzhi = cc.find("btn1", this.btns);
        this.tishi = cc.find("btn2", this.btns);
        this.isTips = cc.find("isTips", this.tishi);
        this.kaishi = cc.find("btn3", this.btns);
        this.chehui = cc.find("btn4", this.btns);
        this.haoshi = cc.find("haoshi/time", this.mainUI).getComponent(cc.Label);
        SudokuData.addListen();
        this.createJiuGongGe();
        this.initTouchEvent();
        this.loadCfg();
        this.isTips.active = SudokuData.isTips;
    }
    // 加载配置
    loadCfg() {
        safeLoadRes("cfg/SudokuCfg", (err, res) => {
            if (err) {
                console.log(`err = ${JSON.stringify(err)}`);
                return;
            }
            SudokuData.resetCfg = res.json[0]["sudo1"];
            SudokuData.sudoCfg = SudokuData.resetSudoCfg(SudokuData.resetCfg);//深拷贝保存原始数据来操作
            SudokuData.changelist = SudokuData.resetSudoCfg(SudokuData.resetCfg);
            SudokuData.calcCount();
            this.initData(SudokuData.sudoCfg);
            SudokuData.canHandle = true;
        }, 6);
    }
    // 创建九宫格
    createJiuGongGe() {
        for (let i = 0; i < 9; i++) {
            var selectItem = cc.instantiate(this.selectItem);
            var selectcomp = selectItem.getComponent("SelectItem");
            selectcomp.setBgColor(cc.Color.WHITE);
            selectcomp.setNumColor(new cc.Color(43, 143, 12, 255));
            selectcomp.setNum(i + 1);
            this.selectNum.addChild(selectItem);
            for (let j = 0; j < 9; j++) {
                var numNode = cc.instantiate(this.numItem);
                this.sudokuUI.addChild(numNode, 1, SudokuData.strIndex("NumItem", i, j));
            }
        }
    }

    initTouchEvent() {
        // 重置
        this.chongzhi.on(cc.Node.EventType.TOUCH_END, this.funChongzhi, this);
        // 提示
        this.tishi.on(cc.Node.EventType.TOUCH_END, this.funTishi, this);
        // 开始
        this.kaishi.on(cc.Node.EventType.TOUCH_END, this.funKaishi, this);
        // 撤回
        this.chehui.on(cc.Node.EventType.TOUCH_END, this.funChehui, this);
    }

    initData(sudoCfg) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                var numNode = this.sudokuUI.getChildByName(SudokuData.strIndex("NumItem", i, j));
                var numcomp = numNode.getComponent("NumItem");
                var [n, m] = SudokuData.getNM(i, j);
                var num = sudoCfg[i][j];
                var numcolor = 0 < num ? new cc.Color(180, 218, 222, 255) : new cc.Color(240, 250, 240, 222);
                var bgcolor = new cc.Color(79, 128, 190, 170);
                if (n == 0 && m == 3 || n == 3 && m == 0 || n == 3 && m == 6 || n == 6 && m == 3) {
                    bgcolor = new cc.Color(243, 194, 239, 170);
                }
                numcomp.init(i, j, num, bgcolor, numcolor);
            }
        }
    }

    funChongzhi() {
        SudokuData.sudoCfg = SudokuData.resetSudoCfg(SudokuData.resetCfg);
        SudokuData.changelist = SudokuData.resetSudoCfg(SudokuData.resetCfg);
        SudokuData.handlelist = [];
        this.initData(SudokuData.sudoCfg);
        SudokuData.sudoCount = 0;
        SudokuData.setCurPos(-1, -1);
        SudokuData.closeMask();
        SudokuData.calcCount();
        SudokuData.isTips = false;
        this.isTips.active = SudokuData.isTips;
        SudokuData.saveTime = 0;
        SudokuData.isSucc = false;
    }

    funTishi() {
        SudokuData.isTips = !SudokuData.isTips;
        this.isTips.active = SudokuData.isTips;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                var num = SudokuData.sudoCfg[i][j];
                if (num == 0) {
                    if (SudokuData.isTips) {
                        var nums = SudokuData.getMayNum(i, j, SudokuData.sudoCfg);
                        MessageCenter.sendMessage(SudokuData.strIndex(MessageID.MsgID_SelectNumTips, i, j), [nums, false]);
                    } else {
                        MessageCenter.sendMessage(SudokuData.strIndex(MessageID.MsgID_SelectNum, i, j), 0);
                    }
                }
            }
        }
    }

    funKaishi() {
        SudokuData.funKaishi();
    }

    funChehui() {
        if (!SudokuData.handlelist.length) {
            SudokuData.closeMask();
            MessageCenter.sendMessage(MessageID.MsgID_SelectGeZi, [-1, -1]);
            return;
        }
        var [i, j, num] = SudokuData.handlelist.pop();
        var ii = i, jj = j, num2 = 0;
        var len = SudokuData.handlelist.length;
        SudokuData.changelist[i][j] = "";
        SudokuData.setSudoVal(i, j, 0);
        if (0 < len) {
            var handlast = SudokuData.handlelist[len - 1];
            ii = handlast[0];
            jj = handlast[1];
            num2 = handlast[2];
        }
        MessageCenter.sendMessage(SudokuData.strIndex(MessageID.MsgID_CheHui, ii, jj));
        MessageCenter.sendMessage(SudokuData.strIndex(MessageID.MsgID_SelectNum, i, j), 0);
        MessageCenter.sendMessage(SudokuData.strIndex(MessageID.MsgID_SelectNum, ii, jj), num2);
        if (!SudokuData.isTips) return;
        var list = SudokuData.getZuobiaos(i, j);
        for (let k = 0; k < list.length; k++) {
            var num1 = SudokuData.sudoCfg[list[k][0]][list[k][1]];
            if (num1 == 0) {
                var nums = SudokuData.getMayNum(list[k][0], list[k][1], SudokuData.sudoCfg);
                MessageCenter.sendMessage(SudokuData.strIndex(MessageID.MsgID_SelectNumTips, list[k][0], list[k][1]), [nums, false]);
            }
        }
    }

    update(dt) {
        if (SudokuData.saveTime == 0) {
            this.haoshi.string = "00:00:00";
        } else if(!SudokuData.isSucc){
            var time = Date.now();
            var h = Math.floor((time - SudokuData.saveTime) / 1000 / 60 / 60);
            var m = Math.floor((time - SudokuData.saveTime) / 1000 / 60 - h * 60);
            var s = Math.floor((time - SudokuData.saveTime) / 1000 - m * 60);
            this.haoshi.string = `${h < 10 ? "0" + h : h}:${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
            if(h == 23 && m == 59 && s == 59){
                this.funChongzhi();
            }
        }
    }

    onDestroy() {
        SudokuData.delListen();
    }
}
