/**
 * Created by 黄帅 on 2018/9/27.
 */

import ajax2promise from "../components/ajax2promise";
import getGlobalData from "../components/getGlobalData";

export async function collectFormId (params = {}) {
    await ajax2promise({
        ins: this,
        url: "/template/message/collect",
        params
    });

    this.$apply();
}