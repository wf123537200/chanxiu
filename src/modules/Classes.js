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

