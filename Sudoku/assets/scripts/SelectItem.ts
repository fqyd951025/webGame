import { MessageCenter } from "./common/MessageCenter";
import { MessageID } from "./common/MessageIDS";
import SudokuData from "./SudokuData";
import WindowManager from "./uiframe/WindowManager";
import AlertPanel from "./panel/AlertPanel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SelectItem extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null;
    @property(cc.Label)
    num: cc.Label = null;

    private selNum = 0;

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.selectNum, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    selectNum(event) {
        if (0 < this.selNum && this.selNum < 10) {
            console.log(`数字 num=${this.selNum}`);
            var [i, j] = SudokuData.getCurPos();
            var alertPanel;
            if (i < 0) {
                alertPanel = WindowManager.open(AlertPanel);
                alertPanel.renderUI(`请选择需要填数的格子\n再选择要填数字！`);
                return;
            }
            if (!SudokuData.judgeNum(i, j, this.selNum)) {
                alertPanel = WindowManager.open(AlertPanel);
                alertPanel.renderUI(`${this.selNum}在该格子不合规则\n请填其他数字！`);
                return;
            }
            MessageCenter.sendMessage(SudokuData.strIndex(MessageID.MsgID_SelectNum, i, j), this.selNum);
            var list = SudokuData.getZuobiaos(i, j);
            SudokuData.closeMask();
            for (let k = 0; k < list.length; k++) {
                MessageCenter.sendMessage(SudokuData.strIndex(MessageID.MsgID_SelectNumTips, list[k][0], list[k][1]), [this.selNum, true]);
            }
            SudokuData.handlelist.push([i, j, this.selNum]);
            SudokuData.setSudoVal(i, j, this.selNum);
            if (SudokuData.sudoCount == 81) {
                alertPanel = WindowManager.open(AlertPanel);
                //判断是否成功
                var isSucc = SudokuData.judgeResult();
                var text = isSucc ? "恭喜您！\n成功完成数独九宫！" : "很遗憾！\n未正确填对数据九宫！";
                SudokuData.isSucc = isSucc;
                alertPanel.renderUI(text);
            }
        }
    }

    setBgColor(color: cc.Color) {
        this.bg.color = color;
    }

    setNum(num: any = "") {
        this.selNum = num;
        this.num.string = num;
    }

    setNumColor(color: cc.Color) {
        this.num.node.color = color;
    }

    onKeyUp(event) {
        this.pressKey(event);
    }

    pressKey(event) {
        if (49 <= event.keyCode && event.keyCode <= 57) {
            if (cc.KEY[this.selNum] == event.keyCode) {
                this.selectNum();
            }

        } else if (97 <= event.keyCode && event.keyCode <= 105) {
            if (cc.KEY["num" + this.selNum] == event.keyCode) {
                this.selectNum();
            }
        }
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
}
