import BasePanel from "./BasePanel";
import { UILayerManager } from "./UILayerManager";

export default class WindowManager {

    private static _dictWindow = {};

    public static open(windowClass, msg?: any) {
        let window: BasePanel = <BasePanel>WindowManager._dictWindow[windowClass];
        if (window == null) {
            window = new windowClass();
            WindowManager._dictWindow[windowClass] = window;
        }
        UILayerManager.show(window,msg);
        return window;
    }

    public static close(windowClass) {
        let window: BasePanel = <BasePanel>WindowManager._dictWindow[windowClass];
        if (window == null) {
            return;
        }
        window.close();
    }
    public static showCenterAlert(msg: string, btnName: string, onBtnfunc: Function) {
        let data = {};
        data["btnCount"] = 1;
        data["msg"] = msg;
        data["btnName"] = btnName;
        data["onBtnfunc"] = onBtnfunc;
        //WindowManager.open(AlertPanel, data);
    }

    public static showAlert(msg: string, btnName1: string, onBtnfunc1: Function, btnName2: string, onBtnfunc2: Function) {
        let data = {};
        data["btnCount"] = 2;
        data["msg"] = msg;
        data["btnName1"] = btnName1;
        data["onBtnfunc1"] = onBtnfunc1;
        data["btnName2"] = btnName2;
        data["onBtnfunc2"] = onBtnfunc2;
        //WindowManager.open(AlertPanel, data);
    }
}