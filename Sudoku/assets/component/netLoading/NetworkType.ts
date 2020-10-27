
export enum NETWORK_TYPE {
    none = 0,
    mobile = 1, // 包含所有移动网络的情况
    mobile2g = 2,
    mobile3g = 3,
    mobile4g = 4,
    wifi = 5,
    connected = 6, // 完全不知道网络类型，只知道是connected的
};

export function NetworkStateIsValid(state) {
    return (state >= NETWORK_TYPE.mobile);
}

export const NETWORK_TYPE_DESC = ["NONE", "MOBILE", "MOBILE2G", "MOBILE3G", "MOBILE4G", "WIFI", "CONNECTED"];