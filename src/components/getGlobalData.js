/**
 * Created by 黄帅 on 2018/9/8.
 */

export default function (ins) {
    let _ins;
    let globalData;

    if (ins.globalData) {
        globalData = ins.globalData;
        _ins = ins;
    }
    else if (ins.$parent.globalData) {
        globalData = ins.$parent.globalData;
        _ins = ins.$parent;
    }
    else if (ins.$root.$parent.globalData) {
        globalData = ins.$root.$parent.globalData;
        _ins = ins.$root.$parent;
    }
    else {
        globalData = {};
        _ins = ins;
    }

    return {
        ins: _ins,
        data: globalData
    }
}
