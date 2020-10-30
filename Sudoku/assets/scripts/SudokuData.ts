import { MessageCenter } from "./common/MessageCenter";
import { MessageID } from "./common/MessageIDS";

export default class SudokuData {

    private static ii: number = -1;
    private static jj: number = -1;
    public static sudoCfg: Array<Array<number>> = [];
    public static resetCfg: Array<Array<number>> = [];
    public static handlelist: Array<Array<number>> = [];
    public static changelist: Array<Array<string>> = [];
    public static sudoCount = 0;
    public static canHandle = false;

    public static isTips = false;
    public static isSucc = false;

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
    static judgeNum(i, j, num) {
        var list = this.getZuobiaos(i, j);
        for (let k = 0; k < list.length; k++) {
            var n = list[k][0];
            var m = list[k][1];
            if (n == i && m == j) continue;
            if (num == this.resetCfg[n][m]) return false;
        }
        return true;
    }

    static closeMask() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                MessageCenter.sendMessage(SudokuData.strIndex(MessageID.MsgID_GeziMask, i, j), false);
            }
        }
    }

    static calcCount() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.sudoCfg[i][j] != 0) this.sudoCount++;
            }
        }
    }

    static judgeResult() {
        var arr = [], arr1 = [];
        for (let n = 0; n < 9; n++) {
            arr = [];
            arr1 = [];
            for (let m = 0; m < 9; m++) {
                if (arr.includes(this.sudoCfg[n][m])) {
                    return false;
                }
                arr.push(this.sudoCfg[n][m]);
                if (arr1.includes(this.sudoCfg[m][n])) {
                    return false;
                }
                arr1.push(this.sudoCfg[m][n]);
            }
        }
        var indexs = [[0, 0], [0, 3], [0, 6], [3, 0], [3, 3], [3, 6], [6, 0], [6, 3], [6, 6]];
        for (let q1 = 0; q1 < indexs.length; q1++) {
            arr = [];
            var n1 = indexs[q1][0];
            var m1 = indexs[q1][1];
            for (var n = n1; n < n1 + 3; n++) {
                for (var m = m1; m < m1 + 3; m++) {
                    if (arr.includes(this.sudoCfg[m][n])) {
                        return false;
                    }
                    arr.push(this.sudoCfg[m][n]);
                }
            }
        }
        return true;
    }

    static setSudoVal(i, j, val) {
        if (this.sudoCfg[i][j] == 0) {
            SudokuData.sudoCount += val == 0 ? 0 : 1;
        } else if (val == 0) {
            SudokuData.sudoCount--;
        }
        this.sudoCfg[i][j] = val;
        console.log(`SudokuData.sudoCount = ${SudokuData.sudoCount}`);

    }
}