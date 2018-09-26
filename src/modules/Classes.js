/**
 * Created by 黄帅 on 2018/9/3.
 */

import ajax2promise from "../components/ajax2promise";

export async function getOpenClasses () {
    this.openedClasses = await ajax2promise({
        ins: this,
        url: "/class/opens"
    });

    this.$apply();
}

export async function getMyClasses() {
    this.myClasses = await ajax2promise({
        ins: this,
        url: "/class/myadds"
    });

    this.$apply();
}

export async function createClass(params = {}) {
    const result = await ajax2promise({
        ins: this,
        method: "POST",
        url: "/class/create",
        params
    });

    this.$apply();
    return result;
}

export async function getClassDetail() {
    this.detail = await ajax2promise({
        ins: this,
        url: "/class/brief",
        params: {
            id: this.classId
        }
    });

    this.$apply();
}

export async function joinClass() {
    const result = await ajax2promise({
        ins: this,
        method: "POST",
        url: "/class/add",
        params: {
            id: this.classId
        }
    });

    this.$apply();
    return result;
}

export async function applyClass(params = {}) {
    params = Object.assign({
        classId: this.classId,
        pages: "/pages/class/detail?id=" + this.classId
    }, params);

    await ajax2promise({
        ins: this,
        method: "POST",
        url: "/class/add/apply",
        params
    });

    this.$apply();
}

export async function exitClass() {
    const result = await ajax2promise({
        ins: this,
        method: "POST",
        url: "/class/exit",
        params: {
            id: this.classId
        }
    });

    this.$apply();
    return result;
}

// 训练名单
export async function getTrainList () {
    const result = await ajax2promise({
        ins: this,
        method: "GET",
        url: "/class/briefing/train/list",
        params: {
            id: this.classId,
            timeType: this.brief.timeType
        }
    });

    this.$apply();
    return result;
}

// 排行榜
export async function getTrainRanks () {
    const result = await ajax2promise({
        ins: this,
        method: "GET",
        url: "/class/briefing/ranking",
        params: {
            id: this.classId,
            timeType: this.brief.timeType
        }
    });

    this.$apply();
    return result;
}

// 中断榜
export async function getInterrupts () {
    const result = await ajax2promise({
        ins: this,
        method: "GET",
        url: "/class/briefing/Interrupt",
        params: {
            id: this.classId,
            timeType: this.brief.timeType
        }
    });

    this.$apply();
    return result;
}

export async function remind (params = {}) {
    params = Object.assign({
        classId: this.classId,
        pages: "/pages/class/detail?id=" + this.classId
    }, params);

    await ajax2promise({
        ins: this,
        method: "POST",
        url: "/class/remind",
        params
    });

    //this.detail.isRemind = true;
    this.$apply();
}

export async function getTrainRecords (params = {}) {
    params = Object.assign({
        classId: this.classId,
        offset: this.trainRecordCount * this.trainRecordRequestCount,
        count: this.trainRecordCount || 10
    }, params);

    const result = await ajax2promise({
        ins: this,
        method: "GET",
        url: "/class/dynamic/list",
        params
    });

    result.forEach(n => this._trainRecords.push(n));
    this.trainRecordRequestCount++;
    this.$apply();
    return result;
}

export async function getStudents() {
    let result = await ajax2promise({
        ins: this,
        method: "GET",
        url: "/class/students",
        params: {
            classId: this.classId
        }
    });

    result = result.map(n => {
        let m = Object.assign({}, n);
        let role = parseInt(m.role);

        if (role === 1) {
            m.roleText = "班长";
        }
        else if (role === 2) {
            m.roleText = "副班长";
        }

        m.strCreateTime = m.strCreateTime.substring(0, 10);

        return m;
    });

    this.$apply();
    return result;
}

export async function studentOperate(params = {}) {
    params = Object.assign({
        classId: this.classId
    }, params);

    await ajax2promise({
        ins: this,
        method: "POST",
        url: "/class/students/operate",
        params
    });

    this.$apply();
}
