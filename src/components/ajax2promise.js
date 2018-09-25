import {ajax} from "./ajax";

export default function (ajaxParams) {
    return new Promise(function (resolve, reject) {
        const {success, fail} = ajaxParams;

        ajaxParams.success = function (data) {
            success && success(data);
            resolve(data);
        };

        ajaxParams.fail = function () {
            fail && fail();
            reject();
        };

        ajax(ajaxParams);
    });
}