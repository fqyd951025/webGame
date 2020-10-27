import { MessageCenter } from "./common/MessageCenter";
import { MessageID } from "./common/MessageIDS";

export default class SudokuData {

    private static ii: number = -1;
    private static jj: number = -1;

    constructor(){
        
    }

    static addListen(){
        MessageCenter.addListen(this, ([i, j])=>{
            if(0 <= this.ii) MessageCenter.sendMessage(MessageID.MsgID_ReSetSelected + this.strIndex(this.ii, this.jj));
            this.setCurPos(i, j);
        }, MessageID.MsgID_SelectGeZi);
    }

    static delListen(){
        MessageCenter.delListen(this);
    }

    static getCurPos() {
        return [this.ii, this.jj];
    }

    static setCurPos(i, j) {
        this.ii = i;
        this.jj = j;
    }

    static strIndex(i, j){
        return `${i}${j}`;
    }

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
}