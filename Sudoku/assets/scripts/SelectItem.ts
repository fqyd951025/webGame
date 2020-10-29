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
            if(!SudokuData.judgeNum(i, j, this.selNum)){
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
            SudokuData.sudoCfg[i][j] = this.selNum;
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

    onDestroy() {

    }
}
