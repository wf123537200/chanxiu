import wepy from "wepy";

// import zanPopupA from "../components/zan-popup-a";
// import applyPopup from "../pages/class/detail/apply-popup";

export default class extends wepy.mixin {
    // components: {
    //     applyPopup,
    //     applyPopupA: zanPopupA
    // };

    data = {
        applyPopupBtns: [
            {
                text: "取消",
                className: "btn-secondary",
                fn: () => {
                    this.methods.showApplyPopup();
                    //this.hideApplyPopup();
                }
            },
            {
                text: "提交",
                className: "btn-primary",
                fn() {
                    this.$invoke("applyPopup", "submit");
                }
            }
        ],
    };

    methods = {
        showApplyPopup () {
            this.showApplyPopup();
        },
        hideApplyPopup () {
            this.hideApplyPopup();
        },
        clearApplyFormData () {
            this.$invoke("applyPopup", "clearFormData");
        }
    };

    showApplyPopup () {
        this.$invoke("applyPopupA", "show");
    }

    hideApplyPopup () {
        this.$invoke("applyPopupA", "hide");
    }
};
