import wepy from "wepy";
import getGlobalData from "../components/getGlobalData";
import {collectFormId} from "../modules/Common";
import moment from "moment";

export default class extends wepy.mixin {
    methods = {
        getFormId (e) {
            this.getFormId(e);
        }
    };

    getFormId (e) {
        console.log("收集到formId：", e.detail.formId);
        this.dealFormIds(e.detail.formId, e.currentTarget.dataset.from);
    };

    dealFormIds (formId, from) {
        let _global = getGlobalData(this);
        let {ins, data} = _global;
        let formIds = data.formIds;
        let expire = moment().add(6, "d").format("YYYY-MM-DD HH:mm:ss");

        if (!formIds) {
            formIds = [];
        }

        if (formId !== "the formId is a mock one") {
            let id = {
                formId,
                expire
            };

            if (from) {
              id.fromPage = from
            }

            formIds.push(id);
            ins.globalData.formIds = formIds;
        }
        else {
            console.log("从开发版收集到formId");
        }
    }

    async onLoad () {
        await this.saveFormIds();
    }

    async saveFormIds () {
        let _global = getGlobalData(this);
        let {ins, data} = _global;
        let formIds = data.formIds;

        if (formIds && formIds.length) {
            //formIds = JSON.stringify(formIds);
            let promises = [];
            ins.globalData.formIds = "";

            formIds.forEach((n) => {
                console.log("组装collect form_id请求列表，参数为：", n);
                promises.push(collectFormId.bind(this)(n));
            });

            return Promise.all(promises);
        }

        return Promise.resolve();
    }
};
