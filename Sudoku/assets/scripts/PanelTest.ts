import WindowManager from "./uiframe/WindowManager";
import MainPanel from "./panel/MainPanel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PanelTest extends cc.Component {
    onLoad () {

    }

    start () {
        WindowManager.open(MainPanel);
    }

    // update (dt) {}
}
