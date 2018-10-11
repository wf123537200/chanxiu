/**
 * Created by 黄帅 on 2018/9/3.
 */

import ajax2promise from "../components/ajax2promise";
import getGlobalData from "../components/getGlobalData";

// 开放班级
export async function getOpenClasses () {
    const global = getGlobalData(this);
    const {ajaxPerfix} = global.data;

    let classes = await ajax2promise({
        ins: this,
        method: "GET",
        url: "/class/opens"
    });

    classes = classes.map((n) =>{
        n.logo = n.logo ? `${ajaxPerfix}${n.logo}` : "/images/classes/class-logo.png";
        n.qrCodeUrl = n.qrCodeUrl ? `${ajaxPerfix}${n.qrCodeUrl}` : "";

        return n;
    });

    this.$apply();
    return classes;
}

// 我加入的班级
export async function getMyClasses() {
    const global = getGlobalData(this);
    const {ajaxPerfix} = global.data;

    let classes = await ajax2promise({
        ins: this,
        method: "GET",
        url: "/class/myadds"
    });

    classes = classes.map((n) =>{
        n.logo = n.logo ? `${ajaxPerfix}${n.logo}` : "";
        n.qrCodeUrl = n.qrCodeUrl ? `${ajaxPerfix}${n.qrCodeUrl}` : "";

        return n;
    });

    this.$apply();
    return classes;
}

// 创建班级
export async function createClass(params = {}) {
    params.qr = "/pages/class/detail?_f=1&id=${classId}";

    const result = await ajax2promise({
        ins: this,
        method: "POST",
        url: "/class/create",
        params
    });

    this.$apply();
    return result;
}

// 修改班级
export async function updateClass(params = {}) {
    const {
        id,
        name,
        brief,
        logo,
        addType,
        maxStudentNum,
        isSupportAdd,
        committee,
        qrCodeUrl,
        detail
    } = this.detail;

    params = Object.assign({
        id,
        name,
        brief,
        logo,
        addType,
        maxStudentNum,
        isSupportAdd,
        committee,
        qrCodeUrl,
        detail
    }, params);

    await ajax2promise({
        ins: this,
        method: "POST",
        url: "/class/update",
        params
    });

    this.$apply();
}

// 班级详情
export async function getClassDetail(fix = true) {
    let detail = await ajax2promise({
        ins: this,
        method: "GET",
        url: "/class/brief",
        params: {
            id: this.classId
        }
    });

    detail = Object.assign({}, detail);

    if (fix) {
        const global = getGlobalData(this);
        const {ajaxPerfix} = global.data;

        if (detail.qrCodeUrl) {
            detail.qrCodeUrl = `${ajaxPerfix}${detail.qrCodeUrl}`;
        }

        if (detail.logo) {
            detail.logo = `${ajaxPerfix}${detail.logo}`;
        }
        else {
            detail.logo = "/images/classes/class-logo.png";
        }

        if (detail.qr) {
            detail.qr = `${ajaxPerfix}${detail.qr}`;
        }
    }

    detail.detail = detail.detail.replace(/\n/g, "\n");

    this.detail = detail;
    this.$apply();
}

// 直接加入
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

// 申请加入
export async function applyClass(params = {}) {
    params = Object.assign({
        classId: this.classId
    }, params);

    await ajax2promise({
        ins: this,
        method: "POST",
        url: "/class/add/apply",
        params
    });

    this.$apply();
}

// 退出班级
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

// 解散
export async function deleteClass() {
    await ajax2promise({
        ins: this,
        method: "POST",
        url: "/class/delete",
        params: {
            id: this.classId
        }
    });

    this.$apply();
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

// 提醒
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

// 记录
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

// 同学列表
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

        m.everyTrainDuration = m.everyTrainDuration || "尚未开始练习";

        return m;
    });

    this.$apply();
    return result;
}

// 新同学
export async function getNewStudents () {
    let result = await ajax2promise({
        ins: this,
        method: "GET",
        url: "/class/new/students",
        params: {
            classId: this.classId
        }
    });

    let now = new Date();
    let y = now.getFullYear();
    let m = now.getMonth() + 1;
    let d = now.getDate();

    result = result.map(n => {
        let m = Object.assign({}, n);
        let _key = m.strCreateTime.substring(0, 10).split("-");
        let _y = _key[0] - 0;
        let _m = _key[1] - 0;
        let _d = _key[2] - 0;

        if (_y === y && _m === m && _d === d) {
            m.strCreateTime = m.strCreateTime.substring(11);
        }

        if (m.status === 1) {
            m.statusText = "已通过";
        }
        else if (m.status === 2) {
            m.statusText = "已拒绝";
        }
        else {
            m.statusText = "";
        }

        m.everyTrainDuration = m.everyTrainDuration || "尚未开始练习";

        return m;
    });

    this.$apply();
    return result;
}

// 同学操作
export async function studentOperate(params = {}) {
    params = Object.assign({
        classId: this.classId
    }, params);

    await ajax2promise({
        ins: this,
        method: "POST",
        url: "/class/student/operate",
        params
    });

    this.$apply();
}
