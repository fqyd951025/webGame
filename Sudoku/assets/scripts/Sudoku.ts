import SudokuData from "./SudokuData";
import { safeLoadRes } from "./common/SafeLoader";

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

        safeLoadRes("cfg/SudokuCfg", this.initData.bind(this), 6);
    }

    initData(err, res){
        if(err){
            console.log(`err = ${JSON.stringify(err)}`);
            return;
        }
        var cfg = res.json[0]["sudo1"];
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
                var [n, m] = SudokuData.getNM(i, j);
                var num = cfg[i][j];
                var numcolor = 0 < num ? new cc.Color(180, 218, 222, 255) : new cc.Color(240, 250, 240, 222);
                var bgcolor = new cc.Color(79, 128, 190, 170);
                if (n == 0 && m == 3 || n == 3 && m == 0 || n == 3 && m == 6 || n == 6 && m == 3) {
                    bgcolor = new cc.Color(243, 194, 239, 170);
                }
                numcomp.init(i, j, num, bgcolor, numcolor);
                this.sudokuUI.addChild(numNode);
            }
        }
    }

    update(dt) { 
        
    }

    onDestroy(){
        SudokuData.delListen();
    }
}
