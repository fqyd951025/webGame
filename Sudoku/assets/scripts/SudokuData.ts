import { MessageCenter } from "./common/MessageCenter";
import { MessageID } from "./common/MessageIDS";

export default class SudokuData {

    private static ii: number = -1;
    private static jj: number = -1;
    public static sudoCfg: Array<Array<number>> = [];
    public static resetCfg: Array<Array<number>> = [];
    public static handlelist: Array<Array<number>> = [];
    public static changelist: Array<Array<string>> = [];

    constructor() {

    }

    static addListen() {
        MessageCenter.addListen(this, ([i, j]) => {
            if (0 <= this.ii) MessageCenter.sendMessage(this.strIndex(MessageID.MsgID_ReSetSelected, this.ii, this.jj));
            this.setCurPos(i, j);
        }, MessageID.MsgID_SelectGeZi);
    }

    static delListen() {
        MessageCenter.delListen(this);
    }

    static getCurPos() {
        return [this.ii, this.jj];
    }

    static setCurPos(i, j) {
        this.ii = i;
        this.jj = j;
    }

    static strIndex(tag, i, j) {
        return `_${tag}_${i}_${j}`;
    }

    //获取每个九宫格的开始索引
    static getNM(i, j) {
        return [this.getIndex(i), this.getIndex(j)];
    }

    static getIndex(i) {
        var n;
        if (i < 3) n = 0;
        else if (i < 6) n = 3;
        else n = 6;
        return n;
    }

    //获取该坐标涉及的坐标集
    static getZuobiaos(i, j) {
        var indexlist = [];
        var [n1, m1] = SudokuData.getNM(i, j);
        for (let n = n1; n < n1 + 3; n++) {
            for (let m = m1; m < m1 + 3; m++) {
                indexlist.push([n, m]);
            }
        }
        for (var k1 = n1 - 1; 0 <= k1; k1--) {
            indexlist.push([k1, j]);
        }
        for (var k2 = n1 + 3; k2 < 9; k2++) {
            indexlist.push([k2, j]);
        }

        for (var k3 = m1 - 1; 0 <= k3; k3--) {
            indexlist.push([i, k3]);
        }
        for (var k4 = m1 + 3; k4 < 9; k4++) {
            indexlist.push([i, k4]);
        }
        return indexlist;
    }

    //获取可能填的数
    static getMayNum(i, j, sudoCfg) {
        function spliceNum(n, m) {
            var spliceIndex = arr.indexOf(sudoCfg[n][m]);
            if (0 <= spliceIndex) {
                arr.splice(spliceIndex, 1);
            }
        }
        var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        var list = this.getZuobiaos(i, j);
        for (let k = 0; k < list.length; k++) {
            spliceNum(list[k][0], list[k][1]);
        }
        return arr.join("");
    }

    //重置数据
    static resetSudoCfg(old) {
        var sudo = [];
        for (let i = 0; i < old.length; i++) {
            sudo[i] = [];
            for (let j = 0; j < old[i].length; j++) {
                sudo[i][j] = old[i][j];
            }
        }
        return sudo;
    }

    //校验是否可填
    static judgeNum(i, j, num){
        var list = this.getZuobiaos(i, j);
        for (let k = 0; k < list.length; k++) {
            var n = list[k][0];
            var m = list[k][1];
            if(n == i && m == j) continue;
            if(num == this.resetCfg[n][m]) return false;
        }
        return true;
    }
    
    static closeMask(){
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                MessageCenter.sendMessage(SudokuData.strIndex(MessageID.MsgID_GeziMask, i, j), false);
            }
        }
    }
}