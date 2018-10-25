/**
 * Created by 黄帅 on 2018/10/25.
 */

import wepy from "wepy";
import {end, playAudio, getTimeInfo} from "../components/ex";

export default class extends wepy.mixin {
    end () {
        return end.call(this, true);
    }

    playAudio (src, title, onEnded) {
        return playAudio.call(this, src, title, onEnded);
    }

    getTimeInfo (cost) {
        return getTimeInfo.call(this, cost);
    }
}