import wepy from "wepy";

export default class extends wepy.mixin {
    computed = {
        bootScene () {
            return this.$parent.globalData.scene;
        },
        bootFromMsg () {
            return this.bootScene === 1007 || this.bootScene === 1008;
        }
    };
};