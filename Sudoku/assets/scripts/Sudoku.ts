import SudokuData from "./SudokuData";

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

    onLoad() {
        this.mainUI = cc.find("mainUI", this.node);
        this.sudokuUI = cc.find("sudokuUI", this.mainUI);
        this.selectNum = cc.find("selectNum", this.mainUI);
       
        this.sudokuUI.removeAllChildren();
        this.selectNum.removeAllChildren();
        SudokuData.addListen();
        for (let i = 0; i < 9; i++) {
            var selectItem = cc.instantiate(this.selectItem);
            var selectcomp = selectItem.getComponent("SelectItem");
            selectcomp.setBgColor(cc.Color.WHITE);
            selectcomp.setNumColor(new cc.Color(43, 143, 12, 255));
            selectcomp.setNum(i + 1);
            this.selectNum.addChild(selectItem);

            for (let j = 0; j < 9; j++) {
                var numNode = cc.instantiate(this.numItem);
                var numcomp = numNode.getComponent("NumItem");
                var [n, m] = this.getNM(i, j);
                var color1 = new cc.Color(79, 128, 190, 170);
                if (n == 0 && m == 3 || n == 3 && m == 0 || n == 3 && m == 6 || n == 6 && m == 3) {
                    color1 = new cc.Color(243, 194, 239, 170)
                }
                numcomp.init(i, j);
                numcomp.setBgColor(color1);
                numcomp.setNum("");
                this.sudokuUI.addChild(numNode);
            }
        }
    }
    
    getNM(i, j) {
        return [this.getIndex(i), this.getIndex(j)];
    }

    getIndex(i) {
        var n;
        if (i < 3) n = 0;
        else if (i < 6) n = 3;
        else n = 6;
        return n;
    }

    start() {

    }

    update(dt) { 
        
    }

    onDestroy(){
        SudokuData.delListen();
    }
}
