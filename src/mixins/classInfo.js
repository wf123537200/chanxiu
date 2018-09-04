import wepy from "wepy";
import {getClassDetail} from "../modules/Classes";

export default class extends wepy.mixin {
    data = {
        classID: "",
        detail: {}
    };

    computed = {
        isAdministrator () {
            return false;
        },
        isNotMyClass () {
            return true;
        },
        isMyClass () {
            return !this.isNotMyClass;
        }
    };

    methods = {
        joinClass () {
            this.$invoke("applyPopup", "show");
        }
    };

    getClassDetail = getClassDetail;

    onLoad(options) {
        if (options) {
            this.classID = options.id;
        }
    }
};